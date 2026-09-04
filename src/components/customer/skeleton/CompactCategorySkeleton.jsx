import SkeletonLoader from "./SkeletonLoader";

const CompactCategorySkeleton = () => {
  return (
    <div
      className="
        flex
        gap-3
        overflow-x-hidden
        px-4
        pb-2
        lg:hidden
      "
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonLoader
          key={index}
          className="
            h-10
            w-24
            flex-shrink-0
            rounded-xl
          "
          rounded=""
        />
      ))}
    </div>
  );
};

export default CompactCategorySkeleton;