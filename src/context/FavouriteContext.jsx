/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore"; // 🟢 Auth store import karein seller_id aur phone ke liye

const FavouriteContext = createContext(null);

export const FavouriteProvider = ({ children }) => {
  const [favouriteProducts, setFavouriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🟢 Helper to get seller_id and customer phone from auth store or localStorage
  const getContextDetails = () => {
    const { profile, user } = useAuthStore.getState();
    const seller_id = profile?.seller_id || user?.seller_id || localStorage.getItem("seller_id");
    const customer_phone = profile?.customer_phone || user?.phoneNumber || user?.phone || localStorage.getItem("customer_phone") || "8470906961";
    return { seller_id, customer_phone };
  };

  const fetchFavourites = useCallback(async () => {
    const { seller_id, customer_phone } = getContextDetails();
    if (!seller_id || !customer_phone) return;

    try {
      setLoading(true);
      const res = await API.get(`/products/favorites`, {
        params: { seller_id, customer_phone }
      });
      const fetched = res.data?.favourites || res.data?.products || res.data?.data || [];
      setFavouriteProducts(Array.isArray(fetched) ? fetched : []);
    } catch (err) {
      console.error("Failed to fetch favourites from database:", err.response?.data || err.message);
      setFavouriteProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFavourites();
  }, [fetchFavourites]);

  const isFavourite = (productId) => {
    return favouriteProducts.some(
      (item) => String(item._id || item.id) === String(productId)
    );
  };

  const toggleFavourite = async (product) => {
    if (!product) return;
    const productId = product._id || product.id;
    const { seller_id, customer_phone } = getContextDetails();
    const exists = favouriteProducts.some((item) => String(item._id || item.id) === String(productId));

    if (!seller_id || !customer_phone) {
      toast.warn("Please log in to manage your wishlist.");
      return false;
    }

    // Optimistic UI Update
    setFavouriteProducts((prev) => {
      const exists = prev.some((item) => String(item._id || item.id) === String(productId));
      if (exists) {
        return prev.filter((item) => String(item._id || item.id) !== String(productId));
      }
      return [...prev, product];
    });

    try {
      // 🟢 Send seller_id and customer_phone along with product_id as required by backend controller
      await API.post("/products/toggle", {
        product_id: productId,
        seller_id,
        customer_phone,
      });
      toast.success(exists ? "Removed from your wishlist." : "Added to your wishlist.");
    } catch (err) {
      console.error("Failed to toggle favourite on backend:", err.response?.data || err.message);
      fetchFavourites(); // Revert on failure
      toast.error("Could not update your wishlist. Please try again.");
      return false;
    }
  };

  const clearFavourites = () => {
    setFavouriteProducts([]);
  };

  const value = useMemo(
    () => ({
      favouriteProducts,
      isFavourite,
      toggleFavourite,
      clearFavourites,
      loading,
      refetchFavourites: fetchFavourites,
    }),
    [favouriteProducts, loading, fetchFavourites]
  );

  return (
    <FavouriteContext.Provider value={value}>
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavourite = () => {
  const context = useContext(FavouriteContext);
  if (!context) {
    throw new Error("useFavourite must be used inside FavouriteProvider.");
  }
  return context;
};
