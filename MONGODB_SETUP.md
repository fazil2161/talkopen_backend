# 🍃 MongoDB Setup Guide for Open Talk

Quick guide to get MongoDB running on your Windows machine.

---

## 🎯 Option 1: MongoDB as Windows Service (Recommended)

If you installed MongoDB with default settings, it's probably already running as a service.

### Check if MongoDB is Running

```powershell
Get-Service MongoDB
```

**Expected output:**
```
Status   Name               DisplayName
------   ----               -----------
Running  MongoDB            MongoDB
```

---

### Start MongoDB Service

**If status is "Stopped":**

```powershell
Start-Service MongoDB
```

---

### Verify Connection

```powershell
# Open MongoDB shell
mongosh

# Or if using older version:
mongo
```

**If it connects, you're good to go!** ✅

Type `exit` to close.

---

## 🎯 Option 2: Run MongoDB Manually

If MongoDB is not installed as a service:

### Start MongoDB Server

**Open a NEW PowerShell window and run:**

```powershell
mongod
```

**Keep this window open!** MongoDB needs to run continuously.

**Expected output:**
```
[initandlisten] waiting for connections on port 27017
```

---

## 📥 MongoDB Not Installed?

### Download and Install

1. **Go to:** https://www.mongodb.com/try/download/community
2. **Select:**
   - Version: Latest
   - Platform: Windows
   - Package: MSI
3. **Download and run installer**
4. **Choose "Complete" installation**
5. **Install MongoDB as a Service** ✅ (check this option!)
6. **Install MongoDB Compass** (optional GUI tool)

---

## ✅ Verify MongoDB is Working

### Test Connection

**Option 1: Using mongosh**
```powershell
mongosh
```

**Option 2: Test from your app**
```powershell
cd backend
npm run dev
```

**Look for:**
```
✅ MongoDB Connected
```

---

## 🐛 Common MongoDB Issues

### ❌ "MongoDB service not found"

**Solution:**
MongoDB is not installed as a service. Run manually:
```powershell
mongod
```

---

### ❌ "Data directory not found"

**Solution:**
Create data directory:
```powershell
New-Item -ItemType Directory -Path C:\data\db -Force
mongod --dbpath C:\data\db
```

---

### ❌ "Port 27017 already in use"

**Solution:**
MongoDB is already running! Just use it.

Or kill the process:
```powershell
Get-Process mongod | Stop-Process -Force
mongod
```

---

### ❌ "Connection refused"

**Solutions:**
1. Check MongoDB is running: `Get-Service MongoDB`
2. Start it: `Start-Service MongoDB`
3. Or run manually: `mongod`

---

## 🔧 Configure MongoDB for Open Talk

Your app is already configured! The `.env` file has:

```env
MONGODB_URI=mongodb://localhost:27017/opentalk
```

This creates a database named `opentalk` automatically.

---

## 📊 View Your Data (Optional)

### Using MongoDB Compass (GUI)

1. **Install MongoDB Compass** (if not already installed)
2. **Open Compass**
3. **Connect to:** `mongodb://localhost:27017`
4. **See databases:**
   - `opentalk` - Your app's database
   - Collections: users, messages, streaks, etc.

### Using Command Line

```powershell
mongosh
use opentalk
show collections
db.users.find().pretty()
```

---

## 🎯 For Your App

### What You Need to Do

**If MongoDB is already running as a service:**
✅ **Nothing!** Just start your backend server:
```powershell
cd backend
npm run dev
```

**If MongoDB is not a service:**
1. **Terminal 1:** Run `mongod` (keep open)
2. **Terminal 2:** Run `cd backend` → `npm run dev`
3. **Terminal 3:** Run `cd mobile` → `npm start`

---

## ✅ Success Checklist

**MongoDB is working if:**

- [ ] `Get-Service MongoDB` shows "Running" OR
- [ ] `mongod` command runs without errors
- [ ] Backend shows "✅ MongoDB Connected"
- [ ] Can register users in your app
- [ ] Data persists after app restart

---

## 💡 Pro Tips

✅ **Install as service** - Easier, starts automatically
✅ **Keep mongod running** - If not using service
✅ **Use MongoDB Compass** - Great for viewing data
✅ **Default port is 27017** - Don't change it
✅ **No password needed** - For local development

---

## 🆘 Need Help?

**Still can't get MongoDB running?**

1. **Check if installed:**
   ```powershell
   mongod --version
   ```

2. **Reinstall MongoDB** with "Install as Service" option

3. **Use MongoDB Atlas (Cloud):**
   - Free cloud database
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up, create free cluster
   - Get connection string
   - Update `MONGODB_URI` in `.env`

---

**MongoDB is essential for the app to work!** Make sure it's running before starting the backend.

Good luck! 🍃

