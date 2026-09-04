import { motion } from "framer-motion";
import {
  BadgeIndianRupee,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { SiRazorpay } from "react-icons/si";

const PaymentMethodList = ({
  paymentMethods = [],
  selectedPayment,
  deliveryType = "delivery",
  onSelect,
}) => {
  const getIcon = (type) => {
    switch (type) {
      case "upi":
      case "razorpay":
        return <SiRazorpay size={18} />;

      case "card":
        return <CreditCard size={18} />;

      case "cod":
        return (
          <BadgeIndianRupee size={18} />
        );

      default:
        return <CreditCard size={18} />;
    }
  };

  const getPaymentType = (type) => {
    switch (type) {
      case "upi":
        return "UPI";

      case "razorpay":
        return "Online Payment";

      case "card":
        return "Card";

      case "cod":
        return "Cash on Delivery";

      default:
        return "Payment";
    }
  };

  // 🟢 FIXED: pickup ke liye "upi" ke saath "razorpay" type bhi allow kiya,
  // kyunki Checkout.jsx online payment method ko type: "razorpay" bhejta hai
  const visiblePaymentMethods =
    deliveryType === "pickup"
      ? paymentMethods.filter(
        (method) =>
          method.type === "upi" || method.type === "razorpay"
      )
      : paymentMethods;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        rounded-2xl
        sm:rounded-[24px]

        border
        border-slate-200
        dark:border-[#A9BDCF]/30

        bg-white
        dark:bg-[#181A1B]

        p-3
        sm:p-5
      "
    >
      {/* Header */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2
            className="
              text-base
              font-bold

              text-slate-900
              dark:text-white

              sm:text-lg
            "
          >
            Payment Method
          </h2>

          <p
            className="
              mt-0.5

              text-xs

              text-slate-500
              dark:text-slate-400

              sm:text-sm
            "
          >
            Choose how you'd like to pay.
          </p>

        </div>

      </div>

      {/* Payment Methods */}

      <div
        className="
          mt-4

          space-y-2.5

          sm:mt-5
          sm:space-y-3
        "
      >
        {visiblePaymentMethods.length === 0 && (
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 text-center py-2">
            Is delivery type ke liye koi payment method available nahi hai.
          </p>
        )}

        {visiblePaymentMethods.map(
          (method) => {
            const active =
              selectedPayment?.id ===
              method.id;

            return (
              <button
                key={method.id}
                onClick={() =>
                  onSelect(method)
                }
                className={`
                  flex

                  w-full

                  items-center

                  gap-3

                  rounded-xl

                  border

                  p-3

                  text-left

                  transition-all
                  duration-200

                  active:scale-[0.99]

                  ${active
                    ? "border-transparent bg-white dark:bg-[#181A1B] shadow-md"
                    : "border-slate-200 dark:border-[#A9BDCF]/30 hover:border-[var(--primary)]"
                  }

                  sm:gap-4
                  sm:rounded-2xl
                  sm:p-4
                `}
              >
                <div
                  className={`
                    flex

                    h-10
                    w-10

                    shrink-0

                    items-center
                    justify-center

                    rounded-xl

                    sm:h-12
                    sm:w-12

                    ${active ? "" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"}
                  `}
                  style={
                    active
                      ? { background: "var(--primary-color)", color: "#fff" }
                      : undefined
                  }
                >
                  {getIcon(method.type)}
                </div>
                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <h3
                      className="
                        truncate

                        text-sm
                        font-bold
                        
                        text-black
                        dark:text-white

                        sm:text-base
                      "
                    >
                      {method.name}
                    </h3>


                  </div>

                  <p
                    className="
                      mt-0.5

                      text-[11px]
                      font-bold

                      uppercase
                      tracking-wide

                      text-slate-500
                      dark:text-slate-400

                      sm:text-xs
                    "
                  >
                    {getPaymentType(method.type)}
                  </p>

                  <p
                    className="
                      mt-1

                      text-xs

                      text-slate-500
                      dark:text-slate-400

                      sm:text-sm
                    "
                  >
                    {method.description}
                  </p>

                </div>

                {active && (
                  <CheckCircle2
                    size={20}
                    color="var(--primary-color)"
                    className="shrink-0"
                  />
                )}
              </button>
            );
          }
        )}
      </div>
    </motion.section>
  );
};

export default PaymentMethodList;
