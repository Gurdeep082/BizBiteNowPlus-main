import SkeletonLoader from "./SkeletonLoader";

const StoreCardSkeleton = () => {
  return (
    <div
      className="
        rounded-[32px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <SkeletonLoader
            className="h-8 w-64"
            rounded=""
          />

          <SkeletonLoader
            className="mt-3 h-4 w-96 max-w-full"
            rounded=""
          />

          <SkeletonLoader
            className="mt-2 h-4 w-72"
            rounded=""
          />
        </div>

        <SkeletonLoader
          className="h-12 w-28 rounded-full"
          rounded=""
        />
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="
              rounded-2xl
              border
              border-slate-200
              p-4
            "
          >
            <SkeletonLoader
              className="h-5 w-5 rounded-full"
              rounded=""
            />

            <SkeletonLoader
              className="mt-3 h-5 w-24"
              rounded=""
            />

            <SkeletonLoader
              className="mt-2 h-3 w-16"
              rounded=""
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-3">
        {[1, 2, 3, 4].map((item) => (
          <SkeletonLoader
            key={item}
            className="h-12 w-36 rounded-2xl"
            rounded=""
          />
        ))}
      </div>
    </div>
  );
};

export default StoreCardSkeleton;