import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  MapPin,
  Plus,
} from "lucide-react";

const AddressSelector = ({
  addresses = [],
  selectedAddress,
  onSelect,
  onManage,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
      rounded-[14px]
      border
      max-w-full
      min-w-0
      p-3
      sm:p-5
      bg-white dark:bg-[#181A1B]
    "
      style={{
        borderColor: "var(--secondary-color)",
      }}
    >
      {/* Header */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="
            text-base
            font-bold
            sm:text-lg
            text-slate-900 dark:text-white
          "
          >
            Delivery Address
          </h2>

          <p
            className="
            mt-0.5
            text-xs
            sm:text-sm
          "
            style={{
              color: "var(--primary-color)",
              opacity: 0.65,
            }}
          >
            Select where you'd like your order delivered.
          </p>
        </div>

        <button
          onClick={onManage}
          className="
          border
          flex
          w-full
          items-center
          justify-center
          gap-1
          rounded-xl
          px-3
          py-2
          text-xs
          font-semibold
          transition-all
          duration-200
          sm:w-auto
          sm:text-sm
        "
          style={{
            color: "var(--primary-color)",
            borderColor: "var(--secondary-color)"
          }}
        >
          Manage
          <ChevronRight size={15} />
        </button>
      </div>


      {/* Addresses */}

      <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
        {addresses.map((address) => {
          const addressId = address._id || address.id;
          const selectedId = selectedAddress?._id || selectedAddress?.id;
          const active = selectedId === addressId;

          const fullAddressText =
            address.delivery_address ||
            address.address ||
            [address.mohalla, address.city].filter(Boolean).join(", ") ||
            "No address details provided";

          return (
            <button
              key={addressId}
              type="button"
              onClick={() => onSelect(address)}
              className={`
              group
              flex
              w-full
              items-start
              gap-3
              rounded-2xl
              border
              p-3
              text-left
              transition-all
              duration-200

              sm:gap-4
              sm:p-4

              ${active
                  ? "shadow-md"
                  : "bg-white dark:bg-[#181A1B] hover:opacity-90"
                }
            `}
              style={{
                borderColor: active
                  ? "var(--primary-color)"
                  : "var(--secondary-color)",
              }}
            >

              {/* Icon */}

              <div
                className="
                mt-0.5
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl

                sm:h-11
                sm:w-11
              "
                style={{
                  background: active
                    ? "var(--primary-color)"
                    : "var(--secondary-color)",
                }}
              >
                <MapPin
                  size={18}
                  style={{
                    color: active
                      ? "var(--accent-color)"
                      : "var(--primary-color)",
                  }}
                />
              </div>


              {/* Content */}

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                  <h3
                    className="
                    truncate
                    text-sm
                    font-semibold
                    sm:text-base
                  "
                    style={{
                      color: "var(--primary-color)",
                    }}
                  >
                    {address.title || "Address"}
                  </h3>


                  {(address.default || address.is_default) && (
                    <span
                      className="
                      rounded-full
                      px-2
                      py-0.5
                      text-[10px]
                      font-semibold
                    "
                      style={{
                        background: "var(--primary-color)",
                        color: "var(--accent-color)",
                      }}
                    >
                      Default
                    </span>
                  )}

                </div>


                <p
                  className="
                  mt-1
                  line-clamp-2
                  text-xs
                  leading-4
                  sm:text-sm
                  sm:leading-5
                "
                  style={{
                    color: "var(--primary-color)",
                    opacity: 0.65,
                  }}
                >
                  {fullAddressText}
                </p>

              </div>


              {active && (
                <div
                  className="
                  flex
                  h-6
                  w-6
                  shrink-0
                  items-center
                  justify-center
                  rounded-full

                  sm:h-7
                  sm:w-7
                "
                  style={{
                    background: "var(--primary-color)",
                    color: "var(--accent-color)",
                  }}
                >
                  <Check size={14} />
                </div>
              )}

            </button>
          );
        })}


        {/* Add Address */}

        <button
          type="button"
          onClick={onManage}
          className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          border
          border-dashed
          py-3
          text-sm
          font-semibold
          transition-all

          sm:py-4
          sm:text-base
        "
          style={{
            borderColor: "var(--secondary-color)",
            color: "var(--primary-color)",
          }}
        >
          <Plus size={17} />
          Add New Address
        </button>

      </div>

    </motion.section>
  );
};

export default AddressSelector;