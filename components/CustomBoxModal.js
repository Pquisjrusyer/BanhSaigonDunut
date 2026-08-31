'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const FLAVORS = [
  'GLAZE',
  'RED VELVET',
  'FRUIT POP',
  'OREOMALLOW',
  'DARK COOKIE',
  'MANGO TANGO',
  'SMOKER WHITE',
  'BLACKPINK',
  'VERY BERRY',
];

export default function CustomBoxModal({ isOpen, onClose }) {
  const { addToCart } = useCart();

  const [cake1, setCake1] = useState('GLAZE');
  const [cake2, setCake2] = useState('OREOMALLOW');
  const [cake3, setCake3] = useState('RED VELVET');
  const [cake4, setCake4] = useState('VERY BERRY');
  const [giftNote, setGiftNote] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const selectedFlavors = [cake1, cake2, cake3, cake4];
    const details = `4 bánh: ${selectedFlavors.join(', ')}${
      giftNote.trim() ? ` | Thư: "${giftNote.trim()}"` : ''
    }`;

    addToCart({
      id: `gift-box-${Date.now()}`,
      name: 'GIFT BOX (4 Bánh)',
      price: 170000,
      img: '/assets/cat-gift-box.png',
      qty: 1,
      flavors: selectedFlavors,
      note: giftNote.trim(),
      details: details,
    });

    onClose();
  };

  return (
    <div
      className="custom-box-modal-backdrop active"
      id="customBoxModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customBoxModalTitle"
      onClick={(e) => {
        if (e.target.id === 'customBoxModal') onClose();
      }}
    >
      <div className="custom-box-modal-card">
        {/* Modal Header */}
        <div className="custom-box-header">
          <div className="custom-box-title-wrap">
            <h2 className="custom-box-title" id="customBoxModalTitle">
              Tùy chỉnh đơn hàng
            </h2>
            <p className="custom-box-subtitle">
              Chọn hương vị cho từng chiếc bánh trong hộp của bạn.
            </p>
          </div>
          <button
            type="button"
            className="custom-box-close-btn"
            id="btnCloseCustomBoxModal"
            aria-label="Đóng tùy chỉnh"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="custom-box-body">
          {/* Cake 1 */}
          <div className="custom-cake-selection-card">
            <div className="cake-selection-header">
              <h3 className="cake-selection-title">Bánh 1</h3>
              <span className="cake-selection-badge">Hương vị tự chọn</span>
            </div>
            <div className="flavor-options-grid">
              {FLAVORS.map((flavor) => (
                <label key={`cake1-${flavor}`} className="flavor-radio-item">
                  <input
                    type="radio"
                    name="cake_flavor_1"
                    value={flavor}
                    checked={cake1 === flavor}
                    onChange={() => setCake1(flavor)}
                    className="flavor-radio-input"
                  />
                  <span className="flavor-radio-custom"></span>
                  <span className="flavor-name">{flavor}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cake 2 */}
          <div className="custom-cake-selection-card">
            <div className="cake-selection-header">
              <h3 className="cake-selection-title">Bánh 2</h3>
              <span className="cake-selection-badge">Hương vị tự chọn</span>
            </div>
            <div className="flavor-options-grid">
              {FLAVORS.map((flavor) => (
                <label key={`cake2-${flavor}`} className="flavor-radio-item">
                  <input
                    type="radio"
                    name="cake_flavor_2"
                    value={flavor}
                    checked={cake2 === flavor}
                    onChange={() => setCake2(flavor)}
                    className="flavor-radio-input"
                  />
                  <span className="flavor-radio-custom"></span>
                  <span className="flavor-name">{flavor}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cake 3 */}
          <div className="custom-cake-selection-card">
            <div className="cake-selection-header">
              <h3 className="cake-selection-title">Bánh 3</h3>
              <span className="cake-selection-badge">Hương vị tự chọn</span>
            </div>
            <div className="flavor-options-grid">
              {FLAVORS.map((flavor) => (
                <label key={`cake3-${flavor}`} className="flavor-radio-item">
                  <input
                    type="radio"
                    name="cake_flavor_3"
                    value={flavor}
                    checked={cake3 === flavor}
                    onChange={() => setCake3(flavor)}
                    className="flavor-radio-input"
                  />
                  <span className="flavor-radio-custom"></span>
                  <span className="flavor-name">{flavor}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cake 4 */}
          <div className="custom-cake-selection-card">
            <div className="cake-selection-header">
              <h3 className="cake-selection-title">Bánh 4</h3>
              <span className="cake-selection-badge">Hương vị tự chọn</span>
            </div>
            <div className="flavor-options-grid">
              {FLAVORS.map((flavor) => (
                <label key={`cake4-${flavor}`} className="flavor-radio-item">
                  <input
                    type="radio"
                    name="cake_flavor_4"
                    value={flavor}
                    checked={cake4 === flavor}
                    onChange={() => setCake4(flavor)}
                    className="flavor-radio-input"
                  />
                  <span className="flavor-radio-custom"></span>
                  <span className="flavor-name">{flavor}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Handwritten Note Textarea */}
          <div className="custom-cake-note-section">
            <label htmlFor="customGiftNote" className="custom-cake-note-label">
              Nội dung thư:
            </label>
            <textarea
              id="customGiftNote"
              className="custom-cake-note-textarea"
              placeholder="Thêm điều muốn nói với người ấy..."
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="custom-box-footer">
          <button
            type="button"
            className="btn-custom-box-submit"
            id="btnModalSubmitAddToCart"
            onClick={handleConfirm}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
