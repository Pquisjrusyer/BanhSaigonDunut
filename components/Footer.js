'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function Footer() {
  const pathname = usePathname();

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      if (window.lenis) {
        window.lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            if (typeof ScrollTrigger !== 'undefined') {
              ScrollTrigger.refresh();
            }
          },
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleLinkClick = (e, targetPath) => {
    if (pathname === targetPath || (targetPath === '/' && (pathname === '/' || pathname === ''))) {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <footer className="site-footer" data-node-id="2291:49834" data-name="Footer" aria-label="Chân trang Donut Saigon">
      {/* Dripping Wave Background Graphic Layer */}
      <div className="footer-bg-wrapper" aria-hidden="true">
        <img src="/assets/footer-wave.png" alt="" className="footer-bg-img" />
      </div>

      <div className="footer-content-wrap">
        <div className="footer-columns">
          {/* Column 1: Brand Logo & Copyright */}
          <div className="footer-col brand-col">
            <Link
              href="/"
              className="footer-logo-link"
              aria-label="Trang chủ Donut Saigon"
              onClick={(e) => handleLinkClick(e, '/')}
            >
              <img src="/assets/logo-donut-saigon.png" alt="Donut Saigon Logo" className="footer-logo" width="122" height="54" />
            </Link>
            <p className="footer-copy-text">
              © 2024 Donut Saigon. Những chiếc donut nghệ nhân được tạo ra bằng tình yêu.
            </p>
          </div>

          {/* Column 2: Khám Phá */}
          <div className="footer-col">
            <h4 className="footer-heading">KHÁM PHÁ</h4>
            <ul className="footer-links">
              <li>
                <Link href="/menu" className="footer-link" onClick={(e) => handleLinkClick(e, '/menu')}>
                  Cửa hàng
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-link" onClick={(e) => handleLinkClick(e, '/about')}>
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hỗ Trợ */}
          <div className="footer-col">
            <h4 className="footer-heading">HỖ TRỢ</h4>
            <ul className="footer-links">
              <li><Link href="/policy#privacy" className="footer-link">Chính sách bảo mật</Link></li>
              <li><Link href="/policy#terms" className="footer-link">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>

          {/* Column 4: Theo Dõi */}
          <div className="footer-col social-col">
            <h4 className="footer-heading">THEO DÕI</h4>
            <div className="footer-social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Chia sẻ Facebook" title="Chia sẻ Facebook">
                <img src="/assets/icon-share.svg" alt="Share" width="18" height="20" />
              </a>
              <a href="mailto:contact@donutsaigon.vn" className="social-icon-btn" aria-label="Gửi email cho Donut Saigon" title="Gửi Email">
                <img src="/assets/icon-mail.svg" alt="Mail" width="20" height="16" />
              </a>
              <a href="tel:0901234567" className="social-icon-btn" aria-label="Hotline Donut Saigon" title="Gọi Hotline">
                <img src="/assets/icon-phone-white.svg" alt="Phone" width="18" height="18" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
