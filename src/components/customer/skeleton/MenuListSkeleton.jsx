import SkeletonLoader from "./SkeletonLoader";

const MenuListSkeleton = () => {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-2.5
        shadow-sm
      "
    >
      {/* Image */}

      <div className="relative h-20 w-20 flex-shrink-0">
        <SkeletonLoader
          className="h-full w-full rounded-xl"
          rounded=""
        />

        {/* Favourite */}

        <div className="absolute -left-1 -top-1">
          <SkeletonLoader
            className="h-7 w-7 rounded-full"
            rounded=""
          />
        </div>
      </div>

      {/* Content */}

      <div className="min-w-0 flex-1">
        {/* Name */}

        <SkeletonLoader
          className="h-4 w-[85%]"
          rounded=""
        />

        <SkeletonLoader
          className="mt-2 h-4 w-[60%]"
          rounded=""
        />

        {/* Rating */}

        <div className="mt-3 flex items-center gap-2">
          <SkeletonLoader
            className="h-3 w-3 rounded-full"
            rounded=""
          />

          <SkeletonLoader
            className="h-3 w-10"
            rounded=""
          />

          <SkeletonLoader
            className="h-3 w-8"
            rounded=""
          />
        </div>

        {/* Price */}

        <div className="mt-3 flex items-center gap-2">
          <SkeletonLoader
            className="h-5 w-14"
            rounded=""
          />

          <SkeletonLoader
            className="h-3 w-10"
            rounded=""
          />
        </div>
      </div>

      {/* Action */}

      <SkeletonLoader
        className="h-9 w-[72px] rounded-xl"
        rounded=""
      />
    </div>
  );
};

export default MenuListSkeleton;