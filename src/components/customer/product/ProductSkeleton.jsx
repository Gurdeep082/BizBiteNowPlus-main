export default function ProductSkeleton() {
  return (
    <div className="animate-pulse">

      {/* Header */}

      <div className="mb-8 h-10 w-48 rounded-xl bg-gray-200" />

      {/* Hero Section */}

      <div className="grid gap-8 lg:grid-cols-2">

        {/* Gallery */}

        <div>

          <div className="aspect-square w-full rounded-3xl bg-gray-200" />

          <div className="mt-4 grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-square rounded-2xl bg-gray-200"
              />
            ))}
          </div>

        </div>

        {/* Product Details */}

        <div className="space-y-6">

          <div className="h-10 w-3/4 rounded-xl bg-gray-200" />

          <div className="h-5 w-32 rounded-lg bg-gray-200" />

          <div className="space-y-3">
            <div className="h-4 rounded-lg bg-gray-200" />
            <div className="h-4 w-11/12 rounded-lg bg-gray-200" />
            <div className="h-4 w-4/5 rounded-lg bg-gray-200" />
          </div>

          <div className="h-20 rounded-3xl bg-gray-200" />

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 rounded-2xl bg-gray-200"
              />
            ))}
          </div>

          <div className="h-56 rounded-3xl bg-gray-200" />

        </div>

      </div>




     

      <div className="h-24 lg:hidden" />

    </div>
  );
}