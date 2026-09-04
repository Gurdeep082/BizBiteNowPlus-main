import { NavLink } from "react-router-dom";

import {
  House,
  UtensilsCrossed,
  ReceiptText,
  Gift,
  User,
  HeartIcon,
} from "lucide-react";
import useCartStore from "../../../api/stores/customerstore/cartStore";
import useGuestCartStore from "../../../api/stores/customerstore/guestCartStore";
import { useFavourite } from "../../../context/FavouriteContext";

const navItems = [
  {
    label: "Home",
    icon: House,
    path: "/customer",
  },
  {
    label: "Menu",
    path: "/customer/menu",
    icon: UtensilsCrossed,
  },
  {
    label: "Orders",
    icon: ReceiptText,
    path: "/customer/orders",
  },
  {
    label: "Favorites",
    icon: HeartIcon,
    path: "/customer/favorites",
  },

  {
    label: "Rewards",
    icon: Gift,
    path: "/customer/rewards",
  },
  {
    label: "Profile",
    icon: User,
    path: "/customer/profile",
  },
];

const BottomNavigation = () => {
  const { favouriteProducts } = useFavourite();
  const favouriteCount = favouriteProducts.length;
  const authCartItems = useCartStore((state) => state.items) || [];
  const guestCartItems = useGuestCartStore((state) => state.items) || [];
  const cartCount = [...authCartItems, ...guestCartItems].reduce(
    (total, item) => total + (Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1),
    0,
  );

  return (
    <nav
      className="
        fixed

        bottom-0

        left-0

        right-0

        z-50

        lg:hidden
      "
    >
      <div
        className="
          flex

          items-center

          justify-around

          rounded-[10px]

          border

          border-slate-200 dark:border-[#A9BDCF]/40

          bg-white/90 dark:bg-[#181A1B]

          px-2

          py-2

          shadow-2xl

          backdrop-blur-xl
        "
      >
        {navItems.map(({ label, icon: Icon, path }) => {
          const count = path === "/customer/favorites"
            ? favouriteCount
            : path === "/customer/cart"
              ? cartCount
              : 0;

          return (
          <NavLink
            key={path}
            to={path}
            end={path === "/customer"}
            className="
              flex

              flex-1

              justify-center
            "
          >
            {({ isActive }) => (
              <div
                className="
                  relative

                  flex

                  flex-col

                  items-center

                  justify-center

                  gap-0.5

                  py-1
                "
              >
                <div
                  className={`
                    relative
                    flex

                    h-10

                    w-10

                    items-center

                    justify-center

                    rounded-[10px]

                    transition-all

                    duration-300

                    ${isActive ? "shadow-lg" : "hover:bg-slate-100 dark:hover:bg-white/5"}
                  `}
                  style={{
                    background: isActive ? "var(--primary-color)" : "transparent",
                    color: isActive ? "var(--accent-color)" : "var(--secondary-color)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--primary-color)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--secondary-color)";
                    }
                  }}
                >
                  <Icon size={20} strokeWidth={2.3} />
                  {count > 0 && (
                    <span
                      className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full  px-1.5 text-[11px] font-extrabold shadow-sm"
                      style={{
                        backgroundColor: "var(--secondary-color)",
                        color: "var(--primary-color)",
                      }}
                    >
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </div>

                <span
                  className="text-[10px] font-semibold"
                  style={{
                    color: isActive ? "var(--primary-color)" : "var(--secondary-color)",
                  }}
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
