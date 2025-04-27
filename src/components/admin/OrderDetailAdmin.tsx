import React from 'react';
import { useGetOrderDetails } from '../../useQuery/hooks/useGetOrderDetails';
import { useParams } from 'react-router-dom';
import SidebarAdmin from './../sidebar/sideBarAdmin';

const OrderDetails = () => {
    const {id} = useParams()
    const {data, isLoading, isError} = useGetOrderDetails(id)
    console.log(data)
    return (
        <div className="flex justify-around mx-auto px-4 py-6">
            <div>
                <SidebarAdmin/>
            </div>
            <div className="max-w-4xl w-full mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Chi tiết đơn hàng #{data?.order._id}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Thông tin khách hàng</h2>
                    <p className="text-gray-600">Tên: {data?.order.name}</p>
                    <p className="text-gray-600">Địa chỉ: {data?.order.address}</p>
                    <p className="text-gray-600">Số điện thoại: {data?.order.phone}</p>
                    </div>
                    <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Thông tin đơn hàng</h2>
                    <p className="text-gray-600">Ngày đặt: {new Date((data?.order.createdAt)).toLocaleString("vi-VN")}</p>
                    <p className="text-gray-600">
                        Trạng thái:{' '}
                        <span
                        className={`ml-2 px-2 py-1 rounded text-white ${
                            data?.order.status === 'Đã giao hàng' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        >
                        {data?.order.status}
                        </span>
                    </p>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Sản phẩm</h2>
                    <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-gray-700">Sản phẩm</th>
                            <th className="p-3 text-gray-700">Số lượng</th>
                            <th className="p-3 text-gray-700">Đơn giá</th>
                            <th className="p-3 text-gray-700">Thành tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                            {data?.order.products.map((item) => {
                                const price = item.product?.salePrice ?? 0;
                                return (
                                <tr key={item._id} className="border-b">
                                    <td className="p-3 text-gray-600">{item.productName}</td>
                                    <td className="p-3 text-gray-600">{item.quantity}</td>
                                    <td className="p-3 text-gray-600">{price.toLocaleString()} VNĐ</td>
                                    <td className="p-3 text-gray-600">{(item.quantity * price).toLocaleString()} VNĐ</td>
                                </tr>
                                );
                            })}
                            </tbody>
                    </table>
                    </div>
                </div>

                {/* Tổng cộng */}
                <div className="flex justify-end">
                    <div className="text-right">
                    <p className="text-lg font-semibold text-gray-700">Tổng cộng:</p>
                    <p className="text-2xl font-bold text-gray-800">{data?.order.totalPrice.toLocaleString()} VNĐ</p>
                    </div>
                </div>

                {/* Nút hành động */}
                <div className="mt-6 flex justify-end space-x-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    In đơn hàng
                    </button>
                    <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Hủy đơn hàng
                    </button>
                </div>
            </div>
        </div>
  );
};

export default OrderDetails;