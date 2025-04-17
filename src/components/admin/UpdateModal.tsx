import { useState } from "react"
import { Button } from "@mui/material"
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded"
import Stack from "@mui/material/Stack"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProduct } from "../../useQuery/api/api"
import { toast } from "react-toastify"

const UpdateModal = ({ setOpenModal, product }) => {
  const queryClient = useQueryClient()

  // Initialize formData with product data
  const [formData, setFormData] = useState({
    name: product?.name || "",
    importPrice: product?.importPrice || "",
    salePrice: product?.salePrice || "",
    stock: product?.stock || "",
    description: product?.description || "",
    categoryName: product?.categoryName || "",
    brand: product?.brand || "",
    images: [],
    existingImages: product?.images || [] // Lưu trữ các ảnh hiện có
  })

  const mutation = useMutation({
    mutationFn: ({ productId, data }) => updateProduct(productId, data), // Nhận object và truyền đúng tham số
    onSuccess: (response) => {
      console.log("Update success response:", response)
      toast("Cập nhật sản phẩm thành công", { position: "top-right" })
      queryClient.invalidateQueries(["products"])
      setOpenModal(false)
    },
    onError: (error) => {
      console.error(
        "Lỗi khi cập nhật sản phẩm:",
        error.response?.data || error.message
      )
      toast(`Lỗi: ${error.response?.data?.message || "Server gặp sự cố"}`, {
        position: "top-right",
        type: "error"
      })
    }
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "images" && files) {
      const filesArray = Array.from(files)
      console.log("Selected files:", filesArray)

      setFormData((prev) => ({
        ...prev,
        images: filesArray,
        // Tạo URL cho preview của các file mới được chọn
        previewImages: filesArray.map((file) => URL.createObjectURL(file)),
        // Đánh dấu là có ảnh mới được chọn
        hasNewImages: true
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.salePrice || !formData.categoryName) {
      toast("Vui lòng điền đầy đủ thông tin bắt buộc", {
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

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file) => data.append("images", file))
    } else if (formData.existingImages && formData.existingImages.length > 0) {
      data.append("keepExistingImages", "true")
      formData.existingImages.forEach((imageUrl, index) => {
        data.append(`existingImages[${index}]`, imageUrl)
      })
    }

    console.log("Payload being sent:")
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`)
    }

    const productId = product._id
    console.log("Sending update to product ID:", productId)
    await mutation.mutateAsync({ productId, data }) // Truyền object đúng cách
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Cập nhật Sản Phẩm</h2>

        <form onSubmit={handleUpdateProduct}>
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
          <input
            type="text"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          <label className="block mb-2 mt-2">Thương hiệu:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          <label className="block mb-2 mt-2">Hình ảnh:</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          {/* Hiển thị ảnh đã chọn hoặc ảnh hiện tại */}
          {formData.hasNewImages &&
          formData.previewImages &&
          formData.previewImages.length > 0 ? (
            <div>
              <p className="mt-2 mb-1 text-sm text-gray-600">
                Ảnh mới đã chọn:
              </p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {formData.previewImages.map((src, index) => (
                  <img
                    key={`new-${index}`}
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded-lg shadow"
                  />
                ))}
              </div>
            </div>
          ) : formData.existingImages && formData.existingImages.length > 0 ? (
            <div>
              <p className="mt-2 mb-1 text-sm text-gray-600">Ảnh hiện tại:</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {formData.existingImages.map((src, index) => (
                  <img
                    key={`existing-${index}`}
                    src={src}
                    alt={`Current ${index}`}
                    className="w-20 h-20 object-cover rounded-lg shadow"
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* Action buttons */}
          <Stack className="mt-5" direction="row" spacing={2}>
            <Button
              type="button"
              onClick={() => setOpenModal(false)}
              variant="outlined"
              startIcon={<CloseRoundedIcon />}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              endIcon={<AddCircleRoundedIcon />}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  )
}

export default UpdateModal
