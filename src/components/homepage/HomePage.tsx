import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useProduct } from "../../useQuery/hooks/useProduct"
import { useMutation } from "@tanstack/react-query"
import { Product, CartItem } from "../../useQuery/user/auth"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { useCategory } from "../../useQuery/hooks/useCategory"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BannerSlide from "../rating/BannerSlide"
import CategoryComponent from "../sidebar/categoryComponent"
import Sort from "../sidebar/sortComponent"


function SupportSection() {
  const { t } = useTranslation()
  const services = [
    {
      icon: "🚚",
      title: t("support.freeDelivery"),
      description: t("support.freeDeliveryDesc")
    },
    {
      icon: "🎧",
      title: t("support.customerService"),
      description: t("support.customerServiceDesc")
    },
    {
      icon: "✅",
      title: t("support.moneyBack"),
      description: t("support.moneyBackDesc")
    }
  ]

  return (
    <div className="py-10 border-b my-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center md:w-1/3 px-4">
            <div className="bg-black text-white p-4 rounded-full text-2xl mb-4">
              {service.icon}
            </div>
            <h3 className="font-bold text-lg">{service.title}</h3>
            <p className="text-gray-600 text-sm">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProductPage = ({
  product
}: {
  product: { id: string; name: string }
}) => {
  const { data, isLoading, isError } = useProduct()
  const { t } = useTranslation()
  const [productsToShow, setProductsToShow] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8
  const { data: category } = useCategory()
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

  return (
    <div className="container mx-auto p-4 space-y-5">
      <p className="text-2xl font-bold ">{t("productPage.category")}</p>
      <CategorySlider categories={category?.categories} />
      <BannerSlide />
      <div className="flex space-x-2 mb-2">
        <div className="w-3 h-7 bg-red-700 rounded-[5px]"></div>
        <p className="content-center text-sm text-red-600">
          {t("productPage.ourProduct")}
        </p>
      </div>
      <h2 className="text-2xl font-bold mb-12 text-green-500">{t("productPage.explore")}</h2>
      <Sort handleSortChange={handleSortChange} sortOption={sortOption}/>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {productsToShow.map((product) => (
          <div
            key={product._id}
            className="bg-white p-3 border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative">
              <img
                crossorigin="anonymous | use-credentials"
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
              <p className="text-sm text-gray-500">{product.brand}</p>
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
        ))}
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
      <SupportSection />
    </div>
  )
}

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
            <Link to={`category/${category.name}`} className="block">
              <CategoryComponent name={category.name} />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductPage
