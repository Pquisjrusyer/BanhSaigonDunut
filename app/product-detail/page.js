'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';

const PRODUCTS_DATA = {
  'glaze': {
    name: 'GLAZE',
    price: 25000,
    rating: '(128 Đánh giá)',
    desc: 'Chiếc donut kinh điển với kết cấu mềm xốp, được ủ bột và chiên vàng nhẹ để giữ độ ẩm tự nhiên bên trong. Bề mặt phủ lớp glaze đường sữa mỏng, tạo độ bóng đẹp mắt cùng vị ngọt thanh dịu dàng. Đây là lựa chọn hoàn hảo cho những ai yêu thích hương vị nguyên bản của donut Mỹ.',
    images: ['/assets/menu-sp-1.png', '/assets/glaze-thumb-2.png', '/assets/glaze-thumb-3.png'],
  },
  'oreomallow': {
    name: 'OREOMALLOW',
    price: 25000,
    rating: '(95 Đánh giá)',
    desc: 'Bánh donut phủ kem marshmallow béo ngậy cùng vụn bánh quy Oreo giòn rụm đậm đà. Hương vị hòa quyện giữa đắng nhẹ socola và ngọt thơm marshmallow.',
    images: ['/assets/menu-sp-2.png', '/assets/oreomallow-thumb-2.png', '/assets/oreomallow-thumb-3.png'],
  },
  'smoker-white': {
    name: 'SMOKER WHITE',
    price: 29000,
    rating: '(76 Đánh giá)',
    desc: 'Hương vị socola trắng khói độc đáo, ngọt dịu và thơm ngậy quyến rũ. Bề mặt trang trí hạt dẻ cười nghiền nhỏ sang trọng.',
    images: ['/assets/menu-sp-3.png', '/assets/smoked-white-thumb-2.png', '/assets/smoked-white-thumb-3.png'],
  },
  'red-velvet': {
    name: 'RED VELVET',
    price: 30000,
    rating: '(210 Đánh giá)',
    desc: 'Sắc đỏ nhung quý phái kết hợp sốt cream cheese béo nhẹ chuẩn vị bánh Mỹ. Lớp bánh nhung dẻo mịn thơm lừng vani.',
    images: ['/assets/menu-sp-4.png', '/assets/red-velvet-thumb-2.png', '/assets/red-velvet-thumb-3.png'],
  },
  'dark-cookie': {
    name: 'DARK COOKIE',
    price: 30000,
    rating: '(142 Đánh giá)',
    desc: 'Socola đen 70% nguyên chất hòa quyện lớp bánh quy đen giòn rụm đậm đà. Sự lựa chọn hoàn hảo cho tín đồ yêu socola nguyên bản.',
    images: ['/assets/menu-sp-5.png', '/assets/dark-cookie-thumb-2.png', '/assets/dark-cookie-thumb-3.png'],
  },
  'blackpink': {
    name: 'BLACKPINK',
    price: 30000,
    rating: '(188 Đánh giá)',
    desc: 'Sự kết hợp hoàn hảo giữa socola đen mượt mà và lớp phủ kem dâu tây hồng ngọt ngào quyến rũ.',
    images: ['/assets/menu-sp-6.png', '/assets/blackpink-thumb-2.png', '/assets/blackpink-thumb-3.png'],
  },
  'fruit-pop': {
    name: 'FRUIT POP',
    price: 30000,
    rating: '(115 Đánh giá)',
    desc: 'Lớp phủ đường ngũ sắc trái cây nhiệt đới chua ngọt thanh mát, bùng nổ vị giác sảng khoái.',
    images: ['/assets/menu-sp-7.png', '/assets/fruit-pop-thumb-2.png', '/assets/fruit-pop-thumb-3.png'],
  },
  'mango-tango': {
    name: 'MANGO TANGO',
    price: 30000,
    rating: '(92 Đánh giá)',
    desc: 'Nhân kem xoài cát chín vàng óng ánh, thơm nức hương vị nhiệt đới Sài Gòn.',
    images: ['/assets/menu-sp-8.png', '/assets/mango-tango-thumb-2.png', '/assets/mango-tango-thumb-3.png'],
  },
  'very-berry': {
    name: 'VERY BERRY',
    price: 36000,
    rating: '(164 Đánh giá)',
    desc: 'Vị dâu tây ngọt ngào phủ lớp đường sữa mỏng nhẹ, hòa quyện sốt berry tươi thơm lừng.',
    images: ['/assets/menu-sp-9.png', '/assets/very-berry-thumb-2.png', '/assets/very-berry-thumb-3.png'],
  },
};

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('product') || 'glaze';
  const product = PRODUCTS_DATA[productId] || PRODUCTS_DATA['glaze'];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: product.name,
      price: product.price,
      img: product.images[0],
      qty: quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const prevImage = () => {
    setActiveImgIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveImgIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <main>
      <section className="detail-main-section" aria-label={`Chi tiết sản phẩm ${product.name}`}>
        <div className="detail-wrapper">
          {/* Breadcrumb Navigation */}
          <nav className="detail-breadcrumbs" aria-label="Điều hướng liên kết">
            <Link href="/">Trang chủ</Link>
            <span className="breadcrumb-separator">&gt;&gt;</span>
            <Link href="/menu">Sản phẩm</Link>
            <span className="breadcrumb-separator">&gt;&gt;</span>
            <span className="breadcrumb-current">{product.name}</span>
          </nav>

          {/* Product Showcase Bento Layout */}
          <div className="detail-bento-grid">
            {/* Left Column: Gallery & Usage Commitments */}
            <div className="detail-gallery-col">
              {/* Main Image Viewer with Nav Arrows */}
              <div className="detail-main-gallery">
                <button type="button" className="gallery-nav-btn gallery-prev" id="galleryPrevBtn" aria-label="Hình ảnh trước" onClick={prevImage}>
                  <img src="/assets/icon-arrow-left.svg" alt="" width="23" height="48" />
                </button>

                <div className="detail-main-img-box">
                  <img src={product.images[activeImgIndex] || product.images[0]} alt={`Bánh Donut ${product.name}`} id="mainShowcaseImg" className="detail-showcase-img" />
                </div>

                <button type="button" className="gallery-nav-btn gallery-next" id="galleryNextBtn" aria-label="Hình ảnh tiếp theo" onClick={nextImage}>
                  <img src="/assets/icon-arrow-right.svg" alt="" width="23" height="48" />
                </button>
              </div>

              {/* Thumbnail Selector List */}
              <div className="detail-thumbnails-list">
                {product.images.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumbnail-item ${idx === activeImgIndex ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                    aria-label={`Xem ảnh ${idx + 1}`}
                  >
                    <img src={imgSrc} alt={`Ảnh chi tiết ${idx + 1}`} />
                  </button>
                ))}
              </div>

              {/* Commitments & Storage Bento Card (HDSD) */}
              <div className="detail-commitments-card">
                <div className="commitments-grid">
                  <div className="commitment-item">
                    <div className="commitment-icon-wrap">
                      <img src="/assets/icon-time-machine.png" alt="" width="50" height="50" />
                    </div>
                    <div className="commitment-info">
                      <h3 className="commitment-title">BÁNH MỚI MỖI NGÀY</h3>
                      <p className="commitment-desc">Làm mới mỗi ngày, trọn vẹn vị tươi ngon.</p>
                    </div>
                  </div>

                  <div className="commitment-item">
                    <div className="commitment-icon-wrap">
                      <img src="/assets/icon-temperature.png" alt="" width="50" height="50" />
                    </div>
                    <div className="commitment-info">
                      <h3 className="commitment-title">BẢO QUẢN</h3>
                      <p className="commitment-desc">Dùng ngon nhất trong ngày hoặc để tủ lạnh 1-2 ngày nha!</p>
                    </div>
                  </div>

                  <div className="commitment-item">
                    <div className="commitment-icon-wrap">
                      <img src="/assets/icon-good-quality.png" alt="" width="50" height="50" />
                    </div>
                    <div className="commitment-info">
                      <h3 className="commitment-title">AN TOÀN CHẤT LƯỢNG</h3>
                      <p className="commitment-desc">Nguyên liệu sạch, 100% không chất bảo quản.</p>
                    </div>
                  </div>

                  <div className="commitment-item">
                    <div className="commitment-icon-wrap">
                      <img src="/assets/icon-gift-box.png" alt="" width="50" height="50" />
                    </div>
                    <div className="commitment-info">
                      <h3 className="commitment-title">THÍCH HỢP</h3>
                      <p className="commitment-desc">Phù hợp ăn sáng, ăn xế, tiệc trà và làm quà tặng.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Product Information & Order Actions */}
            <div className="detail-info-col">
              <div className="detail-info-card">
                <div className="detail-title-wrap">
                  <h1 className="detail-product-title">{product.name}</h1>
                  <div className="detail-badge-wrap">
                    <img src="/assets/badge-best-seller-bg.svg" alt="" className="detail-badge-bg" />
                    <span className="detail-best-seller-badge">BEST SELLER</span>
                  </div>
                </div>

                <div className="detail-price-rating-row">
                  <div className="detail-price-box">
                    <span className="detail-price-amount" id="detailPriceDisplay">{product.price.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="detail-rating-box">
                    <div className="rating-stars">
                      <img src="/assets/icon-star-yellow.svg" alt="5 sao" width="18" height="18" />
                      <img src="/assets/icon-star-yellow.svg" alt="" width="18" height="18" />
                      <img src="/assets/icon-star-yellow.svg" alt="" width="18" height="18" />
                      <img src="/assets/icon-star-yellow.svg" alt="" width="18" height="18" />
                      <img src="/assets/icon-star-yellow.svg" alt="" width="18" height="18" />
                    </div>
                    <span className="rating-count">{product.rating}</span>
                  </div>
                </div>

                <div className="detail-dot-divider"></div>

                <p className="detail-description">{product.desc}</p>

                {/* Highlight Feature Pills */}
                <div className="detail-feature-pills">
                  <div className="feature-pill-item">
                    <div className="feature-pill-icon">
                      <img src="/assets/icon-cherry-donut.png" alt="" width="24" height="24" />
                    </div>
                    <span className="feature-pill-text">Mềm xốp tự nhiên</span>
                  </div>
                  <div className="feature-pill-item">
                    <div className="feature-pill-icon">
                      <img src="/assets/icon-milk-bottle.png" alt="" width="24" height="24" />
                    </div>
                    <span className="feature-pill-text">Ngọt thanh không gắt</span>
                  </div>
                  <div className="feature-pill-item">
                    <div className="feature-pill-icon">
                      <img src="/assets/icon-leaf.png" alt="" width="24" height="24" />
                    </div>
                    <span className="feature-pill-text">Không chất bảo quản</span>
                  </div>
                </div>

                <div className="detail-dot-divider"></div>

                {/* Ingredients */}
                <div className="detail-ingredients-section">
                  <h2 className="ingredients-heading">THÀNH PHẦN NỔI BẬT:</h2>
                  <div className="ingredients-pills-list">
                    <div className="ingredient-pill">
                      <img src="/assets/icon-wheat.png" alt="" width="22" height="22" />
                      <span>Bột mì</span>
                    </div>
                    <div className="ingredient-pill">
                      <img src="/assets/icon-butter.png" alt="" width="24" height="20" />
                      <span>Bơ</span>
                    </div>
                    <div className="ingredient-pill">
                      <img src="/assets/icon-milk-bottle.png" alt="" width="20" height="20" />
                      <span>Sữa</span>
                    </div>
                    <div className="ingredient-pill">
                      <img src="/assets/icon-sugar-cube.png" alt="" width="20" height="20" />
                      <span>Đường</span>
                    </div>
                  </div>
                </div>

                {/* Flavor profile */}
                <div className="detail-flavor-profile">
                  <span className="flavor-heading">HƯƠNG VỊ:</span>
                  <span className="flavor-desc">Ngọt nhẹ - Béo thơm - Mềm xốp</span>
                </div>

                <div className="detail-dot-divider"></div>

                {/* Quantity Selector & Action Buttons */}
                <div className="detail-actions-section">
                  <div className="quantity-selector-row">
                    <span className="qty-label">Số lượng:</span>
                    <div className="qty-pill-controls">
                      <button type="button" className="qty-control-btn" id="btnQtyMinus" aria-label="Giảm" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                      <span className="qty-value-display" id="productQtyDisplay">{quantity}</span>
                      <button type="button" className="qty-control-btn" id="btnQtyPlus" aria-label="Tăng" onClick={() => setQuantity((q) => q + 1)}>+</button>
                    </div>
                  </div>

                  <div className="detail-cta-buttons-row">
                    <button type="button" className="btn-detail-add-cart" id="btnDetailAddCart" onClick={handleAddToCart}>
                      <img src="/assets/icon-add-cart.svg" alt="" width="22" height="21" />
                      <span>Thêm vào giỏ hàng</span>
                    </button>
                    <button type="button" className="btn-detail-buy-now" id="btnDetailBuyNow" onClick={handleBuyNow}>
                      <span>Mua ngay</span>
                    </button>
                  </div>

                  <div className="delivery-guarantee-note">
                    <img src="/assets/icon-speed-delivery.svg" alt="" width="20" height="16" />
                    <span>Giao hàng nhanh trong vòng 30 phút</span>
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

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Đang tải sản phẩm...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
