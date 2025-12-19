import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SocketProvider } from './src/context/SocketContext';
import { ActivityIndicator, View } from 'react-native';

// Screens
import AuthScreen from './src/screens/AuthScreen';
import MainTabs from './src/navigation/MainTabs';
import CallScreen from './src/screens/CallScreen';
import ChatDetailScreen from './src/screens/ChatDetailScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import PrivacySettingsScreen from './src/screens/PrivacySettingsScreen';
import BlockedUsersScreen from './src/screens/BlockedUsersScreen';

const Stack = createStackNavigator();

function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <NavigationContainer key={user ? 'logged-in' : 'logged-out'}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen 
            name="Auth" 
            component={AuthScreen}
            options={{
              animationTypeForReplace: 'pop'
            }}
          />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="Call" 
              component={CallScreen}
              options={{ 
                presentation: 'fullScreenModal',
                gestureEnabled: false
              }}
            />
            <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
            <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Navigation />
      </SocketProvider>
    </AuthProvider>
  );
}

