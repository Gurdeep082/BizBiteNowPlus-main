import SkeletonLoader from "./SkeletonLoader";
import ProductCardSkeleton from "./ProductCardSkeleton";

const MenuSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Search */}
      <SkeletonLoader
        className="h-12 w-full rounded-2xl"
        rounded=""
      />

      {/* Category Chips */}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonLoader
            key={index}
            className="h-10 w-28 rounded-full flex-shrink-0"
            rounded=""
          />
        ))}
      </div>

      {/* Section Title */}
      <div>
        <SkeletonLoader
          className="h-8 w-48"
          rounded=""
        />

        <SkeletonLoader
          className="mt-2 h-4 w-72"
          rounded=""
        />
      </div>

      {/* Products */}
      <div
        className="
          grid
          grid-cols-2
          gap-4

          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
        "
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductCardSkeleton
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuSkeleton;