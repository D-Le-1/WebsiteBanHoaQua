import React, {useState, useEffect} from 'react';
import BannerSlide from '../rating/BannerSlide';
import { useTranslation } from 'react-i18next';
import { useCategory } from '../../useQuery/hooks/useCategory';
import { Link, useParams } from 'react-router-dom';
import CategoryComponent from '../sidebar/categoryComponent';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useProductwithCate } from '../../useQuery/hooks/useProductwithCate';
import Sort from '../sidebar/sortComponent';


const CategoryPage = () => {
    const { categoryName } = useParams();
    const {t} = useTranslation()
    const {data: category} = useCategory()
    const { data, isLoading } = useProductwithCate({ categoryName });
    const [sortOption, setSortOption] = useState("default");

    const currentCategory = category?.categories.find(cat => cat.name === categoryName);

    return (
        <div className="container mx-auto p-4 space-y-5">
            <p className="text-2xl font-bold">{t("productPage.category")}</p>
            <CategorySlider categories={category?.categories}/>
            <BannerSlide />
            <h2 className="text-2xl font-bold text-orange-500 mb-4">{currentCategory?.name}</h2>

            {isLoading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {data?.products.map((product, index) => (
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
            )}
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