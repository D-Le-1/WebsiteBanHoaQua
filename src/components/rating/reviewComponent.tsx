// ReviewSystem.jsx - Fixed version
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addReview, deleteReview, likeReview } from '../../useQuery/api/api';

const ReviewSystem = ({ productId, userId, userName, reviewList }) => {
  const queryClient = useQueryClient();
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Debug the data received as props
  console.log("ReviewSystem props:", { productId, userId, userName, reviewList });

  const addReviewMutation = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      setNewReview({ rating: 5, comment: '' });
      setSuccessMessage('Đánh giá của bạn đã được ghi nhận!');
      setTimeout(() => setSuccessMessage(''), 3000);
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  });
  
  const deleteReviewMutation = useMutation({
    mutationFn: ({ reviewId, userId }) => deleteReview({ reviewId, userId }),
    onSuccess: () => {
      setSuccessMessage('Đã xóa đánh giá thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    },
    onError: () => {
      setErrorMessage('Không thể xóa đánh giá. Vui lòng thử lại sau.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  });
  
  const likeReviewMutation = useMutation({
    mutationFn: likeReview,
    onSuccess: (data, variables) => {
      const reviewId = variables;
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    },
    onError: () => {
      setErrorMessage('Không thể thích đánh giá. Vui lòng thử lại sau.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  });
  
  // Handle inputs change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };

  // Handle review submission
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!newReview.comment.trim()) {
      setErrorMessage('Vui lòng nhập nội dung đánh giá');
      return;
    }

    if (!userId) {
      setErrorMessage('Vui lòng đăng nhập để gửi đánh giá');
      return;
    }

    addReviewMutation.mutate({
      productId,
      userId,
      userName,
      rating: newReview.rating,
      comment: newReview.comment
    });
  };

  // Handle delete review
  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      deleteReviewMutation.mutate({ reviewId, userId });
    }
  };

  // Handle like review
  const handleLikeReview = (reviewId) => {
    likeReviewMutation.mutate(reviewId);
  };

  // Render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span 
        key={index}
        className={`text-2xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  // Extract data safely from reviewList
  const reviews = reviewList?.reviews || [];
  const averageRating = reviewList?.averageRating || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đánh giá sản phẩm</h2>
      
      {/* Average Rating */}
      <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg mb-8">
        <div className="flex mb-2">
          {renderStars(Math.round(averageRating))}
        </div>
        <div className="text-gray-700">
          {averageRating.toFixed(1)} / 5 ({reviews.length} đánh giá)
        </div>
      </div>
      
      {/* Add Review Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">
          Thêm đánh giá của bạn
        </h3>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Đánh giá của bạn:</label>
            <div className="flex flex-row-reverse justify-end">
              {[5, 4, 3, 2, 1].map((star) => (
                <label key={star} className="cursor-pointer mx-1">
                  <input
                    type="radio"
                    name="rating"
                    value={star}
                    checked={newReview.rating === star}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <span className={`text-2xl ${newReview.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-700 mb-2 font-medium">
              Nội dung đánh giá:
            </label>
            <textarea
              id="comment"
              name="comment"
              rows="4"
              value={newReview.comment}
              onChange={handleInputChange}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          
          <button 
            type="submit"
            disabled={addReviewMutation.isLoading || !userId}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {addReviewMutation.isLoading ? 'Đang gửi...' : userId ? 'Gửi đánh giá' : 'Đăng nhập để đánh giá'}
          </button>
          {!userId && (
            <p className="text-sm text-gray-500 mt-2">Bạn cần đăng nhập để gửi đánh giá</p>
          )}
        </form>
      </div>
      
      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Tất cả đánh giá ({reviews.length})
        </h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-gray-800">{review.userName}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className="flex mb-2">
                  {renderStars(review.rating)}
                </div>
                <div className="text-gray-700 mb-4">{review.comment}</div>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleLikeReview(review._id)}
                    className="flex items-center text-gray-500 hover:text-blue-600 transition"
                    disabled={likeReviewMutation.isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {review.likes > 0 && <span>{review.likes}</span>}
                  </button>
                  {userId === review.userId && (
                    <button 
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-500 hover:text-red-600 transition text-sm"
                      disabled={deleteReviewMutation.isLoading}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;