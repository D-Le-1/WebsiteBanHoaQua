import React, { useState, useEffect } from "react"
import SidebarAdmin from "../sidebar/sideBarAdmin"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack
} from "@mui/material"
import { useOrder } from "../../useQuery/hooks/useOrder"
import { editStatus } from "../../useQuery/api/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

const OrderPage: React.FC = () => {
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: number }>()
  const { data } = useOrder()
  const [selectedOrder, setSelectedOrder] = useState<any>(null) // state cho sản phẩm được chọn
  const [searchQuery, setSearchQuery] = useState("") // state cho tìm kiếm
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 6

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const filteredOrders = data?.orders.filter((order) =>
    order.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders?.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  )

  // Tính tổng số trang
  const totalPages = Math.ceil(
    (filteredOrders?.length || 0) / ordersPerPage
  )

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }
    const mutation = useMutation({
      mutationFn: editStatus,
      onSuccess: () => {
        queryClient.invalidateQueries(["orders"]) // Làm mới danh sách
        toast.success("Đã thay đổi trạng thái", { position: "top-right" })
      }
    })

    const changeStatusHandle = (id: number, currentStatus: string) => {
      const newStatus = currentStatus === "pending" ? "confirmed" : "pending"
      mutation.mutate({ id, newStatus })
    }

  return (
    <div className="p-6">
      <div className="flex space-x-10">
        <SidebarAdmin />
        <div className="w-screen">
          <h1 className="text-2xl font-bold mb-4">List Order</h1>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "aqua" }}>
                  <TableCell className="border border-gray-300 p-2">
                    ID
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Name
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Address
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Email
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Phone
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    totalPrice
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Products
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Pay Method
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Status
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentOrders?.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="border border-gray-300 p-2">
                      {order._id}
                    </TableCell>
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
                          className="flex space-x-3 items-center"
                        >
                          <img
                            crossorigin="anonymous | use-credentials"
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
                      {order.status}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span
                          className={`px-3 py-1 h-fit text-white text-sm font-semibold 
                                                ${
                                                  order.status === "pending"
                                                    ? "bg-yellow-500"
                                                    : "bg-green-500"
                                                }`}
                        >
                          {order.status === "pending"
                            ? "⏳ Pending"
                            : "✅ Completed"}
                        </span>
                        <Button
                          onClick={() =>
                            changeStatusHandle(order._id, order.status)
                          }
                          variant="contained"
                          color={
                            order.status === "pending" ? "success" : "warning"
                          }
                          className="transition-transform transform hover:scale-105"
                        >
                          {order.status === "pending" ? "Hoàn tất" : "Đặt lại"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      {/* Phân trang */}
      <div className="flex justify-center mt-6">
            <div className="flex space-x-2 z-auto">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="contained"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    variant={
                      currentPage === pageNumber ? "contained" : "outlined"
                    }
                  >
                    {pageNumber}
                  </Button>
                )
              )}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="contained"
              >
                Next
              </Button>
            </div>
          </div>
    </div>
  )
}

export default OrderPage
