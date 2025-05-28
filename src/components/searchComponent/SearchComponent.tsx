import React, { useState, useEffect } from "react";
import { useSearchParams, Link, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchName } from "../../useQuery/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import StarRating from "../sideComponent/RatingStar";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Fetch search results
  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchProducts", searchQuery],
    queryFn: () => searchName({ name: searchQuery }),
    enabled: !!searchQuery,
  });

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Sort products based on selected option
  const sortProducts = (products) => {
    if (!products) return [];
    
    let sortedProducts = [...products];
    
    switch (sortBy) {
      case "price-asc":
        sortedProducts.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    
    return sortedProducts;
  };

  // Format currency
  const formatCurrency = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Pagination
  const products = data?.products || [];
  const sortedProducts = sortProducts(products);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Add current page and adjacent pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (startPage > 2) {
        pageNumbers.push("...");
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const handleAddToCart = (product: Product) => {
        if (!product || !product._id) {
          console.error("Product is undefined or missing _id");
          return;
        }
    
        const newItem: CartItem = { product, quantity: 1 };
    
        const existingCart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    
        const existingIndex = existingCart.findIndex(
          (item) => item.product._id === product._id
        );
    
        if (existingIndex >= 0) {
          existingCart[existingIndex].quantity += 1;
        } else {
          existingCart.push(newItem);
        }
    
        localStorage.setItem("cart", JSON.stringify(existingCart));
  
        window.dispatchEvent(new Event("cartChanged"));
    
        toast.success("🛒 Sản phẩm đã được thêm vào giỏ hàng!", {
          position: "top-right",
        });
      };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {t("search.resultsFor")} "{searchQuery}"
        </h1>
        <p className="text-gray-600">
          {products.length > 0
            ? t("search.found", { count: products.length })
            : t("search.noResults")}
        </p>
      </div>

      {/* Sort and Filter Options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="w-full sm:w-auto">
          <label htmlFor="sort-select" className="mr-2 text-gray-700">
            {t("search.sortBy")}:
          </label>
          <select
            id="sort-select"
            className="p-2 border rounded-md bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">{t("search.sortDefault")}</option>
            <option value="price-asc">{t("search.priceLowToHigh")}</option>
            <option value="price-desc">{t("search.priceHighToLow")}</option>
            <option value="name-asc">{t("search.nameAZ")}</option>
            <option value="name-desc">{t("search.nameZA")}</option>
            <option value="newest">{t("search.newest")}</option>
          </select>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {isError && (
        <div className="text-center py-20">
          <p className="text-red-500 text-lg">{t("search.error")}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {t("search.tryAgain")}
          </button>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && !isError && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg">{t("search.noResults")}</p>
              <p className="mt-2 text-gray-600">{t("search.tryDifferent")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group"
                >
                    <div
                      key={product._id}
                      className="bg-white p-3 border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative">
                      <img
                          crossOrigin="anonymous | use-credentials"
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                          <StarRating averageRating={product.averageRating} />
                          <Link to={`/productdetail/${product._id}`}>
                          <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition">
                            {product.name}
                          </h3>
                          </Link>
                          <p className="text-xl font-bold text-gray-900 mt-1">
                              {product.salePrice.toLocaleString()}₫
                          </p>
                          <div className="mt-3 flex justify-center">
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-white w-full h-10 text-black px-3 py-1 border-2 rounded-md text-md transition-all duration-500 ease-in-out hover:bg-orange-600 hover:text-white"
                            >
                                {t("productPage.addToCart")}
                            </button>
                        </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <div className="flex items-center space-x-1">
                {/* Previous Page Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  &laquo;
                </button>
                
                {/* Page Numbers */}
                {getPageNumbers().map((pageNum, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (pageNum !== "...") {
                        setCurrentPage(pageNum);
                      }
                    }}
                    className={`px-3 py-1 rounded-md ${
                      pageNum === "..."
                        ? "cursor-default"
                        : pageNum === currentPage
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                {/* Next Page Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;