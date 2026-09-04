import SkeletonLoader from "./SkeletonLoader";

const MobileCurrentCardSkeleton = () => {
  return (
    <div
      className="
        overflow-hidden
        rounded-[14px]
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-100
          px-4
          py-3
        "
      >
        <div>
          <SkeletonLoader
            className="h-5 w-36"
            rounded=""
          />

          <SkeletonLoader
            className="mt-2 h-3 w-24"
            rounded=""
          />
        </div>

        <SkeletonLoader
          className="h-7 w-20 rounded-full"
          rounded=""
        />
      </div>

      {/* Body */}

      <div className="p-4">
        <div className="flex gap-3">
          {/* Image */}

          <SkeletonLoader
            className="
              h-20
              w-20
              rounded-2xl
              flex-shrink-0
            "
            rounded=""
          />

          {/* Content */}

          <div className="flex-1">
            <SkeletonLoader
              className="h-5 w-40"
              rounded=""
            />

            <SkeletonLoader
              className="mt-2 h-4 w-20"
              rounded=""
            />

            <div className="mt-4 flex items-center gap-2">
              <SkeletonLoader
                className="h-4 w-4 rounded-full"
                rounded=""
              />

              <SkeletonLoader
                className="h-4 w-24"
                rounded=""
              />
            </div>

            <SkeletonLoader
              className="mt-4 h-6 w-20"
              rounded=""
            />
          </div>
        </div>

        {/* Buttons */}

        <div className="mt-5 flex gap-3">
          <SkeletonLoader
            className="
              h-12
              flex-1
              rounded-xl
            "
            rounded=""
          />

          <SkeletonLoader
            className="
              h-12
              flex-1
              rounded-xl
            "
            rounded=""
          />
        </div>
      </div>
    </div>
  );
};

export default MobileCurrentCardSkeleton;