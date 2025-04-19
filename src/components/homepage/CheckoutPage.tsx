import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { createOrders, applyCoupon } from "../../useQuery/api/api"
import { toast } from "react-toastify"
import { useCity } from "../../useQuery/hooks/useCity"
import { useNavigate } from "react-router-dom"
import { useCoupon } from "../../useQuery/hooks/useCoupon"
import { useTranslation } from "react-i18next"
import { paymentMomo } from "../../useQuery/api/api"
import { paymentVnpay } from "../../useQuery/api/api"

const CheckOutPage = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useCity()
  const [paymentMethod, setPaymentMethod] = useState()
  const [user, setUser] = useState()
  const [total, setTotal] = useState<number>(0)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const { data: dataCoupon } = useCoupon()
  const [formData, setFormData] = useState({
    firstName: "",
    streetAddress: "",
    city: "",
    email: '',
    phone: "",
    paymentMethod: ""
  })
  const [cart, setCart] = useState([])
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null")
    setUser(savedUser)
  }, [])

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email, // Update email when user is available
      }));
    }
  }, [user]);

  useEffect(() => {
    const saveTotal = JSON.parse(localStorage.getItem("Total"))
    setTotal(saveTotal)
  }, [])

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCart(savedCart)
  }, [])

  const vnpayMutation = useMutation({
    mutationFn: paymentVnpay,
    onSuccess: (data) => {
      if (data?.paymentUrl) {
        console.log("Redirecting to Vnpay payment page:", data.paymentUrl);
        window.location.href = data.paymentUrl;
        localStorage.removeItem("cart")
      } else {
        console.error("VNpay payment URL not found:", data);
      }
    }
    ,
    onError: (error) => {
      toast.error("Thanh toán VNPAY thất bại, vui lòng thử lại!");
      console.log("VNPAY payment error: ", error);
    },
  })

  const momoMutation = useMutation({
    mutationFn: paymentMomo,
    onSuccess: (data) => {
      if (data?.payUrl) {
        console.log("Redirecting to MoMo payment page:", data.payUrl); 
        window.location.href = data.payUrl; 
        localStorage.removeItem("cart")
      } else {
        console.error("Momo payment URL not found:", data);
      }
    }
    ,
    onError: (error) => {
      toast.error("Thanh toán Momo thất bại, vui lòng thử lại!");
      console.log("Momo payment error: ", error);
    },
  });


  const mutation = useMutation({
    mutationFn: createOrders,
    onSuccess: (data) => {
      toast.success("Tạo Order thành công", { position: "top-right" })
      localStorage.removeItem("cart")
      setTimeout(() => {
        navigate("/")
      }, 1000)
    },
    onError: (error) => {
      console.log("err", error)
    }
  })

  const couponMutation = useMutation({
    mutationFn: applyCoupon,
    onSuccess: (data) => {
      const discount = (total * data.discount) / 100
      setDiscountAmount(discount)
      toast.success("Áp dụng mã giảm giá thành công", {
        position: "top-right"
      })
    },
    onError: (error) => {
      console.log("err", error)
      toast.error("Áp dụng mã giảm giá thất bại", {
        position: "top-right"
      })
    }
  })

  const handleApplyCoupon = () => {
    if (!selectedCoupon) {
      toast.error("Vui lòng chọn mã giảm giá!")
      return
    }
    couponMutation.mutate(selectedCoupon)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOrder = (e) => {
    e.preventDefault();
  
    // Kiểm tra xem người dùng đã điền đầy đủ thông tin chưa
    if (!formData.firstName.trim() || !formData.streetAddress.trim() || !formData.city.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin trước khi đặt hàng!");
      return;
    }
  
    // Tạo ID cho đơn hàng
    const orderId = `order-${Date.now()}`;
  
    // Tạo dữ liệu đơn hàng
    const OrderData = {
      name: formData.firstName,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.streetAddress}, ${formData.city}`,
      products: cart.map((item) => ({
        product: item.product._id || item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        quantity: item.quantity
      })),
      totalPrice: Math.round(total - discountAmount),
      discountAmount,
      paymentMethod: paymentMethod
    };
  
    if (paymentMethod === "Momo") {

      momoMutation.mutate({
        amount: OrderData.totalPrice,
        orderInfo: {
          orderId,
          productName: cart.map(item => item.product.name).join(", "),
        },
        orderData: OrderData
      });
  
      return;
    }

    if (paymentMethod === "VNPAY") {
      vnpayMutation.mutate({
        amount: OrderData.totalPrice,
        orderInfo: {
          productName: cart.map((item) => item.product.name).join(", "),
        },
        orderData: OrderData, // Gửi toàn bộ OrderData để backend lưu
      });
  
      return;
    }

  
    console.log("OrderData gửi đi:", OrderData);
    mutation.mutate(OrderData);
  };
  

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <div className="space-x-2">
        <span className="text-sm text-zinc-500">Account /</span>
        <span className="text-sm text-zinc-500">My Account /</span>
        <span className="text-sm text-zinc-500">Product /</span>
        <span className="text-sm text-zinc-500">View Cart /</span>
        <span className="text-sm">Checkout</span>
      </div>
      <div className="md:flex">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">Billing Details</h1>
          <p className="text-zinc-400 text-sm">First Name</p>
          <input
            type="text"
            className="w-96 h-12 p-2 shadow-md rounded-md"
            required
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <p className="text-zinc-400 text-sm">Company Name</p>
          <input type="text" className="w-96 h-12 p-2 shadow-md rounded-md" />
          <p className="text-zinc-400 text-sm">Street Address</p>
          <input
            type="text"
            className="w-96 h-12 p-2 shadow-md rounded-md"
            required
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
          />
          <p className="text-zinc-400 text-sm">Apartment, floor, etc</p>
          <input type="text" className="w-96 h-12 p-2 shadow-md rounded-md" />
          <p className="text-zinc-400 text-sm">Town/City</p>
          <select
            className="w-96 h-12 p-2 shadow-md rounded-md"
            name="city"
            value={formData.city}
            onChange={handleChange}
          >
            <option value="">-- Chọn Tỉnh, Thành Phố --</option>
            {data?.map((city) => (
              <option>{city.name}</option>
            ))}
          </select>
          <p className="text-zinc-400 text-sm">Phone Number</p>
          <input
            value={formData.phone}
            name="phone"
            onChange={handleChange}
            type="text"
            className="w-96 h-12 p-2 shadow-md rounded-md"
          />
          <p className="text-zinc-400 text-sm">Email Address</p>
          <input
            value={formData.email}
            onChange={handleChange}
            name="email"
            defaultValue={user?.email}
            type="text"
            className="w-96 h-12 p-2 shadow-md rounded-md"
          />
          <div className="space-x-3">
            <input type="checkbox" />
            <span className="text-sm">
              Save this information for faster check-out next time
            </span>
          </div>
        </div>
        <div className="max-w-xl w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="flex justify-between items-center"
              >
                <img
                  crossorigin="anonymous | use-credentials"
                  src={item.product.images[0]}
                  className="w-10 h-10"
                />
                <span>{item.product.name}</span>
                <span className="text-md">x {item.quantity}</span>
                <span className="font-medium">
                  {Math.round(item.product.salePrice * item.quantity)}₫
                </span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between items-center">
              <span>Subtotal:</span>
              <span className="font-medium">{Math.round(total)}₫</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping:</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total:</span>
              <span value={total}>{Math.round(total - discountAmount)}₫</span>
            </div>
            <hr />
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  onChange={() => setPaymentMethod("COD")}
                />
                <span>COD</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="radio"
                  name="payment"
                  onChange={() => setPaymentMethod("VNPAY")}
                />
                <span>VNPAY</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="radio"
                  name="payment"
                  onChange={() => setPaymentMethod("Momo")}
                />
                <span>Momo</span>
              </label>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div className="flex gap-2">
                <select
                  value={selectedCoupon}
                  onChange={(e) => setSelectedCoupon(e.target.value)}
                >
                  <option value="">Chọn mã giảm giá</option>
                  {dataCoupon?.coupon
                    .filter((coupon) => coupon.status === "active")
                    .map((coupon) => (
                      <option key={coupon._id} value={coupon.code}>
                        {coupon.description} - {coupon.code}
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleApplyCoupon}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  disabled={couponMutation.isLoading}
                >
                  {couponMutation.isLoading
                    ? "Đang áp dụng..."
                    : "Apply Coupon"}
                </button>
              </div>
            </div>
            <button
              onClick={handleOrder}
              disabled={mutation.isLoading}
              className="w-full bg-red-500 text-white py-2 rounded-md mt-4"
            >
              {mutation.isLoading ? "Creating..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckOutPage
