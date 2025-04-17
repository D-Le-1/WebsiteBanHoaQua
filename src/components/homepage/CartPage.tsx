import { useState, useEffect } from "react"
import QuantitySelector from "../rating/ButtonQuanti"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const CartPage = () => {
  const [cart, setCart] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [user, setUser] = useState<number>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"))
    setUser(savedUser)
  }, [])

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]") || []
    setCart(savedCart)
  }, [])

  const calculateTotals = () => {
    const newSubtotal = cart.reduce(
      (acc, item) => acc + item.product.salePrice * item.quantity,
      0
    )
    localStorage.setItem("Total", JSON.stringify(newSubtotal))
    setSubtotal(newSubtotal)
    setTotal(newSubtotal)
  }

  const updateQuantity = (id: String, quantity) => {
    const updatedCart = cart.map((item) =>
      item.product._id === id ? { ...item, quantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.product._id !== id)
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    toast.success("🗑️ Sản phẩm đã bị xóa khỏi giỏ hàng!", {
      position: "top-right"
    })
  }
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 flex flex-col md:flex-row lg:flex-col">
      <div className="space-x-2">
        <span className="text-sm text-zinc-500">Account /</span>
        <span className="text-sm">Cart</span>
      </div>
      <div className="flex flex-col md:flex-row lg:flex-row border-b pb-3 font-semibold justify-around">
        <span>Product</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Subtotal</span>
      </div>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">
          🛒 Giỏ hàng của bạn đang trống.
        </p>
      ) : (
        cart.map((item) => (
          <div
            key={item.product._id}
            className="flex flex-col md:flex-row lg:flex-row items-center justify-around p-4 mt-4 shadow-sm"
          >
            <div className="flex items-center space-x-5 -ml-5">
              <div className="relative group">
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="absolute top-0 -left-1 bg-red-500 text-white font-bold text-[9px] h-4 w-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  X
                </button>
                <img
                  crossorigin="anonymous | use-credentials"
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12"
                />
              </div>
              <span>{item.product.name}</span>
            </div>
            <span className="-ml-[80px]">${item.product.salePrice}</span>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.product._id, parseInt(e.target.value) || 1)
              }
              className="w-16 h-10 border rounded-md text-center"
              min="1"
            />
            <span className="pl-5">
              ${Math.round(item.product.salePrice * item.quantity)}
            </span>
          </div>
        ))
      )}
      <div className="flex justify-around mt-6 space-x-44">
        <Link to="/" className="border px-4 py-2 rounded font-bold shadow-lg">
          Return To Shop
        </Link>
        <button
          className="border px-4 py-2 rounded font-bold text-black shadow-lg"
          onClick={calculateTotals}
        >
          Update Cart
        </button>
      </div>
      <div className="flex space-x-96">
        <div className="space-x-5 flex">
          <input
            type="text"
            placeholder="Coupon Code"
            className="w-64 h-12 p-5 rounded-md border"
          />
          <button className="bg-red-400 w-44 h-12 rounded-md text-white">
            Apply Coupon
          </button>
        </div>
        <div className="w-96 h-66 p-3 space-y-3 border rounded-md border-black">
          <h2 className="font-bold">Cart Total</h2>
          <div className="border-0 border-b border-black h-10">
            <span>Subtotal: </span>
            <span className="pl-60">${Math.round(subtotal)}</span>
          </div>
          <div className="border-0 border-b h-10 border-black">
            <span>Shipping: </span>
            <span className="pl-60">Free</span>
          </div>
          <div className="border-0 border-b h-10 border-black">
            <span>Total: </span>
            <span className="pl-[265px]">${Math.round(total)}</span>
          </div>
          {user ? (
            <button
              onClick={() => navigate("/checkout")}
              className="w-40 h-10 bg-red-400 ml-24 rounded-md text-white text-sm"
            >
              Proceed Checkout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-40 h-10 bg-red-400 ml-24 rounded-md text-white text-sm"
            >
              Proceed Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartPage
