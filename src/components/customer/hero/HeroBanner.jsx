import { Clock3 } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
const HeroBanner = ({
  banners = [],
  logo,
  name,
  tagline,
  deliveryTime = "20-25 min",
  isOpen = true,
}) => {
  const images =
    banners.length > 0
      ? banners
      : [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
        ];

  return (
    <section className="relative overflow-hidden rounded-[14px]">
      <div className="relative h-[260px] sm:h-[320px] lg:h-[420px]">
        <Swiper
modules={[Autoplay]}
          slidesPerView={1}
          loop={images.length > 1}
         
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}

          className="h-full w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`${name} Banner ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/35" />

              {/* Theme Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 35%, var(--primary-light) 140%)",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>


      </div>
    </section>
  );
};

export default HeroBanner;