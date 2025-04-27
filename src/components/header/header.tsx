import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaUserCircle } from "react-icons/fa"
import { fetchProducts } from "../../useQuery/api/api"
import { useProduct } from "../../useQuery/hooks/useProduct"
import { useMutation, useQuery } from "@tanstack/react-query"
import { searchName, logoutUser } from "../../useQuery/api/api"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import Menu from "./headerComponent/Menu"
import Search from "./headerComponent/Search"

const Header: React.FC = () => {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    setCurrentLanguage(lang)
    setDropdownOpen(false) // đóng dropdown sau khi chọn
  }

  return (
    <header>
      {/* Top Banner */}
      <div className="flex justify-around bg-emerald-50 text-black text-center py-4 text-sm">
        <div>
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
          <span className="font-bold cursor-pointer ml-2">ShopNow</span>
        </div>
        <div>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1"
          >
            <span>{currentLanguage}</span>
            <span>▼</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 sm:right-10 md:right-10 lg:right-72 bg-white shadow-md mt-2 rounded w-24 z-20">
              <p
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => changeLanguage("en")}
              >
                English
              </p>
              <p
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => changeLanguage("vi")}
              >
                Vietnamese
              </p>
            </div>
          )}
        </div>
      </div>
      <div>
        {/* Navbar */}
        <nav className="flex justify-between space-x-5 items-center px-8 py-4 shadow-md bg-orange-100">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl justify-center items-center flex ml-16"
          >
            <img
              className="w-16 h-16"
              src="/images/LogoShop.png"
              alt="logo"
            />
            <p className="text-md font-bold text-emerald-400 font-mono">
              FreshFruit
            </p>
          </Link>

          {/* Menu */}
          <Menu />

          {/* Search & Icons */}
          <Search />
        </nav>
      </div>
    </header>
  )
}

export default Header
