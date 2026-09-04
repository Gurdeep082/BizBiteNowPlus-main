import SkeletonLoader from "./SkeletonLoader";

const CompactHistoryCardSkeleton = () => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-3
        shadow-sm
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <SkeletonLoader
            className="h-11 w-11 rounded-xl"
            rounded=""
          />

          <div>
            <SkeletonLoader
              className="h-4 w-28"
              rounded=""
            />

            <SkeletonLoader
              className="mt-2 h-3 w-20"
              rounded=""
            />
          </div>
        </div>

        <SkeletonLoader
          className="h-6 w-20 rounded-full"
          rounded=""
        />
      </div>

      {/* Date & Amount */}

      <div className="mt-4 flex items-center justify-between">
        <SkeletonLoader
          className="h-4 w-28"
          rounded=""
        />

        <SkeletonLoader
          className="h-5 w-16"
          rounded=""
        />
      </div>

      {/* Order Type */}

      <div className="mt-4 flex items-center justify-between">
        <SkeletonLoader
          className="h-4 w-24"
          rounded=""
        />

        <SkeletonLoader
          className="h-4 w-20"
          rounded=""
        />
      </div>

      {/* Divider */}

      <div className="my-3 border-t border-slate-200" />

      {/* Actions */}

      <div className="grid grid-cols-3 divide-x divide-slate-200">
        <div className="flex justify-center py-2">
          <SkeletonLoader
            className="h-4 w-16"
            rounded=""
          />
        </div>

        <div className="flex justify-center py-2">
          <SkeletonLoader
            className="h-4 w-14"
            rounded=""
          />
        </div>

        <div className="flex justify-center py-2">
          <SkeletonLoader
            className="h-4 w-18"
            rounded=""
          />
        </div>
      </div>
    </div>
  );
};

export default CompactHistoryCardSkeleton;