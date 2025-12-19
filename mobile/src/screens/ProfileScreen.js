import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { streakAPI, followAPI } from '../services/api';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [streak, setStreak] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [streakRes, followersRes, followingRes] = await Promise.all([
        streakAPI.getStreak(),
        followAPI.getFollowers(),
        followAPI.getFollowing(),
      ]);

      setStreak(streakRes.data.streak);
      setFollowers(followersRes.data.followers);
      setFollowing(followingRes.data.following);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={120} color="#fff" />
            {user?.isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={20} color="#fbbf24" />
              </View>
            )}
          </View>

          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          {user?.isPremium && (
            <View style={styles.premiumTag}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={styles.premiumText}>Premium Member</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{followers.length}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{following.length}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streak?.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>Streak Days</Text>
          </View>
        </View>

        {/* Streak Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flame" size={24} color="#f97316" />
            <Text style={styles.sectionTitle}>Streak Progress</Text>
          </View>
          
          <View style={styles.streakCard}>
            <View style={styles.streakRow}>
              <Text style={styles.streakLabel}>Current Streak</Text>
              <Text style={styles.streakValue}>
                {streak?.currentStreak || 0} days
              </Text>
            </View>
            <View style={styles.streakRow}>
              <Text style={styles.streakLabel}>Longest Streak</Text>
              <Text style={styles.streakValue}>
                {streak?.longestStreak || 0} days
              </Text>
            </View>
            <View style={styles.streakRow}>
              <Text style={styles.streakLabel}>Total Calls</Text>
              <Text style={styles.streakValue}>
                {streak?.totalCallsMade || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Following List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color="#6366f1" />
            <Text style={styles.sectionTitle}>Following</Text>
          </View>

          {following.length === 0 ? (
            <Text style={styles.emptyText}>
              Not following anyone yet. Start connecting!
            </Text>
          ) : (
            following.slice(0, 5).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.followItem}
                onPress={() => navigation.navigate('UserProfile', { userId: item._id })}
              >
                <Ionicons name="person-circle" size={40} color="#6366f1" />
                <View style={styles.followInfo}>
                  <Text style={styles.followName}>{item.username}</Text>
                  <Text style={styles.followMeta}>
                    {item.isMutual ? '👥 Mutual' : 'Following'}
                  </Text>
                </View>
                
                <View style={styles.followActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      navigation.navigate('ChatDetail', { otherUser: item });
                    }}
                  >
                    <Ionicons name="chatbubble" size={20} color="#6366f1" />
                  </TouchableOpacity>
                  
                  {item.isOnline && (
                    <View style={styles.onlineBadge}>
                      <View style={styles.onlineDot} />
                      <Text style={styles.onlineText}>Online</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}

          {following.length > 5 && (
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All ({following.length})</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <Ionicons name="key-outline" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('PrivacySettings')}
          >
            <Ionicons name="shield-checkmark-outline" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Privacy Settings</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('BlockedUsers')}
          >
            <Ionicons name="ban-outline" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Blocked Users</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Settings</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          {!user?.isPremium && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Premium')}
            >
              <Ionicons name="star-outline" size={24} color="#fbbf24" />
              <Text style={styles.menuItemText}>Upgrade to Premium</Text>
              <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Terms & Privacy</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Open Talk v1.0.0</Text>
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
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 15,
  },
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  premiumText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  editButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
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
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 10,
  },
  streakCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  streakLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  streakValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  followItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  followInfo: {
    flex: 1,
    marginLeft: 15,
  },
  followName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  followMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  followActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  viewAllButton: {
    alignItems: 'center',
    padding: 15,
  },
  viewAllText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    marginBottom: 10,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 15,
  },
  logoutItem: {
    marginTop: 10,
  },
  logoutText: {
    color: '#ef4444',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default ProfileScreen;

