import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config/config';

const BlockedUsersScreen = ({ navigation }) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Blocked Users',
      headerStyle: { backgroundColor: '#6366f1' },
      headerTintColor: '#fff',
    });
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/user/blocked-users`);
      if (response.data.success) {
        setBlockedUsers(response.data.blockedUsers || []);
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      // If endpoint doesn't exist yet, show empty state
      setBlockedUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUnblock = (userId, username) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${username}? They will be able to contact you again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          style: 'default',
          onPress: async () => {
            try {
              const response = await axios.post(`${API_URL}/user/unblock`, {
                userId,
              });
              if (response.data.success) {
                setBlockedUsers(blockedUsers.filter((user) => user._id !== userId));
                Alert.alert('Success', `${username} has been unblocked`);
              }
            } catch (error) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to unblock user'
              );
            }
          },
        },
      ]
    );
  };

  const renderBlockedUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#6366f1" />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.username}</Text>
          <Text style={styles.userMeta}>
            Blocked on {new Date(item.blockedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(item._id, item.username)}
      >
        <Text style={styles.unblockButtonText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="happy-outline" size={80} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>No Blocked Users</Text>
      <Text style={styles.emptyDescription}>
        You haven't blocked anyone yet. Blocked users won't be able to call or message you.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {blockedUsers.length === 0 && !loading ? (
        renderEmptyState()
      ) : (
        <>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#6366f1" />
            <Text style={styles.infoText}>
              Blocked users can't call or message you
            </Text>
          </View>

          <FlatList
            data={blockedUsers}
            renderItem={renderBlockedUser}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchBlockedUsers();
                }}
                colors={['#6366f1']}
              />
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 12,
    margin: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#1e40af',
    flex: 1,
  },
  listContainer: {
    padding: 15,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
  unblockButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  unblockButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default BlockedUsersScreen;

