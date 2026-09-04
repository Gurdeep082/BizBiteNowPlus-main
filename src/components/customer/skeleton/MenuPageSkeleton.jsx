import SkeletonLoader from "./SkeletonLoader";
import CompactCategorySkeleton from "./CompactCategorySkeleton";
import CompactFiltersSkeleton from "./CompactFiltersSkeleton";
import MenuListSkeleton from "./MenuListSkeleton";
import MenuGridSkeleton from "./MenuGridSkeleton";

const MenuPageSkeleton = () => {
  return (
    <div
      className="
        w-full
        min-w-0
        max-w-[1760px]
        space-y-6
        pb-28
        px-1
        sm:px-2
      "
    >
      {/* =============================== */}
      {/* Header */}
      {/* =============================== */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          rounded-xl
          bg-white
          p-3
          shadow-sm
        "
      >
        <div>
          <SkeletonLoader
            className="h-7 w-40"
            rounded=""
          />

          <SkeletonLoader
            className="mt-2 h-4 w-56"
            rounded=""
          />
        </div>

        <SkeletonLoader
          className="h-11 w-11 rounded-xl"
          rounded=""
        />
      </div>

      {/* =============================== */}
      {/* Categories */}
      {/* =============================== */}

      {/* Mobile */}
      <CompactCategorySkeleton />

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="flex gap-3 overflow-hidden px-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonLoader
              key={index}
              className="h-11 w-28 rounded-xl"
              rounded=""
            />
          ))}
        </div>
      </div>

      {/* =============================== */}
      {/* Filters */}
      {/* =============================== */}

      <CompactFiltersSkeleton />

      <div className="hidden lg:flex items-center justify-between px-4 lg:px-6">
        <SkeletonLoader
          className="h-11 w-64 rounded-xl"
          rounded=""
        />

        <SkeletonLoader
          className="h-11 w-44 rounded-xl"
          rounded=""
        />
      </div>

      {/* =============================== */}
      {/* Product Count */}
      {/* =============================== */}

      <div className="px-4 lg:px-6">
        <SkeletonLoader
          className="h-4 w-36"
          rounded=""
        />
      </div>

      {/* =============================== */}
      {/* Mobile Products */}
      {/* =============================== */}

      <div className="space-y-3 px-4 lg:hidden">
        {Array.from({ length: 8 }).map((_, index) => (
          <MenuListSkeleton key={index} />
        ))}
      </div>

      {/* =============================== */}
      {/* Desktop Products */}
      {/* =============================== */}

      <div className="px-4 lg:px-6">
        <MenuGridSkeleton count={12} />
      </div>
    </div>
  );
};

export default MenuPageSkeleton;