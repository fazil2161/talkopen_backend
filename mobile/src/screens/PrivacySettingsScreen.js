import React, { useState, useEffect } from 'react';
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

const PrivacySettingsScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [showOnlineStatus, setShowOnlineStatus] = useState(
    user?.privacy?.showOnlineStatus ?? true
  );
  const [allowCallsFromStrangers, setAllowCallsFromStrangers] = useState(
    user?.privacy?.allowCallsFromStrangers ?? true
  );
  const [showAge, setShowAge] = useState(user?.privacy?.showAge ?? true);
  const [showGender, setShowGender] = useState(user?.privacy?.showGender ?? true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Privacy Settings',
      headerStyle: { backgroundColor: '#6366f1' },
      headerTintColor: '#fff',
    });
  }, []);

  const handleUpdatePrivacy = async (key, value) => {
    const updatedSettings = {
      showOnlineStatus,
      allowCallsFromStrangers,
      showAge,
      showGender,
      [key]: value,
    };

    try {
      const response = await userAPI.updateProfile({
        privacy: updatedSettings,
      });

      if (response.data.success) {
        updateUser({
          ...user,
          privacy: updatedSettings,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update privacy settings');
      // Revert the change
      switch (key) {
        case 'showOnlineStatus':
          setShowOnlineStatus(!value);
          break;
        case 'allowCallsFromStrangers':
          setAllowCallsFromStrangers(!value);
          break;
        case 'showAge':
          setShowAge(!value);
          break;
        case 'showGender':
          setShowGender(!value);
          break;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibility</Text>
          <Text style={styles.sectionDescription}>
            Control what others can see about you
          </Text>

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
              onValueChange={(value) => {
                setShowOnlineStatus(value);
                handleUpdatePrivacy('showOnlineStatus', value);
              }}
              trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
              thumbColor={showOnlineStatus ? '#6366f1' : '#f3f4f6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="person" size={24} color="#6366f1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Show Age</Text>
                <Text style={styles.settingDescription}>
                  Display your age on your profile
                </Text>
              </View>
            </View>
            <Switch
              value={showAge}
              onValueChange={(value) => {
                setShowAge(value);
                handleUpdatePrivacy('showAge', value);
              }}
              trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
              thumbColor={showAge ? '#6366f1' : '#f3f4f6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="male-female" size={24} color="#6366f1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Show Gender</Text>
                <Text style={styles.settingDescription}>
                  Display your gender on your profile
                </Text>
              </View>
            </View>
            <Switch
              value={showGender}
              onValueChange={(value) => {
                setShowGender(value);
                handleUpdatePrivacy('showGender', value);
              }}
              trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
              thumbColor={showGender ? '#6366f1' : '#f3f4f6'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calls & Matching</Text>
          <Text style={styles.sectionDescription}>
            Control who can connect with you
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="call" size={24} color="#6366f1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Allow Calls from Strangers</Text>
                <Text style={styles.settingDescription}>
                  Get matched with random people
                </Text>
              </View>
            </View>
            <Switch
              value={allowCallsFromStrangers}
              onValueChange={(value) => {
                setAllowCallsFromStrangers(value);
                handleUpdatePrivacy('allowCallsFromStrangers', value);
              }}
              trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
              thumbColor={allowCallsFromStrangers ? '#6366f1' : '#f3f4f6'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Safety</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Download My Data</Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Alert.alert(
                'Clear Call History',
                'This will permanently delete your call history. This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                      Alert.alert('Coming Soon', 'This feature will be available soon');
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash" size={24} color="#ef4444" />
            <Text style={[styles.menuItemText, { color: '#ef4444' }]}>
              Clear Call History
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={24} color="#10b981" />
          <Text style={styles.infoText}>
            Your privacy is important to us. We never share your personal data with third
            parties.
          </Text>
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
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    padding: 15,
    borderRadius: 12,
    margin: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#065f46',
    lineHeight: 20,
  },
});

export default PrivacySettingsScreen;

