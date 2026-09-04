import SkeletonLoader from "./SkeletonLoader";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF5] px-4 py-5">
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SkeletonLoader
              className="h-14 w-14 rounded-full"
              rounded=""
            />

            <div>
              <SkeletonLoader
                className="h-5 w-40"
                rounded=""
              />

              <SkeletonLoader
                className="mt-2 h-4 w-28 rounded-full"
                rounded=""
              />
            </div>
          </div>

          <SkeletonLoader
            className="h-10 w-10 rounded-xl"
            rounded=""
          />
        </div>

        {/* Wallet + Rewards */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <SkeletonLoader
                  className="h-10 w-10 rounded-xl"
                  rounded=""
                />

                <div className="flex-1">
                  <SkeletonLoader
                    className="h-3 w-20"
                    rounded=""
                  />

                  <SkeletonLoader
                    className="mt-2 h-5 w-16"
                    rounded=""
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-4 ${
                index !== 4
                  ? "border-b border-slate-100"
                  : ""
              }`}
            >
              <SkeletonLoader
                className="h-5 w-5 rounded-md"
                rounded=""
              />

              <SkeletonLoader
                className="h-4 flex-1"
                rounded=""
              />

              <SkeletonLoader
                className="h-4 w-4"
                rounded=""
              />
            </div>
          ))}
        </div>

        {/* Logout */}
        <SkeletonLoader
          className="h-14 w-full rounded-2xl"
          rounded=""
        />
      </div>
    </div>
  );
};

export default ProfileSkeleton;