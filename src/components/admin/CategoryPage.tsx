import SidebarAdmin from "../sidebar/sideBarAdmin"
import { useCategory } from "../../useQuery/hooks/useCategory"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { addCategory, deleteCategory } from "../../useQuery/api/api"
import { toast } from "react-toastify"
import { useState } from "react"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded"
import { useParams } from "react-router-dom"

const CategoryPage = () => {
  const { id } = useParams
  const queryClient = useQueryClient()
  const { data } = useCategory()
  const [openModal, setOpenModal] = useState(false)

  const mutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Xóa danh mục thành công")
      queryClient.invalidateQueries(["category"])
    },
    onError: () => {
      toast.error("Không thể xóa danh mục")
    }
  })

  const deleteHandle = (id: string) => {
    mutation.mutate(id)
  }

  return (
    <div className="p-6">
      <div className="flex space-x-10">
        <SidebarAdmin />
        <div className="w-screen">
          <h1 className="text-2xl font-bold mb-4">List Category</h1>
          <Stack direction="row" spacing={2} className="mb-4">
            <Button
              onClick={() => setOpenModal(true)}
              variant="contained"
              color="primary"
            >
              Add Category
            </Button>
            {openModal && <AddModal setOpenModal={setOpenModal} />}
          </Stack>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "aqua" }}>
                  <TableCell className="border border-gray-300 p-2">
                    Name
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Description
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.categories?.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="border border-gray-300 p-2">
                      {category.name}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {category.description}
                    </TableCell>
                    <TableCell className="border space-x-5 border-gray-300 p-2">
                      <Button
                        variant="outlined"
                        startIcon={<CloseRoundedIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteHandle(category._id)}
                        variant="contained"
                        startIcon={<CloseRoundedIcon />}
                      >
                        Delete
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

const AddModal = ({ setOpenModal }) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })
  const mutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      toast.success("Tao category thanh cong")
      queryClient.invalidateQueries(["category"])
      setOpenModal(false)
    },
    onError: () => {
      toast.error("Category da ton tai")
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const addCategoryHandle = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.description) {
      toast("Vui lòng điền đầy đủ thông tin bắt buộc", {
        position: "top-right",
        type: "error"
      })
      return
    }
    const data = new FormData()
    data.append("name", formData.name)
    data.append("description", formData.description)
    mutation.mutate(data)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Thêm Danh Mục</h2>
        <label className="block mb-2">
          Tên danh mục: <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <label className="block mb-2 mt-2">
          Mô tả: <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
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
            onClick={addCategoryHandle}
            variant="contained"
            endIcon={<AddCircleRoundedIcon />}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Đang thêm..." : "Thêm"}
          </Button>
        </Stack>
      </div>
    </div>
  )
}

export default CategoryPage
