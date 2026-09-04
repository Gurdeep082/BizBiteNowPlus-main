import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import {
  Search,
  Filter,
  ChevronRight,
  UserRound,
  UtensilsCrossed,
  Coffee,
  IceCreamBowl,
  Pizza,
  Salad,
  Soup,
} from "lucide-react";

import useAuthStore from "../../store/authStore";
import useProductStore from "../../store/productStore";
import useCartStore from "../../api/stores/customerstore/cartStore";
import useGuestCartStore from "../../api/stores/customerstore/guestCartStore";
import useTableStore from "../../store/tableStore";
import { useFavourite } from "../../context/FavouriteContext";
import { useTheme } from "../../context/ThemeContext";
import {
  normalizeProduct,
  isProductFavourite,
} from "../../util/normalizeProduct";
import ReusableProductCard from "../../components/customer/ReusableProductCard";
import { mockCategoryImages } from "../../data/customerMockData";

const getCategoryName = (category) => {
  if (typeof category === "string") return category;

  return (
    category?.name ||
    category?.category_name ||
    category?.title ||
    category?.category?.name ||
    (typeof category?.category === "string"
      ? category.category
      : null) ||
    "Other"
  );
};

const getCanonicalCategoryName = (category) => {
  const name = getCategoryName(category).trim();
  return name.toLowerCase() === "burger" ? "Burgers" : name;
};

const getCategoryImage = (category) => {
  if (!category || typeof category === "string") {
    return null;
  }

  const getImageUrl = (value) => {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (!value || typeof value !== "object") {
      return null;
    }

    return (
      getImageUrl(value.secure_url) ||
      getImageUrl(value.url) ||
      getImageUrl(value.location) ||
      getImageUrl(value.path) ||
      getImageUrl(value.src) ||
      null
    );
  };

  return (
    getImageUrl(category.image) ||
    getImageUrl(category.image_url) ||
    getImageUrl(category.imageUrl) ||
    getImageUrl(category.category_image) ||
    getImageUrl(category.category_image_url) ||
    getImageUrl(category.categoryImage) ||
    getImageUrl(category.thumbnail) ||
    getImageUrl(category.icon) ||
    getImageUrl(category.icon_url) ||
    getImageUrl(category.category?.image) ||
    getImageUrl(category.category?.image_url) ||
    null
  );
};

const getCategoryFallbackIcon = (categoryName) => {
  const name = String(categoryName || "").toLowerCase();

  if (/drink|beverage|coffee|tea|juice/.test(name)) return Coffee;
  if (/dessert|sweet|ice.?cream|cake/.test(name)) return IceCreamBowl;
  if (/pizza|burger|sandwich|fast.?food/.test(name)) return Pizza;
  if (/salad|veg|vegetable/.test(name)) return Salad;
  if (/soup|starter|appetizer/.test(name)) return Soup;

  return UtensilsCrossed;
};
/* =========================================================
   MENU
========================================================= */

export default function Menu() {
  const navigate = useNavigate();
  const { table_token } = useParams();
  const { darkMode } = useTheme();

  /* =======================================================
     AUTH
  ======================================================= */

  const profile = useAuthStore((s) => s.profile);
  const isLoggedIn = useAuthStore((s) => s.isAuthenticated);

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  /* =======================================================
     TABLE / GUEST FLOW
  ======================================================= */

  const resolveTable = useTableStore((s) => s.resolveTable);
  const resolvedTable = useTableStore((s) => s.resolvedTable);

  const guestCart = useGuestCartStore();
  const setGuestTableToken = useGuestCartStore(
    (s) => s.setTableToken
  );

  const isGuestFlow = !!table_token;

  const sellerId =
    (isGuestFlow && resolvedTable?.seller_id) ||
    profile?.seller_id ||
    profile?.id ||
    localStorage.getItem("seller_id") ||
    import.meta.env.VITE_DEFAULT_SELLER_ID;

  /* =======================================================
     FILTER / SORT STATE
  ======================================================= */

  const [sortBy, setSortBy] = useState("default");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [filters, setFilters] = useState({
    vegOnly: false,
    nonVegOnly: false,
    minRating: 0,
    maxPrice: null,
  });

  const activeFilterCount =
    (filters.vegOnly ? 1 : 0) +
    (filters.nonVegOnly ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxPrice ? 1 : 0);

  /* =======================================================
     PRODUCT STORE
  ======================================================= */

  const storefront = useProductStore((s) => s.storefront);
  const fullMenu = useProductStore((s) => s.fullMenu);
  const storefrontCategories = useProductStore((s) => s.categories);

  const storeInfo = useProductStore(
    (s) => s.store || s.storeInfo || s.currentStore
  );

  const fetchStorefrontCatalog = useProductStore(
    (s) => s.fetchStorefrontCatalog
  );

  const fetchFullMenu = useProductStore(
    (s) => s.fetchFullMenu
  );

  const fetchStorefrontCategories = useProductStore(
    (s) => s.fetchStorefrontCategories
  );

  /* =======================================================
     CART
  ======================================================= */

  const authCartItems = useCartStore(
    (s) => s.items || []
  );

  const authAddToCart = useCartStore(
    (s) => s.addToCart
  );

  const authUpdateQuantity = useCartStore(
    (s) => s.updateQuantity
  );

  const authRemoveItem = useCartStore(
    (s) => s.removeItem
  );

  const authFetchCart = useCartStore(
    (s) => s.fetchCart
  );

  const cartItems = isGuestFlow
    ? guestCart.items
    : authCartItems;

  const addToCart = isGuestFlow
    ? guestCart.addToCart
    : authAddToCart;

  const updateQuantity = isGuestFlow
    ? guestCart.updateQuantity
    : authUpdateQuantity;

  const removeItem = isGuestFlow
    ? guestCart.removeItem
    : authRemoveItem;

  /* =======================================================
     FAVOURITES
  ======================================================= */

  const {
    favouriteProducts,
    toggleFavourite,
  } = useFavourite();

  /* =======================================================
     SEARCH / CATEGORY
  ======================================================= */

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [failedCategoryImages, setFailedCategoryImages] = useState(
    () => new Set()
  );

  /* =======================================================
     STORE OPEN STATUS
  ======================================================= */

  const isStoreOpen = useMemo(() => {
    if (
      storeInfo &&
      storeInfo.is_open !== undefined
    ) {
      return Boolean(storeInfo.is_open);
    }

    if (
      storeInfo &&
      storeInfo.data &&
      storeInfo.data.is_open !== undefined
    ) {
      return Boolean(storeInfo.data.is_open);
    }

    if (
      storefront &&
      storefront.length > 0
    ) {
      const firstItem = storefront[0];

      const openStatus =
        firstItem?.seller_id?.is_open ??
        firstItem?.seller_id?.store_profile?.is_open ??
        firstItem?.store_id?.is_open;

      if (openStatus !== undefined) {
        return Boolean(openStatus);
      }
    }

    const profileOpen =
      profile?.seller_id?.is_open ??
      profile?.is_open;

    if (profileOpen !== undefined) {
      return Boolean(profileOpen);
    }

    return true;
  }, [
    storeInfo,
    storefront,
    profile,
  ]);

  /* =======================================================
     RESOLVE TABLE
  ======================================================= */

  useEffect(() => {
    if (table_token) {
      setGuestTableToken(table_token);

      if (
        !resolvedTable ||
        resolvedTable.table_token !== table_token
      ) {
        resolveTable(table_token).catch((err) =>
          console.error(
            "Table resolve failed:",
            err
          )
        );
      }
    }
  }, [
    table_token,
    resolvedTable,
    resolveTable,
    setGuestTableToken,
  ]);

  /* =======================================================
     LOAD MENU
  ======================================================= */

  useEffect(() => {
    if (!sellerId) return;

    const loadMenuData = async () => {
      try {
        await Promise.all([
          fetchStorefrontCatalog(sellerId),
          fetchFullMenu(sellerId),
          fetchStorefrontCategories(sellerId),
        ]);
      } catch (err) {
        console.error(
          "Menu data fetch error:",
          err
        );
      }
    };

    loadMenuData();
  }, [
    sellerId,
    fetchStorefrontCatalog,
    fetchFullMenu,
    fetchStorefrontCategories,
  ]);

  /* =======================================================
     FETCH AUTH CART
  ======================================================= */

  useEffect(() => {
    if (!isGuestFlow) {
      authFetchCart().catch(() => { });
    }
  }, [
    authFetchCart,
    isGuestFlow,
  ]);

  /* =======================================================
     ALL PRODUCTS
  ======================================================= */

  const allProducts = useMemo(() => {
    if (
      fullMenu &&
      fullMenu.length > 0
    ) {
      return fullMenu.flatMap(
        (section) =>
          (section.products || []).map(
            normalizeProduct
          )
      );
    }

    return storefront.map(
      normalizeProduct
    );
  }, [
    fullMenu,
    storefront,
  ]);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const categoryMap = new Map();

    categoryMap.set("all", {
      id: "All",
      name: "All",
    });

    // The public categories endpoint is the primary source
    // because it carries category metadata such as its image.
    storefrontCategories?.forEach(
      (category, index) => {
        const name = getCanonicalCategoryName(category);
        const key = name.trim().toLowerCase();

        if (name && key !== "all") {
          categoryMap.set(key, {
            id:
              category._id ||
              category.id ||
              `storefront-category-${index}`,
            name,
            image: getCategoryImage(category),
          });
        }
      }
    );

    // The full-menu endpoint returns category objects
    // with their images.
    fullMenu?.forEach(
      (section, index) => {
        const name = getCanonicalCategoryName(section);
        const key = name.trim().toLowerCase();

        if (
          name &&
          key !== "all" &&
          !categoryMap.has(key)
        ) {
          categoryMap.set(key, {
            id:
              section._id ||
              section.id ||
              `category-${index}`,
            name,
            image: getCategoryImage(section),
          });
        }
      }
    );

    allProducts.forEach((p) => {
      if (!p.category) return;

      const name = getCanonicalCategoryName(p.category);

      const key = name.trim().toLowerCase();

      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          id:
            p.category?._id ||
            p.category?.id ||
            name,
          name,
          image:
            typeof p.category === "string"
              ? null
              : getCategoryImage(p.category),
        });
      }
    });

    return Array.from(categoryMap.values()).sort((first, second) => {
      const firstName = getCategoryName(first).trim().toLowerCase();
      const secondName = getCategoryName(second).trim().toLowerCase();

      if (firstName === "all") return -1;
      if (secondName === "all") return 1;
      if (firstName === "main course") return -1;
      if (secondName === "main course") return 1;
      return 0;
    });
  }, [
    allProducts,
    fullMenu,
    storefrontCategories,
  ]);

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        const matchesSearch =
          p.name
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||
          p.description
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            );

        if (!matchesSearch) {
          return false;
        }

        /* =================================================
           CATEGORY FILTER
        ================================================= */

        if (
          selectedCategory !== "All"
        ) {
          if (
            selectedCategory === "Bestseller"
          ) {
            if (
              !(
                p.rating >= 4.0 ||
                p.isBestseller
              )
            ) {
              return false;
            }
          } else {
            const productCategory =
              typeof p.category === "string"
                ? p.category
                    .trim()
                    .toLowerCase()
                : getCategoryName(
                    p.category
                  )
                    .trim()
                    .toLowerCase();

            const selected =
              selectedCategory
                .trim()
                .toLowerCase();

            /*
             * FOOD FIX
             *
             * Food is the parent category.
             * Therefore selecting Food should
             * display all food products instead
             * of requiring product.category === Food.
             */
            if (selected === "food") {
              return true;
            }

            if (
              productCategory !== selected
            ) {
              return false;
            }
          }
        }

        /* =================================================
           DIETARY FILTER
        ================================================= */

        if (
          filters.vegOnly &&
          !p.isVeg
        ) {
          return false;
        }

        if (
          filters.nonVegOnly &&
          p.isVeg
        ) {
          return false;
        }

        /* =================================================
           RATING FILTER
        ================================================= */

        if (
          filters.minRating > 0 &&
          (p.rating || 0) <
          filters.minRating
        ) {
          return false;
        }

        /* =================================================
           PRICE FILTER
        ================================================= */

        if (
          filters.maxPrice &&
          Number(p.price) >
          filters.maxPrice
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price_low":
            return (
              (a.price || 0) -
              (b.price || 0)
            );

          case "price_high":
            return (
              (b.price || 0) -
              (a.price || 0)
            );

          case "rating":
            return (
              (b.rating || 0) -
              (a.rating || 0)
            );

          case "name":
            return a.name.localeCompare(
              b.name
            );

          default:
            return 0;
        }
      });
  }, [
    allProducts,
    searchQuery,
    selectedCategory,
    filters,
    sortBy,
  ]);

  /* =======================================================
     GROUP MENU
  ======================================================= */

  const groupedMenu = useMemo(() => {
    if (
      selectedCategory !== "All" &&
      selectedCategory !== "Bestseller"
    ) {
      return {
        [selectedCategory]:
          filteredProducts,
      };
    }

    const groups = {};

    filteredProducts.forEach((p) => {
      const cat =
        typeof p.category === "string"
          ? p.category
          : getCategoryName(p.category) ||
            "Other";

      if (!groups[cat]) {
        groups[cat] = [];
      }

      groups[cat].push(p);
    });

    return groups;
  }, [
    filteredProducts,
    selectedCategory,
  ]);

  /* =======================================================
     GET CART ITEM
  ======================================================= */

  const getCartItem = (productId) =>
    cartItems.find((item) => {
      const pid =
        typeof item.product_id ===
          "object"
          ? item.product_id?._id
          : item.product_id ??
          item.productId ??
          item.product?._id ??
          item._id ??
          item.id;

      return (
        String(pid) ===
        String(productId)
      );
    });

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAdd = (product) => {
    if (
      !isGuestFlow &&
      !isLoggedIn
    ) {
      setShowLoginPopup(true);
      return;
    }

    if (isGuestFlow) {
      addToCart(product);
      toast.success(`${product.name} added to your cart.`);
    } else {
      addToCart(product)
        .then(() =>
          toast.success(
            `${product.name} added to your cart.`
          )
        )
        .catch((error) =>
          toast.error(
            error?.response?.data?.message ||
              "Unable to add this item to your cart."
          )
        );
    }
  };

  /* =======================================================
     INCREASE QUANTITY
  ======================================================= */

  const increaseQuantity = (
    product
  ) => {
    if (
      !isGuestFlow &&
      !isLoggedIn
    ) {
      setShowLoginPopup(true);
      return;
    }

    const existing =
      getCartItem(product.id);

    if (existing) {
      const targetId = isGuestFlow
        ? existing.product_id
        : existing._id ||
        existing.id;

      const result =
        updateQuantity(
          targetId,
          Number(existing.quantity) + 1
        );

      if (!isGuestFlow) {
        result.catch(() => { });
      }
    } else {
      handleAdd(product);
    }
  };

  /* =======================================================
     DECREASE QUANTITY
  ======================================================= */

  const decreaseQuantity = (
    product
  ) => {
    const existing =
      getCartItem(product.id);

    if (!existing) return;

    const targetId = isGuestFlow
      ? existing.product_id
      : existing._id ||
      existing.id;

    if (
      Number(existing.quantity) <=
      1
    ) {
      const result =
        removeItem(targetId);

      if (!isGuestFlow) {
        result.catch(() => { });
      }
    } else {
      const result =
        updateQuantity(
          targetId,
          Number(existing.quantity) - 1
        );

      if (!isGuestFlow) {
        result.catch(() => { });
      }
    }
  };

  
  const findCategoryImage = (
    categoryName
  ) => {
        const normalizedName = String(
      categoryName || ""
    )
        .trim()
        .toLowerCase();

    const category = categories.find(
      (cat) =>
        getCategoryName(cat)
          .trim()
          .toLowerCase() ===
        normalizedName
    );

    return getCategoryImage(category) || mockCategoryImages[categoryName] || mockCategoryImages.All;
  };

  const primaryShadow =
    "0 14px 32px color-mix(in srgb, var(--primary-color) 18%, transparent)";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        w-full
        max-w-[1780px]
        mx-auto
        space-y-6
        pb-32
        font-sans
        text-slate-800
        px-4
        sm:px-6
        lg:px-8
        pt-2
      "
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          !hidden
          flex
          items-center
          sm:items-center
          sm:justify-between
          gap-4
          rounded-3xl
          border
          border-slate-200/80
          bg-white
          p-4
          sm:p-5
          dark:border-white/10
          dark:bg-[#181A1B]
        "
        style={{ boxShadow: primaryShadow }}
      >
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="min-w-0">
          <h1
            className="
              text-xl
              sm:text-2xl
              font-bold
              text-slate-900
              dark:text-white
              tracking-tight
            "
          >
            Menu
          </h1>

          <p
            className="
              text-xs
              sm:text-sm
              text-slate-500
              dark:text-slate-400
              font-medium
              mt-0.5
            "
          >
            {isGuestFlow &&
              resolvedTable?.table_number
              ? `Table ${
                  resolvedTable.table_number
                } · ${resolvedTable.store_name ||
              ""
              }`
              : "Explore our delicious food items"}
          </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--primary-color) 12%, transparent)",
              color: "var(--primary-color)",
            }}
          >
            {allProducts.length} items
          </span>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--primary-color) 10%, transparent)",
              color: "var(--primary-color)",
            }}
          >
            <UtensilsCrossed size={20} />
          </div>
        </div>
      </div>

      {/* ===================================================
          SEARCH / SORT / FILTER
      =================================================== */}

      <div
        className="
          flex
          flex-col
          items-center
          gap-3
          w-full
          rounded-3xl
          border
          border-slate-200/80
          bg-white/90
          p-3
          sm:flex-row
          dark:border-white/10
          dark:bg-[#181A1B]/90
        "
        style={{ boxShadow: primaryShadow }}
      >
        <div
          className="
            flex
            flex-row
            items-center
            gap-3
            w-full
          "
        >
          {/* Search */}

          <div className="relative flex-1">
            <Search
              className="
                absolute
                left-4
                top-3.5
                text-slate-400
                dark:text-slate-500
              "
              size={18}
            />

            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="
                w-full
                bg-white
                dark:bg-[#181A1B]
                border
                border-slate-200
                dark:border-white/10
                rounded-2xl
                pl-11
                pr-4
                py-3
                text-xs
                sm:text-sm
                outline-none
                font-medium
                text-slate-900
                dark:text-white
                shadow-2xs
                transition
                focus:border-[var(--primary-color)]
                focus:ring-2
                focus:ring-[var(--primary-color)]/20
              "
            />
          </div>

          {/* Sort */}

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
            className="
              bg-white
              dark:bg-[#181A1B]
              border
              border-slate-200
              dark:border-white/10
              rounded-2xl
              px-3
              py-3
              text-xs
              sm:text-sm
              font-semibold
              text-slate-700
              dark:text-slate-300
              shadow-2xs
              cursor-pointer
              outline-none
              shrink-0
            "
          >
            <option value="default">
              Sort
            </option>

            <option value="price_low">
              Price: Low to High
            </option>

            <option value="price_high">
              Price: High to Low
            </option>

            <option value="rating">
              Rating
            </option>

            <option value="name">
              Name (A-Z)
            </option>
          </select>

          {/* Filter */}

          <div className="relative shrink-0">
            <button
              onClick={() =>
                setShowFilterPanel(
                  (v) => !v
                )
              }
              className="
                flex
                items-center
                gap-2
                bg-white
                dark:bg-[#181A1B]
                border
                border-slate-200
                dark:border-white/10
                px-5
                py-3
                rounded-2xl
                text-xs
                sm:text-sm
                font-semibold
                text-slate-700
                dark:text-slate-300
                hover:bg-slate-50
                dark:hover:bg-white/5
                transition
                shadow-2xs
                cursor-pointer
                relative
              "
            >
              <Filter size={16} />

              <span className="hidden sm:inline">
                Filter
              </span>

              {activeFilterCount >
                0 && (
                  <span
                    className="
                    absolute
                    -top-1.5
                    -right-1.5
                    text-white
                    text-[10px]
                    font-semibold
                    rounded-full
                    h-4
                    w-4
                    flex
                    items-center
                    justify-center
                  "
                    style={{
                      backgroundColor:
                        "var(--primary-color)",
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
            </button>

            <AnimatePresence>
              {showFilterPanel && (
                <>
                  <div
                    className="
                      fixed
                      inset-0
                      z-40
                    "
                    onClick={() =>
                      setShowFilterPanel(
                        false
                      )
                    }
                  />

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    className="
                      absolute
                      right-0
                      top-full
                      mt-2
                      w-64
                      bg-white
                      dark:bg-[#181A1B]
                      border
                      border-slate-200
                      dark:border-white/10
                      rounded-2xl
                      shadow-xl
                      p-4
                      space-y-4
                      z-50
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <h4
                        className="
                          text-sm
                          font-bold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        Filters
                      </h4>

                      {activeFilterCount >
                        0 && (
                          <button
                            onClick={() =>
                              setFilters({
                                vegOnly: false,
                                nonVegOnly: false,
                                minRating: 0,
                                maxPrice: null,
                              })
                            }
                            className="
                            text-xs
                            font-bold
                            hover:underline
                          "
                            style={{
                              color:
                                "var(--primary-color)",
                            }}
                          >
                            Reset
                          </button>
                        )}
                    </div>

                    {/* Dietary */}

                    <div className="space-y-2">
                      <label
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          font-semibold
                          text-slate-700
                          dark:text-slate-300
                          cursor-pointer
                        "
                      >
                        <input
                          type="checkbox"
                          checked={
                            filters.vegOnly
                          }
                          onChange={(e) =>
                            setFilters(
                              (f) => ({
                                ...f,
                                vegOnly:
                                  e.target
                                    .checked,
                                nonVegOnly:
                                  e.target
                                    .checked
                                    ? false
                                    : f.nonVegOnly,
                              })
                            )
                          }
                        />

                        Veg only
                      </label>

                      <label
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          font-semibold
                          text-slate-700
                          dark:text-slate-300
                          cursor-pointer
                        "
                      >
                        <input
                          type="checkbox"
                          checked={
                            filters.nonVegOnly
                          }
                          onChange={(e) =>
                            setFilters(
                              (f) => ({
                                ...f,
                                nonVegOnly:
                                  e.target
                                    .checked,
                                vegOnly:
                                  e.target
                                    .checked
                                    ? false
                                    : f.vegOnly,
                              })
                            )
                          }
                        />

                        Non-veg only
                      </label>
                    </div>

                    {/* Rating */}

                    <div className="space-y-1">
                      <p
                        className="
                          text-xs
                          font-semibold
                          text-slate-700
                          dark:text-slate-300
                        "
                      >
                        Minimum rating
                      </p>

                      <div className="flex gap-1">
                        {[
                          0,
                          3,
                          3.5,
                          4,
                          4.5,
                        ].map(
                          (r) => (
                            <button
                              key={r}
                              onClick={() =>
                                setFilters(
                                  (f) => ({
                                    ...f,
                                    minRating:
                                      r,
                                  })
                                )
                              }
                              className="
                                px-2
                                py-1
                                rounded-lg
                                text-[11px]
                                font-bold
                                border
                              "
                              style={{
                                backgroundColor:
                                  filters.minRating ===
                                    r
                                    ? "var(--primary-color)"
                                    : darkMode
                                      ? "#181A1B"
                                      : "white",

                                color:
                                  filters.minRating ===
                                    r
                                    ? "white"
                                    : darkMode
                                      ? "#cbd5e1"
                                      : "#334155",

                                borderColor:
                                  filters.minRating ===
                                    r
                                    ? "var(--primary-color)"
                                    : darkMode
                                      ? "#334155"
                                      : "#e2e8f0",
                              }}
                            >
                              {r === 0
                                ? "Any"
                                : `${r}+`}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Max price */}

                    <div className="space-y-1">
                      <p
                        className="
                          text-xs
                          font-semibold
                          text-slate-700
                          dark:text-slate-300
                        "
                      >
                        Max price
                      </p>

                      <input
                        type="number"
                        min={0}
                        placeholder="No limit"
                        value={
                          filters.maxPrice ??
                          ""
                        }
                        onChange={(e) =>
                          setFilters(
                            (f) => ({
                              ...f,
                              maxPrice:
                                e.target
                                  .value
                                  ? Number(
                                    e.target
                                      .value
                                  )
                                  : null,
                            })
                          )
                        }
                        className="
                          w-full
                          border
                          border-slate-200
                          dark:border-white/10
                          rounded-xl
                          px-3
                          py-2
                          text-xs
                          text-slate-900
                          dark:text-white
                          outline-none
                          focus:border-[var(--primary-color)]
                        "
                      />
                    </div>

                    {/* Apply */}

                    <button
                      onClick={() =>
                        setShowFilterPanel(
                          false
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        py-2
                        text-xs
                        font-bold
                        text-white
                      "
                      style={{
                        backgroundColor:
                          "var(--primary-color)",
                      }}
                    >
                      Apply
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

     {/* ===================================================
    CATEGORIES
=================================================== */}

<div className="w-full overflow-hidden">
  <div
    className="
      flex
      w-full
      overflow-x-auto
      scrollbar-none
      snap-x
      snap-mandatory
    "
  >
    {Array.from({
      length: Math.ceil(categories.length / 8),
    }).map((_, pageIndex) => {
      const pageCategories = categories.slice(
        pageIndex * 8,
        pageIndex * 8 + 8
      );

      return (
        <div
          key={pageIndex}
          className="
            grid
            mt-2
            w-full
            min-w-full
            shrink-0
            grid-cols-4
            grid-rows-2
            lg:grid-cols-8
            lg:grid-rows-1
            gap-x-3
            gap-y-4
            snap-start
          "
        >
          {pageCategories.map((cat) => {
            const categoryName = getCategoryName(cat);
            const CategoryFallbackIcon =
              getCategoryFallbackIcon(categoryName);

            /*
             * =================================================
             * CATEGORY IMAGE
             *
             * Priority:
             * 1. category.image
             * 2. category.image_url
             * 3. category.category_image
             * 4. first product image
             *
             * All images come from the backend.
             * =================================================
             */

            const categoryImage =
              typeof cat !== "string"
                ? (
                    cat?.image ||
                    cat?.image_url ||
                    cat?.imageUrl ||
                    cat?.category_image ||
                    cat?.category_image_url ||
                    cat?.categoryImage ||
                    (
                      Array.isArray(cat?.products) &&
                      cat.products.length > 0
                        ? cat.products[0]?.image
                        : null
                    ) ||
                    mockCategoryImages[categoryName] ||
                    null
                  )
                : mockCategoryImages[categoryName] || null;

            const isActive =
              selectedCategory
                .trim()
                .toLowerCase() ===
              categoryName
                .trim()
                .toLowerCase();

            const categoryKey =
              typeof cat === "string"
                ? cat
                : cat?.category_id ||
                  cat?.id ||
                  cat?._id ||
                  cat?.name ||
                  categoryName;

            return (
              <button
                key={categoryKey}
                type="button"
                onClick={() =>
                  setSelectedCategory(categoryName)
                }
                className="
                  flex
                  min-w-0
                  flex-col
                  items-center
                  justify-start
                  gap-1.5
                  cursor-pointer
                  group
                  outline-none
                "
              >
                {/* =========================================
                    CATEGORY IMAGE
                ========================================= */}

                <div
                  className={`
                    relative
                    h-[58px]
                    w-[58px]
                    shrink-0
                    overflow-hidden
                    rounded-full
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "ring-2 ring-[var(--primary-color)] ring-offset-1"
                        : ""
                    }
                  `}
                  style={{
                    backgroundColor:
                      "var(--secondary-color)",
                  }}
                >
                  {categoryImage && !failedCategoryImages.has(String(categoryKey)) ? (
                    <img
                      src={categoryImage}
                      alt={categoryName}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-300
                        group-hover:scale-105
                      "
                      loading="lazy"
                      onError={() => {
                        setFailedCategoryImages((previous) => {
                          const updated = new Set(previous);
                          updated.add(String(categoryKey));
                          return updated;
                        });
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <CategoryFallbackIcon
                        size={25}
                        strokeWidth={2}
                        style={{ color: "var(--primary-color)" }}
                      />
                    </div>
                  )}
                </div>

                {/* =========================================
                    CATEGORY NAME
                ========================================= */}

                <span
                  className={`
                    w-full
                    truncate
                    px-0.5
                    text-center
                    text-[11px]
                    leading-[14px]
                    font-medium
                    ${
                      isActive
                        ? "text-[var(--primary-color)]"
                        : "text-slate-700"
                    }
                  `}
                >
                  {categoryName}
                </span>
              </button>
            );
          })}
        </div>
      );
    })}
  </div>
</div>

      {/* ===================================================
          EMPTY RESULTS
      =================================================== */}

      {Object.keys(
        groupedMenu
      ).length === 0 ? (
        <div
          className="
            bg-white
            dark:bg-[#181A1B]
            rounded-3xl
            p-12
            text-center
            border
            border-slate-200
            dark:border-white/10
            shadow-xs
            space-y-3
            w-full
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--primary-color) 10%, white)",
              color:
                "var(--primary-color)",
            }}
          >
            <Search size={24} />
          </div>

          <p
            className="
              text-sm
              font-bold
              text-slate-700
              dark:text-slate-300
            "
          >
            No food items found
            matching your search.
          </p>

          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(
                "All"
              );
            }}
            className="
              text-xs
              font-bold
              underline
              cursor-pointer
            "
            style={{
              color:
                "var(--primary-color)",
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        /* =================================================
           GROUPED MENU
        ================================================= */

        <div
          className="
            w-full
            space-y-6
          "
        >
          {Object.entries(
            groupedMenu
          ).map(
            ([
              categoryName,
              items,
            ]) => {
              return (
                <div
                  key={categoryName}
                  className="
                    space-y-3
                    w-full
                  "
                >
                    {/* ===================================================
                      CATEGORY HEADING
                  =================================================== */}

                    <div
                      className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-slate-100
                      dark:border-slate-800
                      pb-2
                    "
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Category Image */}

                        <div
                          className="
                          h-8
                          w-8
                          shrink-0
                          overflow-hidden
                          rounded-full
                        "
                          style={{
                            backgroundColor:
                              "var(--secondary-color)",
                          }}
                        >
                          {findCategoryImage(
                          categoryName
                        ) && (
                            <img
                              src={findCategoryImage(
                              categoryName
                            )}
                              alt={
                              categoryName
                            }
                              className="
                              h-full
                              w-full
                              object-cover
                            "
                              loading="lazy"
                              onError={(
                                event
                              ) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          )}
                        </div>

                        {/* Category Name */}

                        <h2
                          className="
                          truncate
                          text-sm
                          sm:text-base
                          font-black
                          text-slate-900
                          dark:text-white
                        "
                        >
                          {categoryName}
                        </h2>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedCategory(
                          categoryName
                        )
                        }
                        className="
                        flex
                        shrink-0
                        items-center
                        gap-1
                        text-xs
                        font-bold
                        cursor-pointer
                      "
                        style={{
                          color:
                          "var(--primary-color)",
                        }}
                      >
                        View All

                        <ChevronRight
                        size={14}
                      />
                      </button>
                    </div>

                  {/* Products */}

                  <div
                    className="
                      grid
                      grid-cols-2
                      sm:grid-cols-3
                      md:grid-cols-4
                      lg:grid-cols-5
                      gap-2.5
                      sm:gap-4
                      w-full
                    "
                  >
                    {items.map(
                      (product) => {
                        const qty =
                          getCartItem(
                            product.id
                          )?.quantity ||
                          0;

                        const isFav =
                          isProductFavourite(
                            favouriteProducts,
                            product.id
                          );

                        return (
                          <ReusableProductCard
                            key={
                              product.id ||
                              product._id
                            }
                            product={
                              product
                            }
                            qty={qty}
                            isFav={
                              isFav
                            }
                            isStoreOpen={
                              isStoreOpen
                            }
                            onCardClick={(
                              prod
                            ) =>
                              navigate(
                                isGuestFlow
                                  ? `/customer/product/${prod.id ||
                                  prod._id
                                  }/${table_token}`
                                  : `/customer/product/${prod.id ||
                                  prod._id
                                  }`
                              )
                            }
                            onToggleFavourite={(
                              prod
                            ) =>
                              toggleFavourite(
                                prod
                              )
                            }
                            onAdd={(
                              prod
                            ) =>
                              handleAdd(
                                prod
                              )
                            }
                            onIncrease={(
                              prod
                            ) =>
                              increaseQuantity(
                                prod
                              )
                            }
                            onDecrease={(
                              prod
                            ) =>
                              decreaseQuantity(
                                prod
                              )
                            }
                          />
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* ===================================================
          LOGIN POPUP
      =================================================== */}

      <AnimatePresence>
        {showLoginPopup && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowLoginPopup(false);
            }}
            className="
              fixed
              inset-0
              z-[70]
              flex
              items-center
              justify-center
              bg-black/60
              backdrop-blur-xs
              p-4
            "
          >
            <motion.div
              onClick={(e) =>
                e.stopPropagation()
              }
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                w-full
                max-w-sm
                rounded-3xl
                bg-white
                dark:bg-[#181A1B]
                p-6
                text-center
                space-y-4
                shadow-2xl
              "
            >
              {/* Login Icon */}

              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                "
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--primary-color) 10%, white)",
                  color:
                    "var(--primary-color)",
                }}
              >
                <UserRound
                  size={28}
                />
              </div>

              {/* Content */}

              <div className="space-y-1">
                <h3
                  className="
                    text-lg
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Login Required
                </h3>

                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                    font-medium
                  "
                >
                  Please log in to add
                  items to your cart
                  and place an order.
                </p>
              </div>

              {/* Actions */}

              <div
                className="
                  flex
                  flex-col
                  gap-2
                  pt-1
                "
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      "/auth/login"
                    );
                  }}
                  className="
                    w-full
                    rounded-2xl
                    text-white
                    py-3
                    text-sm
                    font-semibold
                    transition
                  "
                  style={{
                    backgroundColor:
                      "var(--primary-color)",
                  }}
                >
                  Login Now
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLoginPopup(
                      false
                    );
                  }}
                  className="
                    w-full
                    rounded-2xl
                    py-3
                    text-sm
                    font-semibold
                    text-slate-500
                    dark:text-slate-400
                    hover:bg-slate-100
                    dark:hover:bg-white/10
                    transition
                  "
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
