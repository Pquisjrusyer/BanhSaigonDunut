'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '../../context/ToastContext';

export default function ReviewsPage() {
  const { showToast } = useToast();
  const [productRating, setProductRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState('');
  const [customReviews, setCustomReviews] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reviewMessage.trim()) {
      showToast('Vui lòng nhập nhận xét của bạn!', '⚠️');
      return;
    }

    const newRev = {
      id: Date.now(),
      name: 'Bạn (Khách hàng)',
      rating: productRating,
      message: reviewMessage.trim(),
      date: 'Vừa xong',
      avatar: '/assets/avatar-review-cow.png',
    };

    setCustomReviews((prev) => [newRev, ...prev]);
    showToast('Cảm ơn bạn! Đánh giá đã được gửi thành công.', '⭐');
    setReviewMessage('');
  };

  return (
    <main className="reviews-main-wrap">
      <div className="reviews-container">
        {/* Back Link */}
        <div className="reviews-top-bar">
          <Link href="/#reviews" className="btn-back-reviews" aria-label="Quay lại trang chủ">
            <img src="/assets/icon-back-arrow.svg" alt="" width="14" height="14" />
            <span>Quay lại</span>
          </Link>
        </div>

        {/* Page Header */}
        <header className="reviews-page-header">
          <h1 className="reviews-page-title">Lời Khen Từ Bạn</h1>
          <p className="reviews-page-subtitle">
            Chia sẻ trải nghiệm ngọt ngào của bạn tại Donut Saigon. Mỗi đánh giá là một động lực để chúng mình hoàn thiện hơn mỗi ngày.
          </p>
        </header>

        {/* Content Grid: Form (Left) & Testimonials (Right) */}
        <div className="reviews-content-grid">
          {/* Left Column: Review Form Card */}
          <section className="review-form-card" aria-label="Form gửi đánh giá">
            <h2 className="review-form-title">Gửi Đánh Giá</h2>

            <form id="customerFeedbackForm" className="review-form-inner" onSubmit={handleSubmit}>
              {/* Field 1: Product Quality Rating */}
              <div className="form-rating-group">
                <label className="form-rating-label">Chất lượng sản phẩm</label>
                <div className="star-rating-controls" data-rating-group="product">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-rating-btn ${star <= productRating ? 'active' : ''}`}
                      onClick={() => setProductRating(star)}
                      aria-label={`${star} sao`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2: Store Service Rating */}
              <div className="form-rating-group">
                <label className="form-rating-label">Dịch vụ cửa hàng</label>
                <div className="star-rating-controls" data-rating-group="service">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-rating-btn ${star <= serviceRating ? 'active' : ''}`}
                      onClick={() => setServiceRating(star)}
                      aria-label={`${star} sao`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 3: Review Textarea */}
              <div className="form-textarea-group">
                <label htmlFor="inputReviewMessage" className="form-rating-label">Nhận xét của bạn</label>
                <textarea
                  id="inputReviewMessage"
                  className="review-feedback-textarea"
                  placeholder="Hãy viết gì đó về chiếc bánh bạn đã thử..."
                  required
                  rows="4"
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-submit-review" id="btnSubmitFeedback">
                <span>Gửi nhận xét</span>
                <img src="/assets/icon-send-arrow.svg" alt="" width="14" height="12" />
              </button>
            </form>
          </section>

          {/* Right Column: Customer Reviews Display */}
          <section className="reviews-display-column" aria-label="Danh sách đánh giá từ khách hàng">
            {/* Custom User Submitted Reviews */}
            {customReviews.map((rev) => (
              <article key={rev.id} className="review-item-card card-featured" style={{ marginBottom: 16 }}>
                <div className="review-avatar-wrap">
                  <img src={rev.avatar} alt={rev.name} className="review-avatar-img" width="96" height="96" />
                </div>
                <div className="review-card-body">
                  <div className="review-card-top-row">
                    <div className="review-author-meta">
                      <h3 className="review-author-name">{rev.name}</h3>
                      <div className="review-stars-row" aria-label={`${rev.rating} sao`}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <img key={i} src="/assets/icon-star-filled-blue.svg" alt="★" width="18" height="18" />
                        ))}
                      </div>
                    </div>
                    <span className="review-date-badge">{rev.date}</span>
                  </div>
                  <p className="review-comment-text">{rev.message}</p>
                </div>
              </article>
            ))}

            {/* Card 1: Featured Large Card (Minh Tuấn) */}
            <article className="review-item-card card-featured">
              <div className="review-avatar-wrap">
                <img src="/assets/avatar-review-cow.png" alt="Minh Tuấn" className="review-avatar-img" width="96" height="96" />
              </div>
              <div className="review-card-body">
                <div className="review-card-top-row">
                  <div className="review-author-meta">
                    <h3 className="review-author-name">Minh Tuấn</h3>
                    <div className="review-stars-row" aria-label="5 sao">
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="18" height="18" />
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="18" height="18" />
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="18" height="18" />
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="18" height="18" />
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="18" height="18" />
                    </div>
                  </div>
                  <span className="review-date-badge">Hôm qua</span>
                </div>
                <p className="review-comment-text">
                  Bánh Donut ở đây thật sự khác biệt. Lớp vỏ mềm tan, không bị quá ngọt. Mình cực kỳ thích vị Matcha Hạnh Nhân, vị trà xanh rất đậm đà và thơm. Sẽ quay lại thường xuyên!
                </p>
              </div>
            </article>

            {/* Row of Standard Review Cards */}
            <div className="reviews-sub-grid">
              {/* Card 2: Khánh Linh */}
              <article className="review-item-card card-standard">
                <div className="review-card-top-compact">
                  <div className="review-avatar-wrap-sm">
                    <img src="/assets/avatar-review-hamster.png" alt="Khánh Linh" className="review-avatar-img-sm" width="48" height="48" />
                  </div>
                  <div className="review-author-meta-sm">
                    <h3 className="review-author-name-sm">Khánh Linh</h3>
                    <div className="review-stars-row-sm" aria-label="5 sao">
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="14" height="14" />
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="14" height="14" />
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="14" height="14" />
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="14" height="14" />
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="14" height="14" />
                    </div>
                  </div>
                </div>
                <p className="review-comment-text-sm">
                  Cửa hàng trang trí rất xinh, nhân viên nhiệt tình hỗ trợ mình chọn bánh. Black Pink là vị mình thích nhất, bánh mềm, siu siu ngon ạ.
                </p>
              </article>

              {/* Card 3: Hoàng Nam */}
              <article className="review-item-card card-standard">
                <div className="review-card-top-compact">
                  <div className="review-avatar-wrap-sm">
                    <img src="/assets/avatar-review-bear.png" alt="Hoàng Nam" className="review-avatar-img-sm" width="48" height="48" />
                  </div>
                  <div className="review-author-meta-sm">
                    <h3 className="review-author-name-sm">Hoàng Nam</h3>
                    <div className="review-stars-row-sm" aria-label="4 sao">
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="14" height="14" />
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="14" height="14" />
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="14" height="14" />
                      <img src="/assets/icon-star-filled-blue.svg" alt="★" width="14" height="14" />
                      <img src="/assets/icon-star-empty-blue.svg" alt="☆" width="14" height="14" />
                    </div>
                  </div>
                </div>
                <p className="review-comment-text-sm">
                  Bánh ngon, chất lượng bánh không có điểm nào chê, tuy nhiên dịch vụ giao hàng giờ cao điểm còn hơi chậm. Mong shop cải thiện vấn đề này.
                </p>
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
