import SkeletonLoader from "./SkeletonLoader";

const QROrderCardSkeleton = () => {
  return (
    <section className="lg:hidden px-2">
      <div
        className="
          flex
          items-center
          justify-between
          rounded-2xl
          bg-white
          px-5
          py-2
          shadow-[0_4px_12px_rgba(15,23,42,0.08)]
        "
      >
        {/* Left */}

        <div className="flex flex-1 items-center gap-3 min-w-0">
          {/* QR Icon */}

          <SkeletonLoader
            className="
              h-9
              w-9
              rounded-lg
              flex-shrink-0
            "
            rounded=""
          />

          {/* Text */}

          <div className="flex-1 min-w-0">
            <SkeletonLoader
              className="h-4 w-44"
              rounded=""
            />

            <SkeletonLoader
              className="mt-2 h-3 w-full"
              rounded=""
            />

            <SkeletonLoader
              className="mt-1 h-3 w-3/4"
              rounded=""
            />

            <SkeletonLoader
              className="mt-2 h-3 w-16"
              rounded=""
            />
          </div>
        </div>

        {/* Scan Button */}

        <SkeletonLoader
          className="
            ml-4
            h-8
            w-24
            rounded-xl
            flex-shrink-0
          "
          rounded=""
        />
      </div>
    </section>
  );
};

export default QROrderCardSkeleton;