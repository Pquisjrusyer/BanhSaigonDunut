'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get('orderId') || 'DS-8829410';
  const orderId = rawId.startsWith('#') ? rawId : `#${rawId}`;

  return (
    <main>
      <section className="order-success-section" aria-label="Đặt hàng thành công">
        <div className="order-success-container">
          {/* Mascot Illustration */}
          <div className="order-success-mascot-wrap">
            <div className="mascot-circle">
              <img src="/assets/order-success-mascot.png" alt="Donut Saigon Mascot" className="mascot-img" />
            </div>
          </div>

          {/* Success Message */}
          <div className="order-success-msg-group">
            <h1 className="order-success-title">Cảm ơn bạn đã đặt hàng!</h1>
            <p className="order-success-subtitle">
              Những chiếc bánh donut thủ công thơm ngon đang<br />
              bắt đầu hành trình đến với bạn.
            </p>
          </div>

          {/* Order Information Card */}
          <div className="order-success-card">
            <span className="order-card-tag">MÃ ĐƠN HÀNG CỦA BẠN</span>
            <div className="order-card-code" id="displayOrderId">{orderId}</div>
            <div className="order-card-estimate">
              <img src="/assets/icon-calendar-clock.svg" alt="" className="estimate-icon" width="14" height="16" />
              <span id="displayEstimateTime">Dự kiến giao: Hôm nay, 14:30 - 15:00</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="order-success-actions">
            <Link href="/menu" className="btn-success-primary">Tiếp tục mua sắm</Link>
            <Link href="/account" className="btn-success-secondary">Chi tiết đơn hàng</Link>
          </div>

          {/* Support Info */}
          <div className="order-success-support">
            <p>Cần hỗ trợ? Gọi chúng tôi tại <a href="tel:0901234567" className="support-phone">090 123 4567</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Đang tải...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
