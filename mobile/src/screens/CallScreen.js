import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from 'react-native-webrtc';
import { Audio } from 'expo-av';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { followAPI, streakAPI } from '../services/api';
import { MIN_CALL_DURATION_FOR_FOLLOW } from '../config/config';

const { width, height } = Dimensions.get('window');

const configuration = {
  iceServers: [
    // STUN servers (discover public IP)
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    
    // FREE TURN servers (relay traffic when direct connection fails)
    // Note: These are public and may be slow/unreliable
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
  iceCandidatePoolSize: 10,
};

const CallScreen = ({ navigation, route }) => {
  const { matchedUser, callId, isInitiator } = route.params; // Add isInitiator flag
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true); // Speaker on by default for audio calls
  const [canFollow, setCanFollow] = useState(false);
  const [audioConnected, setAudioConnected] = useState(false);
  
  // Debug status states
  const [debugMessages, setDebugMessages] = useState([]);
  const [showDebug, setShowDebug] = useState(true); // Always show debug initially
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  // Helper to add debug messages
  const addDebug = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    setDebugMessages(prev => [...prev, { timestamp, message, type, icon }]);
    console.log(`[${timestamp}] ${icon} ${message}`);
  };

  useEffect(() => {
    // Log initial setup
    addDebug(`📱 CallScreen mounted`, 'info');
    addDebug(`👤 My role: ${isInitiator ? 'INITIATOR (create offer)' : 'RECEIVER (wait for offer)'}`, 'info');
    addDebug(`🎯 Matched with: ${matchedUser.username}`, 'info');
    addDebug(`📞 Call ID: ${callId}`, 'info');
    
    // Hide tab bar when entering call screen
    navigation.setOptions({
      tabBarStyle: { display: 'none' }
    });

    // Initialize audio mode for call
    setupAudioMode();

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
    addDebug('📡 Notifying server: call_started', 'info');
    socket.emit('call_started', {
      callId,
      participants: [user.id, matchedUser.userId],
    });

    return () => {
      // Restore tab bar when leaving call screen
      navigation.setOptions({
        tabBarStyle: undefined
      });
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Reset audio mode
      resetAudioMode();
      
      cleanupWebRTC();
    };
  }, []);

  // Setup audio mode for voice call
  const setupAudioMode = async () => {
    try {
      addDebug('🔊 Configuring audio mode...', 'info');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false, // Use speaker by default
      });
      addDebug('✅ Audio mode configured (speaker ON)', 'success');
    } catch (error) {
      addDebug(`❌ Audio mode error: ${error.message}`, 'error');
      console.error('❌ Error setting audio mode:', error);
    }
  };

  // Reset audio mode after call
  const resetAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
      });
      console.log('✅ Audio mode reset');
    } catch (error) {
      console.error('❌ Error resetting audio mode:', error);
    }
  };

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
      addDebug('🎙️ Starting WebRTC setup...', 'info');
      
      // Get microphone permission and audio stream with enhanced audio constraints
      addDebug('🎤 Requesting microphone permission...', 'info');
      const stream = await mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      
      localStream.current = stream;
      addDebug(`✅ Microphone granted (${stream.getAudioTracks().length} tracks)`, 'success');
      
      // Create peer connection
      addDebug('🔗 Creating peer connection...', 'info');
      peerConnection.current = new RTCPeerConnection(configuration);
      addDebug('✅ Peer connection created', 'success');
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
        addDebug(`➕ Added ${track.kind} track (enabled: ${track.enabled})`, 'success');
      });
      
      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        addDebug(`📥 Received remote ${event.track.kind} track`, 'success');
        if (event.streams && event.streams[0]) {
          const audioTracks = event.streams[0].getAudioTracks().length;
          addDebug(`✅ Remote audio stream (${audioTracks} tracks)`, 'success');
          setAudioConnected(true);
        }
      };
      
      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          addDebug('🧊 Sending ICE candidate', 'info');
          socket.emit('ice_candidate', {
            to: matchedUser.userId,
            candidate: event.candidate,
          });
        } else {
          addDebug('🧊 All ICE candidates sent', 'success');
        }
      };
      
      // Handle connection state
      peerConnection.current.onconnectionstatechange = () => {
        const state = peerConnection.current.connectionState;
        addDebug(`🔗 Connection: ${state}`, state === 'connected' ? 'success' : state === 'failed' ? 'error' : 'info');
        
        if (state === 'connected') {
          setAudioConnected(true);
        } else if (state === 'failed') {
          addDebug('❌ CALL FAILED - Connection could not be established', 'error');
          Alert.alert('Connection Error', 'Call connection failed. Please try again.');
        } else if (state === 'disconnected') {
          addDebug('⚠️ Connection disconnected', 'warning');
        }
      };
      
      // Handle ICE connection state
      peerConnection.current.oniceconnectionstatechange = () => {
        const iceState = peerConnection.current.iceConnectionState;
        addDebug(`🧊 ICE: ${iceState}`, iceState === 'connected' || iceState === 'completed' ? 'success' : iceState === 'failed' ? 'error' : 'info');
        
        if (iceState === 'failed') {
          addDebug('❌ ICE FAILED - Network issue or firewall blocking', 'error');
        }
      };
      
      // Only the initiator creates and sends the offer
      if (isInitiator) {
        addDebug('📤 INITIATOR: Creating offer...', 'info');
        const offer = await peerConnection.current.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: false,
        });
        await peerConnection.current.setLocalDescription(offer);
        addDebug('✅ Offer created, sending to peer...', 'success');
        
        socket.emit('call_user', {
          to: matchedUser.userId,
          offer: offer,
          callId: callId,
        });
        
        addDebug(`✅ Offer sent to ${matchedUser.username}`, 'success');
        addDebug('⏳ Waiting for answer...', 'info');
      } else {
        addDebug('📥 RECEIVER: Waiting for offer...', 'info');
      }
    } catch (error) {
      addDebug(`❌ WebRTC SETUP FAILED: ${error.message}`, 'error');
      console.error('❌ WebRTC setup error:', error);
      Alert.alert('Microphone Error', 'Could not access microphone. Please check permissions in Settings.');
    }
  };

  const handleIncomingCall = async ({ from, offer }) => {
    try {
      addDebug('📞 Received OFFER from peer', 'success');
      addDebug('🔄 Setting remote description...', 'info');
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      addDebug('✅ Remote description set', 'success');
      
      addDebug('📤 Creating answer...', 'info');
      const answer = await peerConnection.current.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });
      await peerConnection.current.setLocalDescription(answer);
      addDebug('✅ Answer created', 'success');
      
      socket.emit('answer_call', {
        to: from,
        answer: answer,
        callId: callId,
      });
      
      addDebug('✅ Answer sent to peer', 'success');
    } catch (error) {
      addDebug(`❌ INCOMING CALL FAILED: ${error.message}`, 'error');
      console.error('❌ Error handling incoming call:', error);
    }
  };

  const handleCallAnswered = async ({ from, answer }) => {
    try {
      addDebug('📞 Received ANSWER from peer', 'success');
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      addDebug('✅ Answer accepted, connecting...', 'success');
    } catch (error) {
      addDebug(`❌ ANSWER FAILED: ${error.message}`, 'error');
      console.error('❌ Error handling call answer:', error);
    }
  };

  const handleNewICECandidate = async ({ from, candidate }) => {
    try {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      addDebug('🧊 ICE candidate added', 'success');
    } catch (error) {
      addDebug(`❌ ICE CANDIDATE FAILED: ${error.message}`, 'error');
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

  const toggleSpeaker = async () => {
    try {
      const newSpeakerState = !isSpeakerOn;
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: !newSpeakerState, // true = earpiece, false = speaker
      });
      
      setIsSpeakerOn(newSpeakerState);
      console.log(`🔊 Speaker ${newSpeakerState ? 'ON (Loudspeaker)' : 'OFF (Earpiece)'}`);
    } catch (error) {
      console.error('❌ Error toggling speaker:', error);
    }
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // Video is not implemented for audio-only calls
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

      {/* Debug Panel */}
      {showDebug && (
        <View style={styles.debugPanel}>
          <View style={styles.debugHeader}>
            <Text style={styles.debugHeaderText}>🔍 Call Debug Log</Text>
            <TouchableOpacity onPress={() => setShowDebug(false)}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.debugScroll} nestedScrollEnabled={true}>
            {debugMessages.map((msg, index) => (
              <View key={index} style={[styles.debugMessage, styles[`debug${msg.type.charAt(0).toUpperCase() + msg.type.slice(1)}`]]}>
                <Text style={styles.debugTime}>{msg.timestamp}</Text>
                <Text style={styles.debugText}>{msg.icon} {msg.message}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Toggle Debug Button (when hidden) */}
      {!showDebug && (
        <TouchableOpacity 
          style={styles.debugToggle} 
          onPress={() => setShowDebug(true)}
        >
          <Text style={styles.debugToggleText}>🔍 Show Debug</Text>
        </TouchableOpacity>
      )}

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
          style={[styles.controlButton, !isSpeakerOn && styles.controlButtonActive]}
          onPress={toggleSpeaker}
        >
          <Ionicons
            name={isSpeakerOn ? 'volume-high' : 'volume-mute'}
            size={28}
            color={!isSpeakerOn ? '#ef4444' : '#fff'}
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
  debugPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.4,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
  },
  debugHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugScroll: {
    maxHeight: height * 0.3,
    padding: 10,
  },
  debugMessage: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  debugInfo: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderLeftColor: '#3b82f6',
  },
  debugSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderLeftColor: '#10b981',
  },
  debugError: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderLeftColor: '#ef4444',
  },
  debugWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderLeftColor: '#f59e0b',
  },
  debugTime: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 2,
  },
  debugText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  debugToggle: {
    position: 'absolute',
    bottom: 180,
    left: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  debugToggleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default CallScreen;

