// Tạo file OrderSuccessPage.jsx
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OrderSuccess  = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-6 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-4">Đặt hàng thành công!</h1>
        <p className="mb-6">Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là: <span className="font-semibold">{orderId}</span></p>
        <p className="text-gray-600 mb-8">Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess ;