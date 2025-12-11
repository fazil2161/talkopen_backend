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
// TEMP: Razorpay removed for initial APK build - will add back later
// import RazorpayCheckout from 'react-native-razorpay';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';
import { RAZORPAY_KEY, PREMIUM_PRICE } from '../config/config';

const PremiumScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const response = await paymentAPI.checkPremiumStatus();
      setPremiumStatus(response.data);
    } catch (error) {
      console.error('Error checking premium status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handlePurchasePremium = async () => {
    // TEMP: Payment temporarily disabled - will add Razorpay back in next update
    Alert.alert(
      'Coming Soon! 🚀',
      'Premium features and payment integration will be available in the next update. Stay tuned!',
      [{ text: 'OK' }]
    );
    
    /* Original Razorpay payment code - will re-enable later
    setLoading(true);

    try {
      // Create order on backend
      const orderResponse = await paymentAPI.createOrder();
      const { order } = orderResponse.data;

      // Razorpay options
      const options = {
        description: 'Open Talk Premium Subscription',
        image: 'https://your-logo-url.com/logo.png',
        currency: order.currency,
        key: RAZORPAY_KEY,
        amount: order.amount,
        name: 'Open Talk',
        order_id: order.id,
        prefill: {
          email: user.email,
          name: user.username,
        },
        theme: { color: '#6366f1' },
      };

      // Open Razorpay
      RazorpayCheckout.open(options)
        .then(async (data) => {
          // Payment successful
          try {
            const verifyResponse = await paymentAPI.verifyPayment({
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              await updateUser(verifyResponse.data.user);
              
              Alert.alert(
                'Success! 🎉',
                'You are now a premium member! Enjoy exclusive features.',
                [{ text: 'OK', onPress: () => checkPremiumStatus() }]
              );
            }
          } catch (error) {
            Alert.alert('Error', 'Payment verification failed');
          }
        })
        .catch((error) => {
          console.error('Payment error:', error);
          Alert.alert('Payment Cancelled', 'Your payment was not completed');
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to initiate payment');
      console.error('Error creating order:', error);
    }
    */
  };

  if (checkingStatus) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </SafeAreaView>
    );
  }

  const isPremium = premiumStatus?.isPremium;
  const expiresAt = premiumStatus?.expiresAt;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="star" size={80} color="#fbbf24" />
          <Text style={styles.headerTitle}>Open Talk Premium</Text>
          <Text style={styles.headerSubtitle}>
            Unlock exclusive features and connect better
          </Text>
        </LinearGradient>

        {/* Premium Status */}
        {isPremium && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.statusTitle}>Premium Active</Text>
            </View>
            <Text style={styles.statusText}>
              Your premium subscription expires on{' '}
              {new Date(expiresAt).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Premium Features</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="male-female" size={24} color="#6366f1" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Gender Filtering</Text>
              <Text style={styles.featureDescription}>
                Choose to connect with specific genders
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="chatbubbles" size={24} color="#6366f1" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Unlimited Messaging</Text>
              <Text style={styles.featureDescription}>
                Chat with anyone without mutual follow requirement
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="call" size={24} color="#6366f1" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Call Followed Users</Text>
              <Text style={styles.featureDescription}>
                Direct call your followed users anytime
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="star" size={24} color="#6366f1" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Premium Badge</Text>
              <Text style={styles.featureDescription}>
                Stand out with exclusive premium badge
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="flash" size={24} color="#6366f1" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Priority Matching</Text>
              <Text style={styles.featureDescription}>
                Get matched faster with priority queue
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={24} color="#6366f1" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Ad-Free Experience</Text>
              <Text style={styles.featureDescription}>
                Enjoy the app without any advertisements
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          </View>
        </View>

        {/* Pricing */}
        {!isPremium && (
          <View style={styles.pricingContainer}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.pricingCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.pricingTitle}>Monthly Subscription</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <Text style={styles.price}>{PREMIUM_PRICE}</Text>
                <Text style={styles.pricePeriod}>/month</Text>
              </View>
              <Text style={styles.pricingDescription}>
                Cancel anytime • Secure payment
              </Text>

              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={handlePurchasePremium}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#6366f1" />
                ) : (
                  <>
                    <Ionicons name="star" size={20} color="#6366f1" />
                    <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                  </>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Benefits Note */}
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle" size={20} color="#6b7280" />
          <Text style={styles.noteText}>
            Premium subscription is valid for 30 days from the date of purchase
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 10,
    textAlign: 'center',
  },
  statusCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginLeft: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#6b7280',
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  pricingContainer: {
    padding: 20,
  },
  pricingCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  price: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
  },
  pricePeriod: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
    marginTop: 30,
  },
  pricingDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 30,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
    marginLeft: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 10,
  },
});

export default PremiumScreen;

