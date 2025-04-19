// Tạo file OrderFailedPage.jsx
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OrderFailedPage = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-6 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">Đặt hàng thất bại!</h1>
        <p className="mb-6">Đã xảy ra lỗi trong quá trình thanh toán: <span className="font-semibold">{error || 'Lỗi không xác định'}</span></p>
        <p className="text-gray-600 mb-8">Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFailedPage;