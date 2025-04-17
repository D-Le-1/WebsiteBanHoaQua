import React from "react"
import { useState } from "react"
import {
  FiHome,
  FiLayout,
  FiFileText,
  FiBarChart2,
  FiTable
} from "react-icons/fi"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { Link } from "react-router-dom"

const SidebarAdmin: React.FC = () => {
  return (
    <div
      className={`rounded-md w-96 bg-gray-900 text-white h-screen ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="p-4 text-lg font-semibold border-b border-gray-700">
        Dashboard
      </div>
      <nav className="mt-4">
        <Link
          to="/admin/dashboard"
          className="flex items-center p-3 hover:bg-gray-700"
        >
          <FiHome className="mr-3" /> Dashboard
        </Link>
        <Link
          to="/admin/product"
          className="flex items-center p-3 hover:bg-gray-700"
        >
          <ShoppingCartIcon className="mr-3" /> Product
        </Link>
        <Link
          to="/admin/order"
          className="flex items-center p-3 hover:bg-gray-700"
        >
          <FiFileText className="mr-3" /> Orders
        </Link>
        <Link
          to="/admin/category"
          className="flex items-center p-3 hover:bg-gray-700"
        >
          <FiBarChart2 className="mr-3" /> Category
        </Link>
        <Link
          to="/admin/user"
          className="flex items-center p-3 hover:bg-gray-700"
        >
          <FiTable className="mr-3" /> Users
        </Link>
        <Link
          to="/admin/coupon"
          className="flex items-center p-3 hover:bg-gray-700"
        >
          <FiLayout className="mr-3" /> Coupons
        </Link>
      </nav>
    </div>
  )
}

export default SidebarAdmin
