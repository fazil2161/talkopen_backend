import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const SettingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(
    user?.settings?.notifications ?? true
  );
  const [showOnlineStatus, setShowOnlineStatus] = useState(
    user?.settings?.showOnlineStatus ?? true
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Settings',
      headerStyle: { backgroundColor: '#6366f1' },
      headerTintColor: '#fff',
    });
  }, []);

  const handleUpdateSettings = async (key, value) => {
    try {
      await userAPI.updateSettings({
        notifications,
        showOnlineStatus,
        [key]: value,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
      // Revert change
      if (key === 'notifications') setNotifications(!value);
      if (key === 'showOnlineStatus') setShowOnlineStatus(!value);
    }
  };

  const handleNotificationsToggle = (value) => {
    setNotifications(value);
    handleUpdateSettings('notifications', value);
  };

  const handleOnlineStatusToggle = (value) => {
    setShowOnlineStatus(value);
    handleUpdateSettings('showOnlineStatus', value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color="#6366f1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive push notifications
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
              thumbColor={notifications ? '#6366f1' : '#f3f4f6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="eye" size={24} color="#6366f1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Show Online Status</Text>
                <Text style={styles.settingDescription}>
                  Let others see when you're online
                </Text>
              </View>
            </View>
            <Switch
              value={showOnlineStatus}
              onValueChange={handleOnlineStatusToggle}
              trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
              thumbColor={showOnlineStatus ? '#6366f1' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <Ionicons name="key" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('PrivacySettings')}
          >
            <Ionicons name="shield-checkmark" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Privacy Settings</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('BlockedUsers')}
          >
            <Ionicons name="ban" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Blocked Users</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>About Open Talk</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="lock-closed" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="mail" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Contact Support</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>Danger Zone</Text>

          <TouchableOpacity
            style={[styles.menuItem, styles.dangerItem]}
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      // Implement account deletion
                      Alert.alert('Coming Soon', 'Account deletion will be available soon');
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash" size={24} color="#ef4444" />
            <Text style={[styles.menuItemText, { color: '#ef4444' }]}>
              Delete Account
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionSubtext}>© 2024 Open Talk. All rights reserved.</Text>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    marginBottom: 10,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
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
  dangerItem: {
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 5,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#d1d5db',
  },
});

export default SettingsScreen;

