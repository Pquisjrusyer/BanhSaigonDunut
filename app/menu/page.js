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
              <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M7.29136 16C7.19864 16.0005 7.10672 15.9837 7.02088 15.9505C6.93504 15.9173 6.85696 15.8685 6.79113 15.8067L1.03494 10.361C0.706881 10.0514 0.446599 9.68359 0.269007 9.2787C0.0914142 8.8738 0 8.43973 0 8.00136C0 7.56298 0.0914142 7.12892 0.269007 6.72402C0.446599 6.31912 0.706881 5.95135 1.03494 5.64176L6.79113 0.196028C6.85682 0.133879 6.93481 0.0845804 7.02064 0.0509459C7.10647 0.0173114 7.19846 6.5484e-10 7.29136 0C7.38426 -6.5484e-10 7.47626 0.0173114 7.56209 0.0509459C7.64792 0.0845804 7.7259 0.133879 7.79159 0.196028C7.85729 0.258176 7.9094 0.331957 7.94495 0.413158C7.9805 0.494358 7.9988 0.581389 7.9988 0.66928C7.9988 0.757171 7.9805 0.844201 7.94495 0.925402C7.9094 1.0066 7.85729 1.08038 7.79159 1.14253L2.03541 6.58827C1.63959 6.9632 1.41726 7.47145 1.41726 8.00136C1.41726 8.53127 1.63959 9.03951 2.03541 9.41445L7.79159 14.8602C7.85763 14.9221 7.91005 14.9959 7.94582 15.0771C7.98158 15.1583 8 15.2454 8 15.3334C8 15.4214 7.98158 15.5086 7.94582 15.5898C7.91005 15.671 7.85763 15.7447 7.79159 15.8067C7.72576 15.8685 7.64769 15.9173 7.56185 15.9505C7.476 15.9837 7.38409 16.0005 7.29136 16Z" fill="currentColor"/>
              </svg>
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
              <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M0.708638 1.16157e-05C0.801362 -0.000495551 0.89328 0.016318 0.979121 0.0494887C1.06496 0.0826594 1.14304 0.131535 1.20887 0.193313L6.96506 5.63905C7.29312 5.94863 7.5534 6.31641 7.73099 6.7213C7.90859 7.1262 8 7.56027 8 7.99864C8 8.43702 7.90859 8.87108 7.73099 9.27598C7.5534 9.68088 7.29312 10.0487 6.96506 10.3582L1.20887 15.804C1.14318 15.8661 1.06519 15.9154 0.97936 15.9491C0.89353 15.9827 0.801539 16 0.708637 16C0.615735 16 0.523744 15.9827 0.437914 15.9491C0.352084 15.9154 0.274097 15.8661 0.208406 15.804C0.142714 15.7418 0.0906044 15.668 0.0550525 15.5868C0.0195005 15.5056 0.00120267 15.4186 0.00120268 15.3307C0.00120269 15.2428 0.0195006 15.1558 0.0550525 15.0746C0.0906044 14.9934 0.142715 14.9196 0.208406 14.8575L5.96459 9.41173C6.36041 9.0368 6.58274 8.52855 6.58274 7.99864C6.58274 7.46873 6.36041 6.96049 5.96459 6.58555L0.208407 1.13982C0.142371 1.07785 0.0899548 1.00413 0.0541856 0.922905C0.0184165 0.841679 1.23277e-06 0.754557 1.24046e-06 0.666564C1.24815e-06 0.578571 0.0184165 0.491449 0.0541857 0.410223C0.0899548 0.328998 0.142371 0.255277 0.208407 0.193312C0.274241 0.131535 0.352315 0.0826594 0.438156 0.0494886C0.523997 0.0163179 0.615915 -0.000495568 0.708638 1.16157e-05Z" fill="currentColor"/>
              </svg>
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
