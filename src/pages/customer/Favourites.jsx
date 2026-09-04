import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import ReusableProductCard from "../../components/customer/ReusableProductCard";
import useCartStore from "../../api/stores/customerstore/cartStore";
import useProductStore from "../../store/productStore";
import { useFavourite } from "../../context/FavouriteContext";
import { normalizeProduct } from "../../util/normalizeProduct";
import { useMemo } from "react";

const Favourites = () => {
  const navigate = useNavigate();

  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const storeInfo = useProductStore(
    (s) => s.store || s.storeInfo || s.currentStore
  );

  const isStoreOpen = useMemo(() => {
    if (storeInfo?.is_open !== undefined) {
      return Boolean(storeInfo.is_open);
    }

    if (storeInfo?.data?.is_open !== undefined) {
      return Boolean(storeInfo.data.is_open);
    }

    return true;
  }, [storeInfo]);

  const {
    favouriteProducts: rawFavourites,
    toggleFavourite,
    loading,
  } = useFavourite();

  const favouriteProducts = rawFavourites.map(normalizeProduct);

  const getCartItem = (productId) =>
    cartItems.find((item) => {
      const pid =
        typeof item.product_id === "object"
          ? item.product_id?._id || item.product_id?.id
          : item.product_id ??
            item.productId ??
            item.product?._id ??
            item._id ??
            item.id;

      return String(pid) === String(productId);
    });

  const handleAdd = (product) => {
    addToCart(product).catch(() => {});
  };

  const increaseQuantity = (product) => {
    const prodId = product._id || product.id;
    const existing = getCartItem(prodId);

    if (existing) {
      updateQuantity(
        existing._id || existing.id,
        Number(existing.quantity) + 1
      ).catch(() => {});
    } else {
      handleAdd(product);
    }
  };

  const decreaseQuantity = (product) => {
    const prodId = product._id || product.id;
    const existing = getCartItem(prodId);

    if (!existing) return;

    const targetId = existing._id || existing.id;

    if (Number(existing.quantity) <= 1) {
      removeItem(targetId).catch(() => {});
    } else {
      updateQuantity(
        targetId,
        Number(existing.quantity) - 1
      ).catch(() => {});
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="min-h-screen bg-slate-100 dark:bg-[#1E2021] pb-28"
    >
      <div className="mx-auto w-full max-w-[1780px]">

        {/* ================= CONTENT ================= */}
        <section className="px-4 pt-5 sm:px-6 lg:px-8">

          {/* Section heading */}
          {!loading && favouriteProducts.length > 0 && (
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-slate-900 dark:text-white">
                  Saved for later
                </h2>

                <p className="mt-0.5 text-[12px] font-medium text-slate-500 dark:text-slate-400">
                  Your favourite food items
                </p>
              </div>

              <div
                className="
                  rounded-full
                  px-3 py-1.5
                  text-[11px]
                  font-bold
                "
                style={{
                  background: "color-mix(in srgb, var(--primary-color) 10%, transparent)",
                  color: "var(--primary-color)",
                }}
              >
                {favouriteProducts.length}{" "}
                {favouriteProducts.length === 1 ? "item" : "items"}
              </div>
            </div>
          )}

          {/* ================= LOADING ================= */}
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    h-[220px]
                    animate-pulse
                    rounded-[20px]
                    border border-slate-200 dark:border-white/10
                    bg-white dark:bg-[#181A1B]
                  "
                />
              ))}
            </div>
          ) : favouriteProducts.length === 0 ? (

            /* ================= EMPTY STATE ================= */
            <div
              className="
                flex min-h-[300px]
                flex-col items-center justify-center
                rounded-[26px]
                bg-slate-100 dark:bg-[#181A1B]
                px-6 py-12
                text-center

              "
            >
              {/* Icon */}
              <div
                className="
                  flex h-[82px] w-[82px]
                  items-center justify-center
                  rounded-full
                "
                style={{
                  background:
                    "color-mix(in srgb, var(--primary-color) 10%, transparent)",
                  color: "var(--primary-color)",
                }}
              >
                <Heart
                  size={36}
                  strokeWidth={1.8}
                />
              </div>

              <h2 className="mt-6 text-[21px] font-extrabold tracking-[-0.025em] text-slate-900 dark:text-white">
                No favourites yet
              </h2>

              <p className="mt-2 max-w-[280px] text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                Save the dishes you love and they’ll appear here for quick
                ordering.
              </p>

              <button
                type="button"
                onClick={() => navigate("/customer/menu")}
                className="
                  mt-7
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  px-6
                  text-[13px]
                  font-extrabold
                  text-white
                  shadow-sm
                  transition
                  active:scale-[0.97]
                "
                style={{
                  background: "var(--primary-color)",
                }}
              >
                <ShoppingBag size={16} />
                Browse Menu
              </button>
            </div>

          ) : (

            /* ================= PRODUCTS ================= */
            <div
              className="
                grid
                grid-cols-2
                gap-x-2.5
                gap-y-3
                sm:grid-cols-3
                sm:gap-4
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
              "
            >
              {favouriteProducts.map((product) => {
                const pId = product._id || product.id;

                return (
                  <ReusableProductCard
                    key={pId}
                    product={product}
                    qty={getCartItem(pId)?.quantity ?? 0}
                    isFav={true}
                    isStoreOpen={isStoreOpen}
                    onCardClick={() =>
                      navigate(`/customer/product/${pId}`)
                    }
                    onToggleFavourite={() =>
                      toggleFavourite(product)
                    }
                    onAdd={() => handleAdd(product)}
                    onIncrease={() =>
                      increaseQuantity(product)
                    }
                    onDecrease={() =>
                      decreaseQuantity(product)
                    }
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </motion.main>
  );
};

export default Favourites;
