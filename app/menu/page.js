'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';

const MENU_PRODUCTS = [
  { id: 'glaze', name: 'GLAZE', category: 'ring-donut', price: 25000, img: '/assets/menu-sp-1.png', page: 1, desc: 'Vị truyền thống phủ lớp đường sữa mỏng nhẹ, mềm tan trong miệng.' },
  { id: 'oreomallow', name: 'OREOMALLOW', category: 'ring-donut', price: 25000, img: '/assets/menu-sp-2.png', page: 1, desc: 'Bánh donut phủ kem marshmallow cùng vụn bánh quy Oreo giòn rụm.' },
  { id: 'smoker-white', name: 'SMOKER WHITE', category: 'ring-donut', price: 29000, img: '/assets/menu-sp-3.png', page: 1, desc: 'Hương vị socola trắng khói độc đáo, ngọt dịu và thơm ngậy quyến rũ.' },
  { id: 'red-velvet', name: 'RED VELVET', category: 'ring-donut', price: 30000, img: '/assets/menu-sp-4.png', page: 1, desc: 'Sắc đỏ nhung quý phái kết hợp sốt cream cheese béo nhẹ chuẩn vị bánh Mỹ.' },
  { id: 'dark-cookie', name: 'DARK COOKIE', category: 'ring-donut', price: 30000, img: '/assets/menu-sp-5.png', page: 1, desc: 'Socola đen 70% nguyên chất hòa quyện lớp bánh quy đen giòn rụm đậm đà.' },
  { id: 'blackpink', name: 'BLACKPINK', category: 'ring-donut', price: 30000, img: '/assets/menu-sp-6.png', page: 1, desc: 'Sự kết hợp hoàn hảo giữa socola đen và lớp phủ kem dâu tây hồng ngọt ngào.' },
  { id: 'fruit-pop', name: 'FRUIT POP', category: 'ring-donut', price: 30000, img: '/assets/menu-sp-7.png', page: 1, desc: 'Lớp phủ đường ngũ sắc trái cây nhiệt đới chua ngọt thanh mát, bùng nổ vị giác sảng khoái.' },
  { id: 'mango-tango', name: 'MANGO TANGO', category: 'filled-donut', price: 30000, img: '/assets/menu-sp-8.png', page: 1, desc: 'Nhân kem xoài cát chín vàng óng ánh, thơm nức hương vị nhiệt đới Sài Gòn.' },
  { id: 'very-berry', name: 'VERY BERRY', category: 'filled-donut', price: 36000, img: '/assets/menu-sp-9.png', page: 2, desc: 'Vị dâu tây ngọt ngào phủ lớp đường sữa mỏng nhẹ, hòa quyện sốt berry tươi thơm lừng.' },
];

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (['ring-donut', 'filled-donut', 'all'].includes(initialCategory)) {
      setCurrentCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredProducts = MENU_PRODUCTS.filter((product) => {
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    const matchesPage = currentCategory === 'all' ? product.page === currentPage : true;
    return matchesCategory && matchesPage;
  });

  return (
    <main>
      {/* Menu Header / Category Banner */}
      <section className="menu-banner-section" aria-label="Danh mục thực đơn">
        <div className="menu-banner-container">
          {/* Breadcrumbs */}
          <nav className="menu-breadcrumbs" aria-label="Đường dẫn trang">
            <Link href="/" className="breadcrumb-link">Trang Chủ</Link>
            <span className="breadcrumb-separator">&lt;&lt;</span>
            <span className="breadcrumb-current">Menu</span>
          </nav>

          <div className="menu-banner-row">
            <div className="menu-banner-text">
              <h1 className="menu-banner-title">Tất cả Hương vị</h1>
              <p className="menu-banner-desc">
                Khám phá bộ sưu tập donut nghệ nhân, được chế tác thủ công mỗi ngày với những nguyên liệu cao cấp nhất.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="menu-filter-pills" role="tablist" aria-label="Bộ lọc danh mục">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'ring-donut', label: 'Ring Donut' },
                { id: 'filled-donut', label: 'Filled Donut' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`filter-pill ${currentCategory === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentCategory(tab.id);
                    setCurrentPage(1);
                  }}
                  role="tab"
                  aria-selected={currentCategory === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Listing Grid */}
      <section className="menu-grid-section" aria-label="Danh sách sản phẩm">
        <div className="menu-grid-container" id="menuProductGrid">
          {filteredProducts.map((product) => (
            <article key={product.id} className="menu-product-card" data-category={product.category} data-page={product.page} data-product-id={product.id}>
              <Link href={`/product-detail?product=${product.id}`} className="menu-card-img-link" aria-label={`Xem chi tiết bánh ${product.name}`}>
                <div className="menu-card-img-wrap">
                  <img src={product.img} alt={`Bánh Donut ${product.name}`} className="menu-card-img" loading="lazy" />
                </div>
              </Link>
              <div className="menu-card-body">
                <Link href={`/product-detail?product=${product.id}`} className="menu-card-title-link">
                  <h2 className="menu-card-title">{product.name}</h2>
                </Link>
                <p className="menu-card-desc">{product.desc}</p>
                <div className="menu-card-footer">
                  <span className="menu-card-price">{product.price.toLocaleString('vi-VN')} <small>VNĐ</small></span>
                  <button
                    type="button"
                    className="menu-add-cart-btn"
                    onClick={() => addToCart(product)}
                    aria-label={`Thêm ${product.name} vào giỏ hàng`}
                  >
                    <img src="/assets/icon-add-cart-white.svg" alt="" className="btn-cart-icon" width="20" height="21" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Component */}
        {currentCategory === 'all' && (
          <nav className="menu-pagination" aria-label="Phân trang thực đơn">
            <button
              type="button"
              className={`pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              aria-label="Trang trước"
            >
              &lt;
            </button>
            <button
              type="button"
              className={`pagination-btn pagination-num ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(1)}
              aria-label="Trang 1"
            >
              1
            </button>
            <button
              type="button"
              className={`pagination-btn pagination-num ${currentPage === 2 ? 'active' : ''}`}
              onClick={() => setCurrentPage(2)}
              aria-label="Trang 2"
            >
              2
            </button>
            <button
              type="button"
              className={`pagination-btn pagination-next ${currentPage === 2 ? 'disabled' : ''}`}
              disabled={currentPage === 2}
              onClick={() => setCurrentPage(2)}
              aria-label="Trang sau"
            >
              &gt;
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Đang tải thực đơn...</div>}>
      <MenuContent />
    </Suspense>
  );
}
