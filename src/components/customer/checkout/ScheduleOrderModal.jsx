import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  X,
} from "lucide-react";

const formatDate = (date) =>
  date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const formatTime = (date) =>
  date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const ScheduleOrderModal = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [selectedDay, setSelectedDay] = useState("today");
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    if (!open) {
      setSelectedDay("today");
      setSelectedSlot(null);
    }
  }, [open]);

  const slots = useMemo(() => {
    const now = new Date();
    const minimum = new Date(now.getTime() + 60 * 60 * 1000);

    const base = new Date();

    if (selectedDay === "tomorrow") {
      base.setDate(base.getDate() + 1);
    }

    base.setHours(9, 0, 0, 0);

    const list = [];

    while (base.getHours() < 23) {
      const slot = new Date(base);

      list.push({
        value: slot,
        disabled:
          selectedDay === "today" &&
          slot < minimum,
      });

      base.setMinutes(base.getMinutes() + 30);
    }

    return list;
  }, [selectedDay]);

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
          className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          onClick={onClose}
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
"
        >
          {/* Header */}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Schedule Order
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Delivery must be at least one hour later.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Day */}

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              {
                key: "today",
                label: "Today",
              },
              {
                key: "tomorrow",
                label: "Tomorrow",
              },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setSelectedDay(item.key);
                  setSelectedSlot(null);
                }}
                className={`rounded-xl border p-3 font-medium transition ${
                  selectedDay === item.key
                    ? "border-transparent text-white"
                    : "border-slate-200 dark:border-[#A9BDCF]/30"
                }`}
                style={
                  selectedDay === item.key
                    ? {
                        background:
                          "var(--primary-color)",
                      }
                    : {}
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <CalendarDays size={16} />
                  {item.label}
                </div>
              </button>
            ))}
          </div>

          {/* Time Slots */}

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <Clock3 size={18} />
              Available Time Slots
            </div>

            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {slots.map((slot) => (
                <button
                  key={slot.value.getTime()}
                  disabled={slot.disabled}
                  onClick={() =>
                    setSelectedSlot(slot.value)
                  }
                  className={`
                    rounded-xl
                    border
                    p-3
                    text-sm
                    font-medium
                    transition

                    ${
                      selectedSlot?.getTime() ===
                      slot.value.getTime()
                        ? "border-transparent text-white"
                        : "border-slate-200 dark:border-[#A9BDCF]/30"
                    }

                    ${
                      slot.disabled
                        ? "cursor-not-allowed opacity-40"
                        : "hover:border-[var(--primary-color)]"
                    }
                  `}
                  style={
                    selectedSlot?.getTime() ===
                    slot.value.getTime()
                      ? {
                          background:
                            "var(--primary-color)",
                        }
                      : {}
                  }
                >
                  {formatTime(slot.value)}
                </button>
              ))}
            </div>
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
              "
            >
              Cancel
            </button>

            <button
              disabled={!selectedSlot}
              onClick={() => {
                onConfirm({
                  date: formatDate(selectedSlot),
                  time: formatTime(selectedSlot),
                  datetime: selectedSlot,
                });

                onClose();
              }}
              className="
                flex-1
                rounded-xl
                py-3
                font-semibold
                text-white
                disabled:opacity-50
              "
              style={{
                background:
                  "var(--primary-color)",
              }}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScheduleOrderModal;