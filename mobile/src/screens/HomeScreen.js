import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { streakAPI } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [selectedFilter, setSelectedFilter] = useState('free');
  const [searching, setSearching] = useState(false);
  const [streak, setStreak] = useState(null);
  const [loadingStreak, setLoadingStreak] = useState(true);

  useEffect(() => {
    fetchStreak();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('searching_match', (data) => {
        console.log('Searching:', data.message);
      });

      socket.on('match_found', (data) => {
        setSearching(false);
        navigation.navigate('Call', {
          matchedUser: data.matchedUser,
          callId: data.callId,
        });
      });

      socket.on('match_error', (data) => {
        setSearching(false);
        Alert.alert('Error', data.message);
      });

      return () => {
        socket.off('searching_match');
        socket.off('match_found');
        socket.off('match_error');
      };
    }
  }, [socket]);

  const fetchStreak = async () => {
    try {
      const response = await streakAPI.getStreak();
      setStreak(response.data.streak);
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setLoadingStreak(false);
    }
  };

  const handleFindMatch = () => {
    if (!connected) {
      Alert.alert('Error', 'Not connected to server');
      return;
    }

    if (selectedFilter !== 'free' && !user.isPremium) {
      Alert.alert(
        'Premium Required',
        'Gender filtering is a premium feature. Upgrade to premium to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Premium') },
        ]
      );
      return;
    }

    setSearching(true);
    socket.emit('find_match', {
      userId: user.id,
      filter: selectedFilter,
    });
  };

  const handleCancelSearch = () => {
    socket.emit('cancel_match', { userId: user.id });
    setSearching(false);
  };

  const renderWeeklyStreak = () => {
    if (loadingStreak) {
      return <ActivityIndicator color="#6366f1" />;
    }

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    
    return (
      <View style={styles.weeklyStreakContainer}>
        {weekDays.map((day, index) => {
          const historyEntry = streak?.weeklyHistory?.[index];
          const achieved = historyEntry?.achieved || false;
          const isToday = (today === 0 ? 6 : today - 1) === index;

          return (
            <View key={day} style={styles.dayContainer}>
              <View
                style={[
                  styles.dayCircle,
                  achieved && styles.dayCircleActive,
                  isToday && styles.dayCircleToday,
                ]}
              >
                <Text style={[styles.dayText, achieved && styles.dayTextActive]}>
                  {day[0]}
                </Text>
              </View>
              <Text style={styles.dayLabel}>{day}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={40} color="#6366f1" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Open Talk</Text>
          <View style={styles.connectionIndicator}>
            <View
              style={[
                styles.connectionDot,
                { backgroundColor: connected ? '#10b981' : '#ef4444' },
              ]}
            />
          </View>
        </View>

        {/* Streak Section */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.streakCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.streakHeader}>
            <Ionicons name="flame" size={32} color="#fff" />
            <Text style={styles.streakTitle}>Weekly Streak</Text>
          </View>
          <Text style={styles.streakCount}>
            {streak?.currentStreak || 0} Days
          </Text>
          <Text style={styles.streakSubtitle}>
            Goal: 5 minutes daily • Longest: {streak?.longestStreak || 0} days
          </Text>
          {renderWeeklyStreak()}
        </LinearGradient>

        {/* Connect Section */}
        <View style={styles.connectSection}>
          <Text style={styles.sectionTitle}>Connect with Co-learners</Text>
          
          {/* Filter Options */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'free' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter('free')}
            >
              <Ionicons
                name="people"
                size={20}
                color={selectedFilter === 'free' ? '#fff' : '#6366f1'}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === 'free' && styles.filterButtonTextActive,
                ]}
              >
                Free
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'male' && styles.filterButtonActive,
                !user.isPremium && styles.filterButtonDisabled,
              ]}
              onPress={() => setSelectedFilter('male')}
            >
              <Ionicons
                name="male"
                size={20}
                color={selectedFilter === 'male' ? '#fff' : user.isPremium ? '#6366f1' : '#ccc'}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === 'male' && styles.filterButtonTextActive,
                  !user.isPremium && styles.filterButtonTextDisabled,
                ]}
              >
                Male
              </Text>
              {!user.isPremium && <Ionicons name="star" size={12} color="#fbbf24" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'female' && styles.filterButtonActive,
                !user.isPremium && styles.filterButtonDisabled,
              ]}
              onPress={() => setSelectedFilter('female')}
            >
              <Ionicons
                name="female"
                size={20}
                color={selectedFilter === 'female' ? '#fff' : user.isPremium ? '#6366f1' : '#ccc'}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === 'female' && styles.filterButtonTextActive,
                  !user.isPremium && styles.filterButtonTextDisabled,
                ]}
              >
                Female
              </Text>
              {!user.isPremium && <Ionicons name="star" size={12} color="#fbbf24" />}
            </TouchableOpacity>
          </View>

          {/* Connect Button */}
          <TouchableOpacity
            style={[styles.connectButton, searching && styles.connectButtonSearching]}
            onPress={searching ? handleCancelSearch : handleFindMatch}
            disabled={!connected}
          >
            <LinearGradient
              colors={searching ? ['#ef4444', '#dc2626'] : ['#6366f1', '#8b5cf6']}
              style={styles.connectButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {searching ? (
                <>
                  <ActivityIndicator color="#fff" size="large" />
                  <Text style={styles.connectButtonText}>Searching...</Text>
                  <Text style={styles.connectButtonSubtext}>Tap to cancel</Text>
                </>
              ) : (
                <>
                  <Ionicons name="videocam" size={48} color="#fff" />
                  <Text style={styles.connectButtonText}>Start Connecting</Text>
                  <Text style={styles.connectButtonSubtext}>
                    Find someone to talk with
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Info Cards */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <Ionicons name="people" size={24} color="#6366f1" />
              <Text style={styles.infoCardTitle}>Random Match</Text>
              <Text style={styles.infoCardText}>
                Connect with strangers worldwide
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="heart" size={24} color="#ef4444" />
              <Text style={styles.infoCardTitle}>Make Friends</Text>
              <Text style={styles.infoCardText}>
                Follow after 2+ min calls
              </Text>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  connectionIndicator: {
    width: 40,
    alignItems: 'flex-end',
  },
  connectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  streakCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  streakTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  streakCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  streakSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
  },
  weeklyStreakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  dayCircleActive: {
    backgroundColor: '#fff',
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  dayTextActive: {
    color: '#6366f1',
  },
  dayLabel: {
    fontSize: 10,
    color: '#fff',
  },
  connectSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterButtonDisabled: {
    opacity: 0.5,
  },
  filterButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  filterButtonTextDisabled: {
    color: '#ccc',
  },
  connectButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  connectButtonSearching: {},
  connectButtonGradient: {
    padding: 40,
    alignItems: 'center',
  },
  connectButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  connectButtonSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 10,
  },
  infoCardText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default HomeScreen;

