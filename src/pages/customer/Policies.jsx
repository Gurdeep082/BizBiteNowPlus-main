import { useEffect, useState } from "react";
import { Building2, ShieldCheck, FileText, RotateCcw, Info } from "lucide-react";
import API from "../../api/axios";

const TABS = [
    { key: "about", label: "About Us", icon: Building2 },
    { key: "privacy", label: "Privacy Policy", icon: ShieldCheck },
    { key: "terms", label: "Terms & Conditions", icon: FileText },
    { key: "refund", label: "Refund & Cancellation", icon: RotateCcw },
];

const PoliciesPage = () => {
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("about");

    useEffect(() => {
        let isMounted = true;

        const fetchStore = async () => {
            try {
                const sellerId = import.meta.env.VITE_DEFAULT_SELLER_ID;
                const res = await API.get(`/customer/store/${sellerId}`);
                if (isMounted) setStore(res.data?.data || null);
            } catch (err) {
                console.error("Failed to load store info:", err);
                if (isMounted) setError("We could not load the business details. Please try again.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchStore();
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div
                    className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 dark:border-white/10"
                    style={{ borderTopColor: "var(--primary-color)" }}
                />
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                    {error || "Business details are not available right now."}
                </p>
                <p className="text-sm text-slate-400">Please refresh the page and try again.</p>
            </div>
        );
    }

    const profile = store.store_profile || {};
    const business = store.business_info || {};
    const contact = store.contact_info || {};
    const storeName = profile.store_name || store.business_name || "This business";
    const initials = storeName.charAt(0).toUpperCase();
    const supportEmail = contact.business_email;
    const supportPhone = contact.primary_phone;
    const locationLine = [contact.city, contact.state].filter(Boolean).join(", ");
    const businessType = (business.business_type || "food service business").toLowerCase();

    const aboutParagraphs = [
        `${storeName} is a ${businessType}${locationLine ? ` based in ${locationLine}` : ""}, committed to providing customers with quality food and a reliable ordering experience. We take pride in preparing every order with care and in maintaining consistent standards of hygiene, freshness, and service.`,
        `Our platform allows customers to browse our menu, place orders online, and make secure payments through trusted payment partners. We continuously work to improve our offerings based on customer feedback and to ensure that every interaction with our business is smooth and transparent.`,
        `We value the trust our customers place in us and are committed to protecting their personal information, honouring our stated policies, and delivering a dependable service on every order. For any queries or assistance, our support team can be reached using the contact details provided on this page.`,
    ];

    const policies = {
        privacy: [
            {
                heading: "Information We Collect",
                body: `When you place an order with ${storeName}, we collect basic information such as your name, phone number, delivery address, and payment details necessary to process and deliver your order. This information is collected solely for the purpose of fulfilling your order and providing customer support.`,
            },
            {
                heading: "How We Use Your Information",
                body: `The information collected is used to process orders, send order status updates, manage loyalty or rewards programs, and respond to customer support requests. We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
            },
            {
                heading: "Payment Security",
                body: `All online payments are processed through secure, PCI-compliant third-party payment gateways. We do not store your card, UPI, or banking credentials on our servers. Any information shared with the payment gateway is handled in accordance with their own security and privacy standards.`,
            },
            {
                heading: "Data Retention and Your Rights",
                body: `We retain customer information only for as long as necessary to provide our services and comply with legal obligations. You may request access to, correction of, or deletion of your personal data at any time by contacting us${supportEmail ? ` at ${supportEmail}` : ""}${supportPhone ? ` or ${supportPhone}` : ""}.`,
            },
        ],
        terms: [
            {
                heading: "Placing an Order",
                body: `By placing an order with ${storeName}, you confirm that the details provided, including delivery address and contact number, are accurate and complete. We are not responsible for delays or delivery failures resulting from incorrect information supplied by the customer.`,
            },
            {
                heading: "Pricing and Availability",
                body: `All prices listed are inclusive of applicable taxes unless otherwise stated and are subject to change without prior notice. In the event an ordered item becomes unavailable, we will inform the customer and offer a suitable alternative or process a refund for the affected item.`,
            },
            {
                heading: "Payments",
                body: `We accept payments through UPI, debit/credit cards, digital wallets, and cash on delivery where available. Orders paid online are confirmed only upon successful payment. Cash on delivery orders are confirmed at the time of order placement.`,
            },
            {
                heading: "Acceptable Use",
                body: `We reserve the right to restrict or suspend any account found to be engaging in fraudulent activity, repeated order cancellations, or abusive conduct towards our staff or delivery personnel.`,
            },
        ],
        refund: [
            {
                heading: "Order Cancellation",
                body: `Orders may be cancelled free of charge within a short window after placement, provided preparation has not yet begun. Once the kitchen has started preparing the order, cancellation may no longer be possible.`,
            },
            {
                heading: "Refund Eligibility",
                body: `Customers are eligible for a refund in cases including, but not limited to, incorrect items delivered, quality issues, or non-delivery of an order. Refund requests must be raised within 24 hours of the delivery time for the order to be reviewed.`,
            },
            {
                heading: "Refund Process",
                body: `Approved refunds are processed to the original payment method within 5–7 business days. For cash on delivery orders, approved refunds will be issued via UPI or bank transfer, based on details provided by the customer.`,
            },
            {
                heading: "Non-Refundable Situations",
                body: `Refunds will not be issued where an order could not be delivered due to an incorrect address provided by the customer, or where the customer was unavailable to receive the order at the specified delivery location.`,
            },
        ],
    };

    return (
        <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
            {/* Business header */}
            {/* <div
                className="relative overflow-hidden rounded-[28px] px-6 py-8 sm:py-10"
                style={{
                    background: `linear-gradient(160deg, color-mix(in srgb, var(--primary-color) 92%, black) 0%, var(--primary-color) 55%, color-mix(in srgb, var(--primary-color) 82%, white) 100%)`,
                }}
            >
                <div
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20"
                    style={{ background: "var(--accent-color)" }}
                />

                <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
                    {profile.logo ? (
                        <img
                            src={profile.logo}
                            alt={storeName}
                            className="mb-3 h-16 w-16 shrink-0 rounded-2xl border-2 border-white/70 object-cover shadow-lg sm:mb-0 sm:h-20 sm:w-20"
                        />
                    ) : (
                        <div className="mb-3 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-white/70 bg-white/20 text-2xl font-black text-white shadow-lg sm:mb-0 sm:h-20 sm:w-20">
                            {initials}
                        </div>
                    )}

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                            About &amp; Policies
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                            {storeName}
                        </h1>
                        {business.business_type && (
                            <p className="mt-1 text-sm text-white/80">
                                {business.business_type}
                                {locationLine ? ` · ${locationLine}` : ""}
                            </p>
                        )}
                    </div>
                </div>
            </div> */}

            {/* Tabs */}
            <div
                className="mt-6 flex gap-2 overflow-x-auto pb-1 sm:mt-8 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {TABS.map(({ key, label, icon: Icon }) => {
                    const isActive = activeTab === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition"
                            style={{
                                borderColor: isActive ? "var(--primary-color)" : "transparent",
                                background: isActive
                                    ? "color-mix(in srgb, var(--primary-color) 10%, transparent)"
                                    : "transparent",
                                color: isActive ? "var(--primary-color)" : "var(--secondary-color)",
                            }}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <div className="mt-4 flex flex-col gap-3">
                {activeTab === "about" ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#181A1B] sm:p-6">
                        <h3 className="mb-3 text-base font-bold text-slate-900 dark:text-white">
                            About {storeName}
                        </h3>
                        <div className="flex flex-col gap-3">
                            {aboutParagraphs.map((para, idx) => (
                                <p
                                    key={idx}
                                    className="text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                                >
                                    {para}
                                </p>
                            ))}
                        </div>
                    </div>
                ) : (
                    policies[activeTab].map(({ heading, body }) => (
                        <div
                            key={heading}
                            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#181A1B] sm:p-5"
                        >
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{heading}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                {body}
                            </p>
                        </div>
                    ))
                )}

                <div className="flex items-start gap-2 rounded-2xl mb-10 border border-dashed border-slate-200 p-4 text-xs text-slate-400 dark:border-white/10">
                    <Info size={15} className="mt-0.5 shrink-0" />
                    <span>
                        For any questions, please contact us at{" "}
                        {supportEmail && <a href={`mailto:${supportEmail}`} className="underline">{supportEmail}</a>}
                        {supportEmail && supportPhone && " or "}
                        {supportPhone && <a href={`tel:${supportPhone}`} className="underline">{supportPhone}</a>}
                        .
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PoliciesPage;