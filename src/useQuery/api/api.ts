import axios from "axios"
import {
  RegisterCredentials,
  LoginCredentials,
  LoginResponse,
  CartItem,
  Order
} from "../user/auth"

// axios.interceptors.request.use((config) => {
//   config.headers["ngrok-skip-browser-warning"] = "true";
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

const API_BASE_URL = "http://localhost:8000/api";
// const API_BASE_URL = "https://a873-116-101-151-64.ngrok-free.app/api"

export const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`)
  return response.data
}

export const fetchProductDetail = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/products/${id}`)
  return response.data
}

export const registerUser = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_BASE_URL}/auth/signup`,
    credentials
  )
  return response.data
}

export const loginUser = async (credential: LoginCredentials) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/signin`,
    credential
  )
  return response.data
}

export const logoutUser = async () => {
  const token = localStorage.getItem("token")
  const response = await axios.post(`${API_BASE_URL}/auth/signout`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const createOrders = async (orderData: Order) => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.post(
      `${API_BASE_URL}/orders/create`,
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
      `${API_BASE_URL}/products/${productId}`,
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
  const res = await axios.post(`${API_BASE_URL}/products`, formData, {
    headers: {
      "Content-Type": "multipart/form-data" // ❗ Rất quan trọng
    }
  })
  return res.data
}

export const listOrder = async () => {
  try {
    const token = localStorage.getItem("token")

    const response = await axios.get(`${API_BASE_URL}/orders/`, {
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
    `${API_BASE_URL}/orders/${id}/status`,
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
      `${API_BASE_URL}/products/search?q=${name}`
    )
    return response.data
  } catch (error) {
    return []
  }
}

export const listCategory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`)
    return response.data
  } catch (error) {
    return []
  }
}

export const listUser = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user`)
    return response.data
  } catch (error) {
    return []
  }
}

export const deleteProduct = async (productId: string) => {
  const response = await axios.delete(
    `${API_BASE_URL}/products/${productId}`
  )
  return response.data
}

export const getOrderUser = async () => {
  const userStr = localStorage.getItem("user")
  const email = userStr ? JSON.parse(userStr).email : null
  const token = localStorage.getItem("token")
  const response = await axios.get(
    `${API_BASE_URL}/orders/email?email=${email}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const getOrderDetail = async({id}) => {
  const token = localStorage.getItem("token")
  const response = await axios.get(`${API_BASE_URL}/orders/${id}`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}



export const getlistCoupon = async () => {
  const response = await axios.get(`${API_BASE_URL}/coupons`)
  return response.data
}

export const applyCoupon = async (code: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/coupons/validate`,
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
    `${API_BASE_URL}/auth/update`,
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
    `${API_BASE_URL}/auth/role/${userId}`,
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
    `${API_BASE_URL}/categories`,
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
    `${API_BASE_URL}/categories/${id}`
  )
  return response.data
}

export const changeStatusCoupon = async ({ id, newStatus }) => {
  const response = await axios.patch(
    `${API_BASE_URL}/coupons/${id}`,
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
  const response = await axios.get(`${API_BASE_URL}/products/category/${categoryName}`)
  return response.data
}

export const paymentMomo = async (payload) => {
  try { 
    const response = await axios.post(`${API_BASE_URL}/payment/momo`, {
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
    const response = await axios.post(`${API_BASE_URL}/payment/vnpay`, {
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
  const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}`, formData, 
    {
      headers:{
        "Content-Type": "application/json"
      }
    }
  )
  return response.data
}

export const addCoupon = async(formData) => {
  const response = await axios.post(`${API_BASE_URL}/coupons/create`, formData, {
    headers:{
      "Content-Type": "application/json"
    }
  })
  return response.data
}

export const fetchDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
  return response.data.data;
};

export const fetchProductPerformance = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/products`);
  return response.data.data;
};

//review API
export const fetchReviews = async ({productId}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews/${productId}`);
    console.log("Fetched reviews:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { reviews: [], averageRating: 0 }; // Default fallback value
  }
};

export const addReview = async (reviewData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reviews`, reviewData);
    console.log("Add Review Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Add Review Error:", error);
    throw error;
  }
};

export const deleteReview = async ({ reviewId, userId }) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    console.error("Delete Review Error:", error);
    throw error;
  }
};

export const likeReview = async (reviewId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reviews/${reviewId}/like`);
    return response.data;
  } catch (error) {
    console.error("Like Review Error:", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email
    })
    return response.data
  } catch (error) {
    console.error("Error sending forgot password email:", error)
    throw error
  }
};

export const resetPassword = async ({ email, code, password, confirmPassword }) => {
  const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { email, code, password, confirmPassword });
  return response.data;
};