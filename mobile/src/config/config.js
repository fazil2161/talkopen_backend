// PRODUCTION CONFIGURATION
// Backend deployed on Render - works worldwide!

// IMPORTANT: After deploying to Render, replace this URL with your actual Render URL
const BACKEND_URL = 'https://talkopen-backend.onrender.com'; // ← Replace with YOUR Render URL

export const API_URL = `${BACKEND_URL}/api`;
export const SOCKET_URL = BACKEND_URL;

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

