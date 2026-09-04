import SkeletonLoader from "./SkeletonLoader";

const ProductCardSkeleton = () => {
  return (
    <div
      className="
        flex
        h-[370px]
        w-[250px]
        flex-shrink-0
        flex-col
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Image */}
      <div className="relative h-40">
        <SkeletonLoader
          className="h-full w-full"
          rounded=""
        />

        {/* Favourite */}
        <div className="absolute right-2 top-2">
          <SkeletonLoader
            className="h-8 w-8 rounded-full"
            rounded=""
          />
        </div>

        {/* Veg Badge */}
        <div className="absolute left-2 top-2">
          <SkeletonLoader
            className="h-4 w-4 rounded"
            rounded=""
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3">
        {/* Name */}
        <SkeletonLoader
          className="h-4 w-[85%]"
          rounded=""
        />

        <SkeletonLoader
          className="mt-2 h-4 w-[60%]"
          rounded=""
        />

        {/* Description */}
        <SkeletonLoader
          className="mt-3 h-3 w-full"
          rounded=""
        />

        <SkeletonLoader
          className="mt-2 h-3 w-[75%]"
          rounded=""
        />

        {/* Rating */}
        <div className="mt-4 flex items-center gap-2">
          <SkeletonLoader
            className="h-4 w-4 rounded-full"
            rounded=""
          />

          <SkeletonLoader
            className="h-3 w-10"
            rounded=""
          />

          <SkeletonLoader
            className="h-3 w-8"
            rounded=""
          />
        </div>

        {/* Bottom */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <SkeletonLoader
              className="h-5 w-14"
              rounded=""
            />

            <SkeletonLoader
              className="mt-2 h-3 w-10"
              rounded=""
            />
          </div>

          <SkeletonLoader
            className="h-9 w-16 rounded-xl"
            rounded=""
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;