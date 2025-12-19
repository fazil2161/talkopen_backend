import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      console.log('🔵 Checking for stored credentials...');
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        console.log('🔵 Found stored credentials, validating...');
        // DO NOT set user yet - validate first!
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await axios.get(`${API_URL}/auth/validate`);
          
          if (response.data.valid) {
            // Validation successful - NOW set user
            console.log('✅ Token valid - restoring session:', JSON.parse(storedUser).username);
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token invalid - clear everything
            console.log('⚠️ Token invalid - clearing storage');
            await AsyncStorage.multiRemove(['token', 'user']);
            delete axios.defaults.headers.common['Authorization'];
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          // Validation failed - clear everything
          console.log('❌ Validation failed - clearing storage:', error.message);
          await AsyncStorage.multiRemove(['token', 'user']);
          delete axios.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('🔵 No stored credentials - showing login screen');
        // Ensure user is null
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Error loading user:', error);
      // On any error, ensure clean state
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      console.log('🔵 Attempting registration to:', `${API_URL}/auth/register`);
      console.log('🔵 User data:', userData);
      
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      console.log('✅ Registration successful:', response.data);
      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Full error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      console.log('🔵 Logging out user...');
      
      // Clear AsyncStorage
      await AsyncStorage.multiRemove(['token', 'user']);
      
      // Clear axios headers
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear state (this will trigger navigation to AuthScreen)
      setToken(null);
      setUser(null);
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Error logging out:', error);
      // Force clear even if there's an error
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

