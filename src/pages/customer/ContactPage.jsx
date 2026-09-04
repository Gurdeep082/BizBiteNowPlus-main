import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Globe, MessageCircle, ArrowUpRight } from "lucide-react";
import API from "../../api/axios";
// import API from "../../../services/api";

const ContactPage = () => {
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchStore = async () => {
            try {
                const sellerId = import.meta.env.VITE_DEFAULT_SELLER_ID;

                const res = await API.get(`/customer/store/${sellerId}`);
                const data = res.data?.data;

                if (isMounted) {
                    setStore(data);
                }
            } catch (err) {
                console.error("Failed to load store contact info:", err);
                if (isMounted) {
                    setError("Contact details load nahi ho paayi. Dobara try karein.");
                }
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
            <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4">
                <div
                    className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100"
                    style={{ borderTopColor: "var(--primary-color)" }}
                />
                <p className="animate-pulse text-sm font-medium text-slate-400">Loading details...</p>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="flex h-full min-h-[60vh] items-center justify-center px-6 text-center">
                <div className="rounded-3xl bg-slate-50 px-8 py-10 dark:bg-[#181A1B]">
                    <p className="text-slate-500 dark:text-slate-400">
                        {error || "Store details available nahi hain."}
                    </p>
                </div>
            </div>
        );
    }

    const profile = store.store_profile || {};
    const contact = store.contact_info || {};

    const contactItems = [
        {
            icon: Phone,
            label: "Primary Phone",
            value: contact.primary_phone,
            href: contact.primary_phone ? `tel:${contact.primary_phone}` : null,
        },
        {
            icon: Phone,
            label: "Alternate Phone",
            value: contact.alternate_phone,
            href: contact.alternate_phone ? `tel:${contact.alternate_phone}` : null,
        },
        {
            icon: Mail,
            label: "Email Address",
            value: contact.business_email,
            href: contact.business_email ? `mailto:${contact.business_email}` : null,
        },
        {
            icon: MessageCircle,
            label: "WhatsApp Business",
            value: contact.whatsapp_business,
            href: contact.whatsapp_business
                ? `https://wa.me/${contact.whatsapp_business.replace(/\D/g, "")}`
                : null,
        },
        {
            icon: Globe,
            label: "Website",
            value: contact.website,
            href: contact.website || null,
        },
    ].filter((item) => item.value);

    const addressLine = [contact.address, contact.city, contact.state]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="mx-auto w-full max-w-3xl px-4 pt-10 sm:px-6">
            {/* Hero Header Section */}
            <div className="relative mb-16 mt-4 rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200/50 pt-20 pb-12 text-center dark:from-[#1e2022] dark:to-[#181A1B]">
                {/* Overlapping Profile Logo */}
                <div className="absolute -top-12 left-1/2 flex -translate-x-1/2 items-center justify-center">
                    <div className="rounded-full bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:bg-[#121212]">
                        {profile.logo ? (
                            <img
                                src={profile.logo}
                                alt={profile.store_name}
                                className="h-24 w-24 rounded-full object-cover"
                            />
                        ) : (
                            <div
                                className="flex h-24 w-24 items-center justify-center rounded-full text-4xl font-black text-white"
                                style={{ background: "var(--primary-color)" }}
                            >
                                {(profile.store_name || store.business_name || "S").charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {profile.store_name || store.business_name}
                    </h1>
                    {profile.tagline && (
                        <p className="mt-2 text-base font-medium text-slate-500 dark:text-slate-400">
                            {profile.tagline}
                        </p>
                    )}
                </div>
            </div>

            {/* Contact Details Bento Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {contactItems.map(({ icon: Icon, label, value, href }) => {
                    const content = (
                        <div
                            className="
                                group
                                relative
                                flex
                                h-full
                                items-center
                                gap-5
                                rounded-[1.5rem]
                                border
                                border-slate-100
                                bg-white
                                p-5
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                                hover:border-slate-200
                                dark:border-[#2A2D30]
                                dark:bg-[#181A1B]
                                dark:hover:border-[#3A3D40]
                            "
                        >
                            <div
                                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                                style={{
                                    background: "color-mix(in srgb, var(--primary-color) 10%, transparent)",
                                    color: "var(--primary-color)",
                                }}
                            >
                                <Icon size={24} strokeWidth={2} />
                            </div>

                            <div className="flex w-full flex-col overflow-hidden">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    {label}
                                </span>
                                <span className="mt-0.5 truncate text-base font-bold text-slate-800 dark:text-white">
                                    {value}
                                </span>
                            </div>

                            {/* Subtle indicator for links */}
                            {href && (
                                <div className="absolute right-5 top-5 text-slate-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-slate-600">
                                    <ArrowUpRight size={18} />
                                </div>
                            )}
                        </div>
                    );

                    return href ? (
                        <a
                            key={label}
                            href={href}
                            target={label === "Website" ? "_blank" : undefined}
                            rel={label === "Website" ? "noopener noreferrer" : undefined}
                            className="block rounded-[1.5rem] outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                        >
                            {content}
                        </a>
                    ) : (
                        <div key={label}>{content}</div>
                    );
                })}

                {/* Address Card (Spans full width on larger screens) */}
                {addressLine && (
                    <div
                        className="
                            group
                            relative
                            flex
                            items-start
                            gap-5
                            rounded-[1.5rem]
                            border
                            border-slate-100
                            bg-white
                            p-6
                            transition-all
                            duration-300
                            hover:border-slate-200
                            hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                            sm:col-span-2
                            dark:border-[#2A2D30]
                            dark:bg-[#181A1B]
                        "
                    >
                        <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                            style={{
                                background: "color-mix(in srgb, var(--primary-color) 10%, transparent)",
                                color: "var(--primary-color)",
                            }}
                        >
                            <MapPin size={24} strokeWidth={2} />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Store Location
                            </span>
                            <span className="mt-1 text-base font-bold leading-relaxed text-slate-800 dark:text-white">
                                {addressLine}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Empty State Fallback */}
            {contactItems.length === 0 && !addressLine && (
                <div className="mt-8 rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 py-12 text-center dark:border-slate-800 dark:bg-[#181A1B]/50">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Contact details abhi update nahi hui hain.
                    </p>
                </div>
            )}

            {/* Spacer Div for Bottom Navigation Clearance */}
            <div className="h-32 w-full shrink-0 md:h-10"></div>
        </div>
    );
};

export default ContactPage;