// src/pages/Dashboard.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchProductPerformance } from '../../useQuery/api/api';
import axios from 'axios';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  ArrowUpCircle, ArrowDownCircle, Package, ShoppingCart,
  DollarSign, TrendingUp, Truck, CheckCircle, Clock, XCircle,
  AlertTriangle 
} from 'lucide-react';
import SidebarAdmin from '../sidebar/sideBarAdmin';

const DashboardPage = () => {
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true
  });

  const { 
    data: productPerformance, 
    isLoading: productsLoading, 
    error: productsError 
  } = useQuery({
    queryKey: ['productPerformance'],
    queryFn: fetchProductPerformance,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true
  });

  // Loading state
  const isLoading = statsLoading || productsLoading;
  
  // Error handling
  const error = statsError?.message || productsError?.message;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl font-medium text-gray-700">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-medium">
            Lỗi khi tải dữ liệu dashboard. Vui lòng thử lại sau.
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats || !productPerformance) {
    return null;
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Prepare data for order status chart
  const orderStatusData = [
    { name: 'Chờ xác nhận', value: stats.ordersByStatus.pending, color: '#F59E0B' },
    { name: 'Đã xác nhận', value: stats.ordersByStatus.confirmed, color: '#3B82F6' },
    { name: 'Đang giao', value: stats.ordersByStatus.shipping, color: '#8B5CF6' },
    { name: 'Đã giao', value: stats.ordersByStatus.delivered, color: '#10B981' },
    { name: 'Đã hủy', value: stats.ordersByStatus.cancelled, color: '#EF4444' }
  ];

  const paymentMethodData = stats.paymentMethodStats.map((item, index) => ({
    name: item._id === 'COD' ? 'Tiền mặt' : 
          item._id === 'VNPAY' ? 'VNPAY' : 
          item._id === 'MoMo' ? 'MoMo' : item._id,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  // Format revenue data for the line chart
  const revenueData = stats.dailyRevenue.map(item => ({
    date: new Date(item._id).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    revenue: item.revenue / 1000000, // Convert to millions
    orders: item.count
  }));

  return (
    <div className="flex space-x-10 mx-auto px-4 py-6">
      <SidebarAdmin/>
      <div className='container'>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between">
                <div>
                <p className="text-sm font-medium text-gray-500">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="text-blue-500" size={24} />
            </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between">
                <div>
                <p className="text-sm font-medium text-gray-500">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <DollarSign className="text-green-500" size={24} />
            </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between">
                <div>
                <p className="text-sm font-medium text-gray-500">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                </div>
                <Package className="text-purple-500" size={24} />
            </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between">
                <div>
                <p className="text-sm font-medium text-gray-500">Đơn chờ xác nhận</p>
                <p className="text-2xl font-bold text-amber-500">{stats.ordersByStatus.pending}</p>
                </div>
                <Clock className="text-amber-500" size={24} />
            </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between">
                <div>
                <p className="text-sm font-medium text-gray-500">Đơn đang giao</p>
                <p className="text-2xl font-bold text-blue-600">{stats.ordersByStatus.shipping}</p>
                </div>
                <Truck className="text-blue-600" size={24} />
            </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Doanh thu 30 ngày qua</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${value}M`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => {
                    return name === 'revenue' 
                        ? [formatCurrency(value * 1000000), 'Doanh thu'] 
                        : [value, 'Đơn hàng'];
                    }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu (triệu VND)" stroke="#3B82F6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" name="Số đơn hàng" stroke="#10B981" strokeWidth={2} />
                </LineChart>
                </ResponsiveContainer>
            </div>
            </div>

            {/* Order Status Chart */}
            <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Trạng thái đơn hàng</h2>
            <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                    {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Payment Methods Chart */}
            <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Phương thức thanh toán</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                    {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Hiệu suất danh mục</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={productPerformance.categoryPerformance.slice(0, 5)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" name="Số sản phẩm" dataKey="totalProducts" fill="#3B82F6" />
                    <Bar yAxisId="right" name="Số lượng đã bán" dataKey="totalSold" fill="#10B981" />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Đơn hàng gần đây</h2>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                    <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.substring(order._id.length - 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                            order.status === 'shipping' ? 'bg-purple-100 text-purple-800' : 
                            'bg-red-100 text-red-800'}`}>
                        {order.status === 'pending' ? 'Chờ xác nhận' :
                        order.status === 'confirmed' ? 'Đã xác nhận' :
                        order.status === 'shipping' ? 'Đang giao' :
                        order.status === 'delivered' ? 'Đã giao' : 'Đã hủy'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Selling Products */}
            <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sản phẩm bán chạy</h2>
            <div className="overflow-y-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã bán</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {productPerformance.topSellingProducts.map((product) => (
                    <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                            <img crossOrigin='anonymous' className="h-10 w-10 rounded object-cover" src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/100'} alt={product.name} />
                            </div>
                            <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.categoryName}</div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sold}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.salePrice)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>

            {/* Low Stock Products */}
            <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sản phẩm sắp hết hàng</h2>
            <div className="overflow-y-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {productPerformance.lowStockProducts.map((product) => (
                    <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                            <img crossOrigin='anonymous' className="h-10 w-10 rounded object-cover" src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/100'} alt={product.name} />
                            </div>
                            <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.categoryName}</div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${product.stock === 0 ? 'bg-red-100 text-red-800' : 
                            product.stock < 5 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-orange-100 text-orange-800'}`}>
                            {product.stock === 0 ? 'Hết hàng' : product.stock < 5 ? 'Rất thấp' : 'Thấp'}
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;