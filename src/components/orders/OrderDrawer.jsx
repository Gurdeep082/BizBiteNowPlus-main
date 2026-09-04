import React from "react";
import {
  X,
  Phone,
  MapPin,
  Package,
  CreditCard,
  User,
  FileText,
  UtensilsCrossed,
  ShoppingBag,
  Truck,
} from "lucide-react";
import TrackingTimeline from "./TrackingTimeline";
import { generateOrderBillPDF } from "../../util/generateBill";

// UI Components
import Typography from "../UI/Typography";
import Button from "../UI/Button";
import Badge from "../UI/Badge";

export default function OrderDrawer({ open, order, onClose, storeProfile }) {
  if (!open || !order) return null;

  const isDineIn = order.order_type === "dine-in";
  const isTakeaway = order.order_type === "takeaway" || order.order_type === "pickup";
  const isDelivery = !isDineIn && !isTakeaway;

  const orderTypeLabel = isDineIn ? "DINE-IN" : isTakeaway ? "TAKEAWAY" : "DELIVERY";

  const orderId =
    order.orderId ||
    (order._id ? `#${String(order._id).slice(-6).toUpperCase()}` : "N/A");

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "Recently";

  const deliveryAddress = isDineIn
    ? `Dine-In · Table ${order.table_number || "N/A"}`
    : typeof order.delivery_address === "object" && order.delivery_address !== null
      ? order.delivery_address.address_line || "Delivery Address"
      : order.address || order.delivery_address || "Pickup / Store Order";

  const customerPhone =
    order.phone ||
    order.customer_phone ||
    order.customer?.phone ||
    order.delivery_address?.phone ||
    "N/A";

  const customerName =
    order.customer ||
    order.customer_name ||
    order.customer?.name ||
    "Guest Customer";

  const statusStepMap = {
    Unassigned: 1,
    Pending: 1,
    Assigned: 2,
    "Out for Delivery": 3,
    Delivered: 4,
    "Ready for Pickup": 3,
    Preparing: 2,
    "Picked Up": 4,
  };

  const currentStep =
    order.trackingStep ??
    order?.tracking?.currentStep ??
    statusStepMap[order.status || order.delivery_status] ??
    1;

  const itemsList = Array.isArray(order.items) ? order.items : [];

  const getBasePrice = (item) =>
    Number(item.price) ||
    Number(typeof item.product_id === "object" ? item.product_id?.price : 0) ||
    0;

  const getVariantDelta = (item) => Number(item.variant?.price_delta ?? item.variant?.price ?? 0);

  const getAddonsTotal = (item) =>
    Array.isArray(item.addons)
      ? item.addons.reduce((sum, a) => sum + (Number(a.price) || 0), 0)
      : 0;

  const getUnitPrice = (item) => {
    const hasVariant = !!item.variant?.name;
    const variantDelta = getVariantDelta(item);
    const addonsTotal = getAddonsTotal(item);
    const base = hasVariant ? variantDelta : getBasePrice(item);
    return base + addonsTotal;
  };

  const getItemTotal = (item) =>
    getUnitPrice(item) * (item.qty || item.quantity || 1);

  const getItemTaxPercent = (item) =>
    Number(
      (typeof item.product_id === "object" ? item.product_id?.tax_percent : undefined) ??
      item.tax_percent ??
      0
    );

  const getItemTaxAmount = (item) => {
    const percent = getItemTaxPercent(item);
    if (!percent) return 0;
    return (getItemTotal(item) * percent) / 100;
  };

  const subTotal = itemsList.reduce((sum, item) => sum + getItemTotal(item), 0);
  const discountAmount = Number(order.discount_amount ?? order.discount) || 0;
  const discountedSubTotal = Math.max(0, subTotal - discountAmount);

  const discountRatio = subTotal > 0 ? discountedSubTotal / subTotal : 1;

  const gstGroups = {};
  itemsList.forEach((item) => {
    const percent = getItemTaxPercent(item);
    if (!percent) return;
    const taxableValue = getItemTotal(item) * discountRatio;
    const taxValue = getItemTaxAmount(item) * discountRatio;
    if (!gstGroups[percent]) {
      gstGroups[percent] = { percent, taxableValue: 0, taxValue: 0 };
    }
    gstGroups[percent].taxableValue += taxableValue;
    gstGroups[percent].taxValue += taxValue;
  });
  const gstGroupList = Object.values(gstGroups).sort((a, b) => a.percent - b.percent);

  const rawTaxTotal = itemsList.reduce((sum, item) => sum + getItemTaxAmount(item), 0);
  const taxAmount = Math.round(rawTaxTotal * discountRatio);
  const cgstAmount = Math.round(taxAmount / 2);
  const sgstAmount = taxAmount - cgstAmount;

  let deliveryCharge = 0;
  if (isDelivery) {
    const savedDelivery = order.delivery_charge ?? order.delivery_fee ?? order.deliveryCharge;

    if (savedDelivery !== undefined && savedDelivery !== null && savedDelivery !== "") {
      deliveryCharge = Number(savedDelivery);
    } else {
      const freeDeliveryAbove = Number(storeProfile?.delivery_settings?.free_delivery_above ?? storeProfile?.free_delivery_above ?? 500);
      const configuredDeliveryCharge = Number(storeProfile?.delivery_settings?.delivery_charge ?? storeProfile?.delivery_charge ?? 20);

      deliveryCharge = (freeDeliveryAbove > 0 && subTotal >= freeDeliveryAbove) ? 0 : configuredDeliveryCharge;
    }
  }

  const rawAdditionalCharges = Array.isArray(order.additional_charges)
    ? order.additional_charges
    : Array.isArray(storeProfile?.delivery_settings?.additional_charges)
      ? storeProfile.delivery_settings.additional_charges
      : [];

  const additionalCharges = rawAdditionalCharges
    .filter((c) => c && c.label && Number(c.value) > 0)
    .map((c) => ({ label: c.label, value: Number(c.value) }));

  const additionalChargesTotal = additionalCharges.reduce(
    (sum, c) => sum + c.value,
    0
  );

  const totalAmount = order.amount ?? order.total_amount ?? order.summary?.total ?? 0;
  const grandTotal =
    totalAmount ||
    (discountedSubTotal + taxAmount + deliveryCharge + additionalChargesTotal);

  const handlePrintBill = async () => {
    await generateOrderBillPDF(order, storeProfile);
  };

  const OrderTypeIcon = isDineIn ? UtensilsCrossed : isTakeaway ? ShoppingBag : Truck;
  const badgeVariant = isDineIn ? "success" : isTakeaway ? "warning" : "info";

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <aside
        className="
          fixed right-0 top-0 z-50
          h-screen w-full
          max-w-full sm:max-w-lg
          overflow-y-auto
          scrollbar-hide
          bg-white
          shadow-2xl
          animate-in slide-in-from-right duration-300
        "
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Typography variant="h4" className="truncate text-lg sm:text-xl">
                Order {orderId}
              </Typography>
              <Badge variant={badgeVariant} size="sm" className="!text-[10px] !uppercase">
                <OrderTypeIcon size={11} className="mr-1" />
                {orderTypeLabel}
              </Badge>
            </div>
            <Typography variant="small" className="text-xs sm:text-sm">
              {formattedDate}
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={handlePrintBill}
              className="!h-9 !px-3 !text-xs !bg-emerald-600 hover:!bg-emerald-700 !border-0"
            >
              Print Bill
            </Button>

            <Button
              variant="outline"
              onClick={onClose}
              className="!h-9 !w-9 !p-0 !border-transparent !text-slate-500 hover:!bg-slate-100"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 pb-20">
          <section className="rounded-xl border border-slate-200 p-4 sm:p-5">
            <Typography variant="h6" className="mb-4 flex items-center gap-2 text-sm sm:text-base">
              <User size={18} />
              Customer
            </Typography>

            <Typography variant="p" weight="medium" color="text-slate-800">
              {customerName}
            </Typography>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <Phone size={16} />
              {customerPhone}
            </div>

            <div className="mt-2 flex items-start gap-2 text-sm text-slate-600">
              {isDineIn ? (
                <UtensilsCrossed size={16} className="mt-0.5 shrink-0" />
              ) : (
                <MapPin size={16} className="mt-0.5 shrink-0" />
              )}
              <span>{deliveryAddress}</span>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 p-5">
            <Typography variant="h6" className="mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Package size={18} />
              Ordered Items
            </Typography>

            <div className="space-y-3">
              {itemsList.length === 0 ? (
                <Typography variant="small">No items available</Typography>
              ) : (
                itemsList.map((item, index) => {
                  const itemName =
                    typeof item.product_id === "object"
                      ? item.product_id?.name || item.name
                      : item.name || "Item";

                  const itemImage =
                    typeof item.product_id === "object"
                      ? item.product_id?.image
                      : item.image;

                  const itemQty = item.qty || item.quantity || 1;
                  const hasVariant = !!item.variant?.name;
                  const variantName = item.variant?.name;
                  const basePrice = getBasePrice(item);
                  const variantDelta = getVariantDelta(item);
                  const unitPrice = getUnitPrice(item);
                  const itemTotal = getItemTotal(item);
                  const addonsList = Array.isArray(item.addons) ? item.addons : [];
                  const itemTaxPercent = getItemTaxPercent(item);
                  const itemTaxAmount = getItemTaxAmount(item);

                  const instruction = item.instruction || item.special_instruction || item.note;

                  return (
                    <div
                      key={item._id || item.id || index}
                      className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {itemImage && (
                            <img
                              src={itemImage}
                              alt={itemName}
                              className="h-10 w-10 rounded-lg object-cover shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <Typography variant="p" weight="medium" className="truncate flex items-center gap-1.5 flex-wrap text-slate-800">
                              {itemName}
                              {variantName && (
                                <Badge variant="success" size="sm" className="!px-1.5 !py-0.5 !text-[10px]">
                                  {variantName}
                                </Badge>
                              )}
                            </Typography>
                            <Typography variant="small" className="text-[11px] sm:text-xs">
                              Qty : {itemQty}
                            </Typography>
                          </div>
                        </div>

                        <Typography variant="h6" className="text-sm shrink-0">
                          ₹{itemTotal}
                        </Typography>
                      </div>

                      <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 space-y-1">
                        {hasVariant ? (
                          <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                            <span>Variant ({variantName})</span>
                            <span>₹{variantDelta}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                            <span>Base Price</span>
                            <span>₹{basePrice}</span>
                          </div>
                        )}
                        {addonsList.length > 0 && (
                          <div className="space-y-0.5">
                            {addonsList.map((a, aIdx) => (
                              <div
                                key={a._id || aIdx}
                                className="flex items-center justify-between text-[11px] text-slate-600 font-medium"
                              >
                                <span>+ {a.name}</span>
                                <span>+ ₹{a.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 pt-1 border-t border-slate-200">
                          <span>Unit Price</span>
                          <span>₹{unitPrice}</span>
                        </div>
                        {itemTaxPercent > 0 && (
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span>GST @{itemTaxPercent}%</span>
                            <span>₹{itemTaxAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700">
                          <span>₹{unitPrice} × {itemQty}</span>
                          <span>= ₹{itemTotal}</span>
                        </div>
                      </div>

                      {instruction && (
                        <div className="flex items-start gap-1.5 bg-amber-50/70 border border-amber-100 rounded-lg px-2.5 py-1.5 text-xs text-amber-900">
                          <FileText size={13} className="text-amber-600 shrink-0 mt-0.5" />
                          <span><strong className="text-amber-800">Instruction:</strong> {instruction}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 p-5">
            <Typography variant="h6" className="mb-4 flex items-center gap-2 text-sm sm:text-base">
              <CreditCard size={18} />
              Payment
            </Typography>

            <div className="flex justify-between py-1 text-sm text-slate-600">
              <span>Method</span>
              <span className="font-medium text-slate-800">
                {order.payment || order.payment_method || "COD"}
              </span>
            </div>

            <div className="flex justify-between py-1 text-sm text-slate-600">
              <span>Status</span>
              <span
                className={`font-semibold ${(order.paymentStatus || order.payment_status) === "Paid"
                  ? "text-emerald-600"
                  : "text-amber-600"
                  }`}
              >
                {order.paymentStatus || order.payment_status || "Pending"}
              </span>
            </div>

            <div className="mt-4 border-t pt-4 space-y-1">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Taxable Amount</span>
                <span className="font-medium text-slate-800">₹{discountedSubTotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount</span>
                  <span className="font-medium">- ₹{discountAmount}</span>
                </div>
              )}

              {gstGroupList.length > 0 ? (
                gstGroupList.map((group) => (
                  <div key={group.percent} className="flex justify-between text-sm text-slate-600">
                    <span>GST @{group.percent}% (CGST {(group.percent / 2).toFixed(1)}% + SGST {(group.percent / 2).toFixed(1)}%)</span>
                    <span className="font-medium text-slate-800">₹{group.taxValue.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>GST</span>
                  <span className="font-medium text-slate-800">₹0.00</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-slate-600">
                <span className="pl-3">CGST</span>
                <span className="font-medium text-slate-800">₹{cgstAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span className="pl-3">SGST</span>
                <span className="font-medium text-slate-800">₹{sgstAmount}</span>
              </div>

              {isDelivery && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Delivery Charges</span>
                  <span className="font-medium text-slate-800">
                    {deliveryCharge > 0 ? `₹${deliveryCharge}` : "FREE"}
                  </span>
                </div>
              )}

              {additionalCharges.map((charge, index) => (
                <div key={index} className="flex justify-between text-sm text-slate-600">
                  <span>{charge.label}</span>
                  <span className="font-medium text-slate-800">₹{charge.value}</span>
                </div>
              ))}

              <div className="flex justify-between text-lg font-bold text-slate-900 pt-1">
                <span>Total</span>
                <span className="text-emerald-600">₹{Math.round(grandTotal)}</span>
              </div>
            </div>
          </section>

          <div className="rounded-xl border border-slate-200 p-5">
            <TrackingTimeline currentStep={currentStep} orderType={order.order_type} />
          </div>

          <section className="rounded-xl border border-slate-200 p-5">
            <Typography variant="h6" className="mb-4 flex items-center gap-2 text-sm sm:text-base">
              <OrderTypeIcon size={18} />
              {isDineIn ? "Order Status" : "Delivery"}
            </Typography>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Order Type</span>
                <Badge variant={badgeVariant} size="sm" className="!text-[11px]">
                  {orderTypeLabel}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-semibold text-slate-800">
                  {order.status || order.delivery_status || "Unassigned"}
                </span>
              </div>

              {isDineIn ? (
                <div className="flex justify-between">
                  <span>Table Number</span>
                  <span className="font-medium text-slate-800">
                    {order.table_number || "N/A"}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>Delivery Boy</span>
                  <span className="font-medium text-slate-800">
                    {order.deliveryBoy ||
                      order.delivery_partner?.name ||
                      "Not Assigned"}
                  </span>
                </div>
              )}
            </div>
          </section>

          {order.notes && (
            <section className="rounded-xl border border-slate-200 p-5">
              <Typography variant="h6" className="mb-2 text-sm sm:text-base">
                Customer Notes
              </Typography>
              <Typography variant="small">
                {order.notes}
              </Typography>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}