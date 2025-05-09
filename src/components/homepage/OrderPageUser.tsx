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
  Stack
} from "@mui/material"
import { useOrderUser } from "../../useQuery/hooks/useOrderUser"
import { editStatus } from "../../useQuery/api/api"
import { useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from 'react-toastify';

const OrderPageUser = () => {
  const {id} = useParams()
  const queryClient = useQueryClient()
  const { data } = useOrderUser()
  const mutation = useMutation({
    mutationFn: editStatus,
    onSuccess: () => {
      toast.success("Hủy đơn hàng thành công")
      queryClient.invalidateQueries(["orderusers"])
    },
    onError: () =>{
      toast.error("Không thể hủy đơn hàng")
    }
  })

  const changeHandle = (id: string, currentStatus: string) => {
    const newStatus = "cancelled"; // Bạn có thể thêm logic điều kiện nếu cần
    mutation.mutate({ id, newStatus });
  };
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 flex flex-col md:flex-row lg:flex-col">
      <div className="space-x-2">
        <span className="text-sm text-zinc-500">Home /</span>
        <span className="text-sm">My Orders</span>
      </div>
      <div className="flex">
        <Sidebar />
        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "aqua" }}>
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
                {data?.orders.map((order) => (
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
                    <TableCell>
                      <Button
                        onClick={() => changeHandle(order._id, order.status)}
                        variant="contained"
                        color="error"
                        disabled={mutation.isLoading || order.status !== "pending"}
                      >
                        {mutation.isLoading ? "Cancelling..." : "Cancel"}
                      </Button>
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

export default OrderPageUser
