import React, { useState, useEffect } from "react"
import Rating from "../rating/Rating"
import ColorPicker from "../rating/pickColor"
import SizePicker from "../rating/pickSize"
import QuantitySelector from "../rating/ButtonQuanti"
import LikePicker from "../rating/pickLike"
import { useProductDetail } from "../../useQuery/hooks/useProductDetail"
import { useParams } from "react-router-dom"
import { Product } from "../../useQuery/user/auth"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

const DetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data } = useProductDetail(id)
  const [rating, setRating] = useState(4)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null)
  if (!data) {
    return <></>
  }
  if (selectedImage === null) {
    setSelectedImage(data.product.images[0])
  }

  const handleAddToCart = (product: Product) => {
    const newItem: CartItem = { product, quantity: 1 }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")

    const updatedCart = [...existingCart]
    const existingIndex = updatedCart.findIndex(
      (item) => item.product._id === data.product._id
    )

    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += quantity
    } else {
      updatedCart.push(newItem)
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart))

    toast.success("🛒 Sản phẩm đã được thêm vào giỏ hàng!", {
      position: "top-right"
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 sm:flex-col">
      <div className="space-x-2">
        <span className="text-sm text-zinc-500">Account /</span>
        <span className="text-sm text-zinc-500">Gaming /</span>
        <span className="text-sm">{data.product.name}</span>
      </div>
      <div className="flex flex-col gap-4 space-x-10 md:flex-row md:gap-10 lg:justify-center px-4">
          <div className="flex flex-col overflow-x-auto gap-2 md:flex-col">
            <img
              crossorigin="anonymous"
              className="w-[1200px] h-96 object-cover rounded-lg shadow-md bg-zinc-100"
              src={selectedImage}
              alt="Selected"
            />
            <div className="flex flex-row overflow-x-auto gap-2 mt-4 justify-center">
              {data?.product.images.map((img, index) => (
                <img
                  crossorigin="anonymous"
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  className={`w-16 h-16 object-cover rounded-lg shadow-sm cursor-pointer border-2 ${
                    selectedImage === img ? "border-red-500" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
        </div>
        <div className="w-full md:max-w-96 space-y-3">
          <h1 className="font-bold text-lg">{data.product.name}</h1>
          <Rating
            rating={rating}
            onRatingChange={setRating}
            data={data.product.stock}
          />
          <p className="font-semibold text-lg">{data.product.salePrice}₫</p>
          <div className="border-b-black border-b">
            <p className="text-sm line-clamp-4">{data.product.description}</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
            />
            {data.product && (
              <button
                onClick={() => handleAddToCart(data.product)}
                className="w-32 bg-red-400 text-white rounded-md"
              >
                Buy Now
              </button>
            )}
            <LikePicker />
          </div>
          <div className="border rounded-lg w-full">
            <div className="flex items-center p-4 border-b flex-wrap gap-2">
              <span className="text-2xl">🚚</span>
              <div className="ml-3">
                <h3 className="font-semibold">Free Delivery</h3>
                <a href="#" className="text-blue-600 underline text-sm">
                  Enter your postal code for Delivery Availability
                </a>
              </div>
            </div>
            <div className="flex items-center p-4 flex-wrap gap-2">
              <span className="text-2xl">🔄</span>
              <div className="ml-3">
                <h3 className="font-semibold">Return Delivery</h3>
                <p className="text-sm">
                  Free 30 Days Delivery Returns.{" "}
                  <a href="#" className="text-blue-600 underline">
                    Details
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPage
