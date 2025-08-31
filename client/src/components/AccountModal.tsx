import React, { useState, useEffect } from "react";
import { X, User, Mail, Lock, Heart, ShoppingBag } from "lucide-react";

export function AccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    alert(isLogin ? 'Login successful!' : 'Account created successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div 
        className="fixed inset-0 z-0"
        onClick={onClose}
      />
      <div 
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        {}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {}
        <div className="mb-6 text-center">
          <User className="mx-auto h-10 w-10 text-rose-600" />
          <h2 className="mt-3 text-xl font-semibold text-gray-900">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {isLogin ? "Login to access your account" : "Sign up to start shopping with us"}
          </p>
        </div>

        {}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border px-10 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border px-10 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border px-10 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border px-10 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 cursor-pointer"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {}
        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-rose-600 hover:underline cursor-pointer"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        {}
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <a href="#wishlist" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <Heart className="h-4 w-4" /> Wishlist
          </a>
          <a href="#cart" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ShoppingBag className="h-4 w-4" /> Cart
          </a>
        </div>
      </div>
    </div>
  );
}
