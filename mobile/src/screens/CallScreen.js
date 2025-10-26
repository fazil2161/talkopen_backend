import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from 'react-native-webrtc';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { followAPI, streakAPI } from '../services/api';
import { MIN_CALL_DURATION_FOR_FOLLOW } from '../config/config';

const { width, height } = Dimensions.get('window');

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const CallScreen = ({ navigation, route }) => {
  const { matchedUser, callId } = route.params;
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [canFollow, setCanFollow] = useState(false);
  const [audioConnected, setAudioConnected] = useState(false);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    // Initialize WebRTC
    setupWebRTC();

    // Start call timer
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setCallDuration(elapsed);
      
      if (elapsed >= MIN_CALL_DURATION_FOR_FOLLOW && !canFollow) {
        setCanFollow(true);
      }
    }, 1000);

    // Notify server that call started
    socket.emit('call_started', {
      callId,
      participants: [user.id, matchedUser.userId],
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      cleanupWebRTC();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // WebRTC signaling events
      socket.on('incoming_call', handleIncomingCall);
      socket.on('call_answered', handleCallAnswered);
      socket.on('ice_candidate', handleNewICECandidate);
      socket.on('call_ended_confirmed', handleCallEndConfirmed);

      return () => {
        socket.off('incoming_call');
        socket.off('call_answered');
        socket.off('ice_candidate');
        socket.off('call_ended_confirmed');
      };
    }
  }, [socket]);

  // WebRTC Setup
  const setupWebRTC = async () => {
    try {
      console.log('🎙️ Setting up WebRTC audio...');
      
      // Get microphone permission and audio stream
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      
      localStream.current = stream;
      console.log('✅ Microphone access granted');
      
      // Create peer connection
      peerConnection.current = new RTCPeerConnection(configuration);
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });
      
      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          console.log('✅ Remote audio stream received');
          setAudioConnected(true);
        }
      };
      
      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice_candidate', {
            to: matchedUser.userId,
            candidate: event.candidate,
          });
        }
      };
      
      // Handle connection state
      peerConnection.current.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.current.connectionState);
        if (peerConnection.current.connectionState === 'connected') {
          setAudioConnected(true);
        }
      };
      
      // Create and send offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      
      socket.emit('call_user', {
        to: matchedUser.userId,
        offer: offer,
        callId: callId,
      });
      
      console.log('✅ WebRTC setup complete, offer sent');
    } catch (error) {
      console.error('❌ WebRTC setup error:', error);
      Alert.alert('Microphone Error', 'Could not access microphone. Please check permissions in Settings.');
    }
  };

  const handleIncomingCall = async ({ from, offer }) => {
    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      
      socket.emit('answer_call', {
        to: from,
        answer: answer,
        callId: callId,
      });
      
      console.log('✅ Call answered');
    } catch (error) {
      console.error('❌ Error handling incoming call:', error);
    }
  };

  const handleCallAnswered = async ({ from, answer }) => {
    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('✅ Call answer received');
    } catch (error) {
      console.error('❌ Error handling call answer:', error);
    }
  };

  const handleNewICECandidate = async ({ from, candidate }) => {
    try {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('✅ ICE candidate added');
    } catch (error) {
      console.error('❌ Error adding ICE candidate:', error);
    }
  };

  const cleanupWebRTC = () => {
    try {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      console.log('✅ WebRTC cleaned up');
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCallEndConfirmed = async (data) => {
    try {
      // Update streak
      await streakAPI.updateStreak(data.duration);

      if (data.canFollow) {
        Alert.alert(
          'Great conversation!',
          'You talked for more than 2 minutes. Would you like to follow this user?',
          [
            { text: 'Not Now', style: 'cancel', onPress: () => navigation.goBack() },
            { text: 'Follow', onPress: () => handleFollow() },
          ]
        );
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error handling call end:', error);
      navigation.goBack();
    }
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this call?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => {
            socket.emit('call_ended', {
              callId,
              participants: [user.id, matchedUser.userId],
            });
            
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
          },
        },
      ]
    );
  };

  const handleFollow = async () => {
    try {
      const response = await followAPI.followUser(matchedUser.userId, callDuration);
      
      if (response.data.success) {
        Alert.alert(
          'Success',
          `You are now following ${matchedUser.username}!${
            response.data.isMutual ? ' You can now chat with each other!' : ''
          }`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to follow user',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        console.log(`🎤 Microphone ${audioTrack.enabled ? 'unmuted' : 'muted'}`);
      }
    }
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // Implement actual video toggle with WebRTC
  };

  return (
    <View style={styles.container}>
      {/* Video Views - Placeholder */}
      <View style={styles.videoContainer}>
        {/* Remote Video */}
        <View style={styles.remoteVideo}>
          <View style={styles.placeholderVideo}>
            <Ionicons name="person" size={100} color="#fff" />
            <Text style={styles.remoteUserName}>{matchedUser.username}</Text>
          </View>
        </View>

        {/* Local Video */}
        <View style={styles.localVideo}>
          <View style={styles.placeholderVideoSmall}>
            <Ionicons name="person" size={40} color="#fff" />
            <Text style={styles.localUserText}>You</Text>
          </View>
        </View>

        {/* Call Info Overlay */}
        <View style={styles.callInfoOverlay}>
          <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
          {audioConnected && (
            <View style={styles.audioBadge}>
              <Ionicons name="volume-high" size={16} color="#10b981" />
              <Text style={styles.audioBadgeText}>Audio Connected</Text>
            </View>
          )}
          {canFollow && (
            <View style={styles.followBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.followBadgeText}>Can follow now!</Text>
            </View>
          )}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={toggleMute}
        >
          <Ionicons
            name={isMuted ? 'mic-off' : 'mic'}
            size={28}
            color={isMuted ? '#ef4444' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
          onPress={toggleVideo}
        >
          <Ionicons
            name={isVideoOff ? 'videocam-off' : 'videocam'}
            size={28}
            color={isVideoOff ? '#ef4444' : '#fff'}
          />
        </TouchableOpacity>

        {canFollow && (
          <TouchableOpacity
            style={[styles.controlButton, styles.followButton]}
            onPress={handleFollow}
          >
            <Ionicons name="person-add" size={28} color="#fff" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <Ionicons name="call" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoCard}>
          <Ionicons name="person-circle" size={48} color="#6366f1" />
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{matchedUser.username}</Text>
            <Text style={styles.userGender}>
              {matchedUser.gender} • {matchedUser.age || 'Unknown'} years
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    width: width,
    height: height,
  },
  placeholderVideo: {
    flex: 1,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteUserName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  localVideo: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  placeholderVideoSmall: {
    flex: 1,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localUserText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
  callInfoOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    alignItems: 'flex-start',
  },
  callDuration: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  audioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  audioBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  followBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  followBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(107, 114, 128, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  followButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
  },
  endCallButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    transform: [{ rotate: '135deg' }],
  },
  userInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 15,
  },
  userInfoText: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userGender: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});

export default CallScreen;

