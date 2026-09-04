const SkeletonBlock = ({
  className = "",
}) => (
  <div
    className={`
      animate-pulse
      rounded-xl
      bg-slate-200
      ${className}
    `}
  />
);

const OrderDetailsSkeleton = () => {
  return (
    <>
      {/* Desktop */}
      <main className="hidden w-full lg:block">
        <div className="mx-auto w-full max-w-[1600px] space-y-6">

          {/* Header */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SkeletonBlock className="h-11 w-11 rounded-xl" />

                <div className="space-y-2">
                  <SkeletonBlock className="h-7 w-48" />
                  <SkeletonBlock className="h-4 w-32" />
                </div>
              </div>

              <SkeletonBlock className="h-10 w-40 rounded-full" />
            </div>
          </section>

          {/* Status */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex justify-between gap-8">
              <div className="flex flex-1 gap-5">
                <SkeletonBlock className="h-16 w-16 rounded-2xl" />

                <div className="flex-1 space-y-3">
                  <SkeletonBlock className="h-7 w-56" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-4/5" />

                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <SkeletonBlock className="h-16" />
                    <SkeletonBlock className="h-16" />
                  </div>
                </div>
              </div>

              <SkeletonBlock className="h-40 w-40 rounded-full" />
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <SkeletonBlock className="mb-8 h-6 w-52" />

            <div className="flex justify-between">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center"
                >
                  <SkeletonBlock className="h-12 w-12 rounded-full" />
                  <SkeletonBlock className="mt-4 h-4 w-24" />
                  <SkeletonBlock className="mt-2 h-3 w-16" />
                </div>
              ))}
            </div>
          </section>

          {/* Bottom */}
          <section className="grid gap-6 xl:grid-cols-2">
            {[1, 2].map((card) => (
              <div
                key={card}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <SkeletonBlock className="mb-6 h-6 w-48" />

                <div className="space-y-4">
                  {[1, 2, 3, 4].map((row) => (
                    <div
                      key={row}
                      className="flex items-center gap-4"
                    >
                      <SkeletonBlock className="h-14 w-14 rounded-xl" />

                      <div className="flex-1 space-y-2">
                        <SkeletonBlock className="h-4 w-40" />
                        <SkeletonBlock className="h-3 w-28" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Share */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between">
              <div className="space-y-2">
                <SkeletonBlock className="h-6 w-48" />
                <SkeletonBlock className="h-4 w-72" />
              </div>

              <div className="flex gap-3">
                <SkeletonBlock className="h-11 w-36 rounded-xl" />
                <SkeletonBlock className="h-11 w-44 rounded-xl" />
                <SkeletonBlock className="h-11 w-11 rounded-xl" />
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Mobile */}
      <main className="space-y-3 bg-slate-50 p-3 lg:hidden">

        <SkeletonBlock className="h-16 rounded-2xl" />

        <SkeletonBlock className="h-40 rounded-2xl" />

        <SkeletonBlock className="h-72 rounded-2xl" />

        <SkeletonBlock className="h-80 rounded-2xl" />

        <SkeletonBlock className="h-72 rounded-2xl" />

        <SkeletonBlock className="h-12 rounded-xl" />

      </main>
    </>
  );
};

export default OrderDetailsSkeleton;