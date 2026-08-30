'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { userProfile, updateProfile, isLoggedIn, authLoading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    email: userProfile.email || '',
    phone: userProfile.phone || '',
    address: userProfile.address || '',
    district: userProfile.district || '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        district: userProfile.district || '',
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      router.push('/account');
    } catch (err) {
      alert(err.message || 'Cập nhật thất bại.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <main className="account-main-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#74575C' }}>Đang tải thông tin hồ sơ...</p>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="account-main-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: '#74575C', fontSize: 18 }}>Vui lòng đăng nhập để xem hồ sơ cá nhân.</p>
        <Link href="/account" style={{ color: '#004691', fontWeight: 'bold' }}>→ Đến trang Đăng nhập</Link>
      </main>
    );
  }

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
              disabled
              className="forgot-input"
              style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
              value={formData.email}
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
            <label className="forgot-label">Địa chỉ giao bánh</label>
            <textarea
              className="forgot-input"
              rows="3"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="login-form-group">
            <label className="forgot-label">Quận / Huyện</label>
            <input
              type="text"
              className="forgot-input"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              placeholder="VD: Quận 1, TP. Hồ Chí Minh"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary-lg" style={{ width: '100%', marginTop: 16 }}>
            <span>{saving ? 'Đang lưu...' : 'Lưu Thông Tin Hồ Sơ'}</span>
          </button>
        </form>
      </div>
    </main>
  );
}
