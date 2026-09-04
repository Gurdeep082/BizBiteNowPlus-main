import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FloatingCartButton = ({
  totalItems = 0,
  totalPrice = 0,
}) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          initial={{
            opacity: 0,
            y: 80,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 80,
            scale: 0.85,
          }}
          transition={{
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          onClick={() => navigate("/customer/cart")}
          className="
          fixed
          bottom-22 right-4
          z-[60]
          sm:bottom-24 sm:right-6
          lg:bottom-6 lg:right-8

          flex items-center
          gap-2.5 sm:gap-4

          rounded-xl sm:rounded-2xl
          px-3.5 py-2.5 sm:px-5 sm:py-4

          shadow-xl sm:shadow-2xl

          transition-all duration-300
          hover:scale-[1.03]
          active:scale-95
          cursor-pointer
        "
          style={{
            background: "var(--primary-color)",
            color: "var(--accent-color)",
          }}
        >
          {/* Cart Icon Container */}
          <div
            className="
            relative
            flex
            h-9 w-9 sm:h-11 sm:w-11
            items-center justify-center
            rounded-lg sm:rounded-xl
            shrink-0
          "
            style={{
              background: "var(--secondary-color)",
            }}
          >
            <ShoppingCart className="h-4 w-4 sm:h-[22px] sm:w-[22px]" />

            {/* Badge */}
            <span
              className="
              absolute
              -right-1.5 -top-1.5
              sm:-right-2 sm:-top-2

              flex
              h-6 min-w-6
              items-center justify-center

              rounded-full
         
              px-1.5

              text-[11px]
              font-extrabold
              shadow-xs
            "
              style={{
                background: "var(--accent-color)",
                
                color: "var(--primary-color)",
              }}
            >
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          </div>

          {/* Cart Info */}
          <div className="text-left min-w-0">
            <p
              className="
              text-[10px]
              sm:text-xs
              font-medium
              leading-tight
            "
              style={{
                color: "var(--accent-color)",
                opacity: 0.8,
              }}
            >
              {totalItems} item{totalItems > 1 ? "s" : ""}
            </p>

            <h3 className="text-sm sm:text-base font-bold leading-tight mt-0.5">
              ₹{totalPrice}
            </h3>
          </div>

          {/* Arrow */}
          <ArrowRight
            className="
            h-4 w-4
            sm:h-[22px] sm:w-[22px]
            ml-1 sm:ml-2
            shrink-0
          "
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartButton;
