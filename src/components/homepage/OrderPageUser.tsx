import React, { useState, useEffect } from "react"
import Sidebar from "./../sidebar/sideBar"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Box,
  Typography
} from "@mui/material"
import { useOrderUser } from "../../useQuery/hooks/useOrderUser"
import { editStatus } from "../../useQuery/api/api"
import { useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from 'react-toastify'
import Pagination from "../sidebar/paginationComponent"
import { useTranslation } from "react-i18next"

const OrderPageUser = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data, isLoading } = useOrderUser()
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(5) // Số đơn hàng mỗi trang
  
  // State để lưu trữ đơn hàng phân trang
  const [paginatedOrders, setPaginatedOrders] = useState([])
  const [totalPages, setTotalPages] = useState(0)

  const mutation = useMutation({
    mutationFn: editStatus,
    onSuccess: () => {
      toast.success("Hủy đơn hàng thành công")
      queryClient.invalidateQueries(["orderusers"])
    },
    onError: () => {
      toast.error("Không thể hủy đơn hàng")
    }
  })

  // Cập nhật dữ liệu phân trang khi data thay đổi hoặc trang hiện tại thay đổi
  useEffect(() => {
    if (data && data.orders) {
      // Tính tổng số trang
      const calculatedTotalPages = Math.ceil(data.orders.length / ordersPerPage)
      setTotalPages(calculatedTotalPages)
      
      // Tính chỉ mục bắt đầu và kết thúc cho trang hiện tại
      const indexOfLastOrder = currentPage * ordersPerPage
      const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
      
      // Lấy các đơn hàng cho trang hiện tại
      const currentOrders = data.orders.slice(indexOfFirstOrder, indexOfLastOrder)
      setPaginatedOrders(currentOrders)
    }
  }, [data, currentPage, ordersPerPage])

  // Hàm xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const changeHandle = (id, currentStatus) => {
    const newStatus = "cancelled"
    mutation.mutate({ id, newStatus })
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 flex flex-col md:flex-row lg:flex-col">
      <div className="space-x-2">
        <span className="text-sm text-zinc-500">Home /</span>
        <span className="text-sm">My Orders</span>
      </div>
      <div className="flex space-x-10">
        <Sidebar />
        <div className="flex-1">
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Typography>Loading orders...</Typography>
            </Box>
          ) : paginatedOrders && paginatedOrders.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "aqua" }}>
                      <TableCell className="border border-gray-300 p-2">
                        {t("my_account.orders.name")}
                      </TableCell>
                      <TableCell className="border border-gray-300 p-2">
                        {t("my_account.orders.address")}
                      </TableCell>
                      <TableCell className="border border-gray-300 p-2">
                        {t("my_account.orders.email")}
                      </TableCell>
                      <TableCell className="border border-gray-300 p-2">
                        {t("my_account.orders.phone")}
                      </TableCell>
                      <TableCell className="border border-gray-300 p-2">
                        {t("my_account.orders.totalPrice")}
                      </TableCell>
                      <TableCell className="border border-gray-300 p-2">
                        {t("my_account.orders.product")}
                      </TableCell>
                      <TableCell className="border border-gray-300 p-2">
                        {t("my_account.orders.paymentMethod")}
                      </TableCell>
                      <TableCell className="border border-gray-300 p-2">
                        {t("my_account.orders.status")}
                      </TableCell>
                      <TableCell className="border border-gray-300 p-2">
                        {t("my_account.orders.action")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="border border-gray-300 p-2">
                          {order.name}
                        </TableCell>
                        <TableCell className="border border-gray-300 p-2">
                          {order.address}
                        </TableCell>
                        <TableCell className="border border-gray-300 p-2">
                          {order.email}
                        </TableCell>
                        <TableCell className="border border-gray-300 p-2">
                          {order.phone}
                        </TableCell>
                        <TableCell className="border border-gray-300 p-2">
                          {order.totalPrice}
                        </TableCell>
                        <TableCell className="border border-gray-300 p-2">
                          {order.products.map((product) => (
                            <div
                              key={product._id}
                              className="flex space-x-3 items-center w-56"
                            >
                              <img
                                crossOrigin="anonymous"
                                className="w-10 h-10"
                                src={product.productImage}
                                alt=""
                              />
                              <span className="text-sm font-semibold">
                                {product.productName}
                              </span>
                              <span className="text-sm font-semibold">
                                x{product.quantity}
                              </span>
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="border border-gray-300 p-2">
                          {order.paymentMethod}
                        </TableCell>
                        <TableCell className="border border-gray-300 p-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => changeHandle(order._id, order.status)}
                            variant="contained"
                            color="error"
                            disabled={mutation.isLoading || order.status !== "pending"}
                            size="small"
                          >
                            {mutation.isLoading ? "Cancelling..." : "Cancel"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Component Pagination */}
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              
              {/* Hiển thị thông tin về phân trang */}
              <div className="text-sm text-gray-500 text-center mt-2">
                Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, data?.orders?.length || 0)} of {data?.orders?.length || 0} orders
              </div>
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Typography>No orders found.</Typography>
            </Box>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderPageUser