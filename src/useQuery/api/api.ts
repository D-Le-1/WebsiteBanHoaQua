import axios from "axios"
import {
  RegisterCredentials,
  LoginCredentials,
  LoginResponse,
  CartItem,
  Order
} from "../user/auth"

export const fetchProducts = async () => {
  const response = await axios.get("http://localhost:8000/api/products")
  return response.data
}

export const fetchProductDetail = async (id: string) => {
  const response = await axios.get(`http://localhost:8000/api/products/${id}`)
  return response.data
}

export const registerUser = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `http://localhost:8000/api/auth/signup`,
    credentials
  )
  return response.data
}

export const loginUser = async (credential: LoginCredentials) => {
  const response = await axios.post(
    `http://localhost:8000/api/auth/signin`,
    credential
  )
  return response.data
}

export const logoutUser = async () => {
  const token = localStorage.getItem("token")
  const response = await axios.post(`http://localhost:8000/api/auth/signout`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const createOrders = async (orderData: Order) => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.post(
      `http://localhost:8000/api/orders/create`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    )
    return response.data
  } catch (error) {
    if (error.response) {
      console.error(`❌ API lỗi ${error.response.status}:`, error.response.data)
      console.log("Request headers:", error.config?.headers)
    } else {
      console.error("❌ API lỗi:", error.message)
    }
    throw error
  }
}

export const CityPick = async () => {
  const response = await axios.get("https://provinces.open-api.vn/api/")
  return response.data
}

export const updateProduct = async (productId, formData) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/products/${productId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    )
    return response.data
  } catch (error) {
    console.error("API error:", error.response?.data || error.message)
    throw error
  }
}

export const createProduct = async (formData) => {
  const res = await axios.post("http://localhost:8000/api/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data" // ❗ Rất quan trọng
    }
  })
  return res.data
}

export const listOrder = async () => {
  try {
    const token = localStorage.getItem("token")

    const response = await axios.get("http://localhost:8000/api/orders/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    return null
  }
}

export const editStatus = async ({ id, newStatus }) => {
  const response = await axios.patch(
    `http://localhost:8000/api/orders/${id}/status`,
    { status: newStatus },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
  return response.data
}

export const searchName = async ({ name }) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/products/search?q=${name}`
    )
    return response.data
  } catch (error) {
    return []
  }
}

export const listCategory = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/categories`)
    return response.data
  } catch (error) {
    return []
  }
}

export const listUser = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/auth/user`)
    return response.data
  } catch (error) {
    return []
  }
}

export const deleteProduct = async (productId: string) => {
  const response = await axios.delete(
    `http://localhost:8000/api/products/${productId}`
  )
  return response.data
}

export const getOrderUser = async () => {
  const userStr = localStorage.getItem("user")
  const email = userStr ? JSON.parse(userStr).email : null
  const token = localStorage.getItem("token")
  const response = await axios.get(
    `http://localhost:8000/api/orders/email?email=${email}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const getlistCoupon = async () => {
  const response = await axios.get(`http://localhost:8000/api/coupons`)
  return response.data
}

export const applyCoupon = async (code: string) => {
  const response = await axios.post(
    `http://localhost:8000/api/coupons/validate`,
    {
      code
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
  return response.data
}

export const editProfile = async (data) => {
  const token = localStorage.getItem("token")
  const response = await axios.patch(
    "http://localhost:8000/api/auth/update",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const changeRole = async ({ userId, role }) => {
  const token = localStorage.getItem("token")
  const response = await axios.patch(
    `http://localhost:8000/api/auth/role/${userId}`,
    { role },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const addCategory = async (formData) => {
  const response = await axios.post(
    "http://localhost:8000/api/categories",
    formData,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
  return response.data
}

export const deleteCategory = async (id) => {
  const response = await axios.delete(
    `http://localhost:8000/api/categories/${id}`
  )
  return response.data
}

export const changeStatusCoupon = async ({ id, newStatus }) => {
  const response = await axios.patch(
    `http://localhost:8000/api/coupons/${id}`,
    { status: newStatus },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
  return response.data
}

export const getProductByCategory = async ({categoryName}) => {
  const response = await axios.get(`http://localhost:8000/api/products/category/${categoryName}`)
  return response.data
}

export const paymentMomo = async (payload) => {
  try { 
    const response = await axios.post('http://localhost:8000/api/payment/momo', {
      amount: payload.amount,
      orderInfo: payload.orderInfo,
      orderData: payload.orderData // Thêm thông tin đơn hàng đầy đủ
    });
    
    console.log('MoMo payment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thanh toán MoMo:', error);
    throw error;
  }
};


export const paymentVnpay = async (payload) => {
  try {
    const response = await axios.post("http://localhost:8000/api/payment/vnpay", {
      amount: payload.amount,
      orderInfo: {
        productName: payload.orderInfo.productName,
      },
      orderData: payload.orderData, // Gửi orderData
    });

    console.log("VNPay payment response:", response.data);

    if (response.data.success) {
      window.location.href = response.data.paymentUrl;
    }

    return response.data;
  } catch (error) {
    console.error("Lỗi khi thanh toán VNPay:", error);
    throw error;
  }
};

export const editCategory = async(categoryId, formData) => {
  const response = await axios.put(`http://localhost:8000/api/categories/${categoryId}`, formData, 
    {
      headers:{
        "Content-Type": "application/json"
      }
    }
  )
  return response.data
}
