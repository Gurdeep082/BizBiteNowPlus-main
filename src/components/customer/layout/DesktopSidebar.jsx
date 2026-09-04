import { NavLink } from "react-router-dom";
import {
  House,
  UtensilsCrossed,
  ReceiptText,
  Gift,
  User,
  LogOut,
  LogIn,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { useEffect } from "react";
import useStoreStore from "../../../api/stores/customerstore/storeStore";
import bizBiteIcon from "../../../assets/BIZ BITE NOW Icon.png";
import useCartStore from "../../../api/stores/customerstore/cartStore";
import useGuestCartStore from "../../../api/stores/customerstore/guestCartStore";
import { useFavourite } from "../../../context/FavouriteContext";

const navItems = [
  {
    label: "Home",
    path: "/customer",
    icon: House,
  },
  {
    label: "Menu",
    path: "/customer/menu",
    icon: UtensilsCrossed,
  },
  {
    label: "Favourite",
    path: "/customer/favorites",
    icon: Heart,
  },
  {
    label: "Cart",
    path: "/customer/cart",
    icon: ShoppingBag,
  },
  {
    label: "Orders",
    path: "/customer/orders",
    icon: ReceiptText,
  },
  {
    label: "Rewards",
    path: "/customer/rewards",
    icon: Gift,
  },
  {
    label: "Policies",
    path: "/customer/policies",
    icon: ShieldCheck,
  },
  {
    label: "Contact",
    path: "/customer/contact",
    icon: Phone,
  },
  {
    label: "Profile",
    path: "/customer/profile",
    icon: User,
  },
];

const DesktopSidebar = ({
  store: propStore = {},
  onLogout,
  onLogin,
  isAuthenticated,
  expanded,
  setExpanded,
}) => {
  const store = useStoreStore((state) => state.store);
  const fetchStore = useStoreStore((state) => state.fetchStore);
  const { favouriteProducts } = useFavourite();
  const favouriteCount = favouriteProducts.length;
  const authCartItems = useCartStore((state) => state.items) || [];
  const guestCartItems = useGuestCartStore((state) => state.items) || [];
  const cartCount = [...authCartItems, ...guestCartItems].reduce(
    (total, item) => total + (Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1),
    0,
  );

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  const storeLogo =
    propStore?.logo ||
    store?.store_profile?.logo ||
    store?.logo;

  const storeName =
    propStore?.name ||
    store?.store_profile?.store_name ||
    store?.business_name ||
    store?.name ||
    "Store";

  const storeInitials = storeName.charAt(0).toUpperCase();

  const getBadgeCount = (label) => {
    if (label === "Cart") return cartCount;
    if (label === "Favourite") return favouriteCount;
    return 0;
  };

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        hidden
        lg:flex

        fixed
        top-0
        h-screen
        z-50

        overflow-hidden

        flex-col
        items-center

        border
        border-slate-200 dark:border-[#A9BDCF]/40

        bg-white/90 dark:bg-[#181A1B]

        backdrop-blur-xl

        transition-all
        duration-300
        ease-in-out

        ${expanded ? "w-60" : "w-24"}
      `}
    >
      <NavLink to="/customer" end className="pt-4 pb-4">
        {storeLogo ? (
          <img
            src={storeLogo}
            alt={storeName}
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-xl
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center

              rounded-xl

              text-lg
              font-black
              text-white

              shadow-lg
            "

          >
            <img src={bizBiteIcon} alt="Biz Bite Now" className="h-full w-full rounded-xl object-contain" />
          </div>
        )}
      </NavLink>

      <nav className="flex w-full flex-1 flex-col gap-1 px-3 overflow-y-auto scrollbar-hide">
        {navItems.map(({ icon: Icon, path, label }) => {
          const count = getBadgeCount(label);

          return (
            <NavLink
              key={path}
              to={path}
              end={path === "/customer"}
              className="w-full"
            >
              {({ isActive }) => (
                <div
                  className={`
        group
        relative

        flex
        h-11
        w-full

        items-center
        gap-4

        rounded-[14px]

        transition-all
        duration-300

        ${isActive ? "" : "hover:bg-slate-100 dark:hover:bg-white/5"}
      `}
                  style={{
                    background: "transparent",
                    color: isActive ? "var(--primary-color)" : "var(--secondary-color)",
                    fontWeight: isActive ? 700 : 400,
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
                  <div
                    className="
            relative
            flex
            h-11
            w-14
            shrink-0
            items-center
            justify-center
          "
                  >
                    <Icon size={20} />
                    {count > 0 && !expanded && (
                      <span
                        className="absolute -right-1.5 top-0.5 flex h-6 min-w-6 items-center justify-center rounded-full border px-1.5 text-[11px] font-extrabold shadow-sm"
                        style={{
                          backgroundColor: "var(--secondary-color)",
                          borderColor: "color-mix(in srgb, var(--secondary-color) 32%, transparent)",
                          color: "var(--primary-color)",
                        }}
                      >
                        {count > 99 ? "99+" : count}
                      </span>
                    )}
                  </div>

                  <span
                    className={`
          whitespace-nowrap
          transition-all
          duration-300
          ease-[cubic-bezier(.22,1,.36,1)]

          ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}

          ${!isActive ? "group-hover:-translate-y-0.5" : ""}
        `}
                  >
                    {label}
                  </span>
                  {count > 0 && expanded && (
                    <span
                      className="ml-auto mr-3 flex h-6 min-w-6 items-center justify-center rounded-full border px-2 text-[11px] font-extrabold shadow-sm"
                      style={{
                        backgroundColor: "var(--secondary-color)",
                        borderColor: "color-mix(in srgb, var(--secondary-color) 32%, transparent)",
                        color: "var(--primary-color)",
                      }}
                    >
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="w-full px-3 pb-3">
        {isAuthenticated ? (
          <button
            onClick={() => {
              if (typeof onLogout === "function") {
                onLogout();
              }
            }}
            className="
              flex
              h-11
              w-full
              items-center
              gap-4

              rounded-2xl

              text-red-600

              transition

              hover:bg-red-50 dark:hover:bg-red-500/10
              hover:text-red-700
              cursor-pointer
            "
          >
            <div
              className="
                flex
                h-11
                w-14
                shrink-0
                items-center
                justify-center
              "
            >
              <LogOut size={20} />
            </div>

            <span
              className={`
                whitespace-nowrap
                text-sm
                font-semibold

                transition-all
                duration-300

                ${expanded ? "opacity-100" : "opacity-0"}
              `}
            >
              Logout
            </span>
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="
              flex
              h-11
              w-full
              items-center
              gap-4

              rounded-2xl

              transition

              cursor-pointer
            "
            style={{ color: "var(--primary-color)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--primary-color) 10%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div
              className="
                flex
                h-11
                w-14
                shrink-0
                items-center
                justify-center
              "
            >
              <LogIn size={20} />
            </div>

            <span
              className={`
                whitespace-nowrap
                text-sm
                font-semibold

                transition-all
                duration-300

                ${expanded ? "opacity-100" : "opacity-0"}
              `}
            >
              Login
            </span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default DesktopSidebar;