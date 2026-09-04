import React from "react";
import {
  X,
  Package,
  Tag,
  IndianRupee,
  Star,
  Layers,
  PlusCircle,
} from "lucide-react";

// TERE NAYE UI COMPONENTS
import Typography from "../UI/Typography";
import Badge from "../UI/Badge";

export default function ProductDrawer({ open, onClose, product }) {
  if (!open || !product) return null;

  const isAvailable = product.available === true || product.is_available === true;
  const isVeg = product.isVeg ?? product.is_veg ?? true;
  const foodType = product.foodType || (isVeg ? "Veg" : "Non-Veg");
  const variants = product.variants || [];
  const addons = product.addons || [];

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className="fixed inset-0 z-40 h-full bg-black/40 backdrop-blur-sm" />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-[9999] h-screen w-full max-w-xl overflow-y-auto bg-white shadow-2xl transition-transform transform translate-x-0">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-white p-6">
          <Typography variant="h4">Product Details</Typography>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 cursor-pointer text-slate-500 transition">
            <X size={20} />
          </button>
        </div>

        {/* Image */}
        <div className="relative">
          <img
            src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"}
            alt={product.name}
            className="h-72 w-full object-cover"
          />

          {/* Veg / Non-Veg tag on the image using UI Badge */}
          <Badge
            status={isVeg ? "success" : "danger"}
            className="absolute left-4 top-4 !bg-white/95 backdrop-blur-sm shadow-sm"
          >
            <div className={`h-2.5 w-2.5 mr-1.5 rounded-full ${isVeg ? "bg-emerald-600" : "bg-rose-600"}`} />
            {foodType}
          </Badge>

          {/* Availability tag on the image using UI Badge */}
          <Badge
            status={isAvailable ? "in stock" : "out of stock"}
            className="absolute right-4 top-4 shadow-sm !bg-white/95 backdrop-blur-sm"
          >
            {isAvailable ? "Available" : "Out of Stock"}
          </Badge>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          <div>
            <Typography variant="h2">{product.name}</Typography>
            <Typography variant="p" className="mt-2">
              {product.description || "No description available."}
            </Typography>
          </div>

          {/* Core Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Info icon={<Tag size={18} />} title="Category" value={product.category || "—"} />
            <Info icon={<IndianRupee size={18} />} title="Selling Price" value={`₹${product.price ?? 0}`} />
            <Info icon={<Package size={18} />} title="SKU" value={product.sku || product.sku_code || "Not Assigned"} />
            <Info
              icon={<Star size={18} className="fill-amber-500 text-amber-500" />}
              title="Rating"
              value={`${product.rating ?? "—"} / 5`}
            />
          </div>

          {/* Sizes / Variants */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Layers size={18} className="text-[#1A4D2E]" />
              <Typography variant="h5">Sizes Available</Typography>
            </div>

            {variants.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4">
                <Typography variant="small" align="text-center" className="w-full">
                  No size options — this product is sold as a single size.
                </Typography>
              </div>
            ) : (
              <div className="space-y-2">
                {variants.map((v, i) => (
                  <div
                    key={v.id || i}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <Typography variant="h6">{v.name}</Typography>
                    <Typography variant="h6" color="text-[#1A4D2E]">
                      +₹{v.price_delta ?? v.price ?? 0}
                    </Typography>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add-ons */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <PlusCircle size={18} className="text-[#1A4D2E]" />
              <Typography variant="h5">Add-ons Available</Typography>
            </div>

            {addons.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4">
                <Typography variant="small" align="text-center" className="w-full">
                  No add-ons configured for this product.
                </Typography>
              </div>
            ) : (
              <div className="space-y-2">
                {addons.map((a, i) => (
                  <div
                    key={a.id || i}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <Typography variant="h6">{a.name}</Typography>
                      {a.description && (
                        <Typography variant="small" className="mt-0.5">
                          {a.description}
                        </Typography>
                      )}
                    </div>
                    <Typography variant="h6" color="text-[#1A4D2E]">
                      +₹{a.price ?? 0}
                    </Typography>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Sub-component updated with Typography
function Info({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 bg-white">
      <div className="rounded-lg bg-slate-100 p-3 text-slate-500">{icon}</div>
      <div>
        <Typography variant="small">{title}</Typography>
        <Typography variant="h6">{value}</Typography>
      </div>
    </div>
  );
}