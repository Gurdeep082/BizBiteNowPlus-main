import SkeletonLoader from "./SkeletonLoader";

const BannerSkeleton = () => {
  return (
    <div className="w-full">
      {/* Banner */}
      <SkeletonLoader
        className="
          h-[180px]
          w-full
          rounded-3xl
        "
        rounded=""
      />

      
    </div>
  );
};

export default BannerSkeleton;