import SidebarAdmin from "../sidebar/sideBarAdmin"
import { useProduct } from "../../useQuery/hooks/useProduct"
import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import AddModal from "./AddModal"
import UpdateModal from "./UpdateModal"
import EditRoundedIcon from "@mui/icons-material/EditRounded"
import DeleteIcon from "@mui/icons-material/Delete"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import { deleteProduct } from "../../useQuery/api/api"
import BeenhereIcon from "@mui/icons-material/Beenhere"
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
  TextField
} from "@mui/material"
import { useParams } from "react-router-dom"

const AdminProductPage: React.FC = () => {
  const { productId } = useParams()
  const queryClient = useQueryClient()
  const { data } = useProduct()
  const [openModal, setOpenModal] = useState(false)
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null) // state cho sản phẩm được chọn
  const [searchQuery, setSearchQuery] = useState("") // state cho tìm kiếm
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6

  const filteredProducts = data?.products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )

  const totalPages = Math.ceil(
    (filteredProducts?.length || 0) / productsPerPage
  )

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"])
      toast.success("Product deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete product")
    }
  })

  const handleDelete = (productId: string) => {
    mutation.mutate(productId)
  }

  return (
    <div className="p-6">
      <div className="flex space-x-10">
        <SidebarAdmin />
        <div className="w-screen">
          <h1 className="text-2xl font-bold mb-4">Admin Product List</h1>

          <div className="mb-4">
            <TextField
              label="Search by Name"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
          </div>

          <button
            onClick={() => setOpenModalAdd(true)}
            className="mb-4 p-2 bg-blue-500 text-white rounded"
          >
            Add Product
          </button>
          {openModalAdd && <AddModal setOpenModalAdd={setOpenModalAdd} />}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#77a0f1" }}>
                  <TableCell className="border border-gray-300 p-2">
                    ID
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Name
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Sale Price
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Import Price
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Description
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Stock
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Sold
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Brand
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Category
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentProducts?.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="border border-gray-300 p-2">
                      {product._id}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2 flex">
                      <img
                        crossorigin="anonymous | use-credentials"
                        src={product.images[0]}
                        className="w-20 h-20"
                        alt=""
                      />
                      <p>{product.name}</p>
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      ${product.salePrice}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      ${product.importPrice}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {product.description}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {product.stock}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {product.sold}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {product.brand}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      {product.categoryName}
                    </TableCell>
                    <TableCell className="border border-gray-300 p-2">
                      <Stack
                        className="mt-5"
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Button
                          variant="contained"
                          startIcon={<EditRoundedIcon />}
                          onClick={() => {
                            setSelectedProduct(product)
                            setOpenModal(true)
                          }}
                        >
                          Edit
                        </Button>
                        {openModal && (
                          <UpdateModal
                            setOpenModal={setOpenModal}
                            product={selectedProduct}
                          />
                        )}
                        <Button
                          disabled={mutation.isLoading}
                          onClick={() => handleDelete(product._id)}
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                        >
                          {mutation.isLoading ? "Deleting..." : "Delete"}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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
      </div>
    </div>
  )
}

export default AdminProductPage
