import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useCustomerProfileStore from "../../store/customerProfileStore";
import AddressCard from "../../components/customer/profile/AddressCard";
import SecondaryButton from "../../components/customer/common/SecondaryButton";
import PrimaryButton from "../../components/customer/common/PrimaryButton";

const emptyAddressForm = { type: "Home", mohalla: "", address: "", landmark: "", phone: "" };

const Addresses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const authUser = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  // IDs ko multiple jagah se nikaal rahe hain taaki kabhi missing na ho
  const sellerId = profile?.seller_id || authUser?.seller_id || localStorage.getItem("seller_id");
  const customerId = profile?._id || profile?.id || authUser?.customer_id || localStorage.getItem("customerId");
  const userId = authUser?._id || authUser?.id || profile?.user_id;

  const addresses = useCustomerProfileStore((state) => state.addresses);
  const loadingAddresses = useCustomerProfileStore((state) => state.loadingAddresses);
  const savingAddress = useCustomerProfileStore((state) => state.savingAddress);
  const addressError = useCustomerProfileStore((state) => state.addressError);
  const fetchAddresses = useCustomerProfileStore((state) => state.fetchAddresses);
  const addAddress = useCustomerProfileStore((state) => state.addAddress);
  const updateAddress = useCustomerProfileStore((state) => state.updateAddress);
  const setDefaultAddressAction = useCustomerProfileStore((state) => state.setDefaultAddress);
  const deleteAddressAction = useCustomerProfileStore((state) => state.deleteAddress);
  const clearAddressError = useCustomerProfileStore((state) => state.clearAddressError);

  const userPhone = profile?.customer_phone || authUser?.phoneNumber || authUser?.phone || localStorage.getItem("customer_phone");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyAddressForm);
  const [errors, setErrors] = useState({});
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditingId(null);
      setForm(emptyAddressForm);
      setErrors({});
      setFormOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    clearAddressError();
    if (userPhone && sellerId) fetchAddresses(userPhone, sellerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPhone, sellerId]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyAddressForm);
    setErrors({});
    setFormOpen(true);
  };

  const openEditForm = (address) => {
    setEditingId(address._id || address.id);
    setForm({
      type: address.title || address.type || "Home",
      mohalla: address.mohalla || "",
      address: address.delivery_address || address.address || "",
      landmark: address.landmark || "",
      phone: address.phone || userPhone || "",
    });
    setErrors({});
    setFormOpen(true);
  };

  // 🟢 Enhanced Geolocation Logic
  const getAddressLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Nominatim limit is 1 request/sec. Try to add user agent email if needed for production.
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          if (!res.ok) throw new Error("Network response was not ok");
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            address: data.display_name || `${latitude}, ${longitude}`,
            _latitude: latitude,
            _longitude: longitude,
          }));
        } catch {
          // Fallback if nominatim fails
          setForm((prev) => ({
            ...prev,
            address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            _latitude: latitude,
            _longitude: longitude,
          }));
        }
        setLocLoading(false);
      },
      (error) => {
        // Detailed Error Handling for Mobile
        setLocLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location access denied. Please allow location permissions in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable. Check your device's GPS signal.");
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out. Try again.");
            break;
          default:
            alert("An unknown error occurred while getting location.");
            break;
        }
      },
      {
        enableHighAccuracy: true, // 🟢 Force mobile devices to use GPS for better accuracy
        timeout: 10000,           // 🟢 Wait up to 10 seconds before timing out
        maximumAge: 0             // 🟢 Do not use cached location
      }
    );
  };

  const validate = () => {
    const errs = {};
    if (!form.mohalla.trim()) errs.mohalla = "Delivery area is required";
    if (!form.address.trim()) errs.address = "Address is required";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.warn("Please complete the required address details.");
      return;
    }
    try {
      const currentSellerId = sellerId || localStorage.getItem("seller_id");
      const customerPhone = userPhone || localStorage.getItem("customer_phone");

      if (!currentSellerId || !customerPhone) {
        toast.error("Seller information or customer phone is missing. Please log in again.");
        return;
      }

      const payload = {
        seller_id: currentSellerId,
        customer_phone: customerPhone,
        customer_id: customerId,
        user_id: userId,
        title: form.type,
        customer_name: profile?.customer_name || authUser?.name || "Customer",
        delivery_address: `${form.address.trim()}, ${form.mohalla.trim()}`,
        mohalla: form.mohalla.trim(),
        landmark: form.landmark ? form.landmark.trim() : "",
        phone: form.phone || customerPhone,
        latitude: form._latitude || 0,
        longitude: form._longitude || 0,
        is_default: false,
      };

      if (editingId) {
        payload.address_id = editingId;
        await updateAddress(editingId, payload);
      } else {
        await addAddress(payload);
      }

      setFormOpen(false);
      setEditingId(null);
      fetchAddresses(customerPhone, currentSellerId);
      toast.success(editingId ? "Address updated successfully." : "Address added successfully.");
    } catch (err) {
      setErrors({ address: err.response?.data?.message || "Could not save address" });
      toast.error(err.response?.data?.message || "Could not save address.");
    }
  };

  const handleDelete = async (address) => {
    const id = address._id || address.id;
    if (!id) return;
    if (!window.confirm("Delete this address?")) return;
    try {
      await deleteAddressAction(userPhone, id);
    } catch {
      // handled in store
    }
  };

  const handleSetDefault = async (address) => {
    const id = address._id || address.id;
    if (!id) return;
    try {
      await setDefaultAddressAction(userPhone, id, sellerId);
    } catch {
      // handled in store
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 py-6 space-y-5 pb-32 font-sans text-slate-800"
    >
      {/* Main Addresses List or Add/Edit Form */}
      {!formOpen ? (
        <>
          {loadingAddresses ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[#16522D]" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-white/5 rounded-full flex items-center justify-center text-[#16522D] mb-3">
                <MapPin size={26} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
                No saved addresses yet.
              </p>
            </div>
          ) : (
            <AddressCard
              addresses={addresses}
              onAdd={openAddForm}
              onEdit={openEditForm}
              onDelete={handleDelete}
              onSelect={handleSetDefault}
              hideHeader
            />
          )}
          {addressError && (
            <p className="mt-3 text-center text-xs font-semibold text-red-500">
              {addressError}
            </p>
          )}
        </>
      ) : (
        /* Add / Edit Form Card */
        <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs p-5 sm:p-6 max-w-xl space-y-4">

          {/* Address Type Selector */}
          <div className="flex gap-2">
            {["Home", "Work", "Other"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                className="rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                style={{
                  borderColor: form.type === t ? "var(--primary)" : "#E5E7EB",
                  backgroundColor: form.type === t ? "var(--primary-light)" : "transparent",
                  color: form.type === t ? "var(--primary)" : undefined,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Delivery Area (Mohalla) */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Delivery Area (Mohalla) *
            </label>
            <input
              type="text"
              value={form.mohalla}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, mohalla: e.target.value }));
                if (errors.mohalla) setErrors((prev) => ({ ...prev, mohalla: "" }));
              }}
              placeholder="Enter delivery area (e.g. Civil Lines)"
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none transition-colors bg-transparent text-slate-900 dark:text-white focus:border-[#16522D] ${errors.mohalla
                ? "border-red-400"
                : "border-slate-200 dark:border-slate-800"
                }`}
            />
            {errors.mohalla && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {errors.mohalla}
              </p>
            )}
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Full Address *
            </label>
            <textarea
              value={form.address}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, address: e.target.value }));
                if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
              }}
              placeholder="Enter your full delivery address"
              rows={3}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none resize-none transition-colors bg-transparent text-slate-900 dark:text-white focus:border-[#16522D] ${errors.address
                ? "border-red-400"
                : "border-slate-200 dark:border-slate-800"
                }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {errors.address}
              </p>
            )}

            <button
              onClick={getAddressLocation}
              disabled={locLoading}
              type="button"
              className="mt-2 flex items-center gap-1.5 font-semibold text-xs cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ color: "var(--primary)" }}
            >
              {locLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <MapPin size={14} />
              )}
              {locLoading ? "Getting location..." : "Use my current location"}
            </button>
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Landmark (optional)
            </label>
            <input
              type="text"
              value={form.landmark}
              onChange={(e) => setForm((prev) => ({ ...prev, landmark: e.target.value }))}
              placeholder="e.g. Near City Hospital"
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none transition-colors bg-transparent text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:border-[#16522D]"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Contact Phone (optional)
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder={userPhone || "10-digit mobile number"}
              maxLength={10}
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none transition-colors bg-transparent text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:border-[#16522D]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <SecondaryButton
              fullWidth
              onClick={() => {
                setFormOpen(false);
                setEditingId(null);
              }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton fullWidth onClick={handleSubmit} loading={savingAddress}>
              {editingId ? "Save Changes" : "Add Address"}
            </PrimaryButton>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Addresses;
