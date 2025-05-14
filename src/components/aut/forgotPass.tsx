import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../../useQuery/api/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setEmail('');
      setLoading(false);
      toast.success('Mã xác nhận đã được gửi đến email của bạn', { position: 'top-right' });
      navigate('/reset');
    },
    onError: (error) => {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || 'Đã xảy ra lỗi');
      } else {
        setError('Đã xảy ra lỗi');
      }
    },
  });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email) {
        setError('Vui lòng nhập địa chỉ email');
        return;
        }
        setLoading(true);
        mutation.mutate(email);
    };
  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500 rounded-full p-3">
            <FaEnvelope className="text-white text-2xl" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Quên mật khẩu</h2>
        
        {!emailSent ? (
          <>
            <p className="text-gray-600 text-center mb-6">
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Địa chỉ email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="example@gmail.com"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex justify-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Gửi mã xác nhận'
                )}
              </button>
              
              <div className="text-center">
                <Link to="/login" className="text-blue-500 hover:text-blue-700 text-sm">
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Mã xác nhận đã được gửi đến <span className="font-semibold">{email}</span>
              </p>
              <p className="text-gray-600 text-sm">
                Vui lòng kiểm tra hộp thư của bạn và tiếp tục đặt lại mật khẩu tại trang tiếp theo.
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Link
                to="/reset-password"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                Đặt lại mật khẩu
              </Link>
              
              <button
                onClick={() => setEmailSent(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                Gửi lại mã
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword