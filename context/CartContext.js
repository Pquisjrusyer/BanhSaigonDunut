'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
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
      const discount = parseInt(localStorage.getItem('dnsg_discount_amount') || '0', 10);
      setDiscountAmount(discount);
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
    setAppliedVoucher('');
    setDiscountAmount(0);
    try {
      localStorage.removeItem('ds_cart_items');
      localStorage.setItem('ds_cart_count', '0');
      localStorage.removeItem('dnsg_applied_voucher');
      localStorage.removeItem('dnsg_discount_amount');
    } catch (e) {}
  }, [saveCart]);

  const applyVoucher = useCallback(async (code, subtotal) => {
    try {
      const res = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.error || 'Mã ưu đãi không hợp lệ!', '❌');
        return false;
      }

      setAppliedVoucher(data.voucher.code);
      setDiscountAmount(data.voucher.discountAmount);
      try {
        localStorage.setItem('dnsg_applied_voucher', data.voucher.code);
        localStorage.setItem('dnsg_discount_amount', data.voucher.discountAmount.toString());
      } catch (e) {}
      showToast(data.message, '🎉');
      return true;
    } catch (err) {
      showToast('Lỗi khi kiểm tra mã ưu đãi. Vui lòng thử lại.', '❌');
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
        discountAmount,
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
