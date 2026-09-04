import { useEffect, useRef, useState } from "react";

const BannerCarousel = ({
  banners = [],
  autoPlay = true,
  interval = 2000,
}) => {
  const [active, setActive] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const timer = setInterval(() => {
      setActive((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, banners.length, interval]);

  if (!banners.length) return null;

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;

    const distance =
      touchStartX.current - touchEndX.current;

    // Swipe Left
    if (distance > 50) {
      setActive((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }

    // Swipe Right
    if (distance < -50) {
      setActive((prev) =>
        prev === 0 ? banners.length - 1 : prev - 1
      );
    }
  };

  return (
    <section className="relative lg:hidden">
<div
  className="relative h-44 overflow-hidden rounded-[14px]"
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
  <div
    className="flex h-full transition-transform duration-500 ease-in-out"
    style={{
      transform: `translateX(-${active * 100}%)`,
    }}
  >
    {banners.map((banner) => (
      <div
        key={banner.id}
        className="relative h-full w-full flex-shrink-0"
      >
        <img
          src={banner.image}
          
          className="h-full w-full object-cover select-none pointer-events-none"
          draggable={false}
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col justify-end p-5">
          {banner.tag && (
            <span
              className="mb-2 w-fit rounded-[7px] px-3 py-1 text-xs font-semibold text-white"
              style={{
                background: banner.isOpen
                  ? "#16A34A"
                  : "#DC2626",
              }}
            >
              {banner.tag}
            </span>
          )}

          <h2 className="text-xl font-bold text-white">
            {banner.title}
          </h2>

          {banner.subtitle && (
            <p className="mt-1 text-sm text-white/90">
              {banner.subtitle}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Indicators */}


    </section>
  );
};

export default BannerCarousel;