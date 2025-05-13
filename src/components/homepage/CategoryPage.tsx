import React, {useState, useEffect} from 'react';
import BannerSlide from '../rating/BannerSlide';
import { useTranslation } from 'react-i18next';
import { useCategory } from '../../useQuery/hooks/useCategory';
import { Link, useParams } from 'react-router-dom';
import CategoryComponent from '../sidebar/categoryComponent';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import { useProductwithCate } from '../../useQuery/hooks/useProductwithCate';
import Sort from '../sidebar/sortComponent';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const {t} = useTranslation()
    const [productsToShow, setProductsToShow] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 12
    const {data: category} = useCategory()
    const { data, isLoading } = useProductwithCate({ categoryName });
    const [sortOption, setSortOption] = useState("default");
    
      useEffect(() => {
        if (data?.products) {
          const startIndex = (currentPage - 1) * productsPerPage
          const endIndex = startIndex + productsPerPage
          setProductsToShow(data.products.slice(startIndex, endIndex))
        }
      }, [data, currentPage])
    
      const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
      }
    
      useEffect(() => {
        if (data?.products) {
          let sortedProducts = [...data.products];
          
          // Sắp xếp theo các tùy chọn
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
              // Giữ nguyên thứ tự mặc định
              break;
          }
          
          const startIndex = (currentPage - 1) * productsPerPage;
          const endIndex = startIndex + productsPerPage;
          setProductsToShow(sortedProducts.slice(startIndex, endIndex));
        }
      }, [data, currentPage, sortOption]);
    
      const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setCurrentPage(1); // Reset về trang 1 khi thay đổi sắp xếp
      };
    
      const totalPages = Math.ceil(data?.products?.length / productsPerPage)
      const handleAddToCart = (product: Product) => {
        if (!product || !product._id) {
          console.error("Product is undefined or missing _id")
          return
        }
    
        const newItem: CartItem = { product, quantity: 1 }
    
        const existingCart: CartItem[] = JSON.parse(
          localStorage.getItem("cart") || "[]"
        )
    
        const existingIndex = existingCart.findIndex(
          (item) => item.product._id === product._id // Sửa thành _id
        )
    
        if (existingIndex >= 0) {
          existingCart[existingIndex].quantity += 1
        } else {
          existingCart.push(newItem)
        }
    
        localStorage.setItem("cart", JSON.stringify(existingCart))
    
        toast.success("🛒 Sản phẩm đã được thêm vào giỏ hàng!", {
          position: "top-right"
        })
      }

      const currentCategory = category?.categories.find(cat => cat.name === categoryName);

    return (
        <div className="container mx-auto p-4 space-y-5">
            <p className="text-2xl font-bold">{t("productPage.category")}</p>
            <CategorySlider categories={category?.categories}/>
            <BannerSlide />
            <h2 className="text-2xl font-bold text-orange-500 mb-4">{currentCategory?.name}</h2>
            <Sort handleSortChange={handleSortChange} sortOption={sortOption}/>
            {isLoading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {productsToShow?.map((product, index) => (
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
                                <p className="text-sm text-gray-500">{product.brand} || {Math.round(product.averageRating)}/5</p>
                                <Link to={`/productdetail/${product._id}`}>
                                <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition">
                                  {product.name}
                                </h3>
                                </Link>
                                <p className="text-xl font-bold text-gray-900 mt-1">
                                    {product.salePrice.toLocaleString()}₫
                                </p>
                                <div className="mt-3 flex justify-center">
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
                    ))}
                </div>
            )}
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

export default CategoryPage;