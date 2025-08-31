require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

// Models
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ladies-glam')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Initialize Firebase Admin
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Auth middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Auth Routes
app.post('/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Create or update user in MongoDB
    let user = await User.findOne({ uid: decodedToken.uid });
    if (!user) {
      user = new User({
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture
      });
      await user.save();
    }
    
    const jwtToken = jwt.sign(
      {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token: jwtToken,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid Firebase token' });
  }
});

// User Profile Routes
app.get('/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/user/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, phone } = req.body;
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { displayName, phone },
      { new: true }
    );
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Address Routes
app.get('/user/addresses', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    res.json({ addresses: user?.addresses || [] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/user/addresses', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAddress = req.body;
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push(newAddress);
    await user.save();
    
    res.json({ address: user.addresses[user.addresses.length - 1] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/user/addresses/:addressId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    const address = user.addresses.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    Object.assign(address, req.body);
    
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== req.params.addressId) {
          addr.isDefault = false;
        }
      });
    }
    
    await user.save();
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/user/addresses/:addressId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    user.addresses.id(req.params.addressId).remove();
    await user.save();
    res.json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Payment Methods Routes
app.get('/user/payment-methods', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    res.json({ paymentMethods: user?.paymentMethods || [] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/user/payment-methods', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPaymentMethod = req.body;
    if (newPaymentMethod.isDefault) {
      user.paymentMethods.forEach(pm => pm.isDefault = false);
    }
    
    user.paymentMethods.push(newPaymentMethod);
    await user.save();
    
    res.json({ paymentMethod: user.paymentMethods[user.paymentMethods.length - 1] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/user/payment-methods/:paymentId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    user.paymentMethods.id(req.params.paymentId).remove();
    await user.save();
    res.json({ message: 'Payment method deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Notification Settings Routes
app.get('/user/notifications', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    res.json({ notifications: user?.notificationSettings || {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/user/notifications', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { notificationSettings: req.body },
      { new: true }
    );
    res.json({ notifications: user.notificationSettings });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Orders Routes
app.get('/user/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/user/orders/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderId: req.params.orderId, 
      userId: req.user.uid 
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;
    
    const orderId = `ORD${Date.now()}`;
    const order = new Order({
      orderId,
      userId: req.user.uid,
      userEmail: req.user.email,
      items,
      total,
      shippingAddress,
      paymentMethod,
      status: 'Pending'
    });
    
    await order.save();
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Ladies Glam API Server with MongoDB' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});