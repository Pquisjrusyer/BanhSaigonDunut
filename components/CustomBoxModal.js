'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const FLAVORS = [
  { id: 'glaze', name: 'Glaze Original', img: '/assets/cat-filled-donut.png' },
  { id: 'oreomallow', name: 'Oreomallow', img: '/assets/cat-ring-donut.png' },
  { id: 'smoker-white', name: 'Smoked White', img: '/assets/cat-filled-donut.png' },
  { id: 'red-velvet', name: 'Red Velvet', img: '/assets/cat-ring-donut.png' },
  { id: 'dark-cookie', name: 'Dark Cookie', img: '/assets/cat-filled-donut.png' },
  { id: 'blackpink', name: 'Blackpink', img: '/assets/cat-ring-donut.png' },
];

const BOX_PRICES = {
  4: 120000,
  6: 180000,
  12: 340000,
};

export default function CustomBoxModal({ isOpen, onClose }) {
  const [boxSize, setBoxSize] = useState(6);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleSelectFlavor = (flavor) => {
    if (selectedFlavors.length < boxSize) {
      setSelectedFlavors((prev) => [...prev, flavor]);
    }
  };

  const handleRemoveFlavor = (index) => {
    setSelectedFlavors((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleConfirmBox = () => {
    if (selectedFlavors.length < boxSize) {
      alert(`Vui lòng chọn đủ ${boxSize} bánh cho hộp quà!`);
      return;
    }

    addToCart({
      id: `custom-box-${boxSize}-${Date.now()}`,
      name: `Hộp Quà Tự Chọn (${boxSize} Bánh)`,
      price: BOX_PRICES[boxSize],
      img: '/assets/cat-gift-box.png',
      qty: 1,
      details: selectedFlavors.map((f) => f.name).join(', '),
    });

    setSelectedFlavors([]);
    onClose();
  };

  return (
    <div className="policy-modal-overlay active" id="customBoxModal" style={{ zIndex: 9999 }}>
      <div className="policy-modal-card" style={{ maxWidth: 700 }}>
        <header className="policy-modal-header">
          <h3 className="policy-modal-title">Tùy Biến Hộp Quà Donut Saigon</h3>
          <button type="button" className="policy-modal-close" onClick={onClose}>&times;</button>
        </header>

        <div className="policy-modal-body">
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 'bold', marginBottom: 8, color: '#004691' }}>1. Chọn Cỡ Hộp Quà:</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[4, 6, 12].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setBoxSize(size);
                    setSelectedFlavors([]);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: '2px solid #2D61AD',
                    background: boxSize === size ? '#2D61AD' : '#FFF',
                    color: boxSize === size ? '#FFF' : '#2D61AD',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Hộp {size} bánh ({BOX_PRICES[size].toLocaleString('vi-VN')}đ)
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 'bold', marginBottom: 8, color: '#004691' }}>
              2. Chọn Vị Bánh ({selectedFlavors.length} / {boxSize}):
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {FLAVORS.map((flavor) => (
                <button
                  key={flavor.id}
                  type="button"
                  disabled={selectedFlavors.length >= boxSize}
                  onClick={() => handleSelectFlavor(flavor)}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    border: '1px solid #FDD6DC',
                    background: '#FFF',
                    cursor: selectedFlavors.length >= boxSize ? 'not-allowed' : 'pointer',
                    opacity: selectedFlavors.length >= boxSize ? 0.6 : 1,
                    textAlign: 'center',
                  }}
                >
                  <img src={flavor.img} alt={flavor.name} style={{ width: 40, height: 40, margin: '0 auto 4px', display: 'block' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#18345D', display: 'block' }}>{flavor.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontWeight: 'bold', marginBottom: 8, color: '#004691' }}>3. Ô Bánh Đã Chọn Trong Hộp:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 45, padding: 8, background: '#F8F5F0', borderRadius: 8 }}>
              {selectedFlavors.length === 0 ? (
                <span style={{ fontSize: 13, color: '#74575C' }}>Chưa chọn vị bánh nào. Hãy nhấp vào danh sách trên.</span>
              ) : (
                selectedFlavors.map((item, idx) => (
                  <span
                    key={idx}
                    onClick={() => handleRemoveFlavor(idx)}
                    title="Nhấp để xóa khỏi hộp"
                    style={{
                      background: '#F8CDD4',
                      color: '#004691',
                      padding: '4px 10px',
                      borderRadius: 16,
                      fontSize: 12,
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {item.name} &times;
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <footer className="policy-modal-footer">
          <button
            type="button"
            className="btn-modal-agree"
            disabled={selectedFlavors.length < boxSize}
            onClick={handleConfirmBox}
            style={{ opacity: selectedFlavors.length < boxSize ? 0.5 : 1 }}
          >
            Xác Nhận Thêm Hộp Quà ({BOX_PRICES[boxSize].toLocaleString('vi-VN')}đ)
          </button>
        </footer>
      </div>
    </div>
  );
}
