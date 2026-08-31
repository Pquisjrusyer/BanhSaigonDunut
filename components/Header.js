'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.lenis ? window.lenis.scroll : window.scrollY;
      if (scrollPos > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (window.lenis) {
      window.lenis.on('scroll', handleScroll);
    }
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (window.lenis) {
        window.lenis.off('scroll', handleScroll);
      }
    };
  }, []);

  const toggleMobileDrawer = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileDrawer = () => {
    setIsMobileOpen(false);
  };

  const isActive = (path) => {
    if (path === '/' && (pathname === '/' || pathname === '')) return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

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

  const handleNavClick = (e, path) => {
    if (isActive(path)) {
      e.preventDefault();
      scrollToTop();
    }
    closeMobileDrawer();
  };

  return (
    <header
      className={`site-header ${isScrolled ? 'scrolled' : ''}`}
      id="mainHeader"
      data-node-id="2612:49012"
      data-name="navbar"
    >
      <div className="header-container">
        <Link
          href="/"
          className="brand-logo"
          aria-label="Donut Saigon Trang Chủ"
          onClick={(e) => handleNavClick(e, '/')}
        >
          <img src="/assets/logo-donut-saigon.png" alt="Donut Saigon Logo" className="logo-img" width="122" height="54" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="main-nav" aria-label="Menu chính">
          <ul className="nav-list">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                id="navHome"
                onClick={(e) => handleNavClick(e, '/')}
              >
                TRANG CHỦ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/about"
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                id="navAbout"
                onClick={(e) => handleNavClick(e, '/about')}
              >
                GIỚI THIỆU
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/menu"
                className={`nav-link ${isActive('/menu') ? 'active' : ''}`}
                id="navMenu"
                onClick={(e) => handleNavClick(e, '/menu')}
              >
                MENU
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/account"
                className={`nav-link nav-account ${isActive('/account') ? 'active' : ''}`}
                id="navAccount"
                onClick={(e) => handleNavClick(e, '/account')}
              >
                <span>TÀI KHOẢN</span>
                <span className="nav-icon user-icon" aria-hidden="true">
                  <img src="/assets/icon-user-outer.svg" alt="" className="icon-user-base" />
                  <img src="/assets/icon-user-inner.svg" alt="" className="icon-user-head" />
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/cart"
                className={`nav-link nav-cart ${isActive('/cart') ? 'active' : ''}`}
                id="navCartBtn"
                aria-label="Giỏ hàng"
                onClick={(e) => handleNavClick(e, '/cart')}
              >
                <span>GIỎ HÀNG</span>
                <span className="nav-icon cart-icon" aria-hidden="true">
                  <img src="/assets/icon-cart-1.svg" alt="" className="icon-cart-part" />
                  <img src="/assets/icon-cart-2.svg" alt="" className="icon-cart-part" />
                  <span className="cart-badge" id="cartBadge">{cartCount}</span>
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className={`mobile-menu-btn ${isMobileOpen ? 'open' : ''}`}
          id="mobileMenuBtn"
          aria-label="Mở menu điều hướng"
          aria-expanded={isMobileOpen}
          onClick={toggleMobileDrawer}
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-drawer ${isMobileOpen ? 'open' : ''}`} id="mobileDrawer" aria-hidden={!isMobileOpen}>
        <div className="drawer-header">
          <img src="/assets/logo-donut-saigon.png" alt="Donut Saigon Logo" className="drawer-logo" width="100" />
          <button className="drawer-close-btn" id="drawerCloseBtn" aria-label="Đóng menu" onClick={closeMobileDrawer}>
            &times;
          </button>
        </div>
        <ul className="drawer-list">
          <li>
            <Link
              href="/"
              className={`drawer-link ${isActive('/') ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, '/')}
            >
              TRANG CHỦ
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`drawer-link ${isActive('/about') ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, '/about')}
            >
              GIỚI THIỆU
            </Link>
          </li>
          <li>
            <Link
              href="/menu"
              className={`drawer-link ${isActive('/menu') ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, '/menu')}
            >
              MENU
            </Link>
          </li>
          <li>
            <Link
              href="/account"
              className={`drawer-link ${isActive('/account') ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, '/account')}
            >
              TÀI KHOẢN
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className={`drawer-link ${isActive('/cart') ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, '/cart')}
            >
              GIỎ HÀNG (<span>{cartCount}</span>)
            </Link>
          </li>
        </ul>
        <div className="drawer-footer">
          <p className="drawer-tagline">Nạp vị ngọt, bật công suất cùng Donut Saigon!</p>
        </div>
      </div>
      <div className={`drawer-backdrop ${isMobileOpen ? 'open' : ''}`} id="drawerBackdrop" onClick={closeMobileDrawer}></div>
    </header>
  );
}
