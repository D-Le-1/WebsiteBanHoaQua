// DetailPage.jsx - Fixing review system integration
import React, { useState, useEffect } from "react"
import Rating from "../sideComponent/Rating"
import ColorPicker from "../sideComponent/pickColor"
import SizePicker from "../sideComponent/pickSize"
import QuantitySelector from "../sideComponent/ButtonQuanti"
import LikePicker from "../sideComponent/pickLike"
import { useProductDetail } from "../../useQuery/hooks/useProductDetail"
import { useParams } from "react-router-dom"
import { Product } from "../../useQuery/user/auth"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { useProduct } from "../../useQuery/hooks/useProduct"
import { Link } from "react-router-dom"
import ReviewSystem from "../sideComponent/reviewComponent"
import { useGetListReview } from "../../useQuery/hooks/useGetListReview"
import {useScrollToTop} from "../../useQuery/hooks/useScrollToTop"

const DetailPage = () => {
  useScrollToTop();
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useProductDetail(id)
  const [user, setUser] = useState(null)
  const { 
    data: reviewData, 
    isLoading: isReviewsLoading, 
    isError: isReviewsError 
  } = useGetListReview(id)
  const [quantity, setQuantity] = useState(1)
  const {data: relateProduct} = useProduct()
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    console.log("Saved User:", savedUser);
    setUser(savedUser);
  }, []);

  useEffect(() => {
    if (data?.product) {
      setSelectedImage(data.product.images[0])
    }
  }, [data?.product])

  const handleAddToCart = (product) => {
    const newItem = { product, quantity }

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

    window.dispatchEvent(new Event("cartChanged"));

    toast.success("🛒 Sản phẩm đã được thêm vào giỏ hàng!", {
      position: "top-right"
    })
  }


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error?.message || 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.'}
        </div>
      </div>
    );
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
              crossOrigin="anonymous"
              className="w-[1200px] h-96 object-cover rounded-lg shadow-md bg-zinc-100"
              src={selectedImage}
              alt="Selected"
            />
            <div className="flex flex-row overflow-x-auto gap-2 mt-4 justify-center">
              {data?.product.images.map((img, index) => (
                <img
                  crossOrigin="anonymous"
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
          <p className="font-semibold text-lg">{data.product.salePrice}₫</p>
          <p className="font-bold text-green-500 text-lg">Hiện còn: {data.product.stock}</p>
          <div className="border-b-black border-b">
            <p className="text-sm line-clamp-4">{data.product.description}</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <QuantitySelector
              quantity={quantity}
              stock={data.product.stock}
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
      {/* Pass the review data correctly to ReviewSystem */}
      <ReviewSystem 
        productId={data.product._id} 
        userId={user ? user.userId : null} 
        userName={user ? user.name : "Guest"} 
        reviewList={reviewData} 
      />
      <RelateProduct product={data.product}/>
    </div>
  )
}

function RelateProduct({ product }) {
  const {t} = useTranslation()
  const { data: relateProduct } = useProduct(); // tất cả sản phẩm

  const relatedProducts = relateProduct?.products?.filter(
    (p) => p.categoryName === product.categoryName && p._id !== product._id
  );
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-orange-500 mb-5">{t("productPage.relateProduct")}</h2>
      <div className="grid grid-cols-4 gap-4">
        {relatedProducts?.map((p) => (
          <Link
            key={p._id}
            to={`/productdetail/${p._id}`}
            className="bg-white p-3 border rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              crossOrigin="anonymous"
              src={p.images[0]}
              alt={p.name}
              className="h-40 w-full object-cover rounded"
            />
            <h3 className="mt-2 text-md font-semibold text-gray-800">{p.name}</h3>
            <p className="text-red-600 font-bold">{p.salePrice.toLocaleString()}₫</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default DetailPage