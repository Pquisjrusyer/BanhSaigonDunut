'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { userProfile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    address: userProfile.address,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <main className="account-main-section">
      <div style={{ maxWidth: 650, margin: '40px auto', padding: 32, background: '#FFF', borderRadius: 16, border: '1px solid #FDD6DC' }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/account" style={{ color: '#004691', fontWeight: 'bold', textDecoration: 'none' }}>
            ← Quay lại Dashboard
          </Link>
        </div>

        <h1 style={{ fontSize: 28, color: '#004691', marginBottom: 8 }}>Hồ Sơ Cá Nhân</h1>
        <p style={{ color: '#74575C', marginBottom: 24 }}>Cập nhật thông tin giao hàng và tài khoản thành viên Donut Saigon.</p>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="forgot-label">Họ và tên</label>
            <input
              type="text"
              required
              className="forgot-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="login-form-group">
            <label className="forgot-label">Địa chỉ Email</label>
            <input
              type="email"
              required
              className="forgot-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="login-form-group">
            <label className="forgot-label">Số điện thoại nhận hàng</label>
            <input
              type="tel"
              required
              className="forgot-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="login-form-group">
            <label className="forgot-label">Địa chỉ giao bánh mặc định</label>
            <textarea
              className="forgot-input"
              rows="3"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary-lg" style={{ width: '100%', marginTop: 16 }}>
            <span>Lưu Thông Tin Hồ Sơ</span>
          </button>
        </form>
      </div>
    </main>
  );
}
