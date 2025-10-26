import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { userAPI, followAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserProfileScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [canChat, setCanChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Profile',
      headerStyle: { backgroundColor: '#6366f1' },
      headerTintColor: '#fff',
    });

    fetchUserProfile();
    checkCanChat();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile(userId);
      setUser(response.data.user);
      setStreak(response.data.streak);
      
      // Check if following
      const following = currentUser.following || [];
      setIsFollowing(following.includes(userId));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const checkCanChat = async () => {
    try {
      const response = await followAPI.canChat(userId);
      setCanChat(response.data.canChat);
    } catch (error) {
      console.error('Error checking chat permission:', error);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await followAPI.unfollowUser(userId);
        setIsFollowing(false);
        Alert.alert('Success', 'Unfollowed successfully');
      } else {
        // Can't follow without a call first
        Alert.alert(
          'Cannot Follow',
          'You need to have a call of at least 2 minutes with this user before you can follow them.'
        );
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update follow status');
    }
  };

  const handleMessage = () => {
    if (canChat) {
      navigation.navigate('ChatDetail', { user });
    } else {
      Alert.alert(
        'Cannot Message',
        'You need to follow each other or have a premium subscription to chat.'
      );
    }
  };

  const handleBlock = async () => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${user.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              await userAPI.blockUser(userId);
              Alert.alert('Success', 'User blocked successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to block user');
            }
          },
        },
      ]
    );
  };

  const handleReport = () => {
    Alert.prompt(
      'Report User',
      'Please provide a reason for reporting this user:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          onPress: async (reason) => {
            try {
              await userAPI.reportUser(userId, reason);
              Alert.alert('Success', 'User reported successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to report user');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={120} color="#fff" />
            {user.isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={20} color="#fbbf24" />
              </View>
            )}
            {user.isOnline && <View style={styles.onlineBadge} />}
          </View>

          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.userInfo}>
            {user.gender} • {user.age} years
          </Text>

          {user.isPremium && (
            <View style={styles.premiumTag}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={styles.premiumText}>Premium Member</Text>
            </View>
          )}
        </LinearGradient>

        {/* Bio */}
        {user.bio && (
          <View style={styles.section}>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.followers?.length || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.following?.length || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streak?.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.followButton]}
            onPress={handleFollow}
          >
            <Ionicons
              name={isFollowing ? 'checkmark' : 'person-add'}
              size={20}
              color="#fff"
            />
            <Text style={styles.actionButtonText}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={handleMessage}
          >
            <Ionicons name="chatbubble" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* More Options */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.optionItem} onPress={handleBlock}>
            <Ionicons name="ban" size={24} color="#ef4444" />
            <Text style={[styles.optionText, { color: '#ef4444' }]}>Block User</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} onPress={handleReport}>
            <Ionicons name="flag" size={24} color="#f97316" />
            <Text style={[styles.optionText, { color: '#f97316' }]}>Report User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    padding: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: '#fff',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  premiumText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  section: {
    padding: 20,
  },
  bio: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  followButton: {
    backgroundColor: '#6366f1',
  },
  messageButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default UserProfileScreen;

