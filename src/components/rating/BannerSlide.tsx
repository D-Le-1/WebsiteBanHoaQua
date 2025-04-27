import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules" // Quan trọng!
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

function BannerSlide() {
  const slides = [
    {
      id: 1,
      image: "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/468406482_597828942774050_7177994008916388013_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=UXDgZ9LnVvQQ7kNvwHD7ZoC&_nc_oc=Admmk73fdVnAeDd1YXHFRgqx9TUiZXYNlT9Y2Br9NeK7QjJX7dWQKziiIl83dUNvn516ef93XfVldJPbRSODNWqa&_nc_zt=23&_nc_ht=scontent.fhan14-1.fna&_nc_gid=e7qZEmjpDlzaStTkP1csyw&oh=00_AfF3jNULxxEHbuG9PX8LdXm1FNBVJeYbAC2mBUt79TEf5Q&oe=680D273C",
      title: "Slide 1"
    },
    {
      id: 2,
      image: "https://freshfruitfarm.vn/uploads/images/2022/03/1646204476-single_banner49-banner2copy.jpg",
      title: "Slide 2"
    },
    {
      id: 3,
      image: "https://image.chukouplus.com/upload/C_3875/file/20240105/1bd35c3aec859cf155f411a34b50247c.jpg?x-oss-process=image/format,webp,image/resize,m_pad,h_850,w_1920,color_FFFFFF&1",
      title: "Slide 3"
    },
    {
      id: 4,
      image: "https://www.wadherafruit.com/wp-content/uploads/2017/01/slide1.jpg",
      title: "Slide 4"
    },
    {
      id: 5,
      image:
        "https://bizweb.dktcdn.net/100/478/999/themes/897810/assets/slider_2.jpg?1729570356470",
      title: "Slide 5"
    },
    {
      id: 6,
      image:
      "https://freshfruitfarm.vn/uploads/images/2022/03/1646204506-single_banner49-banner3.jpg",
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
              className="w-full h-auto rounded-lg object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default BannerSlide