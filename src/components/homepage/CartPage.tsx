import { useState, useEffect } from "react"
import QuantitySelector from "../rating/ButtonQuanti"
import { Link, useNavigate } from "react-router-dom"
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
import { useTranslation } from "react-i18next"

const CartPage = () => {
  const [cart, setCart] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [user, setUser] = useState<number>(null)
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"))
    setUser(savedUser)
  }, [])

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]") || []
    setCart(savedCart)
  }, [])

  useEffect(() => {
    const calculateTotals = () => {
      const newSubtotal = cart.reduce(
        (acc, item) => acc + item.product.salePrice * item.quantity,
        0
      )
      localStorage.setItem("Total", JSON.stringify(newSubtotal))
      setSubtotal(newSubtotal)
      setTotal(newSubtotal)
    }
  
    calculateTotals()
  }, [cart])

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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#6cdc26" }}>
              <TableCell>{t("cart.product")}</TableCell>
              <TableCell>{t("cart.price")}</TableCell>
              <TableCell>{t("cart.quantity")}</TableCell>
              <TableCell>{t("cart.subtotal")}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.length === 0 ? (
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center text-gray-500">
                  🛒 {t("cart.empty")}.
                </TableCell>
              </TableRow>
                ) : (
                  cart.map((item) => (
                    <TableRow
                      key={item.product._id}
                    >
                      <TableCell>
                          <img
                            crossorigin="anonymous | use-credentials"
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12"
                          />
                          <p>{item.product.name}</p>
                      </TableCell>
                      <TableCell className="-ml-[80px]">{item.product.salePrice}₫</TableCell>
                      <TableCell>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.product._id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 h-10 border rounded-md text-center"
                        min="1"
                      />
                      </TableCell>
                      <TableCell className="pl-5">
                        {Math.round(item.product.salePrice * item.quantity)}₫
                      </TableCell>
                      <TableCell>
                        <Button onClick={()=> removeItem(item.product._id)} variant="contained">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4 sm:gap-6">
        <Link to="/" className="w-full sm:w-auto px-4 py-2 border rounded-md font-bold text-black shadow-lg hover:bg-gray-100 transition-colors text-center">
          {t("cart.return")}
        </Link>
      </div>
      <div className="flex flex-col items-center justify-between md:flex-row gap-10">
        <div className="space-x-5 flex">
          <input
            type="text"
            placeholder={t("cart.coupon_code")}
            className="w-64 h-12 p-5 rounded-md border"
          />
          <button className="bg-red-400 w-44 h-12 rounded-md text-white">
            {t("cart.apply_coupon")}
          </button>
        </div>
        <div className="w-full max-w-md p-4 space-y-4 border rounded-md border-black md:max-w-lg">
          <h2 className="text-lg font-bold md:text-xl">{t("cart.cart_total")}</h2>
          <div className="flex justify-between items-center border-b border-black pb-2">
            <span>{t("cart.subtotal")}:</span>
            <span>{Math.round(subtotal)}₫</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-2">
            <span>{t("cart.shipping")}:</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-2">
            <span>{t("cart.total")}:</span>
            <span>{Math.round(total)}₫</span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(user ? "/checkout" : "/login")}
              className="w-40 px-4 py-2 bg-red-400 rounded-md text-white text-sm hover:bg-red-500 transition-colors md:w-48"
            >
              {t("cart.checkout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
