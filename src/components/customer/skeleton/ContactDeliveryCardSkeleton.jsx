import SkeletonLoader from "./SkeletonLoader";

const ContactDeliveryCardSkeleton = () => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonLoader
            className="h-14 w-14 rounded-full"
            rounded=""
          />

          <div>
            <SkeletonLoader
              className="h-5 w-40"
              rounded=""
            />

            <SkeletonLoader
              className="mt-2 h-4 w-28"
              rounded=""
            />
          </div>
        </div>

        <SkeletonLoader
          className="h-9 w-20 rounded-full"
          rounded=""
        />
      </div>

      {/* Info */}

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3">
          <SkeletonLoader
            className="h-5 w-5 rounded-full"
            rounded=""
          />

          <SkeletonLoader
            className="h-4 flex-1"
            rounded=""
          />
        </div>

        <div className="flex items-center gap-3">
          <SkeletonLoader
            className="h-5 w-5 rounded-full"
            rounded=""
          />

          <SkeletonLoader
            className="h-4 w-40"
            rounded=""
          />
        </div>
      </div>

      {/* Buttons */}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <SkeletonLoader
          className="h-11 rounded-xl"
          rounded=""
        />

        <SkeletonLoader
          className="h-11 rounded-xl"
          rounded=""
        />
      </div>
    </div>
  );
};

export default ContactDeliveryCardSkeleton;