import SkeletonLoader from "./SkeletonLoader";

const MobileTimelineSkeleton = () => {
  return (
    <div className="px-4 pb-4 overflow-hidden">
      <div className="flex items-start justify-between">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative flex flex-1 flex-col items-center"
          >
            {/* Connector */}

            {index !== 3 && (
              <SkeletonLoader
                className="
                  absolute
                  top-4
                  left-1/2
                  h-[2px]
                  w-full
                  -translate-x-0
                "
                rounded=""
              />
            )}

            {/* Circle */}

            <SkeletonLoader
              className="
                relative
                z-10
                h-8
                w-8
                rounded-full
              "
              rounded=""
            />

            {/* Title */}

            <SkeletonLoader
              className="
                mt-3
                h-3
                w-16
              "
              rounded=""
            />

            {/* Time */}

            <SkeletonLoader
              className="
                mt-2
                h-3
                w-10
              "
              rounded=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileTimelineSkeleton;