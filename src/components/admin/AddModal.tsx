import { useState } from "react"
import { Button } from "@mui/material"
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded"
import Stack from "@mui/material/Stack"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "../../useQuery/api/api"
import { useCategory } from "../../useQuery/hooks/useCategory"
import { toast } from "react-toastify"

const AddModal = ({ setOpenModalAdd }) => {
  const queryClient = useQueryClient()
  const { data: categories } = useCategory()
  const [formData, setFormData] = useState({
    name: "",
    importPrice: "",
    salePrice: "",
    stock: "",
    description: "",
    categoryName: "",
    brand: "",
    images: [],
    previewImages: []
  })

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast("Thêm sản phẩm thành công", { position: "top-right" })
      queryClient.invalidateQueries(["products"])
      setOpenModalAdd(false) // Đóng modal sau khi thêm thành công
    },
    onError: (error) => {
      console.error("Lỗi khi gọi API:", error)
      toast("Thêm sản phẩm thất bại", { position: "top-right" })
    }
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "images" && files) {
      // Convert FileList to an array and create preview URLs
      const filesArray = Array.from(files)
      console.log("Selected files:", filesArray)

      setFormData((prev) => ({
        ...prev,
        images: filesArray,
        previewImages: filesArray.map((file) => URL.createObjectURL(file))
      }))
    } else {
      // Handle other text inputs
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleAddProduct = (e) => {
    e.preventDefault()

    // Kiểm tra thông tin bắt buộc
    if (!formData.name || !formData.salePrice || !formData.categoryName) {
      toast("Vui lòng điền đầy đủ thông tin bắt buộc", {
        position: "top-right",
        type: "error"
      })
      return
    }

    // Kiểm tra có ảnh không
    if (!formData.images || formData.images.length === 0) {
      toast("Vui lòng chọn ít nhất một ảnh", {
        position: "top-right",
        type: "error"
      })
      return
    }

    const data = new FormData()
    data.append("name", formData.name)
    data.append("importPrice", formData.importPrice)
    data.append("salePrice", formData.salePrice)
    data.append("description", formData.description)
    data.append("stock", formData.stock)
    data.append("categoryName", formData.categoryName)
    data.append("brand", formData.brand)

    // Append each image file
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file) => {
        data.append("images", file) // Use "images" to match multer field name
      })
    }

    // Log FormData entries for debugging
    console.log("Form data entries:")
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`)
    }

    mutation.mutate(data) // Send just the FormData object
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Thêm Sản Phẩm</h2>
        <label className="block mb-2">
          Tên sản phẩm: <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <label className="block mb-2 mt-2">
          Giá bán: <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="salePrice"
          value={formData.salePrice}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <label className="block mb-2 mt-2">Giá nhập:</label>
        <input
          type="text"
          name="importPrice"
          value={formData.importPrice}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <label className="block mb-2 mt-2">Mô tả:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <label className="block mb-2 mt-2">Số lượng tồn kho:</label>
        <input
          type="text"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <label className="block mb-2 mt-2">
          Danh mục: <span className="text-red-500">*</span>
        </label>
        <select
          name="categoryName"
          value={formData.categoryName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="">Chọn danh mục</option>
          {categories?.categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}  
        </select>

        <label className="block mb-2 mt-2">Thương hiệu:</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <label className="block mb-2 mt-2">
          Hình ảnh: <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        {/* Display image previews */}
        {formData.previewImages && formData.previewImages.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded-lg shadow"
              />
            ))}
          </div>
        )}

        <Stack className="mt-5" direction="row" spacing={2}>
          <Button
            onClick={() => setOpenModalAdd(false)}
            variant="outlined"
            startIcon={<CloseRoundedIcon />}
          >
            Hủy
          </Button>
          <Button
            onClick={handleAddProduct}
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

export default AddModal
