'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '/assets/avatar-user.png',
    points: 0,
  });
  const [orders, setOrders] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const { showToast } = useToast();

  const setUserFromApiResponse = useCallback((user) => {
    setUserProfile({
      id: user.id,
      name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      district: user.district || '',
      avatar: user.avatar || '/assets/avatar-user.png',
      points: user.points || 0,
      role: user.role || 'customer',
    });
    setIsLoggedIn(true);
  }, []);

  // Handle OAuth hash fragment return (from Google / Facebook OAuth redirect)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');

      if (accessToken) {
        // Clean the hash from the browser URL immediately
        const cleanUrl = window.location.pathname + window.location.search;
        window.history.replaceState(null, '', cleanUrl);

        fetch('/api/auth/oauth-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.user) {
              setUserFromApiResponse(data.user);
              showToast(data.message || 'Đăng nhập Google thành công!', '🎉');
              // Navigate to /account dashboard if not already there
              if (window.location.pathname !== '/account') {
                window.location.href = '/account';
              }
            } else if (data.error) {
              showToast(data.error, '⚠️');
            }
          })
          .catch((err) => {
            console.error('OAuth token exchange error:', err);
          });
      }
    }
  }, [setUserFromApiResponse, showToast]);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setIsLoggedIn(true);
            setUserProfile({
              id: data.user.id,
              name: data.user.full_name || '',
              email: data.user.email || '',
              phone: data.user.phone || '',
              address: data.user.address || '',
              district: data.user.district || '',
              avatar: data.user.avatar || '/assets/avatar-user.png',
              points: data.user.points || 0,
              role: data.user.role || 'customer',
            });
          }
        }
      } catch (e) {
        console.error('Session check failed:', e);
      } finally {
        setAuthLoading(false);
      }
    };
    checkSession();
  }, []);

  // Fetch orders when logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setOrders([]);
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setOrders(data.orders || []);
          }
        }
      } catch (e) {
        console.error('Fetch orders failed:', e);
      }
    };
    fetchOrders();
  }, [isLoggedIn]);

  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Đăng nhập thất bại.');
    }

    setUserFromApiResponse(data.user);
    showToast(data.message || 'Đăng nhập thành công!', '🎉');
    return data;
  }, [showToast, setUserFromApiResponse]);

  const register = useCallback(async (fullName, email, phone, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phone, password }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Đăng ký thất bại.');
    }

    setUserFromApiResponse(data.user);
    showToast(data.message || 'Đăng ký thành công!', '🎉');
    return data;
  }, [showToast, setUserFromApiResponse]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setIsLoggedIn(false);
    setUserProfile({
      name: '',
      email: '',
      phone: '',
      address: '',
      avatar: '/assets/avatar-user.png',
      points: 0,
    });
    setOrders([]);
    showToast('Đã đăng xuất tài khoản.', 'ℹ️');
  }, [showToast]);

  const updateProfile = useCallback(async (newProfile) => {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: newProfile.name,
        phone: newProfile.phone,
        address: newProfile.address,
        district: newProfile.district,
      }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Cập nhật thất bại.');
    }

    setUserFromApiResponse(data.user);
    showToast(data.message || 'Cập nhật thông tin thành công!', '✓');
    return data;
  }, [showToast, setUserFromApiResponse]);

  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      }
    } catch (e) {
      console.error('Refresh orders failed:', e);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userProfile,
        orders,
        authLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshOrders,
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
