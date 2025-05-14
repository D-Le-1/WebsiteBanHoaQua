import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../../useQuery/hooks/useProduct";
import { Product, CartItem } from "../../useQuery/user/auth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCategory } from "../../useQuery/hooks/useCategory";
import Slider from "react-slick";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BannerSlide from "../rating/BannerSlide";
import CategoryComponent from "../sidebar/categoryComponent";
import Sort from "../sidebar/sortComponent";
import dayjs from "dayjs";
import useFavoriteStore from "../../zustand/store/wishListStore";
import { Button } from "@mui/material";

const Card = () => {
  const { t } = useTranslation();
  const cardsData = [
    {
      title: "category.flower.title",
      description: "category.flower.description",
      bgImage: "https://hoatuoi360.vn/upload/hinhanh/hoa-de-ban-05_-hoa-tuoi-360217.png",
    },
    {
      title: "category.food.title",
      description: "category.food.description",
      bgImage: "https://defarm.vn/wp-content/uploads/2021/07/Thuc-Pham-Duoc-Xep-Loai-Tieu-Chuan.jpg",
    },
    {
      title: "category.fruit.title",
      description: "category.fruit.description",
      bgImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx5aRpfuFisb1TYIRIRdBg3mN5p5VJMNnIDA&s",
    }
  ];
  
  return (
    <div className="container flex flex-col md:flex-row justify-center gap-4 p-4 bg-gray-100">
      {cardsData.map((card, index) => (
        <div key={index} className="w-full md:w-96 h-48 rounded-lg shadow-lg flex flex-col justify-center items-center text-center text-white p-4 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out hover:bg-[length:150%]"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${card.bgImage})`,
              border: "2px solid #34C759",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-bold mb-2">{t(card.title)}</h2>
            <p className="text-sm">{t(card.description)}</p>
          </div>
        </div>
      ))}      
    </div>
  );
};

function NewProductsComponent({ products, onAddToCart }) {
  const { t } = useTranslation();
  const today = dayjs();
  const newProducts = products?.filter(product => 
    dayjs(product.createdAt).isAfter(today.subtract(7, "day"))
  );
  
  // Use the favorite store directly in this component
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  
  return (
    <div className="container flex space-x-2 mb-2">
      <section>
        <h2 className="text-2xl font-bold mb-5 text-red-500">{t("productPage.productNews")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {newProducts?.map(product => {
            // Check favorite status for each individual product
            const isProductFavorite = isFavorite(product._id);
            
            return (
              <div
                key={product._id}
                className="bg-white p-3 border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
              >
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold z-10 rounded-bl-lg">
                  NEW
                </div>
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
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <img
                    crossOrigin="anonymous"
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full md:h-48 object-cover"
                  />
                </div>
                <p className="text-sm text-gray-500">{product.brand} || {Math.round(product.averageRating)}/5</p>
                <Link to={`/productdetail/${product._id}`} state={{ scrollToTop: true }}>
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {product.salePrice.toLocaleString()}₫
                </p>
                <div className="mt-3 flex justify-center max-w-md mx-auto">
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => onAddToCart(product)}
                    className="bg-white w-full h-10 text-black px-3 py-1 border-2 rounded-md transition-all duration-500 ease-in-out hover:bg-orange-600 hover:text-white active:bg-orange-700 active:scale-95"
                  >
                    <span className="text-xs">{t("productPage.addToCart")}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SupportSection() {
  const { t } = useTranslation();
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
  ];

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
  );
}

const ProductPage = () => {
  const { data, isLoading } = useProduct();
  const { t } = useTranslation();
  const [productsToShow, setProductsToShow] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const { data: category } = useCategory();
  const [sortOption, setSortOption] = useState("default");
  const [cartUpdated, setCartUpdated] = useState(false);

  // Use Zustand store directly
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  
  useEffect(() => {
    if (data?.products) {
      let sortedProducts = [...data.products];
      
      // Sort products based on selected option
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
          // Keep default order
          break;
      }
      
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      setProductsToShow(sortedProducts.slice(startIndex, endIndex));
    }
  }, [data, currentPage, sortOption]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1); // Reset to page 1 when sorting changes
  };

  const totalPages = Math.ceil(data?.products?.length / productsPerPage) || 0;
  
  const handleAddToCart = (product: Product) => {
    if (!product || !product._id) {
      console.error("Product is undefined or missing _id");
      return;
    }

    // Prevent duplicate operations
    if (cartUpdated) return;

    const newItem: CartItem = { product, quantity: 1 };
    const existingCart: CartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

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

    setCartUpdated(true);
    
    toast.success("🛒 Sản phẩm đã được thêm vào giỏ hàng!", {
      position: "top-right"
    });
    
    setTimeout(() => {
      setCartUpdated(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-5">
      {/* <p className="text-2xl font-bold ">{t("productPage.category")}</p> */}
      {/* <CategorySlider categories={category?.categories} /> */}
      <BannerSlide />
      <Card />
      <div className="flex space-x-2 mb-2">
        <div className="w-3 h-7 bg-red-700 rounded-[5px]"></div>
        <p className="content-center text-sm text-red-600">
          {t("productPage.ourProduct")}
        </p>
      </div>
      <NewProductsComponent 
        products={data?.products}
        onAddToCart={handleAddToCart}
      />
      <h2 className="text-2xl font-bold mb-12 text-green-500">{t("productPage.explore")}</h2>
      <Sort handleSortChange={handleSortChange} sortOption={sortOption} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {productsToShow.map((product) => {
          // Check favorite status for each individual product
          const isProductFavorite = isFavorite(product._id);
          
          return (
            <div
              key={product._id}
              className="bg-white p-3 border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
            >
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
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img
                  crossOrigin="anonymous"
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full md:h-48 object-cover"
                />
              </div>
              <p className="text-sm text-gray-500">{product.brand} | {Math.round(product.averageRating)}/5</p>
              <Link to={`/productdetail/${product._id}`} state={{ scrollToTop: true }}>
                <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {product.salePrice.toLocaleString()}₫
              </p>
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
      <BestSellingProducts 
        products={data?.products}
        onAddToCart={handleAddToCart}
      />
      <SupportSection />
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
    centerMode: true,
    variableWidth: false,
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

function BestSellingProducts({ products, onAddToCart }) {
  const { t } = useTranslation();
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();

  const bestSelling = [...(products || [])]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 12);

  return (
    <div className="flex space-x-2 mb-2">
      <section>
        <h2 className="text-2xl font-bold mb-5 text-red-500">🔥 {t("productPage.bestSeller")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {bestSelling?.map(product => {
            const isProductFavorite = isFavorite(product._id);
            
            return (
              <div
                key={product._id}
                className="bg-white p-3 border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
              >
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
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <img
                    crossOrigin="anonymous"
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full md:h-48 object-cover"
                  />
                </div>
                <p className="text-sm text-gray-500">{product.brand} || {Math.round(product.averageRating)}/5</p>
                <Link to={`/productdetail/${product._id}`} state={{ scrollToTop: true }}>
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {product.salePrice.toLocaleString()}₫
                </p>
                <p className="text-sm text-gray-500">{t("productPage.sold")}: {product.sold}</p>
                <div className="mt-3 flex justify-center max-w-md mx-auto">
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => onAddToCart(product)}
                    className="bg-white w-full h-10 text-black px-3 py-1 border-2 rounded-md transition-all duration-500 ease-in-out hover:bg-orange-600 hover:text-white active:bg-orange-700 active:scale-95"
                  >
                    <span className="text-xs">{t("productPage.addToCart")}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default ProductPage;