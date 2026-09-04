import SkeletonLoader from "./SkeletonLoader";

const CompactFiltersSkeleton = () => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        px-4
        lg:hidden
      "
    >
      {/* Veg Toggle */}

      <div
        className="
          inline-flex
          items-center
          gap-1
          rounded-xl
          border
          border-slate-200
          bg-white
          p-1
          shadow-sm
        "
      >
        <SkeletonLoader
          className="h-9 w-14 rounded-xl"
          rounded=""
        />

        <SkeletonLoader
          className="h-9 w-16 rounded-xl"
          rounded=""
        />

        <SkeletonLoader
          className="h-9 w-20 rounded-xl"
          rounded=""
        />
      </div>

      {/* Sort Dropdown */}

      <SkeletonLoader
        className="
          h-11
          w-32
          rounded-xl
        "
        rounded=""
      />
    </div>
  );
};

export default CompactFiltersSkeleton;