'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState('');
  const { showToast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem('ds_cart_items') || '[]');
      if (Array.isArray(items)) {
        setCartItems(items);
        const count = items.reduce((sum, item) => sum + (item.qty || 1), 0);
        setCartCount(count);
      }
      const voucher = localStorage.getItem('dnsg_applied_voucher') || '';
      setAppliedVoucher(voucher);
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
  }, []);

  // Save cart to localStorage & sync badge count
  const saveCart = useCallback((items) => {
    setCartItems(items);
    const count = items.reduce((sum, item) => sum + (item.qty || 1), 0);
    setCartCount(count);
    try {
      localStorage.setItem('ds_cart_items', JSON.stringify(items));
      localStorage.setItem('ds_cart_count', count.toString());
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, []);

  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const items = [...prevItems];
      const existing = items.find((i) => i.id === product.id || i.name.toLowerCase() === product.name.toLowerCase());
      if (existing) {
        existing.qty += (product.qty || 1);
      } else {
        items.push({
          id: product.id || product.name.toLowerCase().replace(/\s+/g, '-'),
          name: product.name,
          price: product.price || 30000,
          img: product.img || 'assets/menu-sp-4.png',
          qty: product.qty || 1,
          details: product.details || null,
        });
      }
      saveCart(items);
      return items;
    });
    showToast(`Đã thêm ${product.name} vào giỏ hàng!`, '✓');
  }, [saveCart, showToast]);

  const updateQty = useCallback((id, delta) => {
    setCartItems((prevItems) => {
      const items = prevItems.map((item) => {
        if (item.id === id) {
          const newQty = (item.qty || 1) + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
      saveCart(items);
      return items;
    });
  }, [saveCart]);

  const removeFromCart = useCallback((id) => {
    setCartItems((prevItems) => {
      const items = prevItems.filter((item) => item.id !== id);
      saveCart(items);
      return items;
    });
  }, [saveCart]);

  const clearCart = useCallback(() => {
    saveCart([]);
    try {
      localStorage.removeItem('ds_cart_items');
      localStorage.setItem('ds_cart_count', '0');
    } catch (e) {}
  }, [saveCart]);

  const applyVoucher = useCallback((code) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'DONUT5') {
      setAppliedVoucher('DONUT5');
      try {
        localStorage.setItem('dnsg_applied_voucher', 'DONUT5');
      } catch (e) {}
      showToast('Áp dụng mã DONUT5 thành công! Giảm 5.000đ', '🎉');
      return true;
    } else {
      showToast('Mã ưu đãi không hợp lệ!', '❌');
      return false;
    }
  }, [showToast]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        appliedVoucher,
        applyVoucher,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
