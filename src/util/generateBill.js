import { jsPDF } from "jspdf";

const loadImageAsBase64 = (url) => {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

const getBasePrice = (item) => {
  if (item.base_price !== undefined && item.base_price !== null)
    return Number(item.base_price);
  if (item.price !== undefined && item.price !== null)
    return Number(item.price);
  if (typeof item.product_id === "object")
    return Number(item.product_id?.price) || 0;
  return 0;
};

const getVariantDelta = (item) =>
  Number(item.variant?.price_delta ?? item.variant?.price ?? 0);

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
    (typeof item.product_id === "object"
      ? item.product_id?.tax_percent
      : undefined) ??
      item.tax_percent ??
      0,
  );

const getItemTaxAmount = (item) => {
  const percent = getItemTaxPercent(item);
  if (!percent) return 0;
  return (getItemTotal(item) * percent) / 100;
};

const getLocalSequence = (storeProfile) => {
  const startNum =
    Number(storeProfile?.tax_settings?.invoice_start_number) || 1;
  const localKey = `invoice_seq_${storeProfile?._id || "default"}`;
  let currentSeq = Number(localStorage.getItem(localKey));
  if (!currentSeq || currentSeq < startNum) {
    currentSeq = startNum;
    localStorage.setItem(localKey, currentSeq);
  }
  return currentSeq;
};

const incrementLocalSequence = (storeProfile, count = 1) => {
  const localKey = `invoice_seq_${storeProfile?._id || "default"}`;
  let currentSeq = getLocalSequence(storeProfile);
  localStorage.setItem(localKey, currentSeq + count);
};

export const buildBillData = (order, storeProfile, offset = 0) => {
  const isDineIn = order.order_type === "dine-in";
  const isCounter = order.order_type === "counter_billing";
  const isTakeaway =
    order.order_type === "takeaway" ||
    order.order_type === "pickup" ||
    isCounter;
  const isDelivery = !isDineIn && !isTakeaway;

  const orderTypeLabel = isDineIn
    ? "DINE-IN"
    : isCounter
      ? "WALK-IN"
      : isTakeaway
        ? "TAKEAWAY"
        : "DELIVERY";

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
    : isCounter
      ? ""
      : typeof order.delivery_address === "object" &&
          order.delivery_address !== null
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

  const itemsList = Array.isArray(order.items) ? order.items : [];

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

  const gstGroupList = Object.values(gstGroups).sort(
    (a, b) => a.percent - b.percent,
  );

  const rawTaxTotal = itemsList.reduce(
    (sum, item) => sum + getItemTaxAmount(item),
    0,
  );
  const taxAmount = rawTaxTotal * discountRatio;
  const cgstAmount = taxAmount / 2;
  const sgstAmount = taxAmount / 2;

  let deliveryCharge = 0;
  if (isDelivery) {
    const savedDelivery =
      order.delivery_charge ?? order.delivery_fee ?? order.deliveryCharge;

    if (
      savedDelivery !== undefined &&
      savedDelivery !== null &&
      savedDelivery !== ""
    ) {
      deliveryCharge = Number(savedDelivery);
    } else {
      const freeDeliveryAbove = Number(
        storeProfile?.delivery_settings?.free_delivery_above ??
          storeProfile?.free_delivery_above ??
          500,
      );
      const configuredDeliveryCharge = Number(
        storeProfile?.delivery_settings?.delivery_charge ??
          storeProfile?.delivery_charge ??
          20,
      );

      deliveryCharge =
        freeDeliveryAbove > 0 && subTotal >= freeDeliveryAbove
          ? 0
          : configuredDeliveryCharge;
    }
  }

  // 🟢 Seller-defined additional charges (e.g. Convenience Fee, Packaging Fee).
  // Prefer what's saved on the order itself; fall back to current store
  // settings only for legacy orders that predate this field.
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
    0,
  );

  const grandTotal = Math.round(
    discountedSubTotal + taxAmount + deliveryCharge + additionalChargesTotal,
  );

  const storeGstin =
    storeProfile?.tax_settings?.gst_number ||
    storeProfile?.gstin ||
    storeProfile?.gst_number ||
    storeProfile?.tax_info?.gstin ||
    "";

  const invoicePrefix = storeProfile?.tax_settings?.invoice_prefix || "INV";

  let seqNum;
  if (order.invoice_seq) {
    seqNum = Number(order.invoice_seq);
  } else {
    seqNum = getLocalSequence(storeProfile) + offset;
  }

  const invoiceNumber = order.invoice_number
    ? order.invoice_number
    : `${invoicePrefix}-${String(seqNum).padStart(4, "0")}`;

  return {
    isDineIn,
    isTakeaway,
    isDelivery,
    isCounter,
    orderTypeLabel,
    orderId,
    formattedDate,
    deliveryAddress,
    customerPhone,
    customerName,
    itemsList,
    subTotal,
    discountAmount,
    discountedSubTotal,
    gstGroupList,
    taxAmount,
    cgstAmount,
    sgstAmount,
    deliveryCharge,
    additionalCharges,
    additionalChargesTotal,
    grandTotal,
    storeGstin,
    invoiceNumber,
  };
};

const drawBill = (doc, bill, order, storeProfile, logoBase64) => {
  const PAGE_WIDTH = 76.2;
  const MARGIN = 4;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const centerX = PAGE_WIDTH / 2;

  const storeName =
    storeProfile?.store_profile?.store_name ??
    storeProfile?.business_name ??
    storeProfile?.store_name ??
    "Store";
  const storeAddress =
    storeProfile?.contact_info?.address ??
    storeProfile?.address ??
    storeProfile?.description ??
    "";

  const boldText = (d, text, x, y, options = {}) => {
    d.text(text, x, y, options);
    d.text(text, x + 0.1, y, options);
  };

  let y = 6;

  const line = () => {
    doc.setLineDashPattern([1, 1], 0);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    doc.setLineDashPattern([], 0);
    y += 4;
  };

  if (logoBase64) {
    const logoSize = 16;
    doc.addImage(
      logoBase64,
      "PNG",
      centerX - logoSize / 2,
      y,
      logoSize,
      logoSize,
    );
    y += logoSize + 5;
  }

  doc.setFont("courier", "bold");
  doc.setFontSize(13);
  boldText(doc, storeName, centerX, y, { align: "center" });
  y += 5;

  if (storeAddress) {
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    const addrLines = doc.splitTextToSize(storeAddress, CONTENT_WIDTH);
    addrLines.forEach((l) => {
      doc.text(l, centerX, y, { align: "center" });
      y += 4;
    });
  }

  if (bill.storeGstin) {
    doc.setFontSize(7.5);
    doc.text(`GSTIN: ${bill.storeGstin}`, centerX, y, { align: "center" });
    y += 4;
  }

  y += 1;
  line();

  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  boldText(doc, "TAX INVOICE", centerX, y, { align: "center" });
  y += 5;

  doc.setFontSize(9);
  boldText(doc, `Invoice No: ${bill.invoiceNumber}`, centerX, y, {
    align: "center",
  });
  y += 4.5;

  doc.setFontSize(8);
  doc.text(bill.formattedDate, centerX, y, { align: "center" });
  y += 4;

  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  boldText(doc, `[ ${bill.orderTypeLabel} ]`, centerX, y, {
    align: "center",
  });
  y += 4.5;

  if (bill.isDineIn) {
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.text(`Table No: ${order.table_number || "N/A"}`, centerX, y, {
      align: "center",
    });
    y += 4;
  }

  line();

  doc.setFont("courier", "bold");
  doc.setFontSize(9);
  boldText(doc, "CUSTOMER", MARGIN, y);
  y += 4.5;

  doc.setFontSize(8.5);
  doc.text(bill.customerName, MARGIN, y);
  y += 4.5;

  if (
    bill.customerPhone &&
    bill.customerPhone !== "0000000000" &&
    bill.customerPhone !== "N/A"
  ) {
    doc.text(`Ph: ${bill.customerPhone}`, MARGIN, y);
    y += 4.5;
  }

  if (bill.isDelivery && bill.deliveryAddress) {
    const addrLines = doc.splitTextToSize(bill.deliveryAddress, CONTENT_WIDTH);
    addrLines.forEach((l) => {
      doc.text(l, MARGIN, y);
      y += 4.5;
    });
  }

  line();

  doc.setFont("courier", "bold");
  doc.setFontSize(9);
  boldText(doc, "ITEMS", MARGIN, y);
  boldText(doc, "QTY", 48, y, { align: "center" });
  boldText(doc, "TOTAL", PAGE_WIDTH - MARGIN, y, { align: "right" });
  y += 5;

  bill.itemsList.forEach((item) => {
    const baseName =
      typeof item.product_id === "object"
        ? item.product_id?.name || item.name
        : item.name || "Item";
    const hasVariant = !!item.variant?.name;
    const variantName = item.variant?.name;
    const itemName = hasVariant ? `${baseName} (${variantName})` : baseName;

    const itemQty = item.qty || item.quantity || 1;
    const addonsList = Array.isArray(item.addons) ? item.addons : [];
    const itemTotal = getItemTotal(item);

    doc.setFont("courier", "bold");
    doc.setFontSize(8.5);

    const maxNameWidth = 38;
    const nameLines = doc.splitTextToSize(itemName, maxNameWidth);

    boldText(doc, nameLines[0] || itemName, MARGIN, y);
    doc.text(`x${itemQty}`, 48, y, { align: "center" });
    doc.text(`${itemTotal.toFixed(2)}`, PAGE_WIDTH - MARGIN, y, {
      align: "right",
    });
    y += 4.5;

    for (let i = 1; i < nameLines.length; i++) {
      doc.text(nameLines[i], MARGIN, y);
      y += 4.5;
    }

    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);

    addonsList.forEach((a) => {
      doc.text(`  + ${a.name} (${Number(a.price).toFixed(2)})`, MARGIN, y);
      y += 4.2;
    });

    const instruction =
      item.instruction || item.special_instruction || item.note;
    if (instruction) {
      const instrLines = doc.splitTextToSize(
        `Note: ${instruction}`,
        maxNameWidth,
      );
      instrLines.forEach((l) => {
        doc.text(`  ${l}`, MARGIN, y);
        y += 4.2;
      });
    }

    y += 1.5;
  });

  line();

  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);

  doc.text("Item Total", MARGIN, y);
  doc.text(`${bill.subTotal.toFixed(2)}`, PAGE_WIDTH - MARGIN, y, {
    align: "right",
  });
  y += 4.5;

  if (bill.discountAmount > 0) {
    doc.text("Discount", MARGIN, y);
    doc.text(`- ${bill.discountAmount.toFixed(2)}`, PAGE_WIDTH - MARGIN, y, {
      align: "right",
    });
    y += 4.5;
  }

  bill.gstGroupList.forEach((group) => {
    const halfRate = (group.percent / 2).toFixed(1);
    const halfAmount = group.taxValue / 2;

    doc.text(`CGST @${halfRate}%`, MARGIN, y);
    doc.text(`${halfAmount.toFixed(2)}`, PAGE_WIDTH - MARGIN, y, {
      align: "right",
    });
    y += 4.2;

    doc.text(`SGST @${halfRate}%`, MARGIN, y);
    doc.text(`${halfAmount.toFixed(2)}`, PAGE_WIDTH - MARGIN, y, {
      align: "right",
    });
    y += 4.2;
  });

  if (bill.gstGroupList.length === 0) {
    doc.text("GST", MARGIN, y);
    doc.text("0.00", PAGE_WIDTH - MARGIN, y, { align: "right" });
    y += 4.2;
  }

  if (bill.isDelivery) {
    doc.text("Delivery Charge", MARGIN, y);
    doc.text(
      bill.deliveryCharge > 0 ? `${bill.deliveryCharge.toFixed(2)}` : "FREE",
      PAGE_WIDTH - MARGIN,
      y,
      { align: "right" },
    );
    y += 4.5;
  }

  bill.additionalCharges.forEach((charge) => {
    doc.text(charge.label, MARGIN, y);
    doc.text(`${charge.value.toFixed(2)}`, PAGE_WIDTH - MARGIN, y, {
      align: "right",
    });
    y += 4.5;
  });

  y += 1;
  line();

  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  boldText(doc, "GRAND TOTAL", MARGIN, y);
  boldText(doc, `Rs.${Math.round(bill.grandTotal)}`, PAGE_WIDTH - MARGIN, y, {
    align: "right",
  });
  y += 6;

  line();

  doc.setFont("courier", "bold");
  doc.setFontSize(7);
  doc.text("This is a computer generated invoice.", centerX, y, {
    align: "center",
  });
  y += 3.8;
  doc.text("Thank you for your order!", centerX, y, { align: "center" });
  y += 6;

  return y;
};

export const generateOrderBillPDF = async (order, storeProfile) => {
  const bill = buildBillData(order, storeProfile, 0);
  const storeLogo =
    storeProfile?.store_profile?.logo ?? storeProfile?.logo ?? "";
  const logoBase64 = await loadImageAsBase64(storeLogo);

  const PAGE_WIDTH = 76.2;

  const measureDoc = new jsPDF({ unit: "mm", format: [PAGE_WIDTH, 2000] });
  const finalHeight = drawBill(
    measureDoc,
    bill,
    order,
    storeProfile,
    logoBase64,
  );

  const doc = new jsPDF({ unit: "mm", format: [PAGE_WIDTH, finalHeight] });
  drawBill(doc, bill, order, storeProfile, logoBase64);

  const fileName = `Bill_${bill.invoiceNumber || "Order"}.pdf`;
  doc.save(fileName);

  if (!order.invoice_number && !order.invoice_seq) {
    incrementLocalSequence(storeProfile, 1);
  }
};

export const generateBulkBillsPDF = async (ordersArray, storeProfile) => {
  if (!ordersArray || ordersArray.length === 0) return;

  let doc = null;
  const PAGE_WIDTH = 76.2;

  const storeLogo =
    storeProfile?.store_profile?.logo ?? storeProfile?.logo ?? "";
  const logoBase64 = await loadImageAsBase64(storeLogo);

  let generatedCount = 0;

  for (let i = 0; i < ordersArray.length; i++) {
    const order = ordersArray[i];

    let currentOffset = 0;
    if (!order.invoice_number && !order.invoice_seq) {
      currentOffset = generatedCount;
      generatedCount++;
    }

    const bill = buildBillData(order, storeProfile, currentOffset);

    const measureDoc = new jsPDF({ unit: "mm", format: [PAGE_WIDTH, 2000] });
    const finalHeight = drawBill(
      measureDoc,
      bill,
      order,
      storeProfile,
      logoBase64,
    );

    if (i === 0) {
      doc = new jsPDF({ unit: "mm", format: [PAGE_WIDTH, finalHeight] });
      drawBill(doc, bill, order, storeProfile, logoBase64);
    } else {
      doc.addPage([PAGE_WIDTH, finalHeight]);
      drawBill(doc, bill, order, storeProfile, logoBase64);
    }
  }

  if (doc) {
    doc.save(`Bulk_Bills_${ordersArray.length}_Orders.pdf`);
  }

  if (generatedCount > 0) {
    incrementLocalSequence(storeProfile, generatedCount);
  }
};
