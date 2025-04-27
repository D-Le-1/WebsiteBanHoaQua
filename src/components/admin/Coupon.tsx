import React, { useState } from "react"
import { useCoupon } from "../../useQuery/hooks/useCoupon"
import SidebarAdmin from "../sidebar/sideBarAdmin"
import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { changeStatusCoupon, addCoupon } from "../../useQuery/api/api"
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
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
  Tab
} from "@mui/material"
import { toast } from "react-toastify"

const CouponPage = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useCoupon()
  const [openModal, setOpenModal] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount: 0,
    expiresAt: "",
    usageLimit: 0,
    usedCount: 0,
  })

  const addMutation = useMutation({
    mutationFn: addCoupon,
    onSuccess: () => {
      toast.success("Mã khuyến mại đã được them")
      queryClient.invalidateQueries(["coupons"])
    },
    onError: (err) => {
      toast.error("Không thể them mã khuyến mại")
    }
  })

  const mutation = useMutation({
    mutationFn: changeStatusCoupon,
    onSuccess: () => {
      toast.success("Mã khuyến mại đã được active")
      queryClient.invalidateQueries(["coupons"])
    },
    onError: (err) => {
      toast.error("Không thể đổi status mã khuyến mại")
    }
  })

  const statusChange = (id, currentStatus) => {
    const status = currentStatus === "inactive" ? "active" : "inactive"
    mutation.mutate({ id, newStatus: status })
  }

  const changeHandle = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addHandle = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.description || !formData.discount) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const data = new FormData
    data.append("code", formData.code)
    data.append("description", formData.description)
    data.append("discount", formData.discount)
    data.append("expiresAt", formData.expiresAt)
    data.append("usageLimit", formData.usageLimit)
    data.append("usedCount", formData.usedCount)

    addMutation.mutate(data);
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading users</div>
  }

  return (
    <div className="p-6">
      <div className="flex space-x-10">
        <SidebarAdmin />
        <div className="w-screen">
          <h1 className="text-2xl font-bold mb-4">List Coupon</h1>
          <Stack direction="row" spacing={2} className="mb-4">
            <Button onClick={()=> setOpenModal(true)} variant="contained" color="primary">
              Add Coupon
            </Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "aqua" }}>
                  <TableCell className="border border-gray-300 p-2">
                    Code
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Description
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Discount
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Active
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.coupon.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell className="border border-gray-300 p-2">
                      {coupon.code}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {coupon.description}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {coupon.discount} %
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2 text-center">
                      {coupon.status}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            statusChange(coupon._id, coupon.status)
                          }
                        >
                          Change Status
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => console.log("Delete", coupon._id)}
                        >
                          Delete
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
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Thêm khuyến mãi</h2>
              <label className="block mb-2">
                Code: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={changeHandle}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <label className="block mb-2 mt-2">
                Mô tả: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={changeHandle}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <label className="block mb-2 mt-2">Phần trăm giảm giá:</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={changeHandle}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <label className="block mb-2 mt-2">Hiệu lực:</label>
              <input
                type="text"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={changeHandle}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <label className="block mb-2 mt-2">
                Số lượng: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={changeHandle}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <label className="block mb-2 mt-2">Số lượng người dùng:</label>
              <input
                type="number"
                name="usedCount"
                value={formData.usedCount}
                onChange={changeHandle}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <Stack className="mt-5" direction="row" spacing={2}>
                <Button
                  onClick={() => setOpenModal(false)}
                  variant="outlined"
                  startIcon={<CloseRoundedIcon />}
                >
                  Hủy
                </Button>
                <Button
                  onClick={addHandle}
                  variant="contained"
                  endIcon={<AddCircleRoundedIcon />}
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? "Đang thêm..." : "Thêm"}
                </Button>
              </Stack>
            </div>
          </div>
)}
    </div>
  )
}


export default CouponPage
