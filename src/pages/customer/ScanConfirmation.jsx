import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react";

const ScanConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const tableToken = state?.tableToken;

  const tableNumber =
    state?.tableNumber || "Connected";

  const restaurantName =
    state?.restaurantName || "Your Restaurant";

  const handleContinue = () => {
    if (!tableToken) {
      navigate("/customer/menu");
      return;
    }

    navigate(`/customer/menu/${tableToken}`);
  };

  return (
    <div
   className="
    min-h-screen
    w-full
    flex
    items-start
    justify-center
    px-3
    pt-0
    pb-4
    sm:px-4
    mt-5
    sm:pt-0
    sm:pb-6
    bg-slate-100"
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          w-full
          max-w-[350px]
          sm:max-w-md
          overflow-hidden
          rounded-[20px]
          sm:rounded-[28px]
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        {/* =================================================
            SUCCESS HEADER
        ================================================= */}

        <div className="px-4 pb-5 pt-6 text-center sm:px-6 sm:pb-7 sm:pt-9">
          {/* Success Icon */}

          <motion.div
            initial={{
              scale: 0.7,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay: 0.1,
              duration: 0.35,
            }}
            className="
              mx-auto
              flex
              h-[58px]
              w-[58px]
              sm:h-[82px]
              sm:w-[82px]
              items-center
              justify-center
              rounded-full
            "
            style={{
              backgroundColor:
                "var(--primary-color)",
            }}
          >
            <Check
              size={30}
              strokeWidth={3}
              className="text-white sm:h-[42px] sm:w-[42px]"
            />
          </motion.div>

          <h1
            className="
              mt-4
              text-xl
              font-black
              text-slate-900
              sm:mt-6
              sm:text-2xl
            "
          >
            You're All Set!
          </h1>

          <p
            className="
              mx-auto
              mt-1.5
              max-w-[230px]
              text-xs
              leading-4
              text-slate-500
              sm:mt-2
              sm:max-w-[290px]
              sm:text-sm
              sm:leading-5
            "
          >
            Your QR code was scanned successfully
            and your table is connected.
          </p>
        </div>

        {/* =================================================
            TABLE DETAILS
        ================================================= */}

        <div className="px-4 pb-5 sm:px-6 sm:pb-6">
          <div className="rounded-xl bg-slate-50 p-3 sm:rounded-2xl sm:p-4">
            {/* Restaurant */}

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  sm:h-10
                  sm:w-10
                  sm:rounded-xl
                "
                style={{
                  backgroundColor:
                    "var(--secondary-color)",
                }}
              >
                <UtensilsCrossed
                  size={16}
                  strokeWidth={2}
                  className="sm:h-[19px] sm:w-[19px]"
                  style={{
                    color:
                      "var(--primary-color)",
                  }}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-medium text-slate-400 sm:text-[10px]">
                  Restaurant
                </p>

                <p className="truncate text-xs font-bold text-slate-900 sm:text-sm">
                  {restaurantName}
                </p>
              </div>
            </div>

            {/* Divider */}

            <div className="my-3 h-px w-full bg-slate-200 sm:my-4" />

            {/* Table */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-medium text-slate-400 sm:text-[10px]">
                  Your Table
                </p>

                <p
                  className="
                    mt-0.5
                    text-sm
                    font-bold
                    sm:text-base
                  "
                  style={{
                    color:
                      "var(--primary-color)",
                  }}
                >
                  {tableNumber === "Connected"
                    ? tableNumber
                    : `Table ${tableNumber}`}
                </p>
              </div>

              {/* Confirmed Badge */}

              <div
                className="
                  flex
                  items-center
                  gap-1
                  rounded-full
                  px-2.5
                  py-1
                  text-[9px]
                  font-bold
                  sm:gap-1.5
                  sm:px-3
                  sm:py-1.5
                  sm:text-[10px]
                "
                style={{
                  backgroundColor:
                    "var(--secondary-color)",
                  color:
                    "var(--primary-color)",
                }}
              >
                <Check
                  size={11}
                  strokeWidth={3}
                  className="sm:h-[13px] sm:w-[13px]"
                />

                Confirmed
              </div>
            </div>
          </div>

          {/* =================================================
              CONFIRMATION MESSAGE
          ================================================= */}

          <div
            className="
              mt-3
              flex
              items-start
              gap-2.5
              rounded-xl
              border
              p-3
              sm:mt-4
              sm:gap-3
              sm:rounded-2xl
              sm:p-4
            "
            style={{
              borderColor:
                "var(--secondary-color)",
              backgroundColor:
                "var(--secondary-color)",
            }}
          >
            <CheckCircle2
              size={17}
              strokeWidth={2.5}
              className="
                mt-0.5
                shrink-0
                sm:h-5
                sm:w-5
              "
              style={{
                color:
                  "var(--primary-color)",
              }}
            />

            <div>
              <p className="text-xs font-bold text-slate-900 sm:text-sm">
                Table connected successfully
              </p>

              <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
                You can now browse the menu and
                place your order from this table.
              </p>
            </div>
          </div>

          {/* =================================================
              CONTINUE BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={handleContinue}
            className="
              mt-4
              flex
              h-10
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-xl
              text-xs
              font-bold
              text-white
              shadow-sm
              transition
              hover:opacity-95
              active:scale-[0.98]
              cursor-pointer
              sm:mt-6
              sm:h-12
              sm:gap-2
              sm:rounded-2xl
              sm:text-sm
            "
            style={{
              backgroundColor:
                "var(--primary-color)",
            }}
          >
            Continue to Menu

            <ChevronRight
              size={16}
              className="sm:h-[18px] sm:w-[18px]"
            />
          </button>

          {/* Back */}

          <button
            type="button"
            onClick={() =>
              navigate("/customer")
            }
            className="
              mt-2
              flex
              h-9
              w-full
              items-center
              justify-center
              rounded-xl
              text-[10px]
              font-semibold
              text-slate-500
              transition
              hover:bg-slate-50
              cursor-pointer
              sm:mt-3
              sm:h-10
              sm:rounded-2xl
              sm:text-xs
            "
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScanConfirmation;