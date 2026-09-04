import {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import AddressSelector from "../../components/customer/checkout/AddressSelector";
import DeliveryTypeSelector from "../../components/customer/checkout/DeliveryTypeSelector";
import ScheduleOrderModal from "../../components/customer/checkout/ScheduleOrderModal";
import PaymentMethodList from "../../components/customer/checkout/PaymentMethodList";
import OrderSummary from "../../components/customer/checkout/OrderSummary";
import CheckoutFooter from "../../components/customer/checkout/CheckoutFooter";

import useOrderStore from "../../api/stores/customerstore/customerOrderStore";
import useCartStore from "../../api/stores/customerstore/cartStore";
import useAuthStore from "../../store/authStore";
import useDiscountStore from "../../store/discountStore";
import useCustomerProfileStore from "../../store/customerProfileStore";
import { placeGuestOrder } from "../../services/guestOrderApi";
import useGuestCartStore from "../../api/stores/customerstore/guestCartStore";
import { mockData } from "../../data/mockData";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
const RAZORPAY_ENABLED = !!RAZORPAY_KEY_ID;
const DELIVERY_LOCATION_STORAGE_KEY = "customer_delivery_location";
const CURRENT_LOCATION_ADDRESS_ID = "current-delivery-location";

const getHeaderDeliveryLocation = () => {
  try {
    const location = JSON.parse(localStorage.getItem(DELIVERY_LOCATION_STORAGE_KEY));
    return location && typeof location === "object" ? location : null;
  } catch {
    return null;
  }
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getCoordinateCandidates = (location) => {
  const candidates = [];
  const add = (latitude, longitude) => {
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      Math.abs(lat) <= 90 &&
      Math.abs(lon) <= 180
    ) {
      candidates.push({ latitude: lat, longitude: lon });
    }
  };

  add(location?.latitude ?? location?.lat, location?.longitude ?? location?.lng);

  const coordinates = location?.location?.coordinates || location?.coordinates;
  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    // GeoJSON stores coordinates as [longitude, latitude]. The second option
    // supports older address records saved as [latitude, longitude].
    add(coordinates[1], coordinates[0]);
    add(coordinates[0], coordinates[1]);
  }

  return candidates.filter(
    (candidate, index, list) =>
      list.findIndex(
        (item) =>
          item.latitude === candidate.latitude &&
          item.longitude === candidate.longitude,
      ) === index,
  );
};

const resolveDeliveryCoordinates = (address, storeCoordinates) => {
  const addressCoordinates = getCoordinateCandidates(address);
  const stores = storeCoordinates?.length ? storeCoordinates : [];

  if (!addressCoordinates.length) return { latitude: 0, longitude: 0, distance: null };
  if (!stores.length) return { ...addressCoordinates[0], distance: null };

  return addressCoordinates.reduce((nearest, addressCoordinate) => {
    const distance = Math.min(
      ...stores.map((storeCoordinate) =>
        calculateDistance(
          storeCoordinate.latitude,
          storeCoordinate.longitude,
          addressCoordinate.latitude,
          addressCoordinate.longitude,
        ),
      ),
    );

    return !nearest || distance < nearest.distance
      ? { ...addressCoordinate, distance }
      : nearest;
  }, null);
};

const normalizePhoneLocal = (phoneStr) => {
  if (!phoneStr) return "";
  let digits = String(phoneStr).replace(/\D/g, "").trim();
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length > 10) {
    digits = digits.slice(-10);
  }
  return digits;
};

const getItemTaxPercent = (item) => {
  return Number(item.product_id?.tax_percent ?? item.tax_percent ?? 0);
};

const getItemLineTotal = (item) => {
  const price = Number(item.price || item.product_id?.price || 0);
  const qty = Number(item.quantity || 1);
  const delta = Number(item.variant?.price_delta || 0);
  const addonsTotal = Array.isArray(item.addons)
    ? item.addons.reduce((s, a) => s + (Number(a.price) || 0), 0)
    : 0;

  if (item.line_total !== undefined && item.line_total !== null && item.line_total !== "") {
    return Number(item.line_total);
  }
  return (price + delta + addonsTotal) * qty;
};

function GuestCheckout({ guestCart, token, navigate }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const getItemLineTotalGuest = (item) => {
    const addonsTotal = Array.isArray(item.addons)
      ? item.addons.reduce((s, a) => s + (Number(a.price) || 0), 0)
      : 0;
    return (Number(item.price || 0) + addonsTotal) * (item.quantity || 1);
  };

  const getItemTaxAmount = (item) => {
    const taxPercent = Number(item.tax_percent) || 0;
    if (!taxPercent) return 0;
    return Number(((getItemLineTotalGuest(item) * taxPercent) / 100).toFixed(2));
  };

  const subtotal = guestCart.items.reduce((sum, i) => sum + getItemLineTotalGuest(i), 0);
  const taxTotal = Number(
    guestCart.items.reduce((sum, i) => sum + getItemTaxAmount(i), 0).toFixed(2)
  );
  const total = Number((subtotal + taxTotal).toFixed(2));

  const handlePlaceOrder = async () => {
    if (!guestCart.items.length) {
      setError("Your cart is empty.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }

    setIsPlacing(true);
    setError("");
    try {
      const orderedItems = guestCart.items.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        instruction: i.instruction,
        variant_name: i.variant?.name || null,
        addons: i.addons || [],
        tax_percent: i.tax_percent || 0,
      }));

      const payload = {
        items: orderedItems.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          instruction: i.instruction,
          variant_name: i.variant_name,
          addons: i.addons,
        })),
        customer_name: customerName,
        customer_phone: customerPhone,
        payment_method: "CASH",
      };

      const res = await placeGuestOrder(token, payload);

      setPlacedOrder({
        orderId: res.data.order?._id,
        tableNumber: guestCart.tableNumber || res.data.order?.table_number,
        customerName,
        customerPhone,
        items: orderedItems,
        subtotal: res.data.order?.subtotal ?? subtotal,
        taxTotal: res.data.order?.tax_amount ?? taxTotal,
        total: res.data.order?.total_amount ?? total,
        createdAt: new Date(),
      });

      guestCart.clearCart();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to place order.");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-5">
      <div className="space-y-3 bg-white rounded-2xl border border-slate-200 p-4">
        {guestCart.items.map((item) => (
          <div key={item.product_id} className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{item.name} x{item.quantity}</span>
            <span className="font-bold text-slate-900">₹{getItemLineTotalGuest(item)}</span>
          </div>
        ))}

        <div className="pt-3 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {taxTotal > 0 && (
            <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
              <span>Taxes</span>
              <span>+ ₹{taxTotal}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1.5 text-base font-black">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border border-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary-color)]"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={customerPhone}
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
            setCustomerPhone(digitsOnly);
          }}
          maxLength={10}
          className="w-full border border-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary-color)]"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={isPlacing}
        className="w-full bg-[var(--primary-color)] cursor-pointer text-white py-3.5 rounded-2xl text-sm font-bold transition disabled:opacity-60"
      >
        {isPlacing ? "Placing Order..." : `Place Order — ₹${total}`}
      </button>

      {placedOrder && (
        <GuestOrderConfirmationModal
          order={placedOrder}
          onClose={() => {
            guestCart.clearGuestSession();
            navigate(`/customer/menu/${token}`);
          }}
        />
      )}
    </div>
  );
}

function GuestOrderConfirmationModal({ order, onClose }) {
  const shortId = order.orderId
    ? `#${String(order.orderId).slice(-6).toUpperCase()}`
    : "N/A";

  const formattedTime = order.createdAt.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-5 text-slate-800"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 12 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </motion.div>

        <div className="text-center space-y-1">
          <h3 className="text-xl font-black text-slate-900">Order Placed!</h3>
          <p className="text-sm text-slate-500 font-medium">
            Your order {shortId} has been sent to the kitchen.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Order ID</span>
            <span className="font-bold text-slate-900">{shortId}</span>
          </div>
          {order.tableNumber && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Table Number</span>
              <span className="font-bold text-slate-900">{order.tableNumber}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Name</span>
            <span className="font-bold text-slate-900">{order.customerName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Phone</span>
            <span className="font-bold text-slate-900">{order.customerPhone}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Placed At</span>
            <span className="font-bold text-slate-900">{formattedTime}</span>
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-2">
            {order.items.map((item) => (
              <div key={item.product_id} className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-bold text-slate-800">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {order.taxTotal > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Taxes</span>
              <span className="font-bold text-slate-800">+ ₹{order.taxTotal}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-base font-black">
            <span>Total</span>
            <span className="text-emerald-700">₹{order.total}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs font-semibold text-amber-800 text-center">
          📸 Please take a screenshot of this confirmation for your records.
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#16522D] hover:bg-[#114023] text-white py-3 rounded-2xl text-sm font-bold transition"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
}

const Checkout = () => {
  const navigate = useNavigate();
  const { table_token: paramToken } = useParams();
  const guestCart = useGuestCartStore();
  const [isGuestFlow] = useState(
    () => !!paramToken || (!!guestCart.table_token && guestCart.items.length > 0)
  );

  const cartItems = useCartStore((state) => state.items || []);
  const clearCart = useCartStore((state) => state.clearCart);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const checkDiscount = useDiscountStore((state) => state.checkDiscount);

  const [isPlacing, setIsPlacing] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [deliverySettings, setDeliverySettings] = useState({
    deliveryCharge: 20,
    additionalCharges: [],
    freeDeliveryAbove: 500,
    maxDeliveryRadius: 10,
    sellerLat: 0,
    sellerLon: 0,
    sellerCoordinates: [],
    minOrderValue: 0,
    enableHomeDelivery: true,
    enablePickup: true,
  });

  const [acceptedMethods, setAcceptedMethods] = useState({ cod: true, upi: false });

  const orderStoreAction = useOrderStore(
    (state) => state.createOrder || state.placeOrder || state.createCustomerOrder
  );
  const createRazorpayOrder = useOrderStore((state) => state.createRazorpayOrder);
  const verifyRazorpayPayment = useOrderStore((state) => state.verifyRazorpayPayment);

  const authUser = useAuthStore((state) => state.user);
  const authProfile = useAuthStore((state) => state.profile);
  const sellerId =
    authProfile?.seller_id ||
    authUser?.seller_id ||
    localStorage.getItem("seller_id");

  const customerPhone =
    authProfile?.customer_phone ||
    authUser?.phoneNumber ||
    authUser?.phone ||
    localStorage.getItem("customer_phone");

  const addresses = useCustomerProfileStore((state) => state.addresses);
  const fetchAddresses = useCustomerProfileStore((state) => state.fetchAddresses);

  const [storeInfo, setStoreInfo] = useState({
    store_name: "",
  });

  useEffect(() => {
    if (isGuestFlow) return;
    if (customerPhone && sellerId) {
      fetchAddresses(customerPhone, sellerId);
    }
  }, [customerPhone, sellerId, fetchAddresses, isGuestFlow]);

  useEffect(() => {
    if (isGuestFlow) return;
    const fetchDeliveryConfig = async () => {
      try {
        const sellerData = mockData.seller;
        if (sellerData) {
          const profile = sellerData.store_profile || {};
          const coords = sellerData.store_location?.coordinates || [0, 0];

          const rawCharges = sellerData.delivery_settings?.additional_charges;
          const normalizedCharges = Array.isArray(rawCharges)
            ? rawCharges
              .filter((c) => c && c.label && Number(c.value) > 0)
              .map((c) => ({ label: c.label, value: Number(c.value) }))
            : [];

          setDeliverySettings({
            deliveryCharge: Number(
              sellerData.delivery_settings?.delivery_charge ?? 20
            ),
            additionalCharges: normalizedCharges,
            freeDeliveryAbove: Number(
              sellerData.delivery_settings?.free_delivery_above ?? 500
            ),
            maxDeliveryRadius: Number(
              sellerData.delivery_settings?.delivery_radius_km ?? 10
            ),
            minOrderValue: Number(
              sellerData.delivery_settings?.min_order_value ?? 0
            ),
            sellerLon: Number(coords[0] || 0),
            sellerLat: Number(coords[1] || 0),
            sellerCoordinates: getCoordinateCandidates(sellerData.store_location),
            enableHomeDelivery:
              sellerData.delivery_settings?.enable_home_delivery ?? true,
            enablePickup:
              sellerData.delivery_settings?.enable_pickup ?? true,
          });

          const resolvedStoreName =
            profile.store_name || sellerData.business_name || "";
          if (resolvedStoreName) {
            setStoreInfo({ store_name: resolvedStoreName });
            localStorage.setItem("store_name", resolvedStoreName);
          }

          const methods =
            sellerData.payment_settings?.accepted_methods || { cod: true, upi: false };
          setAcceptedMethods(methods);
        }
      } catch (err) {
        console.warn("Could not fetch seller settings, using defaults.", err);
      }
    };
    fetchDeliveryConfig();
  }, [isGuestFlow, sellerId]);

  const [deliveryType, setDeliveryType] = useState("delivery");

  useEffect(() => {
    const deliveryTypeTimer = window.setTimeout(() => {
      if (!deliverySettings.enableHomeDelivery && deliverySettings.enablePickup) {
        setDeliveryType("pickup");
      } else if (deliverySettings.enableHomeDelivery && !deliverySettings.enablePickup) {
        setDeliveryType("delivery");
      }
    }, 0);

    return () => window.clearTimeout(deliveryTypeTimer);
  }, [deliverySettings.enableHomeDelivery, deliverySettings.enablePickup]);

  const availablePaymentMethods = useMemo(() => {
    const methods = [];

    if (acceptedMethods.upi && RAZORPAY_ENABLED) {
      methods.push({
        id: "razorpay",
        type: "razorpay",
        title: "Pay Online",
        name: "Razorpay (Card/UPI/NetBanking)",
        default: true,
      });
    }

    if (acceptedMethods.cod && deliveryType !== "pickup") {
      methods.push({
        id: "cod",
        type: "cod",
        title: "Cash on Delivery",
        name: "COD",
        default: methods.length === 0,
      });
    }

    return methods;
  }, [acceptedMethods, deliveryType]);

  useEffect(() => {
    const paymentTimer = window.setTimeout(() => {
      if (
        availablePaymentMethods.length > 0 &&
        (!selectedPayment || !availablePaymentMethods.find((m) => m.id === selectedPayment.id))
      ) {
        setSelectedPayment(availablePaymentMethods[0]);
      } else if (availablePaymentMethods.length === 0) {
        setSelectedPayment(null);
      }
    }, 0);

    return () => window.clearTimeout(paymentTimer);
  }, [availablePaymentMethods, selectedPayment]);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [headerDeliveryLocation] = useState(getHeaderDeliveryLocation);

  const checkoutAddresses = useMemo(() => {
    const savedAddresses = addresses || [];
    const latitude = Number(headerDeliveryLocation?.latitude);
    const longitude = Number(headerDeliveryLocation?.longitude);
    const hasCurrentLocation =
      headerDeliveryLocation?.type === "current" &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude);

    if (!hasCurrentLocation) return savedAddresses;

    return [
      {
        id: CURRENT_LOCATION_ADDRESS_ID,
        title: headerDeliveryLocation.title || "Current location",
        delivery_address: headerDeliveryLocation.subtitle || "Current location",
        latitude,
        longitude,
        isCurrentLocation: true,
      },
      ...savedAddresses,
    ];
  }, [addresses, headerDeliveryLocation]);

  const defaultAddressId = useMemo(() => {
    if (headerDeliveryLocation?.type === "current") {
      return CURRENT_LOCATION_ADDRESS_ID;
    }

    if (headerDeliveryLocation?.type === "saved") {
      const savedHeaderAddress = checkoutAddresses.find(
        (item) => (item._id || item.id) === headerDeliveryLocation.addressId,
      );
      if (savedHeaderAddress) return savedHeaderAddress._id || savedHeaderAddress.id;
    }

    const defaultAddress =
      checkoutAddresses.find((item) => item.is_default || item.default) || checkoutAddresses[0];
    return defaultAddress?._id || defaultAddress?.id || null;
  }, [checkoutAddresses, headerDeliveryLocation]);

  const selectedAddress = useMemo(() => {
    if (checkoutAddresses.length === 0) return null;
    const addressId = selectedAddressId || defaultAddressId;
    return checkoutAddresses.find((item) => (item._id || item.id) === addressId) || checkoutAddresses[0];
  }, [checkoutAddresses, defaultAddressId, selectedAddressId]);

  const selectedDeliveryCoordinates = useMemo(
    () => resolveDeliveryCoordinates(selectedAddress, deliverySettings.sellerCoordinates),
    [selectedAddress, deliverySettings.sellerCoordinates],
  );

  const [manualCouponCode, setManualCouponCode] = useState("");
  const couponCode = selectedCoupon ? selectedCoupon.code : manualCouponCode;

  const [couponError, setCouponError] = useState("");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    if (isGuestFlow) return;
    const fetchAvailableCoupons = async () => {
      if (!sellerId) return;
      try {
        const resData = mockData.discounts;
        const rawCoupons = Array.isArray(resData)
          ? resData
          : (resData?.discounts || resData?.data || []);

        const currentDate = new Date();
        const myPhone = normalizePhoneLocal(customerPhone);

        const activeOnlyCoupons = rawCoupons.filter((c) => {
          const isActive = c.is_active !== false;
          const notExpired = c.valid_until ? new Date(c.valid_until) >= currentDate : true;
          const underTotalLimit = c.usage_limit_total ? c.used_count < c.usage_limit_total : true;

          const perCustomerLimit = c.usage_limit_per_customer || 1;
          const myUsedCount =
            myPhone && Array.isArray(c.redemptions)
              ? c.redemptions.filter((r) => normalizePhoneLocal(r.customer_phone) === myPhone).length
              : 0;
          const underPerCustomerLimit = myUsedCount < perCustomerLimit;

          return isActive && notExpired && underTotalLimit && underPerCustomerLimit;
        });

        setAvailableCoupons(activeOnlyCoupons);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };

    fetchAvailableCoupons();
  }, [sellerId, customerPhone, isGuestFlow]);

  const [scheduledOrder, setScheduledOrder] = useState({
    scheduled: false,
    date: "",
    time: "",
    datetime: null,
  });

  const [razorpayReady, setRazorpayReady] = useState(RAZORPAY_ENABLED);

  useEffect(() => {
    if (!RAZORPAY_ENABLED) return;
    loadRazorpayScript().then((loaded) => setRazorpayReady(loaded));
  }, []);

  const handleDeliveryTypeChange = useCallback((type) => {
    setDeliveryType(type);
  }, []);

  const handleScheduleConfirm = (schedule) => {
    setScheduledOrder({
      scheduled: true,
      ...schedule,
    });
  };

  const handleCouponChange = (value) => {
    setManualCouponCode(value);
    if (couponError) setCouponError("");
    if (selectedCoupon) setSelectedCoupon(null);
  };

  const handleApplyCoupon = async (selectedCode) => {
    const code = (selectedCode || couponCode).trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.line_total ?? item.price * item.quantity),
      0
    );

    try {
      const result = await checkDiscount(code, sellerId, customerPhone, subtotal, cartItems);
      const data = result?.data || result;
      const doc = result?.discountDoc || data?.discountDoc || data;

      setCouponError("");

      setSelectedCoupon({
        code: doc.coupon_code || doc.code || code,
        discountType: doc.discount_type || doc.discountType || "flat",
        discount: doc.discount_value ?? data.discount ?? data.discount_amount ?? 0,
        exactAmount: result?.discountAmount ?? data?.discountAmount ?? data?.discount_amount ?? 0,
        minOrder: doc.min_order_value ?? doc.minOrder ?? 0,
        maxDiscount: doc.max_discount_cap ?? doc.maxDiscount,
      });
    } catch (err) {
      setCouponError(
        err.response?.data?.message || "The coupon is invalid. Please enter a valid coupon."
      );
      setSelectedCoupon(null);
    }
  };

  const orderSummary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const itemTotal = getItemLineTotal(item);
      return sum + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);

    const rawTaxTotal = cartItems.reduce((sum, item) => {
      const itemTotal = getItemLineTotal(item);
      const taxPercent = getItemTaxPercent(item);
      if (!taxPercent) return sum;
      return sum + (itemTotal * taxPercent) / 100;
    }, 0);

    const freeThreshold = Number(deliverySettings.freeDeliveryAbove) || 0;
    const deliveryCharge = Number(deliverySettings.deliveryCharge) || 0;
    const additionalCharges =
      deliveryType === "pickup" ? [] : (deliverySettings.additionalCharges || []);
    const additionalChargesTotal = additionalCharges.reduce(
      (sum, c) => sum + (Number(c.value) || 0),
      0
    );

    const delivery =
      deliveryType === "pickup"
        ? 0
        : (subtotal >= freeThreshold && freeThreshold > 0)
          ? 0
          : deliveryCharge;

    let discount = 0;

    if (selectedCoupon) {
      if (selectedCoupon.exactAmount > 0) {
        discount = selectedCoupon.exactAmount;
      } else if (selectedCoupon.discountType === "flat" || selectedCoupon.discountType === "FREE_PRODUCT") {
        discount = Number(selectedCoupon.discount || 0);
      } else {
        discount = Math.round((subtotal * Number(selectedCoupon.discount)) / 100);
        if (selectedCoupon.maxDiscount > 0) {
          discount = Math.min(discount, selectedCoupon.maxDiscount);
        }
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);

    const discountRatio = subtotal > 0 ? discountedSubtotal / subtotal : 1;
    const tax = Math.round(rawTaxTotal * discountRatio);

    const amountRemaining = freeThreshold > 0 ? Math.max(freeThreshold - subtotal, 0) : 0;
    const progress = freeThreshold > 0 ? Math.min((subtotal / freeThreshold) * 100, 100) : 100;
    const freeDeliveryUnlocked = freeThreshold > 0 ? subtotal >= freeThreshold : true;

    const calculatedTotal = discountedSubtotal + delivery + additionalChargesTotal + tax;

    return {
      subtotal,
      discount,
      deliveryFee: delivery,
      additionalCharges,
      additionalChargesTotal,
      taxes: tax,
      total: calculatedTotal,
      freeDeliveryThreshold: freeThreshold,
      amountRemaining,
      progress,
      freeDeliveryUnlocked,
    };
  }, [cartItems, selectedCoupon, deliveryType, deliverySettings]);

  const isBelowMinOrder = orderSummary.subtotal < deliverySettings.minOrderValue;

  const coupon = {
    code: couponCode,
    applied: !!selectedCoupon,
    discount: orderSummary.discount,
    error: couponError,
    offers: availableCoupons,
  };

  const buildOrderPayload = (paymentMethodLabel, extra = {}) => {
    const customerName =
      authProfile?.customer_name ||
      authUser?.name ||
      authUser?.customer_name ||
      localStorage.getItem("customer_name") ||
      "Customer";

    const selectedAddressId = selectedAddress?._id || selectedAddress?.id;
    const addressDetails = selectedAddress
      ? [
          selectedAddress.delivery_address || selectedAddress.address,
          selectedAddress.mohalla || selectedAddress.city,
        ]
          .filter(Boolean)
          .join(", ")
      : "";
    const deliveryAddressText =
      deliveryType === "delivery" && selectedAddress
        ? `${selectedAddress.title ? `${selectedAddress.title}: ` : ""}${addressDetails}`
        : "";

    const mohallaText =
      selectedAddress?.mohalla ||
      selectedAddress?.city ||
      "Local Area";

    const appliedCouponCode = selectedCoupon?.code || couponCode || "";
    const appliedDiscountAmount = Number(orderSummary.discount) || 0;
    const deliveryLatitude =
      deliveryType === "delivery" ? selectedDeliveryCoordinates.latitude : 0;
    const deliveryLongitude =
      deliveryType === "delivery" ? selectedDeliveryCoordinates.longitude : 0;

    return {
      seller_id: sellerId,
      customer_name: customerName,
      customer_phone: customerPhone,

      order_type: deliveryType === "pickup" ? "takeaway" : "delivery",
      payment_method: paymentMethodLabel,

      delivery_fee: orderSummary.deliveryFee,
      delivery_charge: orderSummary.deliveryFee,
      additional_charges: orderSummary.additionalCharges,
      subtotal: orderSummary.subtotal,

      discount: appliedDiscountAmount,
      discount_amount: appliedDiscountAmount,
      tax_amount: orderSummary.taxes,

      amount: orderSummary.total,
      total_amount: orderSummary.total,

      // Send both the chosen saved-address ID and its resolved location details.
      // The ID is omitted for a device's current location, which is not a saved address.
      address_id:
        deliveryType === "delivery" &&
        selectedAddressId !== CURRENT_LOCATION_ADDRESS_ID
          ? selectedAddressId
          : undefined,
      delivery_address_id:
        deliveryType === "delivery" &&
        selectedAddressId !== CURRENT_LOCATION_ADDRESS_ID
          ? selectedAddressId
          : undefined,
      delivery_address: deliveryAddressText,
      mohalla: deliveryType === "delivery" ? mohallaText : "",
      // Keep all coordinate names in sync. The orders API has historically
      // accepted both latitude/longitude and lat/lng fields.
      latitude: deliveryLatitude,
      longitude: deliveryLongitude,
      lat: deliveryLatitude,
      lng: deliveryLongitude,
      location:
        deliveryType === "delivery" && deliveryLatitude && deliveryLongitude
          ? {
              type: "Point",
              coordinates: [deliveryLongitude, deliveryLatitude],
            }
          : undefined,

      items: cartItems.map((item) => {
        const unitPrice = item.line_total
          ? Number(item.line_total) / Number(item.quantity || 1)
          : Number(item.price || item.product_id?.price || 0);

        return {
          product_id:
            item.product_id?._id ||
            item.product_id?.id ||
            (typeof item.product_id === "string" ? item.product_id : item._id || item.id),
          quantity: item.quantity || 1,
          price: unitPrice,
          tax_percent: getItemTaxPercent(item),
          variant: item.variant
            ? { name: item.variant.name, price_delta: Number(item.variant.price_delta) || 0 }
            : null,
          addons: Array.isArray(item.addons)
            ? item.addons.map((a) => ({ name: a.name, price: Number(a.price) || 0 }))
            : [],
          special_instructions: item.special_instructions || item.instruction || "",
        };
      }),

      coupon_code: appliedCouponCode,
      discount_code: appliedCouponCode,

      is_scheduled: scheduledOrder.scheduled,
      scheduled_for: scheduledOrder.datetime || undefined,

      ...extra,
    };
  };

  const goToOrderPage = (response) => {
    const realOrderId =
      response?.order?._id ||
      response?.order?.id ||
      response?.data?._id ||
      response?.data?.id ||
      response?._id ||
      response?.id;

    navigate("/customer/order-success", {
      replace: true,
      state: {
        order: response?.order || response?.data || response,
        orderId: realOrderId,
        total: orderSummary.total,
        deliveryType,
      },
    });
  };

  const placeCodOrder = async () => {
    const payload = buildOrderPayload("COD");
    const response = await orderStoreAction(payload);
    return response;
  };

  const placeRazorpayOrder = async () => {
    if (typeof createRazorpayOrder !== "function" || typeof verifyRazorpayPayment !== "function") {
      toast.error("Online payment is unavailable right now. Please use Cash on Delivery.");
      return;
    }

    const orderPayload = buildOrderPayload("ONLINE");
    const initiateResponse = await createRazorpayOrder(orderPayload);

    const rzpOrderId = initiateResponse?.razorpay_order_id;
    const backendAmount = initiateResponse?.amount || initiateResponse?.data?.amount;
    const rzpAmount = backendAmount ? Number(backendAmount) : Math.round(orderSummary.total * 100);
    const pendingOrderId = initiateResponse?.order_id || initiateResponse?.data?.order_id;

    if (!rzpOrderId) {
      toast.error("Unable to initiate payment. Please try again.");
      return;
    }

    const resolvedThemeColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color")
        .trim() || "#16522D";

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: rzpAmount,
        currency: "INR",
        name: storeInfo?.store_name || localStorage.getItem("store_name") || authProfile?.store_name || authUser?.store_name || "BizBiteNow",
        description: `Order Payment (${orderPayload.coupon_code ? 'Coupon: ' + orderPayload.coupon_code : ''})`,
        order_id: rzpOrderId,
        config: {
          display: {
            config_id: "config_RghlebHGc9PUBp",
          },
        },
        prefill: {
          name: authProfile?.customer_name || authUser?.name || "Customer",
          contact: customerPhone || "",
          email: authProfile?.customer_email || authUser?.email || "",
        },
        theme: { color: resolvedThemeColor },
        handler: async (rzpResponse) => {
          try {
            const verified = await verifyRazorpayPayment({
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
              order_id: pendingOrderId,
            });

            if (!verified?.success) {
              toast.error("Payment verification failed. Please contact support if amount was deducted.");
              return reject(new Error("verification_failed"));
            }

            resolve({ order: verified.order });
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => reject(new Error("payment_cancelled")),
        },
      });

      rzp.on("payment.failed", (resp) => {
        toast.error(resp?.error?.description || "Payment failed. Please try again.");
        reject(new Error("payment_failed"));
      });

      rzp.open();
    });
  };

  const placeOrder = async () => {
    if (isPlacing) return;

    if (!cartItems.length) {
      toast.warn("Your cart is empty.");
      return;
    }

    if (!selectedAddress && deliveryType === "delivery") {
      toast.warn("Please select a delivery address.");
      return;
    }

    if (!selectedPayment) {
      toast.warn("Please select a payment method.");
      return;
    }

    if (selectedPayment.type === "razorpay" && (!RAZORPAY_ENABLED || !razorpayReady)) {
      toast.warn("Online payment is currently unavailable. Please try Cash on Delivery.");
      return;
    }

    if (!sellerId) {
      toast.error("Unable to identify the seller. Please try again.");
      return;
    }

    if (!customerPhone) {
      toast.error("Customer phone number is missing. Please log in again.");
      return;
    }

    if (isBelowMinOrder) {
      toast.warn(`Minimum order requirement of ₹${deliverySettings.minOrderValue} is not met.`);
      return;
    }

    if (deliveryType === "delivery" && selectedAddress) {
      const dist = selectedDeliveryCoordinates.distance;

      if (Number.isFinite(dist) && dist > deliverySettings.maxDeliveryRadius) {
        toast.warn(`Selected address is outside our delivery radius (${dist.toFixed(1)} km away). Please select another address or choose takeaway.`);
        return;
      }
    }

    setIsPlacing(true);

    try {
      let response;

      if (selectedPayment.type === "razorpay") {
        response = await placeRazorpayOrder();
        setSelectedCoupon(null);
        if (typeof clearCart === "function") await clearCart();
        toast.success("Payment complete — your order has been placed!");
        goToOrderPage(response);
      } else {
        response = await placeCodOrder();
        setSelectedCoupon(null);
        if (typeof clearCart === "function") await clearCart();
        toast.success("Your order has been placed successfully!");
        goToOrderPage(response);
      }
    } catch (err) {
      if (err?.message !== "payment_cancelled") {
        console.error("Error placing order:", err);
        toast.error(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to place order."
        );
      }
    } finally {
      setIsPlacing(false);
    }
  };

  if (isGuestFlow) {
    return (
      <GuestCheckout
        guestCart={guestCart}
        token={paramToken || guestCart.table_token}
        navigate={navigate}
      />
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full max-w-none px-3 py-4 sm:px-4 lg:px-8 mb-20"
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,1fr)] xl:gap-6">
          <div className="space-y-6">
            <AddressSelector
              addresses={checkoutAddresses}
              selectedAddress={selectedAddress}
              onSelect={(addr) => setSelectedAddressId(addr._id || addr.id)}
              onManage={() => navigate("/customer/profile/addresses")}
            />

            <DeliveryTypeSelector
              deliveryType={deliveryType}
              scheduled={scheduledOrder.scheduled}
              scheduledLabel={
                scheduledOrder.scheduled
                  ? `${scheduledOrder.date} • ${scheduledOrder.time}`
                  : ""
              }
              onDeliveryTypeChange={handleDeliveryTypeChange}
              onScheduleClick={() => setScheduleModalOpen(true)}
              enableHomeDelivery={deliverySettings.enableHomeDelivery}
              enablePickup={deliverySettings.enablePickup}
            />

            <PaymentMethodList
              paymentMethods={availablePaymentMethods}
              selectedPayment={selectedPayment}
              deliveryType={deliveryType}
              onSelect={setSelectedPayment}
            />

            {deliveryType === "pickup" && availablePaymentMethods.length === 0 && (
              <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3">
                <p className="text-xs sm:text-sm font-medium text-rose-700 leading-snug">
                  Online Payment is not available at this moment.
                </p>
              </div>
            )}

            {RAZORPAY_ENABLED && !razorpayReady && (
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-amber-600 shrink-0 mt-0.5"
                >
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
                <p className="text-xs sm:text-sm font-medium text-amber-800 leading-snug">
                  Online payment is currently unavailable. Please select Cash on Delivery to continue.
                </p>
              </div>
            )}
          </div>

          <div className="h-fit xl:sticky xl:top-24 space-y-4">
            <OrderSummary
              summary={orderSummary}
              deliveryType={deliveryType}
              coupon={coupon}
              onCouponChange={handleCouponChange}
              onApplyCoupon={handleApplyCoupon}
            />

            {isBelowMinOrder && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-center shadow-xs">
                <p className="text-[13px] font-bold text-rose-600 flex items-center justify-center gap-1.5">
                  ⚠️ Minimum order amount should be ₹{deliverySettings.minOrderValue}
                </p>
                <p className="text-[11px] font-semibold text-rose-500/90 mt-1">
                  Your current order value is ₹{orderSummary.subtotal}. Please add items worth ₹{deliverySettings.minOrderValue - orderSummary.subtotal} more to checkout.
                </p>
              </div>
            )}

            <CheckoutFooter
              total={orderSummary.total}
              loading={isPlacing}
              disabledMessage={
                !selectedAddress && deliveryType === "delivery"
                  ? "Add Address to Continue"
                  : ""
              }
              disabled={
                isPlacing ||
                (!selectedAddress && deliveryType === "delivery") ||
                !selectedPayment ||
                cartItems.length === 0 ||
                (selectedPayment?.type === "razorpay" && (!RAZORPAY_ENABLED || !razorpayReady)) ||
                isBelowMinOrder
              }
              onPlaceOrder={placeOrder}
            />
          </div>
        </div>
      </motion.div>

      <ScheduleOrderModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onConfirm={handleScheduleConfirm}
      />
    </>
  );
};

export default Checkout;
