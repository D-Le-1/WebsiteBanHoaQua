import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules" // Quan trọng!
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

function BannerSlide() {
  const slides = [
    {
      id: 1,
      image: "https://fujifruit.com.vn/wp-content/uploads/2023/03/7-02.jpg",
      title: "Slide 1"
    },
    {
      id: 2,
      image: "https://ngonfruit.com/wp-content/uploads/2021/09/banner-2-1.jpg",
      title: "Slide 2"
    },
    {
      id: 3,
      image: "https://fujifruit.com.vn/wp-content/uploads/2023/09/6.jpg",
      title: "Slide 3"
    },
    {
      id: 4,
      image: "https://fujifruit.com.vn/wp-content/uploads/2023/03/7-01.jpg",
      title: "Slide 4"
    },
    {
      id: 5,
      image:
        "https://delifruit.vn/wp-content/uploads/2024/04/banner-chan-trang.jpg",
      title: "Slide 5"
    },
    {
      id: 6,
      image:
        "https://shophoaqua.vn/public/media/file/files/slider/banner-bottom.png",
      title: "Slide 6"
    }
  ]
  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-auto rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default BannerSlide