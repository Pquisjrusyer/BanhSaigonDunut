'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Nguyễn Văn An',
    email: 'nguyen.vana@email.com',
    phone: '+84 90 123 4567',
    address: 'Quận 1, TP. Hồ Chí Minh',
    avatar: 'assets/avatar-user.png',
  });
  const [orders, setOrders] = useState([]);
  const { showToast } = useToast();

  // Load auth & profile from localStorage
  useEffect(() => {
    try {
      const logged = localStorage.getItem('dnsg_user_logged_in') === 'true';
      setIsLoggedIn(logged);

      const savedProfile = JSON.parse(localStorage.getItem('dnsg_user_profile') || '{}');
      if (savedProfile && Object.keys(savedProfile).length > 0) {
        setUserProfile((prev) => ({ ...prev, ...savedProfile }));
      }

      const savedOrders = JSON.parse(localStorage.getItem('dnsg_orders') || '[]');
      if (Array.isArray(savedOrders)) {
        setOrders(savedOrders);
      }
    } catch (e) {
      console.error('Failed to load auth state:', e);
    }
  }, []);

  const login = useCallback((email, password) => {
    setIsLoggedIn(true);
    try {
      localStorage.setItem('dnsg_user_logged_in', 'true');
    } catch (e) {}
    showToast('Đăng nhập thành công! Chào mừng bạn quay trở lại.', '🎉');
  }, [showToast]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem('dnsg_user_logged_in', 'false');
    } catch (e) {}
    showToast('Đã đăng xuất tài khoản.', 'ℹ️');
  }, [showToast]);

  const updateProfile = useCallback((newProfile) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...newProfile };
      try {
        localStorage.setItem('dnsg_user_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Cập nhật thông tin cá nhân thành công!', '✓');
  }, [showToast]);

  const addOrder = useCallback((orderData) => {
    setOrders((prev) => {
      const updated = [orderData, ...prev];
      try {
        localStorage.setItem('dnsg_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userProfile,
        orders,
        login,
        logout,
        updateProfile,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
