import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaUserCircle } from "react-icons/fa"
import { fetchProducts } from "../../useQuery/api/api"
import { useProduct } from "../../useQuery/hooks/useProduct"
import { useMutation, useQuery } from "@tanstack/react-query"
import { searchName, logoutUser } from "../../useQuery/api/api"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

function Search() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchItem, setSearchItem] = useState<string>("")
  const [cartQuantity, setCartQuantity] = useState<number>(0)
  const [dropdownOpenMb, setDropdownOpenMb] = useState(false)



  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      toast.success("Đăng xuất thành công", { position: "top-right" })
      navigate("/login")
      navigate(0)
    },
    onError: (error) => {
      console.log("err", error)
    }
  })

  const { data } = useProduct()

  const { data: products, refetch } = useQuery({
    queryKey: ["searchProducts", searchItem],
    queryFn: () => searchName({ name: searchItem }),
    enabled: false
  })

  return (
    <div className="flex items-center space-x-4 rounded-md mr-20">
      <div className="relative hidden md:block">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-64 h-10 p-2"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <span className="absolute right-3 top-2 text-gray-500">
          <button onClick={() => refetch()}>🔍</button>
        </span>
        {searchItem && (
          <ul className="absolute z-10 bg-white shadow-md rounded w-full mt-2">
            {Array.isArray(products?.data) && products.data.length > 0 ? (
              products.data.map(
                (
                  product // ❌ Loại bỏ `.data`
                ) => (
                  <Link
                    to={`/productdetail/${product.id}`}
                    key={product.id}
                    className="p-2 hover:bg-gray-200 flex items-center space-x-4"
                  >
                    <img src={product.images[0]} alt="" className="w-10 h-10" />
                    <span>{product.name}</span>
                  </Link>
                )
              )
            ) : (
              <li className="p-2">Không có sản phẩm phù hợp</li>
            )}
          </ul>
        )}
      </div>
      <Link to="/wishlist">❤️</Link>
      <Link to="/cart">🛒</Link>
      {user ? (
        <div className="relative">
          <div className="hidden md:flex items-center space-x-3">
            <img
              crossorigin="anonymous | use-credentials"
              className="w-10 h-10 rounded-full object-cover"
              src={user?.avatar}
              alt=""
            />
            <span>👋 {user.name}</span>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative"
              >
                <span>▼</span>
              </button>
              {dropdownOpen && (
                <ul className="absolute top-10 right-0 bg-white shadow-md rounded w-44 z-20 p-2 space-y-2">
                  {(user.role === "admin" || user.role === "manager") && (
                    <li className="hover:text-red-400">
                      <Link to="/admin/product">Admin</Link>
                    </li>
                  )}
                  <li className="hover:text-red-400">
                    <Link to="/profile">Manage My Account</Link>
                  </li>
                  <li className="hover:text-red-400">
                    <Link to="/orders">My Order</Link>
                  </li>
                  <li className="hover:text-red-400">
                    <Link>My Cancellations</Link>
                  </li>
                  <li className="hover:text-red-400">
                    <Link>My Reviews</Link>
                  </li>
                  <li className="hover:text-red-400">
                    <button
                      onClick={() => mutation.mutate()}
                      disabled={mutation.isLoading}
                    >
                      {mutation.isLoading ? "Logging out..." : "Logout"}
                    </button>
                  </li>
                </ul>
              )}
          </div>
        </div>
        </div>
      ) : (
        <Link to="/login" className="text-blue-500 hover:underline">
          Đăng nhập
        </Link>
      )}
      <div className="flex md:hidden items-center">
        <button onClick={() => setDropdownOpenMb(!dropdownOpenMb)}>
          <img
            crossorigin="anonymous | use-credentials"
            className="w-10 h-10 rounded-full object-cover"
            src={user?.avatar}
            alt=""
          />
        </button>
      </div>
      {dropdownOpenMb && (
        <ul className="absolute top-32 right-5 bg-white shadow-md rounded w-44 z-20 p-2 space-y-2">
          {(user.role === "admin" || user.role === "manager") && (
            <li className="hover:text-red-400">
              <Link to="/admin/product">Admin</Link>
            </li>
          )}
          <li className="hover:text-red-400">
            <Link to="/profile">Manage My Account</Link>
          </li>
          <li className="hover:text-red-400">
            <Link to="/orders">My Order</Link>
          </li>
          <li className="hover:text-red-400">
            <Link>My Cancellations</Link>
          </li>
          <li className="hover:text-red-400">
            <Link>My Reviews</Link>
          </li>
          <li className="hover:text-red-400">
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Logging out..." : "Logout"}
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}

function Menu() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const { t, i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])
  return (
    <div className="relative">
      <button
        className="md:hidden p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      <ul className="hidden lg:flex space-x-10 text-gray-600 font-medium">
        <li><Link to="/">{t("menu.home")}</Link></li>
        <li><Link to="/contact">{t("menu.contact")}</Link></li>
        <li><Link to="/about">{t("menu.about")}</Link></li>
        <li>
          {user ? (
            <Link to="/profile">{t("menu.myaccount")}</Link>
          ) : (
            <Link to="/signin">{t("menu.signin")}</Link>
          )}
        </li>
      </ul>
      {menuOpen && (
        <ul className="absolute top-12 left-0 bg-white shadow-md w-48 p-4 rounded-md space-y-4 md:hidden text-gray-700 font-medium z-50">
          <li><Link to="/">{t("menu.home")}</Link></li>
          <li><Link to="/contact">{t("menu.contact")}</Link></li>
          <li><Link to="/about">{t("menu.about")}</Link></li>
          <li>
            {user ? (
              <Link to="/profile">{t("menu.myaccount")}</Link>
            ) : (
              <Link to="/signin">{t("menu.signin")}</Link>
            )}
          </li>
        </ul>
      )}
  </div>
    )
  }

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
              crossorigin="anonymous"
              className="w-16 h-16"
              src="images\LogoShop.png"
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
