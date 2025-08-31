const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  phone: String,
  isDefault: { type: Boolean, default: false },
  type: { type: String, enum: ['Shipping', 'Billing'], default: 'Shipping' }
});

const paymentMethodSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  last4: { type: String, required: true },
  exp: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const notificationSettingsSchema = new mongoose.Schema({
  orderUpdates: { type: Boolean, default: true },
  newArrivals: { type: Boolean, default: true },
  salesPromos: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: String,
  photoURL: String,
  phone: String,
  addresses: [addressSchema],
  paymentMethods: [paymentMethodSchema],
  notificationSettings: { type: notificationSettingsSchema, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);