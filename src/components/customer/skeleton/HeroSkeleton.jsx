import BannerSkeleton from "./BannerSkeleton";
import SkeletonLoader from "./SkeletonLoader";

const HeroSkeleton = () => {
  return (
    <section className="space-y-6">
      {/* Hero Banner */}
      <BannerSkeleton />

      {/* Store Info */}
      <div className="flex items-center gap-5 rounded-[32px] bg-white p-6 shadow-sm">
        {/* Logo */}
        <SkeletonLoader
          className="h-24 w-24 rounded-3xl flex-shrink-0"
          rounded=""
        />

        {/* Details */}
        <div className="flex-1">
          <SkeletonLoader
            className="h-8 w-60"
            rounded=""
          />

          <SkeletonLoader
            className="mt-3 h-4 w-80 max-w-full"
            rounded=""
          />

          <SkeletonLoader
            className="mt-2 h-4 w-52"
            rounded=""
          />

          <div className="mt-5 flex gap-3">
            <SkeletonLoader
              className="h-10 w-28 rounded-full"
              rounded=""
            />

            <SkeletonLoader
              className="h-10 w-24 rounded-full"
              rounded=""
            />
          </div>
        </div>

        {/* Status */}
        <SkeletonLoader
          className="h-12 w-28 rounded-full"
          rounded=""
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <SkeletonLoader
              className="h-6 w-6 rounded-full"
              rounded=""
            />

            <SkeletonLoader
              className="mt-4 h-5 w-20"
              rounded=""
            />

            <SkeletonLoader
              className="mt-2 h-3 w-14"
              rounded=""
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSkeleton;