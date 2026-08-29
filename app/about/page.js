'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main>
      {/* About Hero Section */}
      <section className="about-hero-section" aria-label="Giới thiệu câu chuyện Donut Saigon">
        <div className="about-hero-bg-blur" aria-hidden="true"></div>
        <div className="about-hero-container">
          <div className="about-hero-content">
            <div className="about-pill-badge">
              <span>Câu chuyện thương hiệu</span>
            </div>
            <h1 className="about-hero-title">
              Câu chuyện của <br /><span className="highlight-title">chúng tôi</span>
            </h1>
            <p className="about-hero-desc">
              Bắt nguồn từ tình yêu mãnh liệt với những chiếc bánh donut thủ công, Donut Saigon ra đời tại lòng thành phố
              nhộn nhịp với tâm niệm mang đến những trải nghiệm ẩm thực tinh tế, kết hợp giữa truyền thống và hơi thở hiện
              đại của Sài Gòn.
            </p>
            <div className="about-hero-actions">
              <Link href="/menu" className="btn-primary-lg"><span>Khám phá Menu</span></Link>
              <a href="#aboutValues" className="btn-outline-lg"><span>Tìm hiểu thêm</span></a>
            </div>
          </div>

          <div className="about-hero-visual">
            <div className="about-glow-backdrop" aria-hidden="true"></div>
            <div className="about-hero-img-wrap">
              <img src="/assets/about-hero-donut.png" alt="Premium Glazed Donut Saigon" className="about-hero-img" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission-section" aria-label="Sứ mệnh thương hiệu">
        <div className="about-mission-container">
          <div className="mission-visual-wrap">
            <div className="mission-oval-frame">
              <img src="/assets/about-mission-donut.png" alt="Handcrafted Donuts Saigon" className="mission-img" loading="lazy" />
            </div>
          </div>

          <div className="mission-content">
            <h2 className="mission-tag">Sứ mệnh</h2>
            <blockquote className="mission-quote">
              “Mang lại vị ngọt ngào và niềm hạnh phúc trọn vẹn qua từng chiếc bánh donut được nhào nặn thủ công.”
            </blockquote>
            <p className="mission-desc">
              Tại Donut Saigon, chúng tôi không chỉ bán bánh, chúng tôi trao đi những khoảnh khắc vui vẻ. Mỗi chiếc bánh
              là một tác phẩm nghệ thuật, được chăm chút từ khâu chọn lựa nguyên liệu đến khi hoàn thiện lớp topping cuối
              cùng.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-values-section" id="aboutValues" aria-label="Giá trị cốt lõi">
        <div className="about-values-header">
          <h2 className="section-title">Giá trị cốt lõi</h2>
          <div className="about-title-underline" aria-hidden="true"></div>
        </div>

        <div className="about-values-container">
          {/* Value Card 1 */}
          <article className="about-value-card">
            <div className="value-card-icon-wrap">
              <div className="value-card-icon-circle">
                <img src="/assets/about-icon-quality.svg" alt="Biểu tượng chất lượng" className="value-icon-svg" width="33" height="32" />
              </div>
            </div>
            <h3 className="value-card-title">Chất lượng</h3>
            <p className="value-card-desc">
              Nguyên liệu nhập khẩu cao cấp, quy trình chế biến chuẩn mực đảm bảo mỗi chiếc bánh luôn tươi mới mỗi ngày.
            </p>
          </article>

          {/* Value Card 2 */}
          <article className="about-value-card">
            <div className="value-card-icon-wrap">
              <div className="value-card-icon-circle">
                <img src="/assets/about-icon-creativity.svg" alt="Biểu tượng sáng tạo" className="value-icon-svg" width="24" height="30" />
              </div>
            </div>
            <h3 className="value-card-title">Sáng tạo</h3>
            <p className="value-card-desc">
              Không ngừng thử nghiệm những hương vị độc bản, kết hợp tinh hoa Á - Âu để tạo nên sự khác biệt trong từng
              miếng bánh.
            </p>
          </article>

          {/* Value Card 3 */}
          <article className="about-value-card">
            <div className="value-card-icon-wrap">
              <div className="value-card-icon-circle">
                <img src="/assets/about-icon-community.svg" alt="Biểu tượng cộng đồng" className="value-icon-svg" width="36" height="18" />
              </div>
            </div>
            <h3 className="value-card-title">Cộng đồng</h3>
            <p className="value-card-desc">
              Donut Saigon cam kết gắn kết cộng đồng thông qua các hoạt động xã hội và lan tỏa năng lượng tích cực.
            </p>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section" aria-label="Kêu gọi đặt hàng">
        <div className="about-cta-container">
          <div className="about-cta-card">
            <Link href="/menu" className="about-cta-title">Bạn đã sẵn sàng thưởng thức?</Link>
            <p className="about-cta-desc">
              Hãy để chúng tôi đánh thức vị giác của bạn bằng những chiếc bánh donut ngon nhất Sài Thành. Đặt hàng ngay để
              nhận ưu đãi!
            </p>
            <div className="about-cta-buttons">
              <Link href="/menu" className="btn-cta-white"><span>Đặt hàng ngay</span></Link>
              <Link href="/#flavors" className="btn-cta-outline"><span>Xem hương vị</span></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
