'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

function OrderDetailContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId') || 'DS-8829410';
  const { orders } = useAuth();

  const currentOrder = orders.find((o) => o.orderId === orderIdParam) || {
    orderId: orderIdParam,
    date: '24/05/2024',
    total: '320.000đ',
    subtotal: '320.000đ',
    shipping: '15.000đ',
    status: 'Shipper đang trên đường tới bạn',
    items: [
      { id: 'very-berry', name: 'VERY BERRY', price: 180000, qty: 2, img: '/assets/thumb-very-berry.png' },
    ],
  };

  return (
    <main>
      <section className="order-detail-section" aria-label="Tiến trình giao hàng">
        <div className="order-detail-container">
          {/* Back Navigation Bar */}
          <div className="account-back-bar">
            <Link href="/account" className="account-back-btn">
              <img src="/assets/icon-back-arrow.svg" alt="" className="back-icon" width="14" height="14" />
              <span>Quay lại trang tài khoản</span>
            </Link>
          </div>

          {/* Main Tracking Bento Layout */}
          <div className="order-tracking-bento-grid">
            {/* Left Column: Title, Current Status & Timeline */}
            <div className="tracking-left-col">
              {/* Order Header */}
              <div className="tracking-header">
                <h1 className="tracking-title">Theo dõi đơn hàng</h1>
                <p className="tracking-code" id="orderDetailCode">Mã đơn hàng: #{currentOrder.orderId}</p>
              </div>

              {/* Current Status Box */}
              <div className="tracking-current-status-card">
                <div className="status-icon-circle">
                  <img src="/assets/icon-delivery-bike.svg" alt="" width="26" height="18" />
                </div>
                <div className="status-info-wrap">
                  <span className="status-info-label">TRẠNG THÁI HIỆN TẠI</span>
                  <h2 className="status-info-val" id="orderCurrentStatusText">{currentOrder.status || 'Shipper đang trên đường tới bạn'}</h2>
                </div>
              </div>

              {/* Vertical Timeline Stages */}
              <div className="tracking-vertical-timeline">
                {/* Stage 1: Placed */}
                <div className="timeline-stage-item stage-completed">
                  <div className="stage-dot-wrap">
                    <div className="stage-dot">
                      <img src="/assets/icon-timeline-check.svg" alt="" className="stage-check-icon" width="12" height="9" />
                    </div>
                    <div className="stage-line-bar"></div>
                  </div>
                  <div className="stage-content">
                    <h3 className="stage-title">Đã đặt hàng</h3>
                    <p className="stage-desc">Đơn hàng của bạn đã được tiếp nhận thành công.</p>
                  </div>
                </div>

                {/* Stage 2: Preparing */}
                <div className="timeline-stage-item stage-completed">
                  <div className="stage-dot-wrap">
                    <div className="stage-dot">
                      <img src="/assets/icon-timeline-check.svg" alt="" className="stage-check-icon" width="12" height="9" />
                    </div>
                    <div className="stage-line-bar"></div>
                  </div>
                  <div className="stage-content">
                    <h3 className="stage-title">Đang chuẩn bị</h3>
                    <p className="stage-desc">Bếp đang nướng những chiếc donut tươi ngon nhất.</p>
                  </div>
                </div>

                {/* Stage 3: Delivering (Current) */}
                <div className="timeline-stage-item stage-current">
                  <div className="stage-dot-wrap">
                    <div className="stage-dot">
                      <span className="stage-inner-dot"></span>
                    </div>
                    <div className="stage-line-bar line-pending"></div>
                  </div>
                  <div className="stage-content">
                    <h3 className="stage-title">Đang giao hàng</h3>
                    <p className="stage-desc">Shipper đang trên đường tới bạn</p>
                  </div>
                </div>

                {/* Stage 4: Delivered */}
                <div className="timeline-stage-item stage-pending">
                  <div className="stage-dot-wrap">
                    <div className="stage-dot">
                      <span className="stage-inner-dot"></span>
                    </div>
                  </div>
                  <div className="stage-content">
                    <h3 className="stage-title">Đã giao</h3>
                    <p className="stage-desc">Chúc bạn ngon miệng!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Delivery Info & Summary Cards */}
            <div className="tracking-right-col">
              {/* Card 1: Estimated Delivery Time */}
              <div className="delivery-time-card">
                <div className="time-card-header">
                  <div className="time-clock-wrap">
                    <img src="/assets/icon-timeline-clock.svg" alt="" width="26" height="26" />
                  </div>
                  <span className="time-badge">Dự kiến</span>
                </div>
                <p className="time-card-label">Thời gian giao hàng dự kiến</p>
                <div className="time-range-display" id="orderEstTime">14:30 - 15:00</div>
              </div>

              {/* Card 2: Order Items Summary */}
              <div className="order-summary-card">
                <h3 className="summary-card-title">Tóm tắt đơn hàng</h3>

                <div className="order-items-list" id="orderSummaryItems">
                  {currentOrder.items?.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <div className="item-thumb-box">
                        <img src={item.img || '/assets/thumb-very-berry.png'} alt={item.name} className="item-thumb-img" />
                      </div>
                      <div className="item-details">
                        <h4 className="item-name">{item.name}</h4>
                        <span className="item-qty">Số lượng: {item.qty}</span>
                      </div>
                      <div className="item-total-price">{(item.price * item.qty).toLocaleString('vi-VN')}đ</div>
                    </div>
                  ))}
                </div>

                <div className="order-financial-breakdown">
                  <div className="breakdown-line">
                    <span className="line-label">Tạm tính</span>
                    <span className="line-val" id="orderSubtotalVal">{currentOrder.subtotal || currentOrder.total}</span>
                  </div>
                  <div className="breakdown-line">
                    <span className="line-label">Phí giao hàng</span>
                    <span className="line-val" id="orderShippingVal">{currentOrder.shipping || '15.000đ'}</span>
                  </div>
                  <div className="breakdown-total-row">
                    <span className="total-label">Tổng cộng</span>
                    <span className="total-val" id="orderTotalVal">{currentOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Support Note Box */}
              <div className="order-support-note-card">
                <p className="support-note-text">
                  Bạn cần hỗ trợ về đơn hàng này? Hãy truy cập trung tâm trợ giúp của chúng tôi.
                </p>
                <a href="tel:0901234567" className="support-note-btn">Liên hệ trợ giúp</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Đang tải chi tiết đơn hàng...</div>}>
      <OrderDetailContent />
    </Suspense>
  );
}
