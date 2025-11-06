// IMPORTANT: Update these URLs before running the app
// For Android Emulator, use 10.0.2.2 instead of localhost
// For Physical Device, use your computer's IP address (e.g., 192.168.1.100)
// To find your IP: Windows (ipconfig) | Mac/Linux (ifconfig)

const SERVER_IP = '192.168.1.9'; // Change this to your IP address

export const API_URL = `http://${SERVER_IP}:5000/api`;
export const SOCKET_URL = `http://${SERVER_IP}:5000`;

// Razorpay key (Get from https://dashboard.razorpay.com/app/keys)
// Use test key for development: rzp_test_...
export const RAZORPAY_KEY = 'rzp_test_YOUR_KEY_ID_HERE';

// App constants
export const PREMIUM_PRICE = 299;
export const MIN_CALL_DURATION_FOR_FOLLOW = 120; // 2 minutes in seconds
export const DAILY_STREAK_GOAL = 300; // 5 minutes in seconds

// Development tips:
// - Android Emulator: Use 10.0.2.2
// - iOS Simulator: Use localhost
// - Physical Device: Use your computer's local IP (must be on same WiFi)

