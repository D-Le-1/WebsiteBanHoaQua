import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const {t} = useTranslation();
  const [totalItems, setTotalItems] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.length;
    setTotalItems(totalItems);
  };

  useEffect(() => {
    updateCartCount(); // Run when mounted

    // Listen for cart changes
    window.addEventListener("cartChanged", updateCartCount);

    return () => {
      window.removeEventListener("cartChanged", updateCartCount);
    };
  }, []);

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
      localStorage.removeItem("cart");
      localStorage.removeItem("Total");
      localStorage.removeItem("favorite-products");
      toast.success("Đăng xuất thành công", { position: "top-right" });
      navigate("/login");
      navigate(0);
    },
    onError: (error) => {
      console.log("err", error);
    },
  });

  const { data: productData } = useProduct();

  // Fixed filtering - using searchItem instead of undefined 'name' variable
  const filtered = productData?.products?.filter(product => 
    product.name.toLowerCase().includes(searchItem.toLowerCase())
  ) || [];

  const { data: searchResults, refetch, isLoading } = useQuery({
    queryKey: ["searchProducts", searchItem],
    queryFn: () => searchName({ name: searchItem }),
    enabled: false, // Don't run automatically
  });

  // Function to handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchItem.trim()) {
      // Navigate to search results page with search term as query parameter
      navigate(`/search?q=${encodeURIComponent(searchItem.trim())}`);
    }
  };

  // Determine which products to show - API results or filtered local data
  const displayProducts = searchResults?.products || filtered;

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      {/* Search Bar - Hidden on mobile, visible on larger screens */}
      <div className="relative hidden sm:block">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-40 sm:w-64 h-10 p-2 rounded-md text-sm"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-3 top-2 text-gray-500"
          >
            🔍
          </button>
        </form>
        
        {searchItem && (
          <ul className="absolute z-10 bg-white shadow-md rounded w-full mt-2 max-h-60 overflow-y-auto">
            {isLoading ? (
              <li className="p-2 text-sm">Đang tìm kiếm...</li>
            ) : displayProducts && displayProducts.length > 0 ? (
              <>
                {displayProducts.map((product) => (
                  <Link
                    to={`/productdetail/${product._id}`}
                    key={product.id}
                    className="p-2 hover:bg-gray-200 flex items-center space-x-4 text-sm"
                    onClick={() => setSearchItem("")}
                  >
                    <img
                      crossOrigin="anonymous"
                      src={product.images[0]}
                      alt=""
                      className="w-8 h-8 sm:w-10 sm:h-10"
                    />
                    <span>{product.name}</span>
                  </Link>
                ))}
                <li className="p-2 text-center border-t hover:bg-gray-100">
                  <Link 
                    to={`/search?q=${encodeURIComponent(searchItem)}`}
                    className="text-blue-500 font-medium text-sm"
                    onClick={() => setSearchItem("")}
                  >
                    Xem tất cả kết quả
                  </Link>
                </li>
              </>
            ) : (
              <li className="p-2 text-sm">Không có sản phẩm phù hợp</li>
            )}
          </ul>
        )}
      </div>

      {/* Icons */}
      <Link to="/wishlist" className="text-lg">❤️</Link>
      <Link to="/cart" className="text-lg">
        <div className="relative">
          <span> 🛒 </span>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              {totalItems}
            </span>
        </div>
      </Link>

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
                    <Link to="/admin/dashboard">Admin</Link>
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