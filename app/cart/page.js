'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQty, removeFromCart, clearCart, appliedVoucher, discountAmount } = useCart();
  const { userProfile, isLoggedIn, refreshOrders } = useAuth();

  const [currentStep, setCurrentStep] = useState(2); // 2: Review, 3: Shipping & Payment
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [orderLoading, setOrderLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    phone: userProfile.phone || '',
    email: userProfile.email || '',
    address: userProfile.address || '',
    district: userProfile.district || 'Quận 1',
    note: '',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const shippingFee = subtotal >= 200000 || subtotal === 0 ? 0 : 25000;
  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      shipName: 'name',
      shipPhone: 'phone',
      shipEmail: 'email',
      shipAddress: 'address',
      shipDistrict: 'district',
      shipNote: 'note',
    };
    const fieldName = fieldMap[id] || id;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleCompleteOrder = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!');
      return;
    }

    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      router.push('/account');
      return;
    }

    setOrderLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          shippingAddress: `${formData.address}, ${formData.district}`,
          district: formData.district,
          note: formData.note,
          paymentMethod,
          subtotal,
          shippingFee,
          discountAmount,
          voucherCode: appliedVoucher,
          total: finalTotal,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
        return;
      }

      clearCart();
      await refreshOrders();
      router.push(`/order-success?orderId=${data.orderId}`);
    } catch (err) {
      alert('Lỗi hệ thống. Vui lòng thử lại.');
    } finally {
      setOrderLoading(false);
    }
  };


  return (
    <main>
      <section className="cart-section" aria-label="Giỏ hàng của bạn">
        <div className="cart-wrapper">
          {/* Back Navigation Link */}
          <div className="cart-back-bar">
            <Link href="/menu" className="cart-back-link" id="cartBackLink">
              <img src="/assets/icon-back-arrow.svg" alt="" className="back-icon" width="14" height="14" />
              <span>Quay lại</span>
            </Link>
          </div>

          {/* Header */}
          <header className="cart-header">
            <h1 className="cart-header-title">Giỏ hàng của bạn</h1>
            <p className="cart-header-desc">Thưởng thức những chiếc bánh thủ công thơm ngon nhất.</p>
          </header>

          {/* STATE 1: EMPTY CART VIEW */}
          {cartItems.length === 0 && (
            <div className="cart-empty-view-wrapper" id="cartEmptyView">
              <div className="cart-bento-grid">
                <div className="cart-items-col">
                  <div className="cart-empty-card">
                    <div className="cart-empty-img-wrap">
                      <img src="/assets/cart-empty-illustration.png" alt="Giỏ hàng trống" className="cart-empty-img" />
                    </div>
                    <h2 className="cart-empty-title">Giỏ Hàng Bạn Đang Trống</h2>
                    <p className="cart-empty-sub">Hãy chọn những hương vị donut yêu thích để lấp đầy chiếc hộp ngọt ngào nhé!</p>
                    <Link href="/menu" className="btn-primary-lg cart-shop-now-btn"><span>Khám phá Menu ngay</span></Link>
                  </div>
                </div>

                <aside className="cart-summary-col">
                  <div className="cart-summary-card">
                    <h2 className="cart-summary-title">Tổng đơn hàng</h2>
                    <div className="cart-summary-breakdown">
                      <div className="summary-row">
                        <span className="summary-label">Tạm tính</span>
                        <span className="summary-value">0đ</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Phí giao hàng</span>
                        <span className="summary-value text-free">0đ</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Ưu đãi (DONUT5)</span>
                        <span className="summary-value text-discount">0đ</span>
                      </div>
                    </div>

                    <div className="cart-summary-total-wrap">
                      <div className="total-label-box">
                        <span className="total-label-top">Tổng</span>
                        <span className="total-label-bot">cộng</span>
                      </div>
                      <span className="total-price-value">0đ</span>
                    </div>

                    <div className="cart-summary-actions">
                      <Link href="/menu" className="btn-checkout-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
                        <span>Chọn bánh ngay</span>
                        <img src="/assets/icon-arrow-checkout.svg" alt="" className="checkout-arrow-icon" width="16" height="16" />
                      </Link>
                    </div>

                    <div className="ssl-badge-box">
                      <img src="/assets/icon-ssl-shield.svg" alt="Bảo mật SSL" className="ssl-shield-icon" width="16" height="20" />
                      <span className="ssl-badge-text">Thanh toán an toàn 100% với mã hóa SSL</span>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          )}

          {/* STATE 2: CART REVIEW VIEW */}
          {cartItems.length > 0 && currentStep === 2 && (
            <div className="cart-review-view-wrapper" id="cartReviewView">
              <div className="cart-review-grid">
                {/* Left Column: Items List */}
                <div className="cart-review-items-col">
                  <div className="cart-review-items-list" id="cartReviewItemsList">
                    {cartItems.map((item) => (
                      <div key={item.id} className="cart-review-item-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: '#FFF', borderRadius: 12, border: '1px solid #E0E0E0', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <img src={item.img} alt={item.name} width="70" height="70" style={{ objectFit: 'contain' }} />
                          <div>
                            <h3 style={{ margin: 0, fontSize: 16, color: '#004691' }}>{item.name}</h3>
                            <span style={{ fontSize: 14, color: '#74575C' }}>{item.price.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                        </div>

                        <div className="qty-pill-controls" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8F5F0', padding: '4px 12px', borderRadius: 20 }}>
                          <button type="button" className="qty-control-btn" onClick={() => updateQty(item.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: 16 }}>-</button>
                          <span className="qty-value-display" style={{ fontWeight: 'bold' }}>{item.qty}</span>
                          <button type="button" className="qty-control-btn" onClick={() => updateQty(item.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: 16 }}>+</button>
                        </div>

                        <span style={{ fontWeight: 'bold', color: '#004691', fontSize: 16 }}>
                          {(item.price * item.qty).toLocaleString('vi-VN')} VNĐ
                        </span>

                        <button type="button" onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', color: '#FF4D4D', cursor: 'pointer', fontSize: 20 }}>&times;</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Order Summary */}
                <aside className="cart-review-summary-col">
                  <div className="cart-review-summary-card">
                    <h2 className="review-summary-title">Tổng đơn hàng</h2>

                    <div className="review-summary-breakdown">
                      <div className="review-summary-row">
                        <span className="review-summary-label">Tạm tính</span>
                        <span className="review-summary-value" id="reviewSubtotal">{subtotal.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="review-summary-row">
                        <span className="review-summary-label">Phí giao hàng</span>
                        <span className="review-summary-value" id="reviewShipping">{shippingFee === 0 ? '0đ' : `${shippingFee.toLocaleString('vi-VN')}đ`}</span>
                      </div>
                      {appliedVoucher && (
                        <div className="review-summary-row discount-row">
                          <span className="review-summary-label">Ưu đãi (DONUT5)</span>
                          <span className="review-summary-value text-red" id="reviewDiscount">-5.000đ</span>
                        </div>
                      )}
                    </div>

                    <div className="review-summary-total-row">
                      <span className="review-total-label">THÀNH TIỀN</span>
                      <span className="review-total-value" id="reviewTotal">{finalTotal.toLocaleString('vi-VN')} VND</span>
                    </div>

                    <div className="ssl-badge-box">
                      <img src="/assets/icon-ssl-shield.svg" alt="Bảo mật SSL" className="ssl-shield-icon" width="16" height="20" />
                      <span className="ssl-badge-text">Thanh toán an toàn 100% với mã hóa SSL</span>
                    </div>

                    <div className="cart-review-actions-group">
                      <button type="button" className="btn-proceed-checkout" id="btnProceedToCheckout" onClick={() => setCurrentStep(3)}>
                        <span>Thanh toán ngay</span>
                        <img src="/assets/icon-arrow-checkout.svg" alt="" width="16" height="16" />
                      </button>
                      <Link href="/menu" className="btn-continue-shopping"><span>Tiếp tục mua sắm</span></Link>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          )}

          {/* STATE 3: CHECKOUT SHIPPING & PAYMENT FORM */}
          {cartItems.length > 0 && currentStep === 3 && (
            <div className="checkout-view-wrapper" id="cartFilledView">
              {/* Back to Cart Review Button */}
              <div className="checkout-back-step-bar">
                <button type="button" className="btn-back-step" id="btnBackToReview" onClick={() => setCurrentStep(2)}>
                  <img src="/assets/icon-back-arrow.svg" alt="" width="14" height="14" />
                  <span>Xem lại giỏ hàng</span>
                </button>
              </div>

              <div className="checkout-bento-grid">
                {/* Left Column: Shipping Information Form */}
                <div className="checkout-shipping-col">
                  <section className="checkout-card shipping-card">
                    <div className="checkout-card-header">
                      <img src="/assets/icon-shipping-truck.svg" alt="" className="card-header-icon" width="22" height="16" />
                      <h2 className="checkout-card-title">Thông tin vận chuyển</h2>
                    </div>

                    <form className="shipping-form" id="shippingForm" onSubmit={(e) => e.preventDefault()}>
                      <div className="form-row-grid">
                        <div className="form-group">
                          <label htmlFor="shipName" className="form-label">Họ và Tên</label>
                          <input type="text" id="shipName" className="form-input" placeholder="Nguyễn Văn A" value={formData.name} onChange={handleFormChange} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="shipPhone" className="form-label">Số điện thoại</label>
                          <input type="tel" id="shipPhone" className="form-input" placeholder="0901 234 567" value={formData.phone} onChange={handleFormChange} required />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="shipEmail" className="form-label">Email</label>
                        <input type="email" id="shipEmail" className="form-input" placeholder="email@example.com" value={formData.email} onChange={handleFormChange} required />
                      </div>

                      <div className="form-group">
                        <label htmlFor="shipAddress" className="form-label">Địa chỉ giao hàng</label>
                        <textarea id="shipAddress" className="form-textarea" rows="3" placeholder="Số nhà, tên đường, phường/xã..." value={formData.address} onChange={handleFormChange}></textarea>
                      </div>

                      <div className="form-row-grid">
                        <div className="form-group">
                          <label htmlFor="shipDistrict" className="form-label">Quận/Huyện</label>
                          <div className="custom-select-wrap">
                            <select id="shipDistrict" className="form-select" value={formData.district} onChange={handleFormChange}>
                              <option value="Quận 1">Quận 1</option>
                              <option value="Quận 3">Quận 3</option>
                              <option value="Quận 5">Quận 5</option>
                              <option value="Quận 7">Quận 7</option>
                              <option value="Bình Thạnh">Bình Thạnh</option>
                              <option value="Thủ Đức">Thủ Đức</option>
                              <option value="Phú Nhuận">Phú Nhuận</option>
                              <option value="Tân Bình">Tân Bình</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="shipNote" className="form-label">Ghi chú (Tùy chọn)</label>
                          <input type="text" id="shipNote" className="form-input" placeholder="Lời nhắn cho shipper..." value={formData.note} onChange={handleFormChange} />
                        </div>
                      </div>
                    </form>
                  </section>
                </div>

                {/* Right Column: Order Summary & Payment Method */}
                <aside className="checkout-summary-col">
                  {/* Order Summary Card */}
                  <section className="checkout-card order-summary-card">
                    <div className="checkout-card-header">
                      <img src="/assets/icon-order-bag.svg" alt="" className="card-header-icon" width="22" height="19" />
                      <h2 className="checkout-card-title">Tóm tắt đơn hàng</h2>
                    </div>

                    {/* Dynamic Cart Product List */}
                    <div className="checkout-items-list" id="checkoutItemsList">
                      {cartItems.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                          <span>{item.name} x {item.qty}</span>
                          <span style={{ fontWeight: 'bold' }}>{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                        </div>
                      ))}
                    </div>

                    {/* Summary Breakdown */}
                    <div className="checkout-calc-breakdown">
                      <div className="calc-row">
                        <span className="calc-label">Tạm tính</span>
                        <span className="calc-value" id="checkoutSubtotal">{subtotal.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="calc-row">
                        <span className="calc-label">Phí vận chuyển</span>
                        <span className="calc-value" id="checkoutShipping">{shippingFee === 0 ? '0đ' : `${shippingFee.toLocaleString('vi-VN')}đ`}</span>
                      </div>
                      {appliedVoucher && (
                        <div className="calc-row">
                          <span className="calc-label">Ưu đãi (DONUT5)</span>
                          <span className="calc-value text-red">-5.000đ</span>
                        </div>
                      )}
                      <div className="calc-row calc-total-row">
                        <span className="calc-total-label">Tổng cộng</span>
                        <span className="calc-total-value" id="checkoutTotal">{finalTotal.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </section>

                  {/* Payment Method Card */}
                  <section className="checkout-card payment-method-card">
                    <h2 className="checkout-card-title mb-16">Phương thức thanh toán</h2>

                    <div className="payment-options-list">
                      {/* MoMo / ZaloPay */}
                      <label className={`payment-option-item ${paymentMethod === 'wallet' ? 'active' : ''}`} htmlFor="payWallet">
                        <input type="radio" name="paymentMethod" id="payWallet" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="payment-radio-input" />
                        <span className="custom-radio-mark"></span>
                        <div className="payment-option-info">
                          <img src="/assets/icon-pay-wallet.svg" alt="" className="pay-icon" width="19" height="18" />
                          <span className="pay-title">Ví MoMo / ZaloPay</span>
                        </div>
                      </label>

                      {/* COD */}
                      <label className={`payment-option-item ${paymentMethod === 'cod' ? 'active' : ''}`} htmlFor="payCod">
                        <input type="radio" name="paymentMethod" id="payCod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="payment-radio-input" />
                        <span className="custom-radio-mark"></span>
                        <div className="payment-option-info">
                          <img src="/assets/icon-pay-cod.svg" alt="" className="pay-icon" width="22" height="16" />
                          <span className="pay-title">Thanh toán khi nhận hàng (COD)</span>
                        </div>
                      </label>

                      {/* ATM / Card */}
                      <label className={`payment-option-item ${paymentMethod === 'card' ? 'active' : ''}`} htmlFor="payCard">
                        <input type="radio" name="paymentMethod" id="payCard" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="payment-radio-input" />
                        <span className="custom-radio-mark"></span>
                        <div className="payment-option-info">
                          <img src="/assets/icon-pay-card.svg" alt="" className="pay-icon" width="20" height="16" />
                          <span className="pay-title">Thẻ ATM / Visa / Mastercard</span>
                        </div>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button type="button" className="btn-complete-order" id="btnCompleteOrder" onClick={handleCompleteOrder}>
                      <span>Hoàn tất đặt hàng</span>
                    </button>

                    <p className="checkout-terms-note">
                      Bằng việc nhấn đặt hàng, bạn đồng ý với Điều khoản của Donut Saigon.
                    </p>
                  </section>
                </aside>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
