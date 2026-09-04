import {
  Bell,
  ShoppingCart,
  Gift,
  ShoppingBag,
  MapPin,
  ChevronDown,
  Navigation,
  Download,
  X,
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../../api/stores/customerstore/cartStore";
import useGuestCartStore from "../../../api/stores/customerstore/guestCartStore";
import useNotificationStore from "../../../api/stores/customerstore/notificationStore";
import useStoreStore from "../../../api/stores/customerstore/storeStore";
import useAuthStore from "../../../store/authStore";
import useCustomerProfileStore from "../../../store/customerProfileStore";
import bizBiteIcon from "../../../assets/BIZ BITE NOW Icon.png";

const DELIVERY_LOCATION_STORAGE_KEY = "customer_delivery_location";

const persistDeliveryLocation = (location) => {
  localStorage.setItem(DELIVERY_LOCATION_STORAGE_KEY, JSON.stringify(location));
};

const CustomerHeader = ({ sidebarExpanded, isDesktop }) => {
  const navigate = useNavigate();

  const store = useStoreStore((state) => state.store) || {};
  const fetchStore = useStoreStore((state) => state.fetchStore);
  const authUser = useAuthStore((state) => state.user);
  const authProfile = useAuthStore((state) => state.profile);
  const addresses = useCustomerProfileStore((state) => state.addresses);
  const fetchAddresses = useCustomerProfileStore((state) => state.fetchAddresses);

  const notifications = useNotificationStore((state) => state.notifications) || [];
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    title: "Select your location",
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [canInstall, setCanInstall] = useState(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    return !isStandalone && Boolean(window.__deferredInstallPrompt);
  });
  const [installing, setInstalling] = useState(false);
  const [showInstallConfirm, setShowInstallConfirm] = useState(false);

  const wrapperRef = useRef(null);
  const authCartItems = useCartStore((state) => state.items) || [];
  const guestCartItems = useGuestCartStore((state) => state.items) || [];

  const cartCount = [...authCartItems, ...guestCartItems].reduce(
    (total, item) => total + (Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1),
    0
  );

  const sellerId =
    authProfile?.seller_id ||
    authUser?.seller_id ||
    localStorage.getItem("seller_id");
  const customerPhone =
    authProfile?.customer_phone ||
    authUser?.phoneNumber ||
    authUser?.phone ||
    localStorage.getItem("customer_phone");

  useEffect(() => {
    fetchStore();
    fetchNotifications();
  }, [fetchStore, fetchNotifications]);

  useEffect(() => {
    if (customerPhone && sellerId) fetchAddresses(customerPhone, sellerId);
  }, [customerPhone, sellerId, fetchAddresses]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setNotificationOpen(false);
        setLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    const handleReady = () => {
      if (window.__deferredInstallPrompt) {
        setCanInstall(true);
      }
    };

    const handleInstalled = () => {
      setCanInstall(false);
    };

    window.addEventListener("pwa-install-ready", handleReady);
    window.addEventListener("pwa-app-installed", handleInstalled);

    return () => {
      window.removeEventListener("pwa-install-ready", handleReady);
      window.removeEventListener("pwa-app-installed", handleInstalled);
    };
  }, []);

  const handleDownloadApp = () => {
    if (!window.__deferredInstallPrompt) return;
    setShowInstallConfirm(true);
  };

  const confirmInstall = async () => {
    const prompt = window.__deferredInstallPrompt;
    if (!prompt) {
      setShowInstallConfirm(false);
      return;
    }

    setInstalling(true);
    prompt.prompt();

    try {
      await prompt.userChoice;
    } catch (err) {
      console.warn("Install prompt error:", err);
    } finally {
      window.__deferredInstallPrompt = null;
      setCanInstall(false);
      setInstalling(false);
      setShowInstallConfirm(false);
    }
  };

  const getNotificationIcon = (type) => {
    if (type === "reward") return Gift;
    return ShoppingBag;
  };

  const storeName =
    store?.store_profile?.store_name ||
    store?.business_info?.business_name ||
    store?.business_name ||
    store?.name ||
    "Restaurant";

  const storeLogo = bizBiteIcon;

  const rawAddress = store?.contact_info?.address || store?.address?.line1 || "";
  const rawCity = store?.contact_info?.city || store?.address?.city || "";

  const storeAddress = rawAddress || rawCity
    ? `${rawAddress}${rawAddress && rawCity ? ", " : ""}${rawCity}`
    : "Tap to view restaurant";

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setSelectedLocation({ title: "Location unavailable" });
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        // Always show a meaningful location immediately, even if reverse geocoding is slow or unavailable.
        const currentLocation = {
          type: "current",
          title: "Current location",
          subtitle: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          latitude,
          longitude,
        };
        setSelectedLocation(currentLocation);
        persistDeliveryLocation(currentLocation);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          );
          if (!res.ok) throw new Error("Unable to reverse geocode location");

          const data = await res.json();
          const address = data.address || {};
          const locationName =
            address.suburb ||
            address.neighbourhood ||
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            "Current location";

          const resolvedLocation = {
            type: "current",
            title: locationName,
            subtitle: data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            latitude,
            longitude,
          };
          setSelectedLocation(resolvedLocation);
          persistDeliveryLocation(resolvedLocation);
        } catch (err) {
          console.warn("Unable to look up the current location:", err);
        } finally {
          setLocationLoading(false);
          setLocationOpen(false);
        }
      },
      () => {
        setLocationLoading(false);
        setSelectedLocation({ title: "Location unavailable" });
        alert("Location permission denied.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, []);

  const selectSavedAddress = (address) => {
    const addressText =
      address.delivery_address ||
      address.address ||
      [address.mohalla, address.city].filter(Boolean).join(", ") ||
      "Saved address";

    const savedLocation = {
      type: "saved",
      addressId: address._id || address.id,
      title: address.title || address.type || "Saved address",
      subtitle: addressText,
    };
    setSelectedLocation(savedLocation);
    persistDeliveryLocation(savedLocation);
    setLocationOpen(false);
  };

  useEffect(() => {
    if (!isDesktop) return undefined;

    const locationTimer = window.setTimeout(detectLocation, 0);
    return () => window.clearTimeout(locationTimer);
  }, [detectLocation, isDesktop]);

  return (
    <header
      className="
        relative
        z-50
        transition-all
        duration-300
        ease-in-out
        lg:pr-10
        lg:px-2
      "
      style={
        isDesktop
          ? {
            width: sidebarExpanded
              ? "calc(100% + 2rem)"
              : "calc(100% - 0rem)",
          }
          : {
            marginLeft: 0,
            marginRight: 0,
            width: "100%",
          }
      }
    >
      <div
        ref={wrapperRef}
        className="
          relative
          flex
          h-20
          lg:w-full
          items-center
          justify-between
          rounded-[10px]
          px-5
          transition-all
          duration-300
          ease-in-out
        "
      >
        {/* Store */}
        <button
          onClick={() => navigate("/customer/restaurant")}
          className="
            flex
            ml-0
            lg:ml-5
            min-w-0
            flex-1
            items-center
            gap-3
            text-left
            cursor-pointer
          "
        >
          {/* Logo */}
          {storeLogo ? (
            <img
              src={storeLogo}
              alt={storeName}
              className="
                h-11
                w-11
                lg:h-13
                lg:w-13
                rounded-xl
                object-cover
              "
            />
          ) : (
            <div className="h-11 w-11 lg:h-13 lg:w-13 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg shadow-sm">
              {storeName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Store Info */}
          <div className="min-w-0 flex-1">
            <h2
              className="
                truncate
                text-[15px]
                lg:text-[20px]
                font-bold
                text-slate-900 dark:text-white
              "
            >
              {storeName}
            </h2>

            <p
              className="
                truncate
                text-xs
                text-slate-500 dark:text-slate-400
              "
            >
              {storeAddress}
            </p>
          </div>
        </button>

        {/* Actions */}
        <div
          className="
            ml-3
            flex
            items-center
            gap-3
          "
        >
          {/* Location Dropdown */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                bg-slate-100 dark:bg-[#232627]
                px-4
                py-2
                shadow-sm
                transition-all
                hover:shadow-md
                cursor-pointer
              "
              style={{
                borderColor: "color-mix(in srgb, var(--primary-color) 30%, var(--secondary-color))",
              }}
            >
              <div
                className="rounded-lg p-2"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--secondary-color) 15%, transparent)",
                }}
              >
                <MapPin size={18} style={{ color: "var(--primary-color)" }} />
              </div>

              <div className="text-left">
                <p className="text-[10px] " style={{ color: "var(--primary-color)" }}>Deliver to</p>

                <p className="max-w-[140px] truncate text-sm font-semibold" style={{ color: "var(--primary-color)" }}>
                  {locationLoading ? "Getting location..." : selectedLocation.title}
                </p>
              </div>

              <ChevronDown size={18} className="" style={{ color: "var(--primary-color)" }} />
            </button>

            <AnimatePresence>
              {locationOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -15,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -15,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    absolute
                    right-0
                    top-[64px]
                    z-[999]
                    w-[360px]
                    overflow-hidden
                    rounded-3xl
                    border
                    bg-slate-100 dark:bg-[#232627]
                    shadow-2xl
                  "
                  style={{
                    borderColor: "var(--secondary-color)",
                  }}
                >
                  <div
                    className="border-b p-5"
                    style={{ borderColor: "color-mix(in srgb, var(--secondary-color) 70%, white)" }}
                  >
                    <h3 className="text-lg font-bold" style={{ color: "var(--primary-color)" }}>
                      Delivery Location
                    </h3>

                    <p className="mt-1 text-sm" style={{ color: "var(--primary-color)" }}>
                      Choose where you'd like your order delivered.
                    </p>
                  </div>

                  <button
                    onClick={detectLocation}
                    disabled={locationLoading}
                    className="
                      flex
                      w-full
                      items-center
                      gap-4
                      p-4
                      text-left
                      transition
                      cursor-pointer
                    "
                    style={{ color: "var(--primary-color)" }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--secondary-color) 45%, white)";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div
                      className="rounded-xl p-3"
                      style={{ backgroundColor: "var(--secondary-color)" }}
                    >
                      <Navigation size={20} style={{ color: "var(--primary-color)" }} />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold" style={{ color: "var(--primary-color)" }}>
                        {locationLoading ? "Getting location..." : "Use Current Location"}
                      </p>

                      <p className="text-sm" style={{ color: "var(--primary-color)" }}>
                        Detect your current location
                      </p>
                    </div>
                  </button>

                  {addresses.length > 0 && (
                    <div
                      className="border-t p-3"
                      style={{ borderColor: "color-mix(in srgb, var(--secondary-color) 70%, white)" }}
                    >
                      <p className="px-2 pb-2 text-xs font-semibold" style={{ color: "var(--primary-color)" }}>
                        Saved locations
                      </p>
                      <div className="max-h-44 space-y-1 overflow-y-auto">
                        {addresses.map((address) => {
                          const addressId = address._id || address.id;
                          const addressText =
                            address.delivery_address ||
                            address.address ||
                            [address.mohalla, address.city].filter(Boolean).join(", ") ||
                            "Saved address";

                          return (
                            <button
                              key={addressId}
                              type="button"
                              onClick={() => selectSavedAddress(address)}
                              className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition"
                              onMouseEnter={(event) => {
                                event.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--secondary-color) 45%, white)";
                              }}
                              onMouseLeave={(event) => {
                                event.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <MapPin
                                size={18}
                                className="mt-0.5 shrink-0"
                                style={{ color: "var(--primary-color)" }}
                              />
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold" style={{ color: "var(--primary-color)" }}>
                                  {address.title || address.type || "Saved address"}
                                </span>
                                <span className="block truncate text-xs" style={{ color: "var(--primary-color)" }}>
                                  {addressText}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate("/customer/profile/addresses")}
                    className="w-full border-t px-5 py-3 text-left text-sm font-semibold transition"
                    style={{
                      borderColor: "color-mix(in srgb, var(--secondary-color) 70%, white)",
                      color: "var(--primary-color)",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.backgroundColor = "var(--secondary-color)";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Manage saved addresses
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Download App Button */}
          {/* Download App Button */}
          {canInstall && !isDesktop && (
            <button
              onClick={handleDownloadApp}
              disabled={installing}
              className="
      hidden
      lg:flex
      items-center
      gap-1.5
      rounded-lg
      px-3
      py-1.5
      text-xs
      font-semibold
      text-white
      shadow-sm
      transition-all
      hover:shadow-md
      active:scale-95
      disabled:opacity-70
      cursor-pointer
    "
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <Download size={14} />
              {installing ? "Installing..." : "Download App"}
            </button>
          )}

          {canInstall && !isDesktop && (
            <button
              onClick={handleDownloadApp}
              disabled={installing}
              className="
      relative
      flex
      h-9
      w-9
      lg:hidden
      items-center
      justify-center
      rounded-[10px]
      border
      border-slate-200
      bg-slate-200
      text-slate-700
      transition-all
      duration-200
      active:scale-95
      disabled:opacity-70
      cursor-pointer
    "
            >
              <Download size={18} strokeWidth={2.2} />
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={() => navigate("/customer/cart")}
            className="
              relative
              flex
              h-9
              w-9
              lg:hidden
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-slate-200
              text-slate-700
              transition-all
              duration-200
              active:scale-95
              cursor-pointer
            "
          >
            <ShoppingCart size={18} strokeWidth={2.2} />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -right-3
                  -top-3
                  flex
                  h-6
                  min-w-6
                  items-center
                  justify-center
                  rounded-full
                  border
                  px-1.5
                  text-[11px]
                  font-extrabold
                  leading-none
                "
                style={{
                  backgroundColor: "var(--secondary-color)",
                  borderColor: "color-mix(in srgb, var(--secondary-color) 32%, transparent)",
                  color: "var(--primary-color)",
                }}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Notification Button */}
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-[10px]
              transition
              bg-slate-200 dark:bg-[#232627]
              cursor-pointer
            "
          >
            <Bell
              size={18}
              style={{
                color: "var(--primary-color)",
              }}
            />

            {notifications.length > 0 && (
              <span
                className="
                  absolute
                  right-2
                  top-2
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  rounded-full
                  text-[10px]
                  text-white
                "
                style={{
                  background: "var(--primary-color)",
                }}
              >
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Notification Panel */}
        {notificationOpen && (
          <div
            className="
              absolute
              right-0
              top-[72px]
              w-[320px]
              max-w-[calc(100vw-24px)]
              overflow-hidden
              rounded-3xl
              border
              border-slate-200 dark:border-[#A9BDCF]/40
              bg-white dark:bg-[#181A1B]
              shadow-2xl
              z-50
            "
          >
            <div className="border-b border-slate-100 dark:border-[#A9BDCF]/20 p-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Notifications
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Latest updates from the restaurant.
              </p>
            </div>

            <div
              className="
                max-h-[420px]
                overflow-y-auto
              "
            >
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell
                    size={34}
                    className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
                  />

                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    No notifications
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    You're all caught up.
                  </p>
                </div>
              ) : (
                notifications.map((item) => {
                  const Icon = getNotificationIcon(item.type);

                  const timeDisplay = item.time || (item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now");

                  return (
                    <button
                      key={item._id || item.id}
                      className="
                        flex
                        w-full
                        gap-4
                        border-b
                        border-slate-100 dark:border-[#A9BDCF]/20
                        p-4
                        text-left
                        transition
                        hover:bg-slate-50 dark:hover:bg-white/5
                      "
                    >
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-2xl
                          bg-slate-100 dark:bg-[#232627]
                        "
                      >
                        <Icon
                          size={20}
                          style={{
                            color: "var(--primary-color)",
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {item.message}
                        </p>

                        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                          {timeDisplay}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showInstallConfirm && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
            >
              <button
                onClick={() => setShowInstallConfirm(false)}
                className="absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
                {storeLogo ? (
                  <img
                    src={storeLogo}
                    alt={storeName}
                    className="h-full w-full rounded-xl object-contain"
                  />
                ) : (
                  <Smartphone size={28} style={{ color: "var(--primary-color)" }} />
                )}
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Install {storeName}?
              </h2>

              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                Add {storeName} to your home screen for faster access and a better experience.
              </p>

              <button
                onClick={confirmInstall}
                disabled={installing}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                {installing ? "Installing..." : "Download Now"}
              </button>

              <button
                onClick={() => setShowInstallConfirm(false)}
                className="mt-3 w-full py-2 text-sm font-semibold text-slate-400 transition hover:text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default CustomerHeader;
