import React, { useState, useEffect } from 'react';
import { useProduct } from '../../useQuery/hooks/useProduct';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BannerSlide from '../rating/BannerSlide';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCategory } from '../../useQuery/hooks/useCategory';
import CategoryComponent from '../sidebar/categoryComponent';
import { toast } from 'react-toastify';
import Sort from '../sidebar/sortComponent';

const ProductList: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading, isError } = useProduct();
    const { data: category } = useCategory();
    const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
    const [sortOption, setSortOption] = useState("default");
    const [productsToShow, setProductsToShow] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
  
    const filteredProducts = data?.products.filter((product: Product) => {
      return selectedCategory === "Tất cả" || product.categoryName === selectedCategory;
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
  
    return (
      <div className="container mx-auto p-4 space-y-5">
        <p className="text-2xl font-bold">{t("productPage.category")}</p>
        <CategorySlider categories={category?.categories} />
        <div>
          <BannerSlide />
        </div>
        {/* Sidebar */}
        <div className="flex flex-col md:flex-row">
          <div className="w-full h-full md:w-64 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-green-700 uppercase">Danh Mục Sản Phẩm</h2>
            <ul className="space-y-2">
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
          </div>
  
          {/* Product Grid */}
          <div className="flex-1 p-6 space-x-5 space-y-5">
            <Sort handleSortChange={handleSortChange} sortOption={sortOption} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsToShow?.map((product: Product) => {
                const discount = calculateDiscount(product.price, product.salePrice);
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
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {product.brand} || {Math.round(product.averageRating)}/5
                    </p>
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
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-600 w-full h-10 text-white px-3 py-1 rounded-md text-sm sm:text-md transition-all duration-500 ease-in-out hover:bg-green-700 active:bg-green-800 active:scale-95"
                      >
                        {t("productPage.addToCart")}
                      </button>
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
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`py-2 px-4 rounded-full ${
                    pageNumber === currentPage
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

 const CategorySlider = ({ categories }) => {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 1,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 3000,
      centerMode: true, // Optional: Set to true if you want centered slides
      variableWidth: false, // Ensure consistent width for slides
      slidesPerRow: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    };
  
    return (
      <div className="p-2">
        <Slider {...settings}>
          {categories?.map((category) => (
            <div key={category.name} className="px-12">
              <Link to={`/category/${category.name}`} className="block">
                <CategoryComponent name={category.name} />
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    );
  };

export default ProductList;