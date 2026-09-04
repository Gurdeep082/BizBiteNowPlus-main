const CartSkeleton = () => {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
       
          {/* Left Section */}
          <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="h-8 w-56 rounded-lg bg-gray-200" />
              <div className="mt-3 h-4 w-80 rounded bg-gray-100" />
            </div>

            {/* Cart Items */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex gap-5 border-b border-gray-100 p-6 last:border-b-0"
                >
                  <div className="h-28 w-28 rounded-2xl bg-gray-200" />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="h-5 w-48 rounded bg-gray-200" />

                      <div className="mt-3 h-4 w-32 rounded bg-gray-100" />

                      <div className="mt-4 h-4 w-full rounded bg-gray-100" />

                      <div className="mt-2 h-4 w-3/4 rounded bg-gray-100" />
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="h-11 w-32 rounded-xl bg-gray-200" />

                      <div className="h-7 w-24 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

  

          </div>




      </div>
    </main>
  );
};

export default CartSkeleton;