import SkeletonLoader from "./SkeletonLoader";

const CartSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      {/* Page Header */}
      <div>
        <SkeletonLoader
          className="h-8 w-44"
          rounded=""
        />

        <SkeletonLoader
          className="mt-2 h-4 w-72"
          rounded=""
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Cart Items */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              {/* Image */}
              <SkeletonLoader
                className="h-24 w-24 flex-shrink-0 rounded-2xl"
                rounded=""
              />

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <SkeletonLoader
                    className="h-5 w-48"
                    rounded=""
                  />

                  <SkeletonLoader
                    className="mt-3 h-4 w-32"
                    rounded=""
                  />

                  <SkeletonLoader
                    className="mt-2 h-4 w-20"
                    rounded=""
                  />
                </div>

                <div className="flex items-center justify-between">
                  <SkeletonLoader
                    className="h-6 w-16"
                    rounded=""
                  />

                  <SkeletonLoader
                    className="h-10 w-28 rounded-full"
                    rounded=""
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bill Summary */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SkeletonLoader
            className="h-7 w-40"
            rounded=""
          />

          <div className="mt-6 space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between"
              >
                <SkeletonLoader
                  className="h-4 w-24"
                  rounded=""
                />

                <SkeletonLoader
                  className="h-4 w-14"
                  rounded=""
                />
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-slate-200" />

          <div className="flex items-center justify-between">
            <SkeletonLoader
              className="h-6 w-28"
              rounded=""
            />

            <SkeletonLoader
              className="h-6 w-20"
              rounded=""
            />
          </div>

          <SkeletonLoader
            className="mt-6 h-14 w-full rounded-2xl"
            rounded=""
          />
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;