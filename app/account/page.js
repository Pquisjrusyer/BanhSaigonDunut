'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function AccountPage() {
  const { isLoggedIn, userProfile, orders, login, register, logout, updateProfile, authLoading } = useAuth();

  const [authState, setAuthState] = useState('login'); // 'login' | 'signup' | 'forgot' | 'otp' | 'success' | 'profile_edit'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '']);
  const [testOtpHint, setTestOtpHint] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoadingBtn, setAuthLoadingBtn] = useState(false);
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [editProfileForm, setEditProfileForm] = useState({
    name: userProfile.name || '',
    email: userProfile.email || '',
    phone: userProfile.phone || '',
    address: userProfile.address || '',
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoadingBtn(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setAuthError(err.message || 'Đăng nhập thất bại.');
    } finally {
      setAuthLoadingBtn(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setAuthError('');
    setTestOtpHint('');
    setAuthLoadingBtn(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Không thể gửi mã OTP.');
        return;
      }

      if (data.devOtp) {
        setTestOtpHint(data.devOtp);
        setOtpValues(data.devOtp.split(''));
      }

      setAuthState('otp');
    } catch (err) {
      setAuthError('Lỗi hệ thống. Vui lòng thử lại.');
    } finally {
      setAuthLoadingBtn(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < 4) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = otpValues.join('');
    if (code.length < 5) {
      setAuthError('Vui lòng nhập đầy đủ 5 số OTP.');
      return;
    }
    setAuthError('');
    setAuthLoadingBtn(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, code }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Mã OTP không đúng.');
        return;
      }

      // OTP verified — user is now logged in (JWT cookie set by API)
      window.location.reload();
    } catch (err) {
      setAuthError('Lỗi hệ thống. Vui lòng thử lại.');
    } finally {
      setAuthLoadingBtn(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoadingBtn(true);
    try {
      await register(signupForm.name, signupForm.email, signupForm.phone, signupForm.password);
      setAuthState('success');
    } catch (err) {
      setAuthError(err.message || 'Đăng ký thất bại.');
    } finally {
      setAuthLoadingBtn(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoadingBtn(true);
    try {
      await updateProfile(editProfileForm);
      setAuthState('dashboard');
    } catch (err) {
      setAuthError(err.message || 'Cập nhật thất bại.');
    } finally {
      setAuthLoadingBtn(false);
    }
  };

  if (authLoading) {
    return (
      <main>
        <section className="account-main-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#74575C', fontSize: 16 }}>Đang kiểm tra phiên đăng nhập...</p>
        </section>
      </main>
    );
  }

  // DASHBOARD VIEW (WHEN LOGGED IN AND NOT EDITING PROFILE)
  if (isLoggedIn && authState !== 'profile_edit') {
    return (
      <main>
        <section className="account-main-section" id="authDashboardView" aria-label="Khu vực tài khoản thành viên">
          <div className="account-dashboard-wrapper">
            {/* Back Navigation Button */}
            <div className="account-back-bar">
              <Link href="/" className="account-back-btn">
                <img src="/assets/icon-back-arrow.svg" alt="" className="back-icon" width="14" height="14" />
                <span>Quay lại trang chủ</span>
              </Link>
            </div>

            {/* Dashboard Header */}
            <header className="account-header">
              <h1 className="account-header-title">Lời Khen Từ Bạn</h1>
              <p className="account-header-desc">
                Chia sẻ trải nghiệm ngọt ngào của bạn tại Donut Saigon. Mỗi đánh giá là một động lực để chúng mình hoàn thiện hơn mỗi ngày.
              </p>
            </header>

            {/* Bento Grid Layout */}
            <div className="account-bento-grid">
              {/* Left Column: User Profile & Loyalty Points */}
              <aside className="account-profile-col">
                {/* Profile Card */}
                <div className="profile-card">
                  <div className="profile-avatar-wrap">
                    <div className="profile-avatar-frame">
                      <img src="/assets/avatar-user.png" alt="Ảnh đại diện Nguyễn Văn An" className="profile-avatar-img" />
                    </div>
                    <h2 className="profile-name">{userProfile.name}</h2>
                    <span className="profile-badge">Thành viên thân thiết</span>
                  </div>

                  <div className="profile-info-list">
                    <div className="profile-info-item">
                      <img src="/assets/icon-email.svg" alt="Email" className="info-icon" width="20" height="16" />
                      <span className="info-text">{userProfile.email}</span>
                    </div>
                    <div className="profile-info-item">
                      <img src="/assets/icon-phone.svg" alt="Số điện thoại" className="info-icon" width="18" height="18" />
                      <span className="info-text">{userProfile.phone}</span>
                    </div>
                    <div className="profile-info-item">
                      <img src="/assets/icon-location.svg" alt="Địa chỉ" className="info-icon" width="16" height="20" />
                      <span className="info-text">{userProfile.address}</span>
                    </div>
                  </div>

                  <div className="profile-actions-stack">
                    <button type="button" className="profile-edit-btn" id="editProfileBtn" aria-label="Chỉnh sửa thông tin cá nhân" onClick={() => setAuthState('profile_edit')}>
                      <img src="/assets/icon-edit.svg" alt="" className="edit-btn-icon" width="12" height="12" />
                      <span>Chỉnh sửa thông tin</span>
                    </button>
                    <button type="button" className="profile-logout-btn" id="btnLogout" aria-label="Đăng xuất tài khoản" onClick={logout}>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>

                {/* Loyalty Rewards Card */}
                <div className="loyalty-card">
                  <h3 className="loyalty-title">Ưu đãi của bạn</h3>
                  <p className="loyalty-desc">
                    Bạn có <strong>{userProfile.points || 0} điểm</strong> tích lũy. Đổi 500 điểm để nhận ngay 1 hộp Donut Classic!
                  </p>
                  <div className="loyalty-progress-track" aria-hidden="true">
                    <div className="loyalty-progress-bar" style={{ width: `${Math.min(100, ((userProfile.points || 0) / 500) * 100)}%` }}></div>
                  </div>
                  <div className="loyalty-milestones">
                    <span>{userProfile.points || 0} điểm</span>
                    <span>500 điểm</span>
                  </div>
                </div>
              </aside>

              {/* Right Column: Order History & Favorites */}
              <div className="account-orders-col">
                {/* Order History Table Card */}
                <div className="orders-table-card">
                  <div className="orders-table-header">
                    <div className="orders-title-wrap">
                      <img src="/assets/icon-order-history.svg" alt="" className="orders-title-icon" width="20" height="20" />
                      <h2 className="orders-title">Lịch sử mua hàng</h2>
                    </div>
                    <span className="orders-count-pill">{orders.length > 0 ? `${orders.length} Đơn hàng` : 'Chưa có đơn hàng'}</span>
                  </div>

                  <div className="orders-table-responsive">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th scope="col">MÃ ĐƠN HÀNG</th>
                          <th scope="col">NGÀY ĐẶT</th>
                          <th scope="col" className="text-right">TỔNG TIỀN</th>
                          <th scope="col">TRẠNG THÁI</th>
                          <th scope="col">THAO TÁC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length > 0 ? (
                          orders.map((o, i) => (
                            <tr key={o.id || i}>
                              <td className="order-code">#{o.order_code}</td>
                              <td className="order-date">{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                              <td className="order-total text-right">{o.total?.toLocaleString('vi-VN')}đ</td>
                              <td>
                                <span className={`order-status-badge ${o.status === 'Đã giao thành công' ? 'status-delivered' : 'status-processing'}`}>
                                  <span className="status-dot"></span>
                                  {o.status}
                                </span>
                              </td>
                              <td>
                                <Link href={`/order-detail?orderId=${o.order_code}`} className="order-action-link">
                                  <span>Chi tiết</span>
                                  <img src="/assets/icon-arrow-right-mini.svg" alt="" className="action-arrow" />
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#74575C' }}>
                              Bạn chưa có đơn hàng nào. Hãy khám phá menu và đặt hàng ngay!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="orders-table-footer">
                    <button className="view-all-orders-btn" id="viewAllOrdersBtn">Xem tất cả đơn hàng</button>
                  </div>
                </div>

                {/* Recent Favorites Row */}
                <div className="account-favorites-row">
                  <div className="favorite-donut-card">
                    <div className="fav-donut-img-wrap">
                      <img src="/assets/account-fav-1.png" alt="Dark Cookie Donut" className="fav-donut-img" />
                    </div>
                    <div className="fav-donut-info">
                      <span className="fav-donut-sub">Món yêu thích nhất</span>
                      <h3 className="fav-donut-title">DARK COOKIE</h3>
                      <span className="fav-donut-price">30.000 VNĐ</span>
                    </div>
                  </div>

                  <div className="favorite-donut-card">
                    <div className="fav-donut-img-wrap">
                      <img src="/assets/account-fav-2.png" alt="Strawberry Filled Donut" className="fav-donut-img" />
                    </div>
                    <div className="fav-donut-info">
                      <span className="fav-donut-sub">Món yêu thích nhất</span>
                      <h3 className="fav-donut-title">STRAWBERRY FILLED</h3>
                      <span className="fav-donut-price">32.000 VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // PROFILE EDIT VIEW
  if (authState === 'profile_edit') {
    return (
      <main>
        <section className="auth-login-section auth-profile-section" id="authProfileEditView" aria-label="Cập nhật thông tin cá nhân">
          <div className="auth-decor-blob blob-left"></div>
          <div className="auth-decor-blob blob-right"></div>

          <div className="profile-update-container">
            <div className="profile-update-card">
              {/* Left Column: Visual Banner */}
              <div className="profile-update-visual-col">
                <img src="/assets/profile-visual-bg.png" alt="" className="profile-visual-bg-img" aria-hidden="true" />
                <div className="profile-visual-content-wrap">
                  <div className="profile-visual-badge-wrap">
                    <span className="profile-visual-badge">GÓC NGỌT NGÀO</span>
                  </div>
                  <h2 className="profile-visual-heading">Cập Nhật Hồ Sơ<br />&amp; Sở Thích</h2>
                  <div className="profile-visual-desc-wrap">
                    <p className="profile-visual-desc">
                      Duy trì thông tin chính xác và cập nhật sở thích của bạn để chúng tôi có thể phục vụ tốt nhất.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Form Area */}
              <div className="profile-update-form-col">
                <header className="profile-form-header">
                  <div className="profile-header-top-row">
                    <h1 className="profile-form-title">Thông tin cá nhân</h1>
                    <button type="button" className="btn-profile-back-dashboard" id="btnBackFromProfileEdit" aria-label="Quay lại bảng điều khiển" onClick={() => setAuthState('dashboard')}>← Bảng điều khiển</button>
                  </div>
                  <p className="profile-form-subtitle">Cập nhật email và số điện thoại liên lạc mới nhất.</p>
                </header>

                <form className="profile-form-inner" id="profileEditForm" onSubmit={handleSaveProfile}>
                  <div className="profile-input-group">
                    <label htmlFor="editFullNameInput" className="profile-input-label">Họ và tên</label>
                    <div className="profile-input-box-wrap">
                      <img src="/assets/icon-signup-user.svg" alt="" className="profile-field-icon" width="18" height="18" />
                      <input type="text" id="editFullNameInput" className="profile-field-input" value={editProfileForm.name} onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })} required />
                    </div>
                  </div>

                  <div className="profile-input-group">
                    <label htmlFor="editEmailInput" className="profile-input-label">Email</label>
                    <div className="profile-input-box-wrap">
                      <img src="/assets/icon-signup-email.svg" alt="" className="profile-field-icon" width="18" height="18" />
                      <input type="email" id="editEmailInput" className="profile-field-input" value={editProfileForm.email} onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })} required />
                    </div>
                  </div>

                  <div className="profile-input-group">
                    <label htmlFor="editPhoneInput" className="profile-input-label">Số điện thoại</label>
                    <div className="profile-input-box-wrap">
                      <img src="/assets/icon-signup-phone.svg" alt="" className="profile-field-icon" width="18" height="18" />
                      <input type="tel" id="editPhoneInput" className="profile-field-input" value={editProfileForm.phone} onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })} required />
                    </div>
                  </div>

                  <div className="profile-input-group">
                    <label htmlFor="editAddressInput" className="profile-input-label">Địa chỉ giao hàng</label>
                    <div className="profile-input-box-wrap textarea-mode">
                      <img src="/assets/icon-location.svg" alt="" className="profile-field-icon icon-pin" width="18" height="18" />
                      <textarea id="editAddressInput" className="profile-field-textarea" value={editProfileForm.address} onChange={(e) => setEditProfileForm({ ...editProfileForm, address: e.target.value })}></textarea>
                    </div>
                  </div>

                  <div className="profile-confirm-row">
                    <label className="custom-checkbox-label">
                      <input type="checkbox" id="confirmProfileUpdateCheckbox" className="custom-checkbox-input" defaultChecked />
                      <span className="custom-checkbox-box"></span>
                      <span className="profile-confirm-text">Xác nhận thông tin cập nhật</span>
                    </label>
                  </div>

                  <button type="submit" className="btn-profile-submit" id="btnSaveProfile">
                    <span>Cập nhật thông tin</span>
                    <span className="submit-arrow">→</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="login-page-footer-note">
              <span className="footer-note-copy">© 2024 Donut Saigon. Bánh donut vừa rẻ vừa ngon.</span>
              <div className="footer-note-links">
                <Link href="/policy#privacy">Chính sách bảo mật</Link>
                <Link href="/policy#terms">Điều khoản dịch vụ</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // LOGIN / FORGOT / OTP / SIGNUP / SUCCESS VIEWS
  return (
    <main>
      {/* STATE 1: LOGIN VIEW */}
      {authState === 'login' && (
        <section className="auth-login-section" id="authLoginView">
          <div className="auth-decor-blob blob-left" aria-hidden="true"></div>
          <div className="auth-decor-blob blob-right" aria-hidden="true"></div>

          <div className="login-card-container">
            <div className="login-card">
              <div className="login-header-icon-wrap">
                <img src="/assets/icon-account-blue.svg" alt="Tài khoản" className="login-avatar-icon" width="48" height="48" />
              </div>

              <header className="login-header">
                <h1 className="login-title">Chào mừng trở lại</h1>
                <p className="login-subtitle">Đăng nhập để đặt món bánh hằng ngày của bạn</p>
              </header>

              <form className="login-form" id="loginForm" onSubmit={handleLoginSubmit}>
                {authError && (
                  <div style={{ color: '#d9534f', background: '#fdf7f7', border: '1px solid #eed3d7', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, fontWeight: 500 }}>
                    ⚠️ {authError}
                  </div>
                )}

                <div className="login-form-group">
                  <label htmlFor="loginEmail" className="login-label">Địa chỉ Email</label>
                  <input type="email" id="loginEmail" className="login-input" placeholder="ten@vidu.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>

                <div className="login-form-group">
                  <div className="login-label-row">
                    <label htmlFor="loginPassword" className="login-label">Mật khẩu</label>
                    <button type="button" className="login-forgot-link" id="forgotPasswordLink" onClick={() => { setAuthError(''); setAuthState('forgot'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Quên mật khẩu?</button>
                  </div>
                  <input type="password" id="loginPassword" className="login-input" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                </div>

                <div className="login-remember-row">
                  <label className="custom-checkbox-label">
                    <input type="checkbox" id="loginRemember" defaultChecked className="custom-checkbox-input" />
                    <span className="custom-checkbox-box"></span>
                    <span className="remember-text">Duy trì đăng nhập trong 30 ngày</span>
                  </label>
                </div>

                <button type="submit" disabled={authLoadingBtn} className="btn-login-submit" id="btnLoginSubmit">
                  <span>{authLoadingBtn ? 'Đang đăng nhập...' : 'Đăng Nhập'}</span>
                </button>
              </form>

              <div className="social-auth-divider">
                <span className="divider-line"></span>
                <span className="divider-text">HOẶC TIẾP TỤC VỚI</span>
                <span className="divider-line"></span>
              </div>

              <div className="social-login-grid">
                <button type="button" className="social-btn btn-google" id="btnSocialGoogle">
                  <img src="/assets/icon-google.png" alt="Google" width="22" height="22" />
                  <span>Google</span>
                </button>
                <button type="button" className="social-btn btn-facebook" id="btnSocialFacebook">
                  <img src="/assets/icon-facebook.png" alt="Facebook" width="22" height="22" />
                  <span>Facebook</span>
                </button>
              </div>

              <div className="login-signup-redirect">
                <span>Chưa có tài khoản?</span>
                <button type="button" className="signup-link" id="signupLink" onClick={() => setAuthState('signup')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Đăng ký ngay</button>
              </div>
            </div>

            <div className="login-page-footer-note">
              <span className="footer-note-copy">© 2024 Donut Saigon. Bánh donut vừa rẻ vừa ngon.</span>
              <div className="footer-note-links">
                <Link href="/policy#privacy">Chính sách bảo mật</Link>
                <Link href="/policy#terms">Điều khoản dịch vụ</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STATE 1B: FORGOT PASSWORD VIEW */}
      {authState === 'forgot' && (
        <section className="auth-login-section" id="authForgotView">
          <div className="auth-decor-blob blob-left" aria-hidden="true"></div>
          <div className="auth-decor-blob blob-right" aria-hidden="true"></div>

          <div className="login-card-container">
            <div className="login-card forgot-card">
              <div className="forgot-back-wrap">
                <button type="button" className="btn-forgot-back" id="btnForgotBack" aria-label="Quay lại đăng nhập" onClick={() => setAuthState('login')}>
                  <img src="/assets/icon-arrow-back-blue.svg" alt="" width="18" height="18" />
                </button>
              </div>

              <header className="forgot-header">
                <h1 className="forgot-title">Bạn quên mật khẩu ?</h1>
                <p className="forgot-subtitle">Hãy nhập email của bạn để cấp lại mật khẩu.</p>
              </header>

              <form className="forgot-form" id="forgotForm" onSubmit={handleForgotSubmit}>
                {authError && (
                  <div style={{ color: '#d9534f', background: '#fdf7f7', border: '1px solid #eed3d7', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, fontWeight: 500 }}>
                    ⚠️ {authError}
                  </div>
                )}

                <div className="login-form-group">
                  <label htmlFor="forgotEmail" className="forgot-label">Địa chỉ Email của bạn</label>
                  <input type="email" id="forgotEmail" className="forgot-input" placeholder="donutsaigon@gmail.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                </div>

                <button type="submit" disabled={authLoadingBtn} className="btn-forgot-submit" id="btnForgotSubmit">
                  <span>{authLoadingBtn ? 'Đang gửi OTP qua Resend...' : 'Tiếp tục'}</span>
                </button>
              </form>
            </div>

            <div className="login-page-footer-note">
              <span className="footer-note-copy">© 2024 Donut Saigon. Bánh donut vừa rẻ vừa ngon.</span>
              <div className="footer-note-links">
                <Link href="/policy#privacy">Chính sách bảo mật</Link>
                <Link href="/policy#terms">Điều khoản dịch vụ</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STATE 1C: OTP VERIFICATION VIEW */}
      {authState === 'otp' && (
        <section className="auth-login-section" id="authOtpView">
          <div className="auth-decor-blob blob-left" aria-hidden="true"></div>
          <div className="auth-decor-blob blob-right" aria-hidden="true"></div>

          <div className="login-card-container">
            <div className="login-card otp-card">
              <div className="forgot-back-wrap">
                <button type="button" className="btn-forgot-back" id="btnOtpBack" aria-label="Quay lại bước trước" onClick={() => { setAuthError(''); setAuthState('forgot'); }}>
                  <img src="/assets/icon-arrow-back-blue.svg" alt="" width="18" height="18" />
                </button>
              </div>

              <header className="forgot-header">
                <h1 className="forgot-title">Kiểm tra email của bạn</h1>
                <p className="forgot-subtitle">
                  Chúng tôi đã gửi mã OTP qua email của bạn, mã gồm 5 số và có hiệu lực trong vòng 3 phút.
                </p>
              </header>

              <form className="otp-form" id="otpForm" onSubmit={handleOtpSubmit}>
                {testOtpHint && (
                  <div style={{ color: '#004691', background: '#eef5ff', border: '1px solid #c2dbfe', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, textAlign: 'center', fontWeight: 500 }}>
                    🔑 Mã OTP (Thử nghiệm): <strong style={{ letterSpacing: 2, fontSize: 15 }}>{testOtpHint}</strong>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>Đã tự động điền vào 5 ô bên dưới</div>
                  </div>
                )}

                {authError && (
                  <div style={{ color: '#d9534f', background: '#fdf7f7', border: '1px solid #eed3d7', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, fontWeight: 500 }}>
                    ⚠️ {authError}
                  </div>
                )}

                <div className="otp-boxes-row">
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      id={`otp-box-${idx}`}
                      type="text"
                      className="otp-box"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                    />
                  ))}
                </div>

                <button type="submit" disabled={authLoadingBtn} className="btn-forgot-submit" id="btnOtpSubmit">
                  <span>{authLoadingBtn ? 'Đang xác thực...' : 'Tiếp tục'}</span>
                </button>

                <div className="otp-resend-row">
                  <span>Bạn chưa nhận được mã?</span>
                  <button type="button" className="btn-resend-otp" id="btnResendOtp">Gửi lại mã</button>
                </div>
              </form>
            </div>

            <div className="login-page-footer-note">
              <span className="footer-note-copy">© 2024 Donut Saigon. Bánh donut vừa rẻ vừa ngon.</span>
              <div className="footer-note-links">
                <Link href="/policy#privacy">Chính sách bảo mật</Link>
                <Link href="/policy#terms">Điều khoản dịch vụ</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STATE 1D: SIGN UP VIEW */}
      {authState === 'signup' && (
        <section className="auth-login-section auth-signup-section" id="authSignupView">
          <div className="auth-decor-blob blob-left" aria-hidden="true"></div>
          <div className="auth-decor-blob blob-right" aria-hidden="true"></div>

          <div className="signup-card-container">
            <div className="signup-card">
              <div className="signup-left-col">
                <img src="/assets/signup-brand-banner.png" alt="Donut Saigon - Trở Thành Khách Hàng Thân Thiết" className="signup-banner-img" />
              </div>

              <div className="signup-right-col">
                <header className="signup-header">
                  <h1 className="signup-title">Tạo tài khoản</h1>
                  <p className="signup-subtitle">Bắt đầu hành trình thưởng thức donut cùng chúng tôi.</p>
                </header>

                <form className="signup-form" id="signupForm" onSubmit={handleSignupSubmit}>
                  {authError && (
                    <div style={{ color: '#d9534f', background: '#fdf7f7', border: '1px solid #eed3d7', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, fontWeight: 500 }}>
                      ⚠️ {authError}
                    </div>
                  )}

                  <div className="signup-form-group">
                    <label htmlFor="signupName" className="signup-label">Họ và tên</label>
                    <div className="signup-input-wrap">
                      <img src="/assets/icon-signup-user.svg" alt="" className="input-icon-left" width="16" height="16" />
                      <input
                        type="text"
                        id="signupName"
                        className="signup-input"
                        placeholder="Nguyen Van A"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="signup-form-group">
                    <label htmlFor="signupEmail" className="signup-label">Email</label>
                    <div className="signup-input-wrap">
                      <img src="/assets/icon-signup-email.svg" alt="" className="input-icon-left" width="18" height="16" />
                      <input
                        type="email"
                        id="signupEmail"
                        className="signup-input"
                        placeholder="vi-du@email.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="signup-form-group">
                    <label htmlFor="signupPhone" className="signup-label">Số điện thoại</label>
                    <div className="signup-input-wrap">
                      <img src="/assets/icon-signup-phone.svg" alt="" className="input-icon-left" width="16" height="16" />
                      <input
                        type="tel"
                        id="signupPhone"
                        className="signup-input"
                        placeholder="0912 345 678"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="signup-form-group">
                    <label htmlFor="signupPassword" className="signup-label">Mật khẩu</label>
                    <div className="signup-input-wrap">
                      <img src="/assets/icon-signup-lock.svg" alt="" className="input-icon-left" width="16" height="18" />
                      <input
                        type="password"
                        id="signupPassword"
                        className="signup-input"
                        placeholder="•••••••• (tối thiểu 6 ký tự)"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="signup-terms-row">
                    <label className="custom-checkbox-label">
                      <input type="checkbox" id="signupTerms" defaultChecked className="custom-checkbox-input" required />
                      <span className="custom-checkbox-box"></span>
                      <span className="terms-text">
                        Tôi đồng ý với các <Link href="/policy#terms" className="terms-link">Điều khoản dịch vụ</Link> và <Link href="/policy#privacy" className="terms-link">Chính sách bảo mật</Link>
                      </span>
                    </label>
                  </div>

                  <button type="submit" disabled={authLoadingBtn} className="btn-signup-submit" id="btnSignupSubmit">
                    <span>{authLoadingBtn ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}</span>
                  </button>
                </form>

                <div className="signup-login-redirect">
                  <span>Đã có tài khoản?</span>
                  <button type="button" className="login-link-btn" id="linkToLogin" onClick={() => setAuthState('login')}>Đăng nhập</button>
                </div>
              </div>
            </div>

            <div className="login-page-footer-note">
              <span className="footer-note-copy">© 2024 Donut Saigon. Bánh donut vừa rẻ vừa ngon.</span>
              <div className="footer-note-links">
                <Link href="/policy#privacy">Chính sách bảo mật</Link>
                <Link href="/policy#terms">Điều khoản dịch vụ</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STATE 1E: SIGN UP SUCCESS VIEW */}
      {authState === 'success' && (
        <section className="auth-login-section auth-success-section" id="authSignupSuccessView">
          <div className="auth-decor-blob blob-left" aria-hidden="true"></div>
          <div className="auth-decor-blob blob-right" aria-hidden="true"></div>

          <div className="signup-success-container">
            <div className="signup-success-card">
              <header className="signup-success-header">
                <h1 className="signup-success-title">Đăng ký thành công!</h1>
                <p className="signup-success-subtitle">Bắt đầu hành trình thưởng thức donut cùng chúng tôi.</p>
              </header>

              <div className="signup-success-icon-wrap">
                <img src="/assets/icon-signup-success-check.svg" alt="Thành công" className="signup-success-check-img" width="145" height="145" />
              </div>

              <Link href="/" className="btn-success-home" id="btnSuccessHome" onClick={() => login('nguyen.vana@email.com', '123')}>
                <span>Tiến đến trang chủ</span>
              </Link>
            </div>

            <div className="login-page-footer-note">
              <span className="footer-note-copy">© 2024 Donut Saigon. Bánh donut vừa rẻ vừa ngon.</span>
              <div className="footer-note-links">
                <Link href="/policy#privacy">Chính sách bảo mật</Link>
                <Link href="/policy#terms">Điều khoản dịch vụ</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
