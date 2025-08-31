import React, { useState } from "react";
import { 
  User, MapPin, CreditCard, Phone, Package, 
  Bell, KeyRound, ChevronRight, Plus, Edit, Trash2, X, Check, LogOut 
} from "lucide-react";
import { useToast } from '../components/Toast';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import { userAPI, addressAPI, paymentAPI, notificationAPI, orderAPI } from '../services/api';

interface Address {
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  type: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp: string;
  isDefault?: boolean;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    image: string;
  }>;
}

const currency = (amount: number) => `$${amount.toFixed(2)}`;
const UserIcon = User;

export default function Account() {
  const { showToast } = useToast();
  const { user, signOut, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses);
  const [payments, setPayments] = useState<PaymentMethod[]>(defaultPayments);
  const [orders] = useState<Order[]>(defaultOrders);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState({ 
    name: user?.displayName || "Precious Arthur", 
    email: user?.email || "preciousarthur@gmail.com", 
    phone: "+233 25 717 9772" 
  });
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    newArrivals: true,
    salesPromos: false
  });
  const [promoCode, setPromoCode] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [newPayment, setNewPayment] = useState({ brand: '', last4: '', exp: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    fullName: 'Precious Arthur',
    line1: 'Effiakuma',
    line2: '',
    city: 'Takoradi',
    state: 'Western Region',
    zip: '00233',
    country: 'Ghana',
    phone: '+233 25 717 9772',
    type: 'Shipping'
  });

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [loading, isAuthenticated, navigate]);

  
  React.useEffect(() => {
    if (isAuthenticated && !loading) {
      loadUserData();
    }
  }, [isAuthenticated, loading]);

  const loadUserData = async () => {
    try {
      const [userRes, addressRes, paymentRes, notificationRes, orderRes] = await Promise.all([
        userAPI.getProfile(),
        addressAPI.getAddresses(),
        paymentAPI.getPaymentMethods(),
        notificationAPI.getSettings(),
        orderAPI.getOrders()
      ]);
      
      if (userRes.user) {
        setProfile({
          name: userRes.user.displayName || user?.displayName || 'User',
          email: userRes.user.email || user?.email || '',
          phone: userRes.user.phone || '+233 25 717 9772'
        });
      }
      
      setAddresses(addressRes.addresses || []);
      setPayments(paymentRes.paymentMethods || []);
      setNotifications(notificationRes.notifications || {
        orderUpdates: true,
        newArrivals: true,
        salesPromos: false
      });
      
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast('Signed out successfully!', 'success');
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      showToast('Error signing out', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSetDefaultPayment = async (id: string) => {
    try {
      const paymentMethod = payments.find(pm => pm.id === id);
      if (paymentMethod) {
        await paymentAPI.addPaymentMethod({ ...paymentMethod, isDefault: true });
        setPayments(prev => prev.map(pm => ({ ...pm, isDefault: pm.id === id })));
        showToast('Default payment method updated', 'success');
      }
    } catch (error) {
      console.error('Error updating default payment:', error);
      showToast('Failed to update payment method', 'error');
    }
  };

  const handleRemovePayment = async (id: string) => {
    try {
      await paymentAPI.deletePaymentMethod(id);
      setPayments(prev => prev.filter(pm => pm.id !== id));
      showToast('Payment method removed', 'success');
    } catch (error) {
      console.error('Error removing payment method:', error);
      showToast('Failed to remove payment method', 'error');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const address = addresses.find(addr => addr.id === id);
      if (address) {
        await addressAPI.updateAddress(id, { ...address, isDefault: true });
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === id })));
        showToast('Default address updated', 'success');
      }
    } catch (error) {
      console.error('Error updating default address:', error);
      showToast('Failed to update address', 'error');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await addressAPI.deleteAddress(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      showToast('Address deleted', 'success');
    } catch (error) {
      console.error('Error deleting address:', error);
      showToast('Failed to delete address', 'error');
    }
  };

  const handleNotificationChange = async (key: keyof typeof notifications) => {
    try {
      const newSettings = { ...notifications, [key]: !notifications[key] };
      await notificationAPI.updateSettings(newSettings);
      setNotifications(newSettings);
      showToast('Notification settings updated', 'success');
    } catch (error) {
      console.error('Error updating notifications:', error);
      showToast('Failed to update notifications', 'error');
    }
  };

  const handleSaveProfile = async () => {
    try {
      await userAPI.updateProfile({
        displayName: profile.name,
        phone: profile.phone
      });
      setEditingProfile(false);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      showToast(`Promo code "${promoCode}" applied!`, 'success');
      setPromoCode("");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await addressAPI.updateAddress(editingAddress, newAddress);
        setAddresses(prev => prev.map(addr => 
          addr.id === editingAddress ? { ...newAddress, id: editingAddress } : addr
        ));
        setEditingAddress(null);
        showToast('Address updated successfully!', 'success');
      } else {
        const response = await addressAPI.addAddress({
          ...newAddress,
          isDefault: addresses.length === 0
        });
        const address: Address = {
          ...newAddress,
          id: response.address._id,
          isDefault: addresses.length === 0
        };
        setAddresses(prev => [...prev, address]);
        showToast('Address added successfully!', 'success');
      }
      
      setNewAddress({
        fullName: 'Precious Arthur',
        line1: 'Effiakuma',
        line2: '',
        city: 'Takoradi',
        state: 'Western Region',
        zip: '00233',
        country: 'Ghana',
        phone: '+233 25 717 9772',
        type: 'Shipping'
      });
      setShowAddressModal(false);
    } catch (error) {
      console.error('Error saving address:', error);
      showToast('Failed to save address', 'error');
    }
  };

  const handleEditAddress = (address: Address) => {
    setNewAddress({
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone || '',
      type: address.type
    });
    setEditingAddress(address.id);
    setShowAddressModal(true);
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await paymentAPI.addPaymentMethod({
        ...newPayment,
        isDefault: payments.length === 0
      });
      
      const payment: PaymentMethod = {
        ...newPayment,
        id: response.paymentMethod._id,
        isDefault: payments.length === 0
      };
      
      setPayments(prev => [...prev, payment]);
      setNewPayment({ brand: '', last4: '', exp: '' });
      setShowPaymentModal(false);
      showToast('Payment method added successfully!', 'success');
    } catch (error) {
      console.error('Error adding payment method:', error);
      showToast('Failed to add payment method', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new !== passwordForm.confirm) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    if (passwordForm.new.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        showToast('User not authenticated', 'error');
        return;
      }
      
      
      const credential = EmailAuthProvider.credential(currentUser.email, passwordForm.current);
      await reauthenticateWithCredential(currentUser, credential);
      
      
      await updatePassword(currentUser, passwordForm.new);
      
      showToast('Password updated successfully!', 'success');
      setPasswordForm({ current: '', new: '', confirm: '' });
      setShowPasswordForm(false);
    } catch (error: any) {
      console.error('Password change error:', error);
      let errorMessage = 'Failed to update password';
      
      switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Current password is incorrect';
          break;
        case 'auth/weak-password':
          errorMessage = 'New password is too weak';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Please sign out and sign in again before changing password';
          break;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600">Manage your profile, orders, and preferences</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors self-start sm:self-auto"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {}
          <div className="lg:col-span-2 space-y-6">
            {}
            <div className="rounded-2xl border bg-white p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg">
                    <span className="text-xl sm:text-2xl font-bold">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {editingProfile ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-xl font-bold focus:outline-none focus:border-rose-500 transition-colors"
                      />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:border-rose-500 transition-colors"
                      />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-600 font-mono focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 text-center sm:text-left">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{profile.name}</h2>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Active Member</span>
                        </div>
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-600 text-sm">@</span>
                          </div>
                          <span className="text-gray-700 font-medium">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-gray-600 font-mono">{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-600 text-xs">📅</span>
                          </div>
                          <span className="text-sm text-gray-500">Member since March 2024</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {editingProfile ? (
                  <>
                    <button 
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                    >
                      <Check className="h-4 w-4" /> Save
                    </button>
                    <button 
                      onClick={() => setEditingProfile(false)}
                      className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-black/5"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setEditingProfile(true)}
                    className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-black/5"
                  >
                    <Edit className="h-4 w-4" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {}
            <div className="rounded-2xl border bg-white p-4 sm:p-6">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
                <button 
                  onClick={() => setShowAllOrders(!showAllOrders)}
                  className="px-3 py-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  {showAllOrders ? 'Show less' : 'View all'}
                </button>
              </div>
              <div className="space-y-4">
                {(showAllOrders ? orders : orders.slice(0, 2)).map((order) => (
                  <OrderCard key={order.id} order={order} setShowOrderDetails={setShowOrderDetails} />
                ))}
              </div>
            </div>
          </div>

          {}
          <aside className="space-y-4 lg:space-y-6">
            {}
            <div className="rounded-2xl border bg-white p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-lg font-semibold">Payment Methods</h3>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="flex items-center gap-1 rounded-full bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
                >
                  <Plus className="h-3 w-3"/>Add
                </button>
              </div>
              <div className="space-y-3">
                {payments.map((pm) => (
                  <div key={pm.id} className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-10 w-10 place-items-center rounded-lg text-white ${
                          pm.brand === 'Visa' ? 'bg-blue-600' : 
                          pm.brand === 'Mastercard' ? 'bg-red-500' : 'bg-gray-800'
                        }`}>
                          <CreditCard className="h-5 w-5"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{pm.brand}</p>
                            <span className="text-gray-400">••••</span>
                            <span className="font-mono text-sm font-medium">{pm.last4}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <p className="text-xs text-gray-500">Exp {pm.exp}</p>
                            {pm.isDefault && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {!pm.isDefault && (
                        <button 
                          onClick={() => handleSetDefaultPayment(pm.id)}
                          className="flex-1 rounded border border-gray-200 px-1.5 py-1 text-[10px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Default
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to remove this ${pm.brand} card?`)) {
                            handleRemovePayment(pm.id);
                          }
                        }}
                        className="flex-1 rounded border border-red-200 px-1.5 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="rounded-2xl border bg-white p-4 sm:p-5">
              <h3 className="text-sm font-semibold">Security</h3>
              <div className="mt-3 space-y-3 text-sm">
                <button 
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex w-full items-center justify-between rounded-xl border p-3 text-left hover:bg-black/5 transition-colors"
                >
                  <span className="flex items-center gap-2"><KeyRound className="h-4 w-4"/> Change password</span>
                  <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${showPasswordForm ? 'rotate-90' : ''}`}/>
                </button>
                
                {showPasswordForm && (
                  <form onSubmit={handleChangePassword} className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="flex-1 rounded-lg bg-rose-600 px-3 py-2 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        {passwordLoading && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        )}
                        {passwordLoading ? 'Updating...' : 'Update Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordForm({ current: '', new: '', confirm: '' });
                        }}
                        className="flex-1 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {}
            <div className="rounded-2xl border bg-white p-4 sm:p-5">
              <h3 className="text-sm font-semibold mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Bell className="h-4 w-4 text-blue-600"/>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order updates</p>
                      <p className="text-xs text-gray-500">Get notified about your order status</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('orderUpdates')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
                      notifications.orderUpdates ? 'bg-rose-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.orderUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50">
                      <Bell className="h-4 w-4 text-emerald-600"/>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New arrivals</p>
                      <p className="text-xs text-gray-500">Be first to know about new products</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('newArrivals')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
                      notifications.newArrivals ? 'bg-rose-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.newArrivals ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50">
                      <Bell className="h-4 w-4 text-amber-600"/>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sales & promos</p>
                      <p className="text-xs text-gray-500">Receive exclusive deals and offers</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('salesPromos')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
                      notifications.salesPromos ? 'bg-rose-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.salesPromos ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {}
        <section className="mt-8 lg:mt-10">
          <div className="rounded-2xl border bg-white p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Promo Codes</h2>
            <form onSubmit={handleApplyPromo} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button 
                type="submit"
                className="rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Apply
              </button>
            </form>
            <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-emerald-800">SAVE20</p>
                    <p className="text-sm text-emerald-600">20% off your next order</p>
                  </div>
                  <button 
                    onClick={() => {
                      setPromoCode('SAVE20');
                      showToast('SAVE20 promo code applied!', 'success');
                      setPromoCode('');
                    }}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Use Code
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-800">FREESHIP</p>
                    <p className="text-sm text-blue-600">Free shipping on orders $50+</p>
                  </div>
                  <button 
                    onClick={() => {
                      setPromoCode('FREESHIP');
                      showToast('FREESHIP promo code applied!', 'success');
                      setPromoCode('');
                    }}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Use Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="mt-8 lg:mt-10">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Your Addresses</h2>
            <button 
              onClick={() => setShowAddressModal(true)}
              className="rounded-full border px-3 py-1.5 text-xs font-semibold hover:bg-black/5 transition-colors"
            >
              <Plus className="mr-1 inline h-3.5 w-3.5"/>Add new
            </button>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {addresses.map((a) => (
              <div key={a.id} className="rounded-2xl border bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">{a.type} Address</p>
                  {a.isDefault && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold">Default</span>}
                </div>
                <AddressLines a={a} compact={false} />
                <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
                  {!a.isDefault && (
                    <button 
                      onClick={() => handleSetDefaultAddress(a.id)}
                      className="rounded-full border px-3 py-2 font-semibold hover:bg-black/5 transition-colors text-center"
                    >
                      Set default
                    </button>
                  )}
                  <button 
                    onClick={() => handleEditAddress(a)}
                    className="rounded-full border px-3 py-2 font-semibold hover:bg-black/5 transition-colors text-center"
                  >
                    <Edit className="mr-1 inline h-3.5 w-3.5"/>Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete this ${a.type.toLowerCase()} address?`)) {
                        handleDeleteAddress(a.id);
                      }
                    }}
                    className="rounded-full border px-3 py-2 font-semibold hover:bg-red-50 hover:border-red-200 text-rose-700 transition-colors text-center"
                  >
                    <Trash2 className="mr-1 inline h-3.5 w-3.5"/>Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {}
        <section className="mt-8 lg:mt-10 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-rose-800">Danger Zone</h3>
          <p className="mt-1 text-sm text-rose-900/80">Delete your account and all associated data. This action cannot be undone.</p>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                showToast('Account deletion request submitted', 'warning');
              }
            }}
            className="mt-3 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            Delete account
          </button>
        </section>

        {}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <button 
                  onClick={() => setShowAddressModal(false)}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddAddress} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address Line 1</label>
                  <input
                    type="text"
                    required
                    value={newAddress.line1}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, line1: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={newAddress.line2}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, line2: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={newAddress.zip}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, zip: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressModal(false);
                      setEditingAddress(null);
                      setNewAddress({
                        fullName: 'Precious Arthur',
                        line1: 'Effiakuma',
                        line2: '',
                        city: 'Takoradi',
                        state: 'Western Region',
                        zip: '00233',
                        country: 'Ghana',
                        phone: '+233 25 717 9772',
                        type: 'Shipping'
                      });
                    }}
                    className="flex-1 rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-700"
                  >
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {}
        {showOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Order Details #{showOrderDetails}</h3>
                <button 
                  onClick={() => setShowOrderDetails(null)}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {(() => {
                const order = orders.find(o => o.id === showOrderDetails);
                if (!order) return null;
                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className={`font-medium ${
                          order.status === "Delivered" ? "text-emerald-600" : 
                          order.status === "Cancelled" ? "text-rose-700" : "text-amber-600"
                        }`}>{order.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium">{currency(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Items</p>
                        <p className="font-medium">{order.items.length} item(s)</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 border rounded-lg">
                            <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                              <p className="text-sm text-gray-500">Price: {currency(item.price)}</p>
                            </div>
                            <p className="font-medium">{currency(item.price * item.qty)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Payment Method</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Brand</label>
                  <select
                    required
                    value={newPayment.brand}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Select brand</option>
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">American Express</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    pattern="[0-9]{4}"
                    value={newPayment.last4}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, last4: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{2}/[0-9]{2}"
                    value={newPayment.exp}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, exp: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-700"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function AddressLines({ a, compact = true }: { a: Address; compact?: boolean }) {
  return (
    <div className={`mt-2 ${compact ? "text-xs" : "text-sm"} text-gray-700`}>
      <p className="flex items-center gap-2"><UserIcon className="h-4 w-4 text-gray-500"/> {a.fullName}</p>
      <p className="mt-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-500"/> {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.zip}</p>
      <p className="mt-1 text-gray-600">{a.country}</p>
      {a.phone && <p className="mt-1 flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500"/> {a.phone}</p>}
    </div>
  );
}

function OrderCard({ order, setShowOrderDetails }: { order: Order; setShowOrderDetails: (id: string) => void }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-50 text-rose-700">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Order #{order.id}</p>
            <p className="text-xs text-gray-600">Placed {new Date(order.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{currency(order.total)}</p>
          <p className={`text-xs ${order.status === "Delivered" ? "text-emerald-600" : order.status === "Cancelled" ? "text-rose-700" : "text-amber-600"}`}>{order.status}</p>
        </div>
      </div>

      {}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {order.items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-xl border p-3">
            <img src={it.image} alt={it.name} className="h-16 w-14 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{it.name}</p>
              <p className="text-xs text-gray-600">Qty {it.qty}</p>
            </div>
            <p className="text-sm font-medium">{currency(it.price * it.qty)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end">
        <button 
          onClick={() => setShowOrderDetails(order.id)}
          className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
        >
          View details
        </button>
      </div>
    </div>
  );
}


const defaultAddresses: Address[] = [
  {
    id: "addr1",
    fullName: "Precious Arthur",
    line1: "Effiakuma",
    city: "Takoradi",
    state: "Western Region",
    zip: "00233",
    country: "Ghana",
    phone: "+233 25 717 9772",
    isDefault: true,
    type: "Shipping",
  },
];

const defaultPayments: PaymentMethod[] = [
  { id: "pm1", brand: "Visa", last4: "4242", exp: "08/27", isDefault: true },
  { id: "pm2", brand: "Mastercard", last4: "5454", exp: "05/26" },
];

const defaultOrders: Order[] = [
  {
    id: "100231",
    date: new Date().toISOString(),
    status: "Shipped",
    total: 167.98,
    items: [
      { name: "Wrap Midi Dress", qty: 1, price: 69, image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop" },
      { name: "Strappy Heels", qty: 1, price: 59, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200&auto=format&fit=crop" },
    ],
  },
  {
    id: "100198",
    date: new Date(Date.now() - 86400 * 1000 * 12).toISOString(),
    status: "Delivered",
    total: 44,
    items: [
      { name: "Mini Crossbody Bag", qty: 1, price: 44, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop" },
    ],
  },
];