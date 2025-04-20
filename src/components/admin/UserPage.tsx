import React, { useEffect, useState } from "react"
import { useUser } from "../../useQuery/hooks/useUser"
import SidebarAdmin from "../sidebar/sideBarAdmin"
import { useMutation } from "@tanstack/react-query"
import { changeRole } from "../../useQuery/api/api"
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
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { toast } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"

const UserPage = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useUser()
  const [role, setRole] = useState()

  useEffect(() => {
    const roleData = localStorage.getItem("user")
    if (roleData) {
      setRole(JSON.parse(roleData))
    }
  }, [])

  const mutation = useMutation({
    mutationFn: changeRole,
    onSuccess: () => {
      toast.success("Thay đổi vai trò thành công")
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (err) => {
      toast.error("Không thể thay đổi vai trò")
    }
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading users</div>
  }

  const changeRoleHandle = (userId, currentRole) => {
    const newRole = currentRole === "user" ? "manager" : "user"
    mutation.mutate({ userId, role: newRole })
  }

  return (
    <div className="p-6">
      <div className="flex space-x-10">
        <SidebarAdmin />
        <div className="w-screen">
          <h1 className="text-2xl font-bold mb-4">List User</h1>
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
                    Phone
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Address
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Email
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Role
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="border border-gray-300 p-2">
                      {user._id}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {user.name}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {user.phone}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {user.address}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {user.email}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {user.role}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2 text-center">
                      {(role?.role === "admin") && (
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                                onClick={
                                () => changeRoleHandle(user._id, user.role) // Sử dụng user._id thay vì order.id
                                }
                                variant="contained"
                                className="transition-transform transform hover:scale-105"
                                startIcon={<ChangeCircleIcon/>}
                            >
                                Change
                            </Button>
                          </div>
                      )}
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

export default UserPage
