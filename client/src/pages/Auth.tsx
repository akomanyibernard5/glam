import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { useToast } from '../components/Toast';


const carouselImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop",
    title: "Elegant Dresses",
    category: "Fashion"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop",
    title: "Designer Handbags",
    category: "Accessories"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop",
    title: "Hair Styling",
    category: "Beauty"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop",
    title: "Chic Outerwear",
    category: "Fashion"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop",
    title: "Luxury Bags",
    category: "Accessories"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1200&auto=format&fit=crop",
    title: "Hair Care",
    category: "Beauty"
  }
];


function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={carouselImages[currentIndex].url}
            alt={carouselImages[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium text-rose-200 mb-2"
            >
              {carouselImages[currentIndex].category}
            </motion.p>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold"
            >
              {carouselImages[currentIndex].title}
            </motion.h3>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleGoogleSignIn = async () => {
    const startTime = Date.now();
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));
      
      
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsed);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      showToast('Signed in with Google successfully!', 'success');
      setTimeout(() => navigate('/'), 0);
    } catch (error) {
      console.error('Authentication error:', error);
      
      
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsed);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      showToast('Google sign-in failed. Please try again.', 'error');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (!formData.email || !formData.password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    if (!isLogin && !formData.name) {
      showToast('Please enter your full name', 'error');
      return;
    }
    
    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    setEmailLoading(true);
    const startTime = Date.now();
    
    try {
      let userCredential;
      
      if (isLogin) {
        
        userCredential = await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      } else {
        
        userCredential = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
        
        if (formData.name.trim()) {
          await updateProfile(userCredential.user, {
            displayName: formData.name.trim()
          });
        }
      }
      
      const user = userCredential.user;
      
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || formData.name.trim(),
        photoURL: user.photoURL
      }));
      
      
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsed);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      showToast(isLogin ? 'Signed in successfully!' : 'Account created successfully!', 'success');
      setTimeout(() => navigate('/'), 0);
    } catch (error: any) {
      console.error('Authentication error:', error);
      let errorMessage = 'Authentication failed';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered. Try signing in instead.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Try signing up instead.';
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password authentication is not enabled. Please use Google sign-in.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = `Authentication failed: ${error.message}`;
      }
      
      
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsed);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      showToast(errorMessage, 'error');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 p-8">
          <div className="w-full h-full">
            <ImageCarousel />
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl mb-4">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-gray-600">
                  {isLogin ? "Sign in to your account" : "Join our fashion community"}
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </motion.div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: emailLoading ? 1 : 1.02 }}
                  whileTap={{ scale: emailLoading ? 1 : 0.98 }}
                  type="submit"
                  disabled={emailLoading}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {emailLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {emailLoading ? 'Please wait...' : (isLogin ? "Sign In" : "Create Account")}
                </motion.button>
              </form>
              
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-sm text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white/50 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLogin ? "Sign in with Google" : "Sign up with Google"}
              </motion.button>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-rose-500 hover:text-rose-600 font-semibold"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Auth;