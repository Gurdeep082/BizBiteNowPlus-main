import { Expand } from "lucide-react";

export default function ProductGallery({ product }) {
  const image =
    product?.image ||
    product?.imageUrl ||
    product?.thumbnail ||
    "/placeholder-food.png";

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181A1B] shadow-sm">
      <div className="group relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={product?.name}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        <button
          className="
            absolute
            right-4
            top-4
            hidden
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white/90
            shadow-lg
            backdrop-blur
            lg:flex
          "
        >
          <Expand size={18} />
        </button>
      </div>
    </div>
  );
}