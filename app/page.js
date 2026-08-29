'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const reviews = [
    { name: 'Minh Lan', avatarText: 'ML', comment: 'Bánh donut ở đây thực sự khác biệt, không quá ngọt và phần bột rất mềm mịn. Mình đặc biệt thích vị Trứng Muối.' },
    { name: 'Quang Trung', avatarText: 'QT', comment: 'Thiết kế hộp rất đẹp, mang đi tặng đối tác hay bạn bè đều rất sang trọng. Chất lượng phục vụ 10 điểm.' },
    { name: 'Hoàng Anh', avatarText: 'HA', comment: 'Bánh tươi mỗi ngày cảm nhận rõ rệt. Mình hay đặt cho văn phòng ăn xế, ai cũng khen ngon.' },
    { name: 'Trúc Linh', avatarText: 'TL', comment: 'Bánh có nhiều loại bắt mắt, vị bánh thơm béo nhẹ. Mình thích nhất phần kem và lớp phủ bên ngoài không bị ngấy. Rất phù hợp để ăn nhẹ hoặc mua làm quà.' },
    { name: 'Bình An', avatarText: 'BA', comment: 'Bánh nhìn đẹp và được làm khá chỉn chu. Phần vỏ mềm, bên trong xốp, hương vị dễ ăn. Giá ổn so với chất lượng, chắc chắn sẽ quay lại thử thêm những vị khác.' },
    { name: 'Nguyễn Hùng', avatarText: 'NH', comment: 'Đóng gói gọn gàng và hương vị khá ổn. Mình thích nhất là bánh không bị quá ngọt hay ngấy, phù hợp để ăn nhẹ trong ngày. Chắc chắn sẽ quay lại thử thêm các vị mới.' },
  ];

  const prevReview = () => {
    setReviewIndex((prev) => Math.max(0, prev - 1));
  };

  const nextReview = () => {
    setReviewIndex((prev) => Math.min(reviews.length - 1, prev + 1));
  };

  return (
    <main>
      {/* Intro Splash Screen / Preloader Animation */}
      {showSplash && (
        <div className="intro-overlay" id="introOverlay">
          <div className="intro-content">
            <div className="intro-logo-box">
              <img src="/assets/logo-donut-saigon.png" alt="Donut Saigon" className="intro-logo-img" />
              <div className="intro-glow-pulse"></div>
            </div>
            <p className="intro-tagline">Nghệ Nhân Bánh Donut Tươi Ngon</p>
            <div className="intro-progress-bar">
              <div className="intro-progress-fill" id="introProgress" style={{ width: '100%', transition: 'width 1.5s ease' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner Slider */}
      <section className="hero-section" id="hero" aria-label="Banner nổi bật">
        <div className="hero-slider-wrapper" id="heroSlider">
          <div className="hero-slides-container">
            {/* Slide 1 */}
            <div className={`hero-slide ${heroIndex === 0 ? 'active' : ''}`} data-slide="0">
              <img src="/assets/hero-slide-1.png" alt="Dám Nghĩ Dám Làm - Cùng DONUT SAIGON nạp vị ngọt, bật công suất" className="hero-banner-img" />
              <div className="hero-slide-overlay">
                <Link href="/menu" className="hero-cta-btn" aria-label="Khám phá ngay sản phẩm">
                  <span>ĐẶT BÁNH NGAY</span>
                  <img src="/assets/icon-arrow-white.svg" alt="" className="cta-arrow-icon" />
                </Link>
              </div>
            </div>

            {/* Slide 2 */}
            <div className={`hero-slide ${heroIndex === 1 ? 'active' : ''}`} data-slide="1">
              <img src="/assets/hero-slide-2.png" alt="Donut Saigon Combo Bánh Tươi Thơm Ngon" className="hero-banner-img" />
              <div className="hero-slide-overlay">
                <Link href="/menu" className="hero-cta-btn" aria-label="Khám phá ngay sản phẩm">
                  <span>KHÁM PHÁ MENU</span>
                  <img src="/assets/icon-arrow-white.svg" alt="" className="cta-arrow-icon" />
                </Link>
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <button className="slider-arrow prev" id="heroPrevBtn" aria-label="Slide trước" onClick={() => setHeroIndex((prev) => (prev === 0 ? 1 : 0))}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="slider-arrow next" id="heroNextBtn" aria-label="Slide tiếp theo" onClick={() => setHeroIndex((prev) => (prev === 1 ? 0 : 1))}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Slider Indicators */}
          <div className="slider-dots" id="heroDots" role="tablist" aria-label="Điều hướng slide">
            <button className={`dot ${heroIndex === 0 ? 'active' : ''}`} role="tab" aria-selected={heroIndex === 0} aria-label="Slide 1" onClick={() => setHeroIndex(0)}></button>
            <button className={`dot ${heroIndex === 1 ? 'active' : ''}`} role="tab" aria-selected={heroIndex === 1} aria-label="Slide 2" onClick={() => setHeroIndex(1)}></button>
          </div>
        </div>
      </section>

      {/* Section: Khám Phá Hương Vị */}
      <section className="flavors-section" id="flavors" aria-labelledby="flavorsTitle">
        <div className="section-header">
          <h2 className="section-title" id="flavorsTitle">Khám Phá Hương Vị</h2>
          <p className="section-subtitle">Thưởng thức trọn vẹn tinh hoa bánh donut nghệ nhân được nhào nặn công phu từ những nguyên liệu tươi mới nhất.</p>
        </div>

        <div className="flavors-container">
          {/* Two Column Product Grid */}
          <div className="product-cards-row">
            {/* Card 1: Filled Donut */}
            <article className="product-card card-filled-donut" data-product="filled-donut">
              <div className="card-image-wrap">
                <Link href="/menu?category=filled-donut" className="card-image-link" aria-label="Xem dòng Filled Donut trên thực đơn">
                  <img src="/assets/cat-filled-donut.png" alt="Filled Donut - Bánh Donut Nhân Kem Dâu Béo Ngậy" className="product-img" loading="lazy" />
                </Link>
                <Link href="/menu?category=filled-donut" className="card-cta-btn btn-pink" aria-label="Khám phá dòng Filled Donut">
                  <span className="btn-text">KHÁM PHÁ NGAY</span>
                  <span className="btn-icon">
                    <img src="/assets/icon-arrow-white.svg" alt="" className="arrow-svg" />
                  </span>
                </Link>
              </div>
              <div className="card-meta">
                <h3 className="card-title">FILLED DONUT</h3>
                <p className="card-desc">Lớp vỏ ngoài mềm xốp ôm trọn lớp kem nhân dâu béo nhẹ, thơm lừng ngất ngây.</p>
              </div>
            </article>

            {/* Card 2: Ring Donut */}
            <article className="product-card card-ring-donut" data-product="ring-donut">
              <div className="card-image-wrap">
                <Link href="/menu?category=ring-donut" className="card-image-link" aria-label="Xem dòng Ring Donut trên thực đơn">
                  <img src="/assets/cat-ring-donut.png" alt="Ring Donut - Bánh Donut Vòng Socola Marshmallow" className="product-img" loading="lazy" />
                </Link>
                <Link href="/menu?category=ring-donut" className="card-cta-btn btn-white" aria-label="Khám phá dòng Ring Donut">
                  <span className="btn-text">KHÁM PHÁ NGAY</span>
                  <span className="btn-icon">
                    <img src="/assets/icon-arrow-blue.svg" alt="" className="arrow-svg" />
                  </span>
                </Link>
              </div>
              <div className="card-meta">
                <h3 className="card-title">RING DONUT</h3>
                <p className="card-desc">Bánh vòng phủ socola Bỉ đậm đà, điểm xuyết kẹo dẻo marshmallow xốp mềm.</p>
              </div>
            </article>
          </div>

          {/* Full Width Card: Gift Box */}
          <article className="product-card card-gift-box" data-product="gift-box">
            <div className="card-image-wrap">
              <Link href="/product-detail?product=gift-box" className="card-image-link" aria-label="Xem chi tiết Hộp Quà Gift Box">
                <img src="/assets/cat-gift-box.png" alt="Gift Box - Hộp Quà Donut Trao Gửi Vị Ngọt Kèm Thiệp" className="product-img" loading="lazy" />
              </Link>
              <Link href="/product-detail?product=gift-box" className="card-cta-btn btn-white-gift" aria-label="Khám phá Hộp Quà Gift Box">
                <span className="btn-text">KHÁM PHÁ NGAY</span>
                <span className="btn-icon">
                  <img src="/assets/icon-arrow-blue.svg" alt="" className="arrow-svg" />
                </span>
              </Link>
            </div>
            <div className="card-meta gift-meta">
              <h3 className="card-title">GIFT BOX</h3>
              <p className="card-desc">Viết lời yêu thương - Trao gửi vị ngọt. Món quà hoàn hảo để dành tặng đối tác, người thân yêu.</p>
            </div>
          </article>
        </div>
      </section>

      {/* Section: Giá Trị Cốt Lõi */}
      <section className="values-section" id="about" aria-label="Cam kết thương hiệu Donut Saigon">
        <div className="values-container">
          <div className="value-item">
            <div className="value-icon-circle">
              <img src="/assets/icon-truck.svg" alt="Giao Hàng Siêu Tốc" className="value-svg" width="33" height="24" />
            </div>
            <h4 className="value-title">Giao Hàng Siêu Tốc</h4>
            <p className="value-desc">Nhận bánh nóng hổi chỉ trong 30-45 phút nội thành Sài Gòn.</p>
          </div>

          <div className="value-item">
            <div className="value-icon-circle">
              <img src="/assets/icon-box.svg" alt="Đóng Gói Cao Cấp" className="value-svg" width="30" height="30" />
            </div>
            <h4 className="value-title">Đóng Gói Cao Cấp</h4>
            <p className="value-desc">Hộp bánh thiết kế sang trọng, bảo vệ trọn vẹn hình dáng và hương vị.</p>
          </div>

          <div className="value-item">
            <div className="value-icon-circle">
              <img src="/assets/icon-leaf.svg" alt="Nguyên Liệu Sạch" className="value-svg" width="26" height="26" />
            </div>
            <h4 className="value-title">Nguyên Liệu Sạch</h4>
            <p className="value-desc">Cam kết không chất bảo quản, 100% nguyên liệu tự nhiên trong ngày.</p>
          </div>
        </div>
      </section>

      {/* Section: Khách Hàng Nói Gì? */}
      <section className="reviews-section" id="reviews" aria-labelledby="reviewsTitle">
        <div className="reviews-header">
          <h2 className="reviews-title" id="reviewsTitle">Khách Hàng Nói Gì?</h2>
        </div>

        <div className="reviews-carousel-wrapper">
          <button className="review-nav-btn prev-review" id="reviewPrevBtn" aria-label="Xem đánh giá trước" onClick={prevReview}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D61AD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="reviews-track-container" id="reviewsTrackContainer">
            <div className="reviews-track" id="reviewsTrack" style={{ transform: `translateX(-${reviewIndex * 360}px)`, transition: 'transform 0.4s ease' }}>
              {reviews.map((item, i) => (
                <article key={i} className="review-card" data-index={i}>
                  <div className="review-rating" aria-label="Đánh giá 5 sao">
                    <img src="/assets/icon-star-filled.svg" alt="" className="star-icon" />
                    <img src="/assets/icon-star-filled.svg" alt="" className="star-icon" />
                    <img src="/assets/icon-star-filled.svg" alt="" className="star-icon" />
                    <img src="/assets/icon-star-filled.svg" alt="" className="star-icon" />
                    <img src="/assets/icon-star-filled.svg" alt="" className="star-icon" />
                  </div>
                  <blockquote className="review-quote">
                    <p>"{item.comment}"</p>
                  </blockquote>
                  <div className="review-author">
                    <div className="author-avatar" aria-hidden="true">{item.avatarText}</div>
                    <div className="author-info">
                      <strong className="author-name">{item.name}</strong>
                      <span className="author-location">Hồ Chí Minh</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button className="review-nav-btn next-review" id="reviewNextBtn" aria-label="Xem đánh giá tiếp" onClick={nextReview}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D61AD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div className="reviews-bottom-cta">
          <Link href="/reviews" className="btn-reviews-cta" aria-label="Gửi và xem đánh giá của bạn">
            <span>Đánh giá của bạn</span>
            <img src="/assets/icon-send-arrow.svg" alt="" width="14" height="12" />
          </Link>
        </div>
      </section>
    </main>
  );
}
