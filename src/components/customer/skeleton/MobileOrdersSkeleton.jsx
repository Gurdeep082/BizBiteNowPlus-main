import SkeletonLoader from "./SkeletonLoader";
import MobileCurrentCardSkeleton from "./MobileCurrentCardSkeleton";
import MobileTimelineSkeleton from "./MobileTimelineSkeleton";
import ContactDeliveryCardSkeleton from "./ContactDeliveryCardSkeleton";
import CompactHistoryCardSkeleton from "./CompactHistoryCardSkeleton";

const MobileOrdersSkeleton = () => {
  return (
    <div className="space-y-5 pb-24">
      <div className="px-1">
        {/* Header */}

        <div className="mt-5 flex items-center justify-between rounded-xl bg-white p-2 shadow-sm">
          <div>
            <SkeletonLoader
              className="h-7 w-40"
              rounded=""
            />

            <SkeletonLoader
              className="mt-2 h-4 w-52"
              rounded=""
            />
          </div>

          <SkeletonLoader
            className="h-11 w-11 rounded-[10px]"
            rounded=""
          />
        </div>

        {/* Current Order */}

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <SkeletonLoader
              className="h-7 w-40"
              rounded=""
            />

            <SkeletonLoader
              className="h-7 w-20 rounded-full"
              rounded=""
            />
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-[14px] bg-white shadow-sm">
              <MobileCurrentCardSkeleton />

              <div className="my-4 border-t border-slate-200" />

              <MobileTimelineSkeleton />

              <ContactDeliveryCardSkeleton />
            </div>
          </div>
        </section>

        {/* Divider */}

        <div className="my-6 flex justify-center">
          <SkeletonLoader
            className="h-1.5 w-16 rounded-full"
            rounded=""
          />
        </div>

        {/* Order History */}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <SkeletonLoader
              className="h-7 w-36"
              rounded=""
            />

            <SkeletonLoader
              className="h-4 w-20"
              rounded=""
            />
          </div>

          <div className="space-y-3 pb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <CompactHistoryCardSkeleton
                key={index}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MobileOrdersSkeleton;