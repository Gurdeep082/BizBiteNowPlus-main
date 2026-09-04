import {
  Home,
  Briefcase,
  MapPin,
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
  Home,
  Work: Briefcase,
  Other: MapPin,
};

/**
 * @param {boolean} hideHeader - true when the parent page already renders
 *   its own title/subtitle/Add-button (e.g. the full Addresses page).
 *   Leave false (default) for compact contexts like Checkout, where this
 *   card is the only address UI on screen.
 * @param {boolean} compact - single-column, tighter padding — for use
 *   inside Checkout where the card sits in a narrower column.
 */
const AddressCard = ({
  addresses = [],
  onAdd,
  onEdit,
  onDelete,
  onSelect,
  hideHeader = false,
  compact = false,
}) => {
  return (
    <section className="space-y-6">
      {!hideHeader && (
        <SectionHeader
          title="Saved Addresses"
          subtitle="Manage your delivery locations."
          action="Add Address"
          onAction={onAdd}
        />
      )}

      {addresses.length > 0 ? (
        <div
          className={
            compact
              ? "grid grid-cols-1 gap-4"
              : "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          }
        >
          {addresses.map((address) => {
            const id = address._id || address.id;
            const isDefault = address.default || address.is_default;
            const Icon = icons[address.type || address.title] || MapPin;

            return (
              <Card
                key={id}
                className={`relative flex flex-col ${isDefault
                    ? "border-[var(--primary-color)]"
                    : ""
                  }`}
              >
                {isDefault && (
                  <Badge
                    variant="premium"
                    className="absolute right-5 top-5"
                  >
                    <CheckCircle2 size={14} />
                    Default
                  </Badge>
                )}

                <div
                  className="
                  mb-5
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                "
                  style={{
                    background: "var(--primary-color)",
                    color: "var(--accent-color)",
                  }}
                >
                  <Icon size={24} />
                </div>

                <h3
                  className="
                  text-xl
                  font-bold
                  text-slate-900
                  dark:text-white
                "
                >
                  {address.type || address.title}
                </h3>

                <p
                  className="
                  mt-3
                  break-words
                  leading-7
                  text-slate-600
                  dark:text-slate-300
                "
                >
                  {address.address || address.delivery_address}
                </p>

                {address.landmark && (
                  <p
                    className="
                    mt-3
                    break-words
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                  >
                    {address.landmark}
                  </p>
                )}

                {address.phone && (
                  <p
                    className="
                    mt-2
                    font-semibold
                    text-slate-800
                    dark:text-slate-200
                  "
                  >
                    {address.phone}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  {!isDefault && onSelect && (
                    <SecondaryButton
                      fullWidth
                      size="sm"
                      onClick={() => onSelect(address)}
                    >
                      Set Default
                    </SecondaryButton>
                  )}

                  {onEdit && (
                    <SecondaryButton
                      size="sm"
                      onClick={() => onEdit(address)}
                      className="!h-11 !w-11 !min-w-[44px] shrink-0 !p-0"
                    >
                      <Pencil size={18} />
                    </SecondaryButton>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(address)}
                      className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      transition
                      hover:bg-red-50
                    "
                      style={{
                        borderColor: "var(--secondary-color)",
                        color: "var(--primary-color)",
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="address"
          title="No Address Added"
          description="Add a delivery address to start ordering."
          actionText="Add Address"
          onAction={onAdd}
        />
      )}
    </section>
  );
};

export default AddressCard;