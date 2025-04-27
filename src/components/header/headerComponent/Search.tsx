import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { searchName, logoutUser } from "../../../useQuery/api/api";
import { toast } from "react-toastify";
import { useProduct } from "../../../useQuery/hooks/useProduct";
import { useTranslation } from "react-i18next";

const Search = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [dropdownOpenMb, setDropdownOpenMb] = useState(false);
  const {t} = useTranslation()

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Đăng xuất thành công", { position: "top-right" });
      navigate("/login");
      navigate(0);
    },
    onError: (error) => {
      console.log("err", error);
    },
  });

  const { data } = useProduct();

  const { data: products, refetch } = useQuery({
    queryKey: ["searchProducts", searchItem],
    queryFn: () => searchName({ name: searchItem }),
    enabled: false,
  });

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      {/* Search Bar - Hidden on mobile, visible on larger screens */}
      <div className="relative hidden sm:block">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-40 sm:w-64 h-10 p-2 rounded-md text-sm"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <span className="absolute right-3 top-2 text-gray-500">
          <button onClick={() => refetch()}>🔍</button>
        </span>
        {searchItem && (
          <ul className="absolute z-10 bg-white shadow-md rounded w-full mt-2 max-h-60 overflow-y-auto">
            {Array.isArray(products?.products) && products.products.length > 0 ? (
              products.products.map((product) => (
                <Link
                  to={`/productdetail/${product.id}`}
                  key={product.id}
                  className="p-2 hover:bg-gray-200 flex items-center space-x-4 text-sm"
                >
                  <img
                    crossOrigin="anonymous"
                    src={product.images[0]}
                    alt=""
                    className="w-8 h-8 sm:w-10 sm:h-10"
                  />
                  <span>{product.name}</span>
                </Link>
              ))
            ) : (
              <li className="p-2 text-sm">Không có sản phẩm phù hợp</li>
            )}
          </ul>
        )}
      </div>

      {/* Icons */}
      <Link to="/wishlist" className="text-lg">❤️</Link>
      <Link to="/cart" className="text-lg">🛒</Link>

      {/* User Profile - Desktop */}
      {user ? (
        <div className="relative">
          <div className="hidden sm:flex items-center space-x-2">
            <img
              crossOrigin="anonymous"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              src={user?.avatar}
              alt=""
            />
            <span className="text-sm">👋 {user.name}</span>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-sm"
            >
              <span>▼</span>
            </button>
            {dropdownOpen && (
              <ul className="absolute top-10 right-0 bg-white shadow-md rounded w-44 z-20 p-2 space-y-2 text-sm">
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

          {/* User Profile - Mobile */}
          <div className="flex sm:hidden items-center">
            <button onClick={() => setDropdownOpenMb(!dropdownOpenMb)}>
              <img
                crossOrigin="anonymous"
                className="w-8 h-8 rounded-full object-cover"
                src={user?.avatar}
                alt=""
              />
            </button>
          </div>
          {dropdownOpenMb && (
            <ul className="absolute top-12 right-0 bg-white shadow-md rounded w-44 z-20 p-2 space-y-2 text-sm">
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
      ) : (
        <Link to="/login" className="text-blue-500 hover:underline text-sm">
          {t("menu.signin")}
        </Link>
      )}
    </div>
  );
};

export default Search;