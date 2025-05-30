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
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box
} from "@mui/material"
import { useOrder } from "../../useQuery/hooks/useOrder"
import { Link } from "react-router-dom"
import { editStatus } from "../../useQuery/api/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

const OrderPage: React.FC = () => {
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: number }>()
  const { data } = useOrder()
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all") // Thêm state cho bộ lọc trạng thái
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 6

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter]) // Reset trang khi thay đổi điều kiện tìm kiếm hoặc bộ lọc

  // Lọc đơn hàng dựa trên từ khóa tìm kiếm và trạng thái
  const filteredOrders = data?.orders.filter((order) => {
    const matchesName = order.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesName && matchesStatus;
  });

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
    const nextStatusMap: Record<string, string> = {
      pending: "confirmed",
      confirmed: "shipping",
      shipping: "delivered",
      delivered: "pending",
    };
  
    const newStatus = nextStatusMap[currentStatus] || "pending";
    mutation.mutate({ id, newStatus });
  };

  // Lấy danh sách các trạng thái có trong dữ liệu
  const allStatuses = data?.orders 
    ? Array.from(new Set(data.orders.map(order => order.status)))
    : [];

  return (
    <div className="p-6">
      <div className="flex space-x-10">
        <SidebarAdmin />
        <div className="w-screen">
          <h1 className="text-2xl font-bold mb-4">List Order</h1>
          
          {/* Thêm bộ lọc và tìm kiếm */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Tìm kiếm theo tên"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="status-filter-label">Trạng thái</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {allStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
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
                        <Button variant="outlined">
                            <Link to={`/admin/orders/${order._id}`}>Detail</Link>
                        </Button>
                        <Button
                          onClick={() => changeStatusHandle(order._id, order.status)}
                          variant="contained"
                          color="primary"
                          className="transition-transform w-28 transform hover:scale-105"
                          disabled={order.status === "delivered" || order.status === "cancelled"}
                        >
                          Cập nhật
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