'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '../context/ToastContext';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const hasConsented = localStorage.getItem('dnsg_cookie_consent');
      if (!hasConsented) {
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        'dnsg_cookie_consent',
        JSON.stringify({
          essential: true,
          analytics: true,
          marketing: true,
          date: new Date().toISOString(),
        })
      );
    } catch (e) {}
    setShowBanner(false);
    showToast('🍪 Bạn đã chấp nhận toàn bộ cookie. Cảm ơn bạn!', '✓');
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(
        'dnsg_cookie_consent',
        JSON.stringify({
          essential: true,
          analytics,
          marketing,
          date: new Date().toISOString(),
        })
      );
    } catch (e) {}
    setShowPolicyModal(false);
    setShowBanner(false);
    showToast('🍪 Đã lưu tùy chọn Cookie của bạn!', '✓');
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  return (
    <>
      {/* Cookie Consent Banner (Bottom Right Floating) */}
      <div
        className={`donut-cookie-banner ${showBanner ? 'active' : ''}`}
        id="donutCookieBanner"
        aria-live="polite"
        role="dialog"
        aria-label="Thông báo Cookie"
      >
        <div className="cookie-banner-content">
          <div className="cookie-icon-wrap">
            <span className="cookie-emoji" aria-hidden="true">🍪</span>
          </div>
          <div className="cookie-text-wrap">
            <h3 className="cookie-title">Thông báo Cookie &amp; Quyền riêng tư</h3>
            <p className="cookie-desc">
              Donut Saigon sử dụng cookie để tối ưu trải nghiệm duyệt web, lưu giỏ hàng và mang đến các ưu đãi ngọt ngào nhất.{' '}
              <Link href="/policy" className="cookie-policy-link" id="openPrivacyPolicyFromBanner">
                Xem chính sách
              </Link>
            </p>
          </div>
        </div>
        <div className="cookie-actions-wrap">
          <button
            type="button"
            className="btn-cookie-secondary"
            id="btnCookieCustomize"
            onClick={() => setShowPolicyModal(true)}
          >
            Tùy chỉnh
          </button>
          <button
            type="button"
            className="btn-cookie-primary"
            id="btnCookieAcceptAll"
            onClick={handleAcceptAll}
          >
            Chấp nhận tất cả
          </button>
        </div>
        <button
          type="button"
          className="btn-cookie-close"
          id="btnCookieClose"
          aria-label="Đóng thông báo"
          onClick={handleCloseBanner}
        >
          ✕
        </button>
      </div>

      {/* Privacy Policy & Cookie Preferences Modal */}
      <div
        className={`policy-modal-backdrop ${showPolicyModal ? 'active' : ''}`}
        id="privacyPolicyModal"
        aria-hidden={!showPolicyModal}
        role="dialog"
        aria-labelledby="policyModalTitle"
      >
        <div className="policy-modal-card">
          <div className="policy-modal-header">
            <div className="policy-header-title-wrap">
              <span className="policy-header-badge">DONUT SAIGON</span>
              <h2 className="policy-modal-title" id="policyModalTitle">
                Chính Sách Bảo Mật &amp; Cookie
              </h2>
            </div>
            <button
              type="button"
              className="policy-modal-close"
              id="btnClosePolicyModal"
              aria-label="Đóng modal"
              onClick={() => setShowPolicyModal(false)}
            >
              ✕
            </button>
          </div>
          <div className="policy-modal-body">
            <div className="policy-section">
              <h3 className="policy-section-title">1. Mục Đích Thu Thập Thông Tin</h3>
              <p>
                Donut Saigon cam kết bảo mật thông tin cá nhân của bạn. Dữ liệu (họ tên, email, số điện thoại, địa chỉ nhận bánh) chỉ được dùng để giao hàng nhanh chóng, tích lũy điểm thưởng thành viên và gửi voucher ưu đãi đặc quyền.
              </p>
            </div>
            <div className="policy-section">
              <h3 className="policy-section-title">2. Quản Lý Tùy Chọn Cookie</h3>
              <p>Bạn có thể tùy chỉnh các loại cookie mà website được phép lưu trữ trên thiết bị của bạn:</p>
              <div className="cookie-preferences-box">
                <div className="pref-item">
                  <div className="pref-info">
                    <span className="pref-name">Cookie Cần Thiết (Essential)</span>
                    <span className="pref-desc">Bắt buộc để lưu giỏ hàng, thanh toán và bảo mật tài khoản.</span>
                  </div>
                  <input type="checkbox" defaultChecked disabled className="pref-switch" title="Luôn bật" />
                </div>
                <div className="pref-item">
                  <div className="pref-info">
                    <span className="pref-name">Cookie Phân Tích (Analytics)</span>
                    <span className="pref-desc">Giúp chúng mình thống kê lưu lượng để nâng cấp tốc độ website.</span>
                  </div>
                  <input
                    type="checkbox"
                    id="prefAnalytics"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="pref-switch"
                  />
                </div>
                <div className="pref-item">
                  <div className="pref-info">
                    <span className="pref-name">Cookie Tiếp Thị (Marketing)</span>
                    <span className="pref-desc">Hiển thị ưu đãi quà tặng và voucher giảm giá bánh mới.</span>
                  </div>
                  <input
                    type="checkbox"
                    id="prefMarketing"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="pref-switch"
                  />
                </div>
              </div>
            </div>
            <div className="policy-section">
              <h3 className="policy-section-title">3. Cam Kết Bảo Mật Tuyệt Đối</h3>
              <p>
                Mọi giao dịch và thông tin thanh toán đều được mã hóa an toàn. Chúng tôi không bao giờ chia sẻ dữ liệu của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại.
              </p>
            </div>
          </div>
          <div className="policy-modal-footer">
            <button
              type="button"
              className="btn-save-cookie-prefs"
              id="btnSaveCookiePrefs"
              onClick={handleSavePreferences}
            >
              Lưu Tùy Chọn &amp; Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
