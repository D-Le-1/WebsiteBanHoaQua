import React from "react"
import { useCoupon } from "../../useQuery/hooks/useCoupon"
import SidebarAdmin from "../sidebar/sideBarAdmin"
import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { changeStatusCoupon } from "../../useQuery/api/api"
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
            <Button variant="contained" color="primary">
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
    </div>
  )
}

export default CouponPage
