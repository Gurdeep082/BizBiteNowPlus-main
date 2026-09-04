import SkeletonLoader from "./SkeletonLoader";

const OrderSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      {/* Header */}
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

      {/* Status Tabs */}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonLoader
            key={index}
            className="h-10 w-28 rounded-full flex-shrink-0"
            rounded=""
          />
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <SkeletonLoader
                  className="h-5 w-40"
                  rounded=""
                />

                <SkeletonLoader
                  className="mt-2 h-4 w-24"
                  rounded=""
                />
              </div>

              <SkeletonLoader
                className="h-9 w-24 rounded-full"
                rounded=""
              />
            </div>

            {/* Products */}
            <div className="space-y-4 p-5">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-4"
                >
                  <SkeletonLoader
                    className="h-20 w-20 rounded-2xl flex-shrink-0"
                    rounded=""
                  />

                  <div className="flex-1">
                    <SkeletonLoader
                      className="h-5 w-48"
                      rounded=""
                    />

                    <SkeletonLoader
                      className="mt-3 h-4 w-28"
                      rounded=""
                    />

                    <SkeletonLoader
                      className="mt-2 h-4 w-20"
                      rounded=""
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 p-5">
              <SkeletonLoader
                className="h-6 w-24"
                rounded=""
              />

              <SkeletonLoader
                className="h-11 w-36 rounded-2xl"
                rounded=""
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSkeleton;