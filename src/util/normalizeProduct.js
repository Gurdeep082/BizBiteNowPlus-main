export const normalizeProduct = (p) => ({
  ...p,
  id: p._id || p.id,
  name: p.name,
  price: p.price ?? 0,
  image: p.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
  description: p.description || "",
  category: p.category || "Other",
  isVeg: typeof p.is_veg === "boolean" ? p.is_veg : (typeof p.isVeg === "boolean" ? p.isVeg : true),
  available: p.is_available ?? p.available ?? true,
  originalPrice: p.originalPrice || null,
});

// Favourite match check — same logic sab jagah use karo taaki
// heart-icon fill status hamesha consistent rahe (Home/Menu/Favourites)
export const isProductFavourite = (favouriteProducts, productId) => {
  return favouriteProducts.some((item) => {
    const favId = typeof item === "string" ? item : (item._id || item.id || item.product_id);
    return String(favId) === String(productId);
  });
};