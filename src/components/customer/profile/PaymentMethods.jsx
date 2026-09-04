import {
  Smartphone,
  Banknote,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import SecondaryButton from "../common/SecondaryButton";
import SectionHeader from "../common/SectionHeader";


const icons = {
  upi: Smartphone,
  cod: Banknote,
};


const PaymentMethods = ({
  methods = [],
  onAdd,
  onEdit,
  onDelete,
  onSelect,
}) => {

  return (
    <section className="space-y-6">


      <SectionHeader
        title="Payment Methods"
        subtitle="Manage your saved payment options."
        action="Add Payment"
        onAction={onAdd}
      />



      {methods.length > 0 ? (

        <div className="grid gap-6 lg:grid-cols-2">

          {methods.map((method) => {

            const Icon =
              icons[method.type] ||
              Smartphone;


            return (

              <Card
                key={method.id}

                className={`
                  relative

                  ${
                    method.default
                      ? "border-[var(--primary)]"
                      : ""
                  }
                `}
              >


                {method.default && (

                  <Badge
                    variant="premium"
                    className="
                      absolute
                      right-5
                      top-5
                    "
                  >

                    <CheckCircle2 size={14} />

                    Default

                  </Badge>

                )}



                {/* Icon */}

                <div
                  className="
                    mb-5

                    flex
                    h-14
                    w-14

                    items-center
                    justify-center

                    rounded-2xl

                    text-white
                  "

                  style={{
                    background:
                      "var(--primary)",
                  }}
                >

                  <Icon size={24}/>

                </div>



                {/* Details */}


                <h3 className="text-xl font-bold text-slate-900">
                  {method.title}
                </h3>



                <p className="mt-2 text-slate-500">
                  {method.subtitle}
                </p>



                {method.type === "upi" && (

                  <p className="mt-4 font-semibold text-slate-800">
                    {method.value}
                  </p>

                )}



                {method.type === "cod" && (

                  <p className="mt-4 font-semibold text-slate-800">
                    Cash on Delivery
                  </p>

                )}




                {/* Actions */}

                <div className="mt-8 flex gap-3">


                  {!method.default && (

                    <SecondaryButton

                      fullWidth

                      size="sm"

                      onClick={() =>
                        onSelect?.(method)
                      }

                    >
                      Set Default

                    </SecondaryButton>

                  )}



                  <SecondaryButton

                    size="sm"

                    onClick={() =>
                      onEdit?.(method)
                    }

                    className="
                      !h-11
                      !w-11
                      !min-w-[44px]
                      !p-0
                    "
                  >

                    <Pencil size={18}/>

                  </SecondaryButton>




                  <button

                    onClick={() =>
                      onDelete?.(method)
                    }

                    className="
                      flex
                      h-11
                      w-11

                      items-center
                      justify-center

                      rounded-xl

                      border
                      border-red-200

                      text-red-600

                      transition

                      hover:bg-red-50
                    "
                  >

                    <Trash2 size={18}/>

                  </button>


                </div>


              </Card>

            );

          })}

        </div>


      ) : (

        <EmptyState

          icon="package"

          title="No Payment Method"

          description="Save your preferred payment option for faster checkout."

          actionText="Add Payment Method"

          onAction={onAdd}

        />

      )}


    </section>
  );
};


export default PaymentMethods;