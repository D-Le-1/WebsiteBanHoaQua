import React, { useState, useEffect } from 'react';
import { useProduct } from '../../useQuery/hooks/useProduct';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BannerSlide from '../sideComponent/BannerSlide';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCategory } from '../../useQuery/hooks/useCategory';
import CategoryComponent from '../sidebar/categoryComponent';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Sort from '../sidebar/sortComponent';
import StarRating from '../sideComponent/RatingStar';
import Pagination from '../sidebar/paginationComponent';
import useFavoriteStore from './../../zustand/store/wishListStore';

const ProductList: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading, isError } = useProduct();
    const { data: category } = useCategory();
    const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
    const [sortOption, setSortOption] = useState("default");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
    const [productsToShow, setProductsToShow] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  
    const filteredProducts = data?.products.filter((product: Product) => {
      const categoryMatch = selectedCategory === "Tất cả" || product.categoryName === selectedCategory;
      const priceMatch = product.salePrice >= priceRange[0] && product.salePrice <= priceRange[1];
      return categoryMatch && priceMatch;
    });
  
    useEffect(() => {
      if (filteredProducts) {
        let sortedProducts = [...filteredProducts];
  
        switch (sortOption) {
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
          default:
            break;
        }
  
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        setProductsToShow(sortedProducts.slice(startIndex, endIndex));
      }
    }, [filteredProducts, currentPage, sortOption]);
  
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };
  
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortOption(e.target.value);
      setCurrentPage(1);
    };
  
    const handlePriceRangeChange = (range: [number, number]) => {
      setPriceRange(range);
      setCurrentPage(1);
    };
  
    const totalPages = Math.ceil((filteredProducts?.length || 0) / productsPerPage);
  
    const calculateDiscount = (price: number, salePrice: number) => {
      if (price <= salePrice) return 0;
      return Math.round(((price - salePrice) / price) * 100);
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
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
  
    if (isError) {
      return <p className="text-center text-red-500">Có lỗi xảy ra khi tải dữ liệu.</p>;
    }
  
    // Price range options
    const priceRanges = [
      { label: "Tất cả giá", value: [0, Infinity] },
      { label: "Dưới 100.000₫", value: [0, 100000] },
      { label: "100.000₫ - 500.000₫", value: [100000, 500000] },
      { label: "500.000₫ - 1.000.000₫", value: [500000, 1000000] },
      { label: "Trên 1.000.000₫", value: [1000000, Infinity] }
    ];
  
    return (
      <div className="container mx-auto p-4 space-y-5">
        <div className="flex flex-col md:flex-row">
          <div className="w-full h-full md:w-64 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-green-700 uppercase">Danh Mục Sản Phẩm</h2>
            <ul className="space-y-2 mb-4">
              {["Tất cả", ...(category?.categories.map((cat: Category) => cat.name) || [])].map((categoryName: string) => (
                <li key={categoryName} className="flex items-center">
                  <button
                    className={`w-full text-left p-2 rounded text-gray-700 hover:bg-gray-200 ${
                      selectedCategory === categoryName ? "font-bold" : ""
                    }`}
                    onClick={() => setSelectedCategory(categoryName)}
                  >
                    {categoryName}{" "}
                    <span className="text-gray-400">
                      (
                      {data?.products.filter(
                        (p: Product) => p.categoryName === categoryName || categoryName === "Tất cả"
                      ).length}
                      )
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mb-4 text-green-700 uppercase">Lọc Theo Giá</h2>
            <ul className="space-y-2">
              {priceRanges.map((range) => (
                <li key={range.label} className="flex items-center">
                  <button
                    className={`w-full text-left p-2 rounded text-gray-700 hover:bg-gray-200 ${
                      priceRange[0] === range.value[0] && priceRange[1] === range.value[1] 
                        ? "font-bold" 
                        : ""
                    }`}
                    onClick={() => handlePriceRangeChange(range.value as [number, number])}
                  >
                    {range.label}{" "}
                    <span className="text-gray-400">
                      (
                      {data?.products.filter(
                        (p: Product) => 
                          p.salePrice >= range.value[0] && 
                          p.salePrice <= range.value[1]
                      ).length}
                      )
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
  
          {/* Product Grid */}
          <div className="flex-1 p-6 space-x-5 space-y-5">
            <Sort handleSortChange={handleSortChange} sortOption={sortOption} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsToShow?.map((product: Product) => {
                const discount = calculateDiscount(product.price, product.salePrice);
                const isProductFavorite = isFavorite(product._id);
                return (
                  <div
                    key={product._id}
                    className="bg-white p-3 border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
                  >
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center">
                        -{discount}%
                      </div>
                    )}
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <img
                        crossOrigin="anonymous"
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full md:h-48 object-cover rounded"
                      />
                      <div className="absolute top-0 left-0 p-2 z-10">
                        <button
                          onClick={() => {
                            if (isProductFavorite) {
                              removeFavorite(product._id);
                            } else {
                              addFavorite(product);
                            }
                          }}
                          className="text-2xl focus:outline-none"
                          title={isProductFavorite ? t("productPage.removeFavorite") : t("productPage.addFavorite")}
                        >
                          {isProductFavorite ? "❤️" : "🤍"}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {product.brand}
                    </p>
                    <StarRating averageRating={product.averageRating} />
                    <Link to={`/productdetail/${product._id}`}>
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      {discount > 0 && (
                        <p className="text-gray-500 line-through">
                          {product.price.toLocaleString()}₫
                        </p>
                      )}
                      <p className="text-xl font-bold text-red-500">
                        {product.salePrice.toLocaleString()}₫
                      </p>
                    </div>
                    <div className="mt-3 flex justify-center max-w-md mx-auto">
                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={() => handleAddToCart(product)}
                        className="bg-white w-full h-10 text-black px-3 py-1 border-2 rounded-md transition-all duration-500 ease-in-out hover:bg-orange-600 hover:text-white active:bg-orange-700 active:scale-95"
                      >
                        <span className="text-xs">{t("productPage.addToCart")}</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            {productsToShow?.length === 0 && (
              <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
            )}
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        )}
      </div>
    );
  };

export default ProductList;