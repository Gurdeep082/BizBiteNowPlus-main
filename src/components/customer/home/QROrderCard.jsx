import { QrCode } from "lucide-react";

const QROrderCard = ({
  tableNumber,
  onScan,
}) => {
  const hasTable = Boolean(tableNumber);

  return (
    <section className="lg:hidden px-2">
      <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-[#181A1B] px-5 py-2 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">

        <div className="flex flex-1 items-center gap-3 min-w-0">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10">
            <QrCode
              size={30}
              className="text-slate-700 dark:text-slate-300"
            />
          </div>

          <div className="flex-1 min-w-0">

            <h3 className="text-[13px] font-bold leading-none text-slate-900 dark:text-white">
              {hasTable
                ? `Ordering from Table #${tableNumber}`
                : "Ordering from the table?"}
            </h3>

            <p className="mt-0.5 text-[10px] leading-4 text-slate-500 dark:text-slate-400">
              {hasTable
                ? "Your orders will be placed for this table."
                : "Scan the QR code to order instantly from your table."}
            </p>

            {hasTable && (
              <span className="mt-1 inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                ✓ Connected
              </span>
            )}

          </div>

        </div>

        <button
          onClick={onScan}
          className="
            ml-4
            h-8
            rounded-xl
            bg-[#238B45]
            px-4
            text-[12px]
            font-semibold
            text-white
            shadow-[0_0_0_2px_rgba(255,164,32,.55),0_4px_10px_rgba(255,164,32,.28)]
            transition
            hover:bg-[#1c7a3c]
          "
        >
          {hasTable ? "Change Table" : "Scan QR"}
        </button>

      </div>
    </section>
  );
};

export default QROrderCard;