import {
  ArrowLeft,
  ReceiptText,
} from "lucide-react";

const MobileOrderHeader = ({
  order = {},
  onBack,
}) => {
  return (
    <header
      className="
        sticky
        top-0
        z-20

        rounded-2xl


        px-4
        py-4

      "
    >
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-xl

              border
              border-slate-200

              transition
              hover:bg-slate-100
            "
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Order Details
            </h1>

            <div className="mt-1 flex items-center gap-1.5">
              <ReceiptText
                size={14}
                className="text-green-600"
              />

              <span className="text-xs text-slate-500">
                #{order.id || "BBN123456"}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <span
          className="
            rounded-full

            bg-green-100

            px-3
            py-1.5

            text-[11px]
            font-semibold

            text-green-700
          "
        >
          {order.status || "Preparing"}
        </span>
      </div>
    </header>
  );
};

export default MobileOrderHeader;