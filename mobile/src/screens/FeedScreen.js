import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { feedAPI } from '../services/api';

const FeedScreen = ({ navigation }) => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async (pageNum = 1) => {
    try {
      const response = await feedAPI.getFeed(pageNum);
      if (pageNum === 1) {
        setFeed(response.data.feed);
      } else {
        setFeed((prev) => [...prev, ...response.data.feed]);
      }
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeed(1);
  };

  const loadMore = () => {
    fetchFeed(page + 1);
  };

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'call_completed':
        return { name: 'call', color: '#10b981' };
      case 'new_follow':
        return { name: 'person-add', color: '#6366f1' };
      case 'premium_activated':
        return { name: 'star', color: '#fbbf24' };
      case 'streak_achieved':
        return { name: 'flame', color: '#f97316' };
      default:
        return { name: 'information-circle', color: '#6b7280' };
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diff = now - activityDate;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return activityDate.toLocaleDateString();
  };

  const renderFeedItem = ({ item }) => {
    const icon = getActivityIcon(item.activityType);

    return (
      <View style={styles.feedItem}>
        <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
          <Ionicons name={icon.name} size={24} color={icon.color} />
        </View>

        <View style={styles.feedContent}>
          <TouchableOpacity
            onPress={() => {
              if (item.user?._id) {
                navigation.navigate('UserProfile', { userId: item.user._id });
              }
            }}
          >
            <Text style={styles.feedDescription}>{item.description}</Text>
          </TouchableOpacity>

          <View style={styles.feedMeta}>
            <Text style={styles.feedTime}>{formatTime(item.createdAt)}</Text>
            {item.metadata?.duration && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.feedMetaText}>
                  {Math.floor(item.metadata.duration / 60)} min call
                </Text>
              </>
            )}
            {item.metadata?.streakCount && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.feedMetaText}>
                  {item.metadata.streakCount} day streak
                </Text>
              </>
            )}
          </View>
        </View>

        {item.relatedUser && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('UserProfile', { userId: item.relatedUser._id })
            }
          >
            <Ionicons name="person-circle" size={40} color="#6366f1" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading feed...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {feed.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="newspaper-outline" size={80} color="#d1d5db" />
          <Text style={styles.emptyText}>No activities yet</Text>
          <Text style={styles.emptySubtext}>
            Follow people to see their activities here
          </Text>
        </View>
      ) : (
        <FlatList
          data={feed}
          keyExtractor={(item) => item._id}
          renderItem={renderFeedItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  feedItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  feedContent: {
    flex: 1,
    justifyContent: 'center',
  },
  feedDescription: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 5,
  },
  feedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedTime: {
    fontSize: 13,
    color: '#9ca3af',
  },
  metaDot: {
    fontSize: 13,
    color: '#9ca3af',
    marginHorizontal: 5,
  },
  feedMetaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default FeedScreen;

