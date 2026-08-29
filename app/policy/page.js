'use client';

import React from 'react';
import Link from 'next/link';

export default function PolicyPage() {
  return (
    <main>
      <section className="policy-main-section" aria-label="Chính sách cửa hàng">
        <div className="policy-page-container">
          {/* Hero Section */}
          <header className="policy-hero-header">
            <h1 className="policy-hero-title">Chính sách cửa hàng</h1>
            <div className="policy-hero-desc">
              <p>Mọi thông tin bạn cần biết khi mua hàng tại Donut Saigon.</p>
              <p>Chúng tôi luôn đặt sự minh bạch và sự hài lòng của bạn lên hàng đầu.</p>
            </div>
          </header>

          {/* Policy Cards Stack */}
          <div className="policy-cards-stack">
            {/* Card 1: Shipping Policy */}
            <article className="policy-card-item" id="shipping">
              <div className="policy-card-header">
                <div className="policy-card-icon-circle">
                  <img src="/assets/icon-policy-shipping.svg" alt="" width="26" height="19" />
                </div>
                <h2 className="policy-card-heading">Chính sách giao hàng</h2>
              </div>
              <div className="policy-card-content">
                <p className="policy-lead-text">Cửa hàng cam kết thời gian giao hàng từ 30-45 phút trong nội thành TP. Hồ Chí Minh.</p>
                <p className="policy-body-text">
                  Chúng tôi hiểu rằng bánh donut ngon nhất là khi còn tươi mới. Vì vậy, đội ngũ giao hàng của Donut Saigon luôn ưu tiên tốc độ để đảm bảo chất lượng sản phẩm.
                </p>
                <ul className="policy-list">
                  <li className="policy-list-item">Phạm vi giao hàng: Các quận nội thành Sài Gòn.</li>
                  <li className="policy-list-item">Phí giao hàng: Tính theo khoảng cách từ chi nhánh gần nhất.</li>
                  <li className="policy-list-item">Giờ hoạt động: 08:00 - 21:00 hàng ngày.</li>
                </ul>
              </div>
            </article>

            {/* Card 2: Return & Exchange Policy */}
            <article className="policy-card-item" id="returns">
              <div className="policy-card-header">
                <div className="policy-card-icon-circle">
                  <img src="/assets/icon-policy-return.svg" alt="" width="21" height="23" />
                </div>
                <h2 className="policy-card-heading">Chính sách đổi trả</h2>
              </div>
              <div className="policy-card-content">
                <p className="policy-lead-text">Cam kết chất lượng (Quality Guarantee).</p>
                <p className="policy-body-text">
                  Nếu sản phẩm không đạt tiêu chuẩn về độ tươi, hình thức hoặc sai hương vị so với đơn đặt hàng, quý khách có quyền yêu cầu đổi trả ngay lập tức.
                </p>
                <div className="policy-alert-box">
                  <p>Lưu ý: Quý khách vui lòng kiểm tra bánh ngay khi nhận hàng và phản hồi với nhân viên giao hàng hoặc hotline trong vòng 30 phút.</p>
                </div>
              </div>
            </article>

            {/* Card 3: Privacy Policy */}
            <article className="policy-card-item" id="privacy">
              <div className="policy-card-header">
                <div className="policy-card-icon-circle">
                  <img src="/assets/icon-policy-privacy.svg" alt="" width="19" height="23" />
                </div>
                <h2 className="policy-card-heading">Chính sách bảo mật</h2>
              </div>
              <div className="policy-card-content">
                <p className="policy-body-text">
                  Donut Saigon cam kết bảo vệ thông tin cá nhân của khách hàng. Chúng tôi chỉ thu thập thông tin cần thiết để xử lý đơn hàng và cải thiện trải nghiệm dịch vụ.
                </p>
                <p className="policy-body-text">
                  Mọi dữ liệu thanh toán đều được mã hóa và xử lý thông qua các đối tác cổng thanh toán uy tín. Chúng tôi tuyệt đối không chia sẻ thông tin của bạn cho bên thứ ba vì mục đích quảng cáo khi chưa được sự đồng ý.
                </p>
              </div>
            </article>

            {/* Card 4: Terms of Service */}
            <article className="policy-card-item" id="terms">
              <div className="policy-card-header">
                <div className="policy-card-icon-circle">
                  <img src="/assets/icon-policy-terms.svg" alt="" width="21" height="22" />
                </div>
                <h2 className="policy-card-heading">Điều khoản dịch vụ</h2>
              </div>
              <div className="policy-card-content">
                <p className="policy-body-text">
                  Khi sử dụng dịch vụ của Donut Saigon, quý khách đồng ý tuân thủ các điều khoản sau:
                </p>
                <ul className="policy-list">
                  <li className="policy-list-item">Giá niêm yết đã bao gồm thuế GTGT.</li>
                  <li className="policy-list-item">Đơn hàng chỉ được xác nhận sau khi có nhân viên gọi điện hoặc tin nhắn xác nhận.</li>
                  <li className="policy-list-item">Mọi tranh chấp phát sinh sẽ được giải quyết dựa trên tinh thần thỏa thuận và quy định pháp luật hiện hành.</li>
                </ul>
              </div>
            </article>

            {/* Contact Support CTA Card */}
            <section className="policy-contact-cta" aria-label="Hỗ trợ khách hàng">
              <h3 className="policy-cta-heading">CẦN HỖ TRỢ THÊM?</h3>
              <p className="policy-cta-desc">Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng lắng nghe bạn 24/7.</p>
              <div className="policy-cta-btn-group">
                <button type="button" className="btn-policy-chat" id="btnPolicyChat">Chat với chúng tôi</button>
                <a href="tel:0901234567" className="btn-policy-hotline">Hotline: 090 123 4567</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
