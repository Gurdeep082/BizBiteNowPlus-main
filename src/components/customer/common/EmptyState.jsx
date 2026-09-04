import { motion } from "framer-motion";
import {
  PackageOpen,
  Search,
  ShoppingBag,
  Gift,
  Heart,
  MapPin,
  ClipboardList,
} from "lucide-react";

const icons = {
  package: PackageOpen,
  search: Search,
  order: ShoppingBag,
  reward: Gift,
  favorite: Heart,
  address: MapPin,
  history: ClipboardList,
};

const EmptyState = ({
  icon = "package",
  title = "Nothing Here Yet",
  description = "Content will appear here when available.",
  actionText,
  onAction,
  image,
  className = "",
}) => {
  const Icon = icons[icon] || PackageOpen;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className={`
        flex
        flex-col
        items-center
        justify-center

        rounded-[22px]
        lg:rounded-[32px]

        border

        bg-white dark:bg-[#181A1B]

        px-5
        py-9

        text-center

        shadow-sm

        lg:px-8
        lg:py-14

        ${className}
      `}
      style={{
        borderColor: "var(--secondary-light)",
      }}
    >

      {/* Illustration */}

      {image ? (
        <img
          src={image}
          alt={title}
          className="
            mb-5
            h-28
            w-28
            object-contain

            lg:mb-8
            lg:h-44
            lg:w-44
          "
        />
      ) : (
        <div
          className="
            mb-5
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full

            lg:mb-8
            lg:h-28
            lg:w-28
          "
          style={{
            background: "var(--primary-light)",
          }}
        >

          <Icon
            size={34}
            className="lg:hidden"
            style={{
              color: "var(--primary-color)",
            }}
          />

          <Icon
            size={50}
            className="hidden lg:block"
            style={{
              color: "var(--primary-color)",
            }}
          />

        </div>
      )}


      {/* Title */}

      <h2 className="text-lg font-bold text-slate-900 dark:text-white lg:text-2xl">
        {title}
      </h2>


      {/* Description */}

      <p
        className="
          mt-2
          max-w-md
          text-sm
          leading-6
          text-slate-500 dark:text-slate-400

          lg:mt-3
          lg:leading-7
          lg:text-base
        "
      >
        {description}
      </p>


      {/* Action */}

      {actionText && (
        <button
          onClick={onAction}
          className="
            mt-5

            rounded-xl

            px-6
            py-3

            text-sm

            font-semibold

            transition-all

            hover:scale-[1.03]
            active:scale-95

            lg:mt-8
            lg:rounded-2xl
            lg:px-8
            lg:py-4
            lg:text-base
          "
          style={{
            background: "var(--primary-color)",
            color: "var(--accent-color)",
          }}
        >
          {actionText}
        </button>
      )}

    </motion.div>
  );
};

export default EmptyState;