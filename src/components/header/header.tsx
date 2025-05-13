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
  const [currentLanguage, setCurrentLanguage] = useState("vi")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    setCurrentLanguage(lang)
    setDropdownOpen(false) // đóng dropdown sau khi chọn
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top Banner */}
      <div>
        {/* Navbar */}
        <nav className="flex justify-between space-x-5 items-center px-8 py-2 shadow-md bg-gradient-to-tr from-orange-400 to-orange-200">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl justify-center items-center flex ml-16"
          >
            <img
              className="w-16 h-16"
              src="/images/LogoShop.png"
              alt="logo"
            />
            <p className="font-bold text-white font-mono">
              FreshFruit
            </p>
          </Link>

          {/* Menu */}
          <Menu />

           <div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1"
              >
                <span>{currentLanguage}</span>
                <span>▼</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-28 sm:right-80 md:right-[450px] lg:right-[650px] bg-white shadow-md mt-2 rounded w-24 z-20">
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
          {/* Search & Icons */}
          <Search />
        </nav>
      </div>
    </header>
  )
}

export default Header
