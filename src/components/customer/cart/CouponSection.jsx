import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Percent,
  Tag,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const CouponSection = ({
  coupon = {},
  onChange,
  onApply,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [shake, setShake] = useState(false);

  const {
    code = "",
    applied = false,
    discount = 0,
    offers = [],
    error = "",
  } = coupon;

  useEffect(() => {
    if (error) {
      setShake(true);

      const timer = setTimeout(() => {
        setShake(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <section
      className="
        rounded-xl
        sm:rounded-2xl

        border
        border-slate-200 dark:border-white/10

        bg-white dark:bg-[#181A1B]
        shadow-sm
      "
    >
      {/* Header */}

      <div
        className="
          border-b
          border-slate-100 dark:border-slate-800

          px-4
          py-4

          sm:px-6
          sm:py-5
        "
      >
        <div className="flex items-center gap-3">

          <div
            className="
              flex

              items-center
              justify-center

              rounded-full

              bg-orange-50
              text-orange-500

              sm:h-10
              sm:w-10
            "
          >
            <Percent size={16} />
          </div>

          <div>

            <h2
              className="
                text-base
                font-semibold

                text-slate-900 dark:text-white

                sm:text-lg
              "
            >
              Coupons & Offers
            </h2>

            <p
              className="
                text-xs
                text-slate-500 dark:text-slate-400

                sm:text-sm
              "
            >
              Apply a coupon and save more
            </p>

          </div>

        </div>

      </div>

      {/* Coupon Input */}

      <div
        className="
          p-6

          sm:p-6
        "
      >
        <div
          className="
            flex
            flex-col

            gap-2

            sm:flex-row
            sm:gap-3
          "
        >

          <input
            value={code}
            placeholder="Enter coupon code"
            onChange={(e) => {
              if (error) {
                setShake(false);
              }

              onChange(e.target.value);
            }}
            className={`
    min-h-[56px]
    sm:min-h-[44px]

    flex-1

    rounded-xl

    border

    px-4
    py-4

    text-sm

    outline-none

    transition-all
    duration-300

    ${error
                ? "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30"
                : "border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-green-600 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/20"
              }

    ${shake
                ? "animate-[shake_0.4s_ease-in-out]"
                : ""
              }
  `}
          />

          <button
            onClick={() => onApply()}
            className="
              w-full

              rounded-xl


              px-4
              py-2.5

              font-semibold
              text-white

              transition


              sm:w-auto
              sm:px-6
            "
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            {applied ? "Applied" : "Apply"}
          </button>
        </div>

        {applied && (
          <div
            className="
              mt-3

              flex
              items-center

              gap-2

              rounded-xl

              bg-green-50 dark:bg-green-950/20

              p-2.5

              sm:mt-4
              sm:p-3
            "
            style={{ color: "var(--primary-color)" }}
          >
            <CheckCircle2 size={18} />

            <span
              className="
                text-xs
                font-medium

                sm:text-sm
              "
              style={{ color: "var(--primary-color)" }}
            >
              Coupon applied successfully.
              You saved ₹{discount}
            </span>
          </div>
        )}

        {!applied && error && (
          <div
            className="
              mt-3

              flex
              items-center

              gap-2

              text-xs
              font-medium

              text-red-600

              sm:text-sm
            "
          >
            <XCircle size={16} />

            <span>
              The coupon is invalid.
              Please enter a valid coupon.
            </span>
          </div>
        )}

      </div>

      {/* Available Coupons */}

      {offers.length > 0 && (
        <>

          <button
            onClick={() =>
              setExpanded(!expanded)
            }
            className="
              flex

              w-full

              items-center
              justify-between

              border-t
              border-slate-100 dark:border-slate-800

              px-4
              py-3

              transition

              hover:bg-slate-50 dark:hover:bg-white/5

              sm:px-6
              sm:py-4
            "
          >
            <span
              className="
                text-sm
                font-medium

                text-slate-900 dark:text-white

                sm:text-base
              "
            >
              Available Coupons ({offers.length})
            </span>

            {expanded ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expanded && (
            <div
              className="
                space-y-2

                border-t
                border-slate-100 dark:border-slate-800

                p-4

                sm:space-y-3
                sm:p-6
              "
            >
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="
                    flex

                    items-center
                    justify-between

                    gap-3

                    rounded-xl

                    border
                    border-slate-200 dark:border-white/10

                    p-3

                    sm:p-4
                  "
                >
                  <div className="flex gap-3">

                    <Tag
                      size={18}
                      className="mt-1" style={{ color: "var(--primary-color)" }}
                    />

                    <div>

                      <h4
                        className="
                          text-sm
                          font-semibold

                          text-slate-900 dark:text-white

                          sm:text-base
                        "
                      >
                        {offer.code}
                      </h4>

                      <p
                        className="
                          mt-1

                          text-xs

                          text-slate-500 dark:text-slate-400

                          sm:text-sm
                        "
                      >
                        {offer.description}
                      </p>

                    </div>

                  </div>
                  <button
                    onClick={() =>
                      onApply(offer.code)
                    }
                    className="
    rounded-lg

    px-3
    py-1.5

    text-xs
    font-semibold

    transition

    sm:py-2
    sm:text-sm
  "
                    style={{
                      background: "var(--primary-light)",
                      color: "var(--primary-color)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "var(--primary-color)";
                      e.currentTarget.style.color =
                        "var(--accent-color)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "var(--primary-light)";
                      e.currentTarget.style.color =
                        "var(--primary-color)";
                    }}
                  >
                    Apply
                  </button>

                </div>
              ))}
            </div>
          )}

        </>
      )}

    </section>
  );
};

export default CouponSection;