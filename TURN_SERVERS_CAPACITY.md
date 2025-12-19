# 📡 **TURN Servers - Capacity & Production Guide**

## **🆓 Free TURN Servers (Current Setup)**

### **What You're Currently Using:**

```javascript
// These are FREE public TURN servers
{ urls: 'stun:stun.relay.metered.ca:80' }
{ urls: 'turn:global.relay.metered.ca:80', ... }
{ urls: 'turn:global.relay.metered.ca:80?transport=tcp', ... }
{ urls: 'turn:global.relay.metered.ca:443', ... }
{ urls: 'turns:global.relay.metered.ca:443?transport=tcp', ... }
```

---

### **❌ Free TURN Server Limitations:**

| Aspect | Limitation | Reality |
|--------|------------|---------|
| **Concurrent Users** | ~10-20 simultaneous calls | Shared with thousands of developers |
| **Call Duration** | Unlimited (but unreliable) | May disconnect randomly |
| **Bandwidth** | Limited & throttled | Choppy audio, delays |
| **Uptime** | No guarantee | Can go offline anytime |
| **Location** | Fixed servers | High latency for distant users |
| **Support** | None | If it breaks, you're stuck |
| **Rate Limiting** | Heavy restrictions | Calls may fail during peak hours |

---

### **🎯 Real-World Performance:**

#### **✅ What Works:**
- Testing with 2-5 users
- Development & debugging
- Same country calls (usually)
- Proving the concept

#### **❌ What Fails:**
- **Peak Hours**: Most users get "ICE failed"
- **International Calls**: High latency = poor audio
- **Reliability**: Random disconnections
- **Scaling**: 20+ users = service degrades significantly
- **Production Use**: Completely unsuitable

---

### **📊 Expected Capacity:**

| Users | Experience | Call Success Rate |
|-------|------------|-------------------|
| 1-10 | Good (testing) | ~90% |
| 10-50 | Degraded | ~60% |
| 50-100 | Very poor | ~30% |
| 100-500 | Mostly fails | ~10% |
| 500+ | Unusable | ~0% |

**Reality:** Free TURN servers are **shared by thousands of apps**. Your 100 users are competing with thousands of other users globally.

---

## **💎 Metered TURN (Paid - Recommended for Production)**

### **What is Metered.ca?**

Metered.ca is a **premium TURN server provider** with:
- Dedicated infrastructure
- Global CDN (10+ locations)
- High uptime (99.9% SLA)
- Pay-per-GB pricing
- No rate limiting

---

### **🚀 Metered.ca Capacity:**

| Plan | Monthly Cost | Bandwidth | Concurrent Users | Suitable For |
|------|--------------|-----------|------------------|--------------|
| **Free** | $0 | 50 GB | ~10-20 | Testing only |
| **Starter** | $29 | 250 GB | ~200-300 | Small launch |
| **Growth** | $79 | 750 GB | ~600-800 | Growing app |
| **Business** | $199 | 2 TB | ~1,500-2,000 | Production |
| **Enterprise** | Custom | Unlimited | 10,000+ | Large scale |

---

### **📈 Bandwidth Calculations:**

**How much bandwidth does a call use?**

| Call Type | Bitrate | Bandwidth per Minute | Bandwidth per Hour |
|-----------|---------|----------------------|--------------------|
| **Audio Only** | 64 kbps | ~0.5 MB | ~30 MB |
| **HD Audio** | 128 kbps | ~1 MB | ~60 MB |
| **Video (720p)** | 1-2 Mbps | ~10-15 MB | ~600-900 MB |

**Your app (audio only):**
- **Per call minute**: ~0.5 MB bandwidth
- **Per call (10 min avg)**: ~5 MB
- **Per call (30 min)**: ~15 MB

---

### **💰 Cost Breakdown for Your App:**

#### **Scenario 1: Small Launch (100 active users)**

**Assumptions:**
- 100 users
- Average 5 calls per user per day
- Average call duration: 10 minutes

**Calculation:**
```
Daily calls: 100 users × 5 calls = 500 calls/day
Daily bandwidth: 500 × 5 MB = 2.5 GB/day
Monthly bandwidth: 2.5 GB × 30 days = 75 GB/month
```

**Cost:** **$29/month** (Starter plan - 250 GB)

**Success Rate:** **~98%** ✅

---

#### **Scenario 2: Growing App (1,000 active users)**

**Assumptions:**
- 1,000 users
- Average 5 calls per user per day
- Average call duration: 10 minutes

**Calculation:**
```
Daily calls: 1,000 users × 5 calls = 5,000 calls/day
Daily bandwidth: 5,000 × 5 MB = 25 GB/day
Monthly bandwidth: 25 GB × 30 days = 750 GB/month
```

**Cost:** **$79/month** (Growth plan - 750 GB)

**Success Rate:** **~99%** ✅

---

#### **Scenario 3: Popular App (10,000 active users)**

**Assumptions:**
- 10,000 users
- Average 5 calls per user per day
- Average call duration: 10 minutes

**Calculation:**
```
Daily calls: 10,000 users × 5 calls = 50,000 calls/day
Daily bandwidth: 50,000 × 5 MB = 250 GB/day
Monthly bandwidth: 250 GB × 30 days = 7.5 TB/month
```

**Cost:** **~$500/month** (Custom Enterprise pricing)

**Success Rate:** **99.9%** ✅

---

### **🌍 Metered.ca Global Locations:**

- 🇺🇸 USA (East, West, Central)
- 🇪🇺 Europe (London, Frankfurt, Amsterdam)
- 🇮🇳 India (Mumbai, Bangalore)
- 🇦🇺 Australia (Sydney)
- 🇯🇵 Japan (Tokyo)
- 🇧🇷 Brazil (São Paulo)

**Benefit:** Users automatically connect to the **closest server** = low latency!

---

## **⚙️ How to Upgrade to Metered (Paid)**

### **Step 1: Create Account**

1. Go to: https://www.metered.ca/
2. Sign up for free account
3. Verify email

---

### **Step 2: Get Your Credentials**

1. Dashboard → TURN Servers
2. Copy your credentials:
   ```javascript
   {
     urls: 'turn:a.relay.metered.ca:443',
     username: 'YOUR_USERNAME_HERE',
     credential: 'YOUR_PASSWORD_HERE'
   }
   ```

---

### **Step 3: Update CallScreen.js**

**Replace current TURN config:**

```javascript:mobile/src/screens/CallScreen.js
// OLD (Free - unreliable)
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:global.relay.metered.ca:80',
      username: 'a1234567890',
      credential: 'password123',
    },
    // ... more free servers
  ],
  iceCandidatePoolSize: 10,
};

// NEW (Metered paid - reliable)
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:a.relay.metered.ca:443',
      username: 'YOUR_METERED_USERNAME', // ← From dashboard
      credential: 'YOUR_METERED_PASSWORD', // ← From dashboard
    },
    {
      urls: 'turn:a.relay.metered.ca:443?transport=tcp',
      username: 'YOUR_METERED_USERNAME',
      credential: 'YOUR_METERED_PASSWORD',
    },
  ],
  iceCandidatePoolSize: 10,
};
```

---

### **Step 4: Choose a Plan**

1. Start with **Free tier** (50 GB) to test
2. Monitor usage in dashboard
3. Upgrade when you hit limits:
   - **50 GB**: ~10,000 calls
   - **250 GB**: ~50,000 calls
   - **750 GB**: ~150,000 calls

---

## **🆚 Comparison: Free vs Metered (Paid)**

| Feature | Free TURN | Metered Paid |
|---------|-----------|--------------|
| **Concurrent Users** | 10-20 | 1,000+ |
| **Call Success Rate** | ~70% | 99.9% |
| **Audio Quality** | Choppy | Crystal clear |
| **Latency** | High (varies) | Low (optimized) |
| **Uptime** | No guarantee | 99.9% SLA |
| **Support** | None | Email + Chat |
| **Rate Limiting** | Heavy | None |
| **Global CDN** | No | Yes (10+ locations) |
| **Analytics** | None | Full dashboard |
| **Suitable For** | Testing only | Production |
| **Cost** | Free | $29-$199/month |

---

## **🎯 Recommendations by Stage:**

### **Stage 1: Development & Testing**
- **Use:** Free TURN servers (current setup)
- **Cost:** $0
- **Capacity:** 2-10 test users
- **Duration:** Until app is stable

---

### **Stage 2: Soft Launch (100-500 users)**
- **Use:** Metered Starter ($29/month)
- **Cost:** $29/month
- **Capacity:** 200-300 concurrent calls
- **Expected Calls:** 10,000-50,000/month
- **Success Rate:** 98%+

---

### **Stage 3: Growing App (500-5,000 users)**
- **Use:** Metered Growth ($79/month)
- **Cost:** $79/month
- **Capacity:** 600-800 concurrent calls
- **Expected Calls:** 50,000-200,000/month
- **Success Rate:** 99%+

---

### **Stage 4: Popular App (5,000+ users)**
- **Use:** Metered Business/Enterprise
- **Cost:** $199-$500/month
- **Capacity:** 2,000+ concurrent calls
- **Expected Calls:** 500,000+/month
- **Success Rate:** 99.9%+

---

## **🔧 Alternative TURN Providers:**

| Provider | Pricing | Best For | Link |
|----------|---------|----------|------|
| **Metered.ca** | $29-$199/mo | All apps (recommended) | https://www.metered.ca/ |
| **Twilio TURN** | $0.0005/GB | Enterprise apps | https://www.twilio.com/stun-turn |
| **Xirsys** | $20-$100/mo | WebRTC focus | https://xirsys.com/ |
| **Cloudflare** | Usage-based | Large scale | https://www.cloudflare.com/ |
| **Self-hosted** | $50-$200/mo | Full control (advanced) | coturn server |

---

## **📊 Your Current Status:**

✅ **Working:** Free TURN servers for development
⚠️ **Limitation:** Not suitable for 100+ users
🚀 **Next Step:** Upgrade to Metered Starter when you have 50+ active users

---

## **💡 Pro Tips:**

### **1. Monitor Usage:**
- Track call success rate
- Monitor ICE connection failures
- Watch for "slow" or "choppy" complaints

### **2. When to Upgrade:**
- Call success rate drops below 85%
- More than 50 active daily users
- Users report frequent disconnections
- Planning to launch publicly

### **3. Cost Optimization:**
- Start with Starter plan ($29)
- Monitor bandwidth usage
- Only upgrade when you hit 80% of plan limit
- Consider implementing call time limits

### **4. Hybrid Approach:**
- Use free TURN for testing/development
- Use paid Metered for production APK
- Switch based on build configuration

---

## **🎯 Bottom Line:**

### **For Your App:**

**Current Free TURN Servers:**
- ✅ **Perfect for now** (testing phase)
- ✅ Handles 2-20 test users
- ❌ NOT production-ready

**When to Upgrade:**
- ✅ When you have 50+ daily active users
- ✅ When planning public launch
- ✅ When free servers start failing (>30% failure rate)

**Expected Production Cost:**
- **100 users**: $29/month
- **1,000 users**: $79/month
- **10,000 users**: $500/month

---

## **📝 Summary:**

| Question | Answer |
|----------|--------|
| **How many users can free TURN handle?** | Realistically 10-20 concurrent calls |
| **How many minutes of calls?** | Unlimited duration, but may disconnect |
| **Should I use free in production?** | NO - only for testing |
| **How many users with Metered paid?** | 200-2,000+ depending on plan |
| **Recommended plan for launch?** | Metered Starter ($29/mo) for first 100-500 users |
| **When to upgrade?** | When you have 50+ active users or success rate drops |

---

**Your current setup is PERFECT for development. Switch to Metered paid before public launch!** 🚀

