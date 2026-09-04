import ProductCardSkeleton from "./ProductCardSkeleton";
import SkeletonLoader from "./SkeletonLoader";

const HorizontalSectionSkeleton = ({
  count = 5,
}) => {
  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <SkeletonLoader
            className="h-7 w-44"
            rounded=""
          />

          <SkeletonLoader
            className="mt-2 h-4 w-32"
            rounded=""
          />
        </div>

        <SkeletonLoader
          className="h-5 w-16"
          rounded=""
        />
      </div>

      {/* Horizontal Cards */}
      <div
        className="
          flex
          gap-4
          overflow-x-hidden
          pb-2
        "
      >
        {Array.from({
          length: count,
        }).map((_, index) => (
          <ProductCardSkeleton
            key={index}
          />
        ))}
      </div>
    </section>
  );
};

export default HorizontalSectionSkeleton;