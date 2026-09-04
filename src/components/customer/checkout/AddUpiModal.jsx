import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Smartphone,
  ShieldCheck,
  X,
} from "lucide-react";

const UPI_REGEX =
  /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

const AddUpiModal = ({
  open,
  loading = false,
  onClose,
  onSave,
}) => {
  const [upiId, setUpiId] = useState("");
  const [makeDefault, setMakeDefault] =
    useState(false);

  useEffect(() => {
    if (!open) {
      setUpiId("");
      setMakeDefault(false);
    }
  }, [open]);

  const valid =
    UPI_REGEX.test(upiId.trim());

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}

        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 40,
          }}
          transition={{
            duration: 0.25,
          }}
className="
relative

w-full
max-w-md

mx-4
lg:mx-0

rounded-t-[24px]
lg:rounded-[14px]

bg-white
dark:bg-[#181A1B]

p-6
">
          {/* Header */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-xl
                "
                style={{
                  background:
                    "var(--primary-light)",
                }}
              >
                <Smartphone
                  size={22}
                  color="var(--primary)"
                />
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Add UPI ID
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Save a UPI ID for faster checkout.
                </p>

              </div>

            </div>

            <button
              onClick={onClose}
              className="
                rounded-xl
                p-2

                transition

                hover:bg-slate-100
                dark:hover:bg-white/10
              "
            >
              <X size={20} />
            </button>

          </div>

          {/* Input */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-semibold">
              UPI ID
            </label>

            <input
              value={upiId}
              onChange={(e) =>
                setUpiId(e.target.value)
              }
              placeholder="example@oksbi"
              className="
                w-full

                rounded-xl

                border
                border-slate-200
                dark:border-[#A9BDCF]/30

                bg-transparent

                px-4
                py-3

                outline-none

                transition

                focus:border-[var(--primary)]
              "
            />

            <p className="mt-2 text-xs text-slate-500">
              Example:
              raj@oksbi,
              9876543210@ybl,
              name@paytm
            </p>

          </div>

          {/* Default */}

          <label
            className="
              mt-6

              flex
              items-center
              justify-between

              rounded-xl

              border
              border-slate-200
              dark:border-[#A9BDCF]/30

              p-4

              cursor-pointer
            "
          >
            <div>

              <p className="font-semibold">
                Set as default
              </p>

              <p className="text-sm text-slate-500">
                Use this payment method automatically.
              </p>

            </div>

            <input
              type="checkbox"
              checked={makeDefault}
              onChange={(e) =>
                setMakeDefault(
                  e.target.checked
                )
              }
              className="
                h-5
                w-5
                accent-[var(--primary)]
              "
            />
          </label>

          {/* Security */}

          <div
            className="
              mt-5

              flex
              items-center
              gap-2

              rounded-xl

              bg-green-50
              dark:bg-green-900/20

              p-3
            "
          >
            <ShieldCheck
              size={18}
              className="text-green-600"
            />

            <span className="text-sm text-green-700 dark:text-green-400">
              Your payment information is securely stored.
            </span>
          </div>

          {/* Footer */}

          <div className="mt-6 flex gap-3">

            <button
              onClick={onClose}
              className="
                flex-1

                rounded-xl

                border
                border-slate-200

                py-3

                font-semibold

                hover:bg-slate-100
                dark:hover:bg-white/10
              "
            >
              Cancel
            </button>

            <button
              disabled={!valid || loading}
              onClick={() =>
                onSave({
                  upiId: upiId.trim(),
                  default:
                    makeDefault,
                })
              }
              className="
                flex-1

                rounded-xl

                py-3

                font-semibold

                text-white

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              style={{
                background:
                  "var(--primary)",
              }}
            >
              {loading
                ? "Saving..."
                : "Save UPI"}
            </button>

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddUpiModal;