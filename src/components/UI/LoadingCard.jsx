const LoadingOrderCard = () => {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/70 p-5 shadow-xl backdrop-blur-xl animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-5 w-36 rounded bg-gray-300" />
          <div className="h-4 w-28 rounded bg-gray-200" />
        </div>

        <div className="h-8 w-16 rounded-full bg-gray-300" />
      </div>

      {/* Address */}
      <div className="mt-5 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>

      {/* Items */}
      <div className="mt-6">
        <div className="mb-4 h-4 w-28 rounded bg-gray-300" />

        <div className="space-y-3">
          <div className="flex justify-between rounded-lg bg-gray-100 p-3">
            <div className="h-4 w-32 rounded bg-gray-300" />
            <div className="h-4 w-10 rounded bg-gray-300" />
          </div>

          <div className="flex justify-between rounded-lg bg-gray-100 p-3">
            <div className="h-4 w-24 rounded bg-gray-300" />
            <div className="h-4 w-10 rounded bg-gray-300" />
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="mt-6 h-11 w-full rounded-xl bg-gray-300" />
    </div>
  );
};

export default LoadingOrderCard;