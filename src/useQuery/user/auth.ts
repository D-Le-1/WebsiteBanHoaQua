export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    name: string
    email: string
  }
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
  brand: string
  stock: number
}

export interface Order {
  name: string
  email: string
  phone: string
  address: string
  items: {
    productId: number
    productName: string
    quantity: number
  }
}
