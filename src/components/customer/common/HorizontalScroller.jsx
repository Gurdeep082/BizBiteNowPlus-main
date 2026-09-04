import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HorizontalScroller = ({
  children,
  className = "",
  gap = "gap-4",
  showControls = true,
  scrollAmount = 320,
}) => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (!containerRef.current) return;

    containerRef.current.scrollBy({
      left:
        direction === "left"
          ? -scrollAmount
          : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Left Button */}

      {showControls && (
        <button
          onClick={() => scroll("left")}
          className="
            absolute
            left-2
            top-1/2

            z-10

            hidden
            -translate-y-1/2

            items-center
            justify-center

            rounded-full

            border
            border-slate-200

            bg-white/95

            p-2

            shadow-lg

            backdrop-blur

            transition

            hover:scale-105

            lg:flex
          "
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Right Button */}

      {showControls && (
        <button
          onClick={() => scroll("right")}
          className="
            absolute
            right-2
            top-1/2

            z-10

            hidden
            -translate-y-1/2

            items-center
            justify-center

            rounded-full

            border
            border-slate-200

            bg-white/95

            p-2

            shadow-lg

            backdrop-blur

            transition

            hover:scale-105

            lg:flex
          "
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Scroll Area */}

      <div
        ref={containerRef}
        className={`
          flex

          overflow-x-auto

          scroll-smooth

          scrollbar-hide

          ${gap}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroller;