import './globals.css';
import { ToastProvider } from '../context/ToastContext';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import LenisScroll from '../components/LenisScroll';
import AgentationWrapper from '../components/AgentationWrapper';

export const metadata = {
  title: 'Donut Saigon | Những Chiếc Donut Nghệ Nhân Tươi Ngon Mỗi Ngày',
  description: 'Donut Saigon mang đến trải nghiệm bánh donut nghệ nhân cao cấp, không chất bảo quản, mềm mịn tươi mới mỗi ngày. Giao nhanh 30-45 phút nội thành Sài Gòn.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;500;600;700;800;900&family=Montserrat:wght@800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <LenisScroll />
              <Header />
              {children}
              <Footer />
              <CookieConsent />
              <AgentationWrapper />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
