import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react" // hoặc dùng bất kỳ icon lib nào

const Sidebar: React.FC = () => {
  const [active, setActive] = useState("My Profile")
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: "My Profile", path: "/profile" },
    { name: "My Order", path: "/orders" },
    { name: "My Wishlist", path: "/wishlist" },
  ]

  const renderMenu = () => (
    <div className="bg-white md:bg-transparent md:shadow-none shadow-md p-4 md:p-0 w-full md:w-64">
      <h3 className="font-semibold text-black mb-4">Manage My Account</h3>
      {menuItems.map((item) => (
        <div key={item.name} className="mt-2">
          <Link
            to={item.path}
            onClick={() => {
              setActive(item.name)
              setIsOpen(false) // đóng menu trên mobile khi chọn
            }}
            className={`block cursor-pointer ${
              active === item.name
                ? "text-red-500 font-medium"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {item.name}
          </Link>
        </div>
      ))}
    </div>
  )

  return (
    <div className="md:block relative">
      {/* Toggle button on small screen */}
      <button
        className="md:hidden p-2 text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar for md+ or mobile open */}
      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        {renderMenu()}
      </div>
    </div>
  )
}

export default Sidebar
