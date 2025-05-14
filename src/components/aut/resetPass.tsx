// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../../useQuery/api/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

    const mutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
        setLoading(false);
        toast.success('Mật khẩu đã được đặt lại thành công', { position: 'top-right' });
        navigate('/login');
        },
        onError: (error) => {
        setLoading(false);
        if (axios.isAxiosError(error)) {
            setErrors({ ...errors, server: error.response?.data.message });
        } else {
            setErrors({ ...errors, server: 'Đã xảy ra lỗi' });
        }
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Reset error for the field being changed
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const { email, code, password, confirmPassword } = formData;

        if (!email) {
            setErrors((prev) => ({ ...prev, email: 'Vui lòng nhập địa chỉ email' }));
            return;
        }

        if (!code) {
            setErrors((prev) => ({ ...prev, code: 'Vui lòng nhập mã xác nhận' }));
            return;
        }

        if (!password) {
            setErrors((prev) => ({ ...prev, password: 'Vui lòng nhập mật khẩu mới' }));
            return;
        }

        if (password !== confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
            return;
        }

        setLoading(true);
        mutation.mutate({ email, code, password, confirmPassword });
        };
 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500 rounded-full p-3">
            <FaLock className="text-white text-2xl" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Đặt lại mật khẩu</h2>
        <p className="text-gray-600 text-center mb-6">
          {step === 1 
            ? 'Nhập email và mã xác nhận để tiếp tục' 
            : 'Tạo mật khẩu mới cho tài khoản của bạn'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">Địa chỉ email</label>
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="example@gmail.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Mã xác nhận */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">Mã xác nhận</label>
                <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.code ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="Nhập mã 6 chữ số"
                maxLength={6}
                />
                {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>

            {/* Mật khẩu mới */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">Mật khẩu mới</label>
                <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">Xác nhận mật khẩu mới</label>
                <div className="relative">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Nút gửi */}
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
                'Đặt lại mật khẩu'
                )}
            </button>
            </form>

      </div>
    </div>
  );
};

export default ResetPassword;