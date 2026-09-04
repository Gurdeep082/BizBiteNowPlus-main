import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Menu, X, ShoppingBag, MapPin, Phone, Star, ChevronDown, ArrowRight, Tag, Copy, TicketPercent } from "lucide-react";
import API from "../../api/axios";
import aboutUsDefaultImage from "../../assets/about-us-default.png";

const STORE_ID = import.meta.env.VITE_DEFAULT_SELLER_ID;

export default function LandingPage() {
    const [storeInfo, setStoreInfo] = useState(null);
    const [landingPage, setLandingPage] = useState(null);
    const [products, setProducts] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [festiveDeals, setFestiveDeals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.documentElement.classList.add("scroll-smooth");

        const load = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [
                    storeRes,
                    landingRes,
                    productsRes,
                    discountsRes,
                    festiveDealsRes,
                    categoriesRes,
                ] = await Promise.allSettled([
                    API.get(`/customer/store/${STORE_ID}`),
                    API.get(`/landing-page/public/${STORE_ID}`),
                    API.get(`/products/${STORE_ID}/products`),
                    API.get(`/discounts/`, { params: { is_active: true } }), // Added is_active params here
                    API.get(`/festive-deals/storefront/${STORE_ID}`),
                    API.get(`/categories/get`),
                ]);

                const store = storeRes.status === "fulfilled" ? storeRes.value.data?.data || null : null;
                const lp = landingRes.status === "fulfilled" ? landingRes.value.data?.landingPage || null : null;

                if (store?.store_profile?.theme_colors) {
                    const { primary, secondary, accent } = store.store_profile.theme_colors;
                    const root = document.documentElement;
                    if (primary) root.style.setProperty("--primary-color", primary);
                    if (secondary) root.style.setProperty("--secondary-color", secondary);
                    if (accent) root.style.setProperty("--accent-color", accent);
                }

                setStoreInfo(store);
                setLandingPage(lp);
                setProducts(productsRes.status === "fulfilled" ? productsRes.value.data?.products || productsRes.value.data?.data || [] : []);
                setDiscounts(discountsRes.status === "fulfilled" ? discountsRes.value.data?.discounts || discountsRes.value.data?.data || [] : []);
                setFestiveDeals(festiveDealsRes.status === "fulfilled" ? festiveDealsRes.value.data?.deals || festiveDealsRes.value.data?.data || [] : []);
                setCategories(categoriesRes.status === "fulfilled" ? categoriesRes.value.data?.categories || categoriesRes.value.data?.data || [] : []);

            } catch (err) {
                setError(err.response?.data?.message || "Failed to load store");
            } finally {
                setIsLoading(false);
            }
        };

        load();

        return () => {
            document.documentElement.classList.remove("scroll-smooth");
        };
    }, []);

    if (isLoading) return <div className="flex min-h-screen items-center justify-center font-medium text-slate-400">Loading experience...</div>;
    if (error) return <div className="flex min-h-screen items-center justify-center font-medium text-red-500">{error}</div>;
    if (!storeInfo) return null;

    const sortedSections = (landingPage?.sections || [])
        .filter((s) => s.is_active)
        .sort((a, b) => a.order - b.order);

    // Fallback: show a default About Us section until the backend has one configured for this store.
    const activeSections = sortedSections.some((s) => s.section_key === "about_us")
        ? sortedSections
        : (() => {
            const aboutIndex = sortedSections.findIndex((s) => s.section_key === "about");
            const categoriesIndex = sortedSections.findIndex((s) => s.section_key === "categories");
            const insertAt = aboutIndex !== -1 ? aboutIndex : categoriesIndex !== -1 ? categoriesIndex + 1 : sortedSections.length;
            const withFallback = [...sortedSections];
            withFallback.splice(insertAt, 0, { section_key: "about_us", is_active: true, data: {} });
            return withFallback;
        })();

    return (
        <div className="font-sans text-slate-800 selection:bg-[var(--accent-color)] selection:text-slate-900 bg-[#FCFCFD] min-h-screen pb-20 md:pb-0 font-light">
            <Navbar storeInfo={storeInfo} />
            <main className="pt-28 flex w-full flex-col gap-16 md:gap-32 overflow-x-hidden">
                {activeSections.map((section) => (
                    <SectionRenderer
                        key={section.section_key}
                        section={section}
                        storeInfo={storeInfo}
                        products={products}
                        discounts={discounts}
                        festiveDeals={festiveDeals}
                        categories={categories}
                    />
                ))}
            </main>
        </div>
    );
}

function Navbar({ storeInfo }) {
    const [isOpen, setIsOpen] = useState(false);
    const profile = storeInfo?.store_profile || {};
    const storeName = profile.store_name || storeInfo?.business_name || "Store";

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between transition-all">
                <div className="flex items-center gap-3">
                    {profile.logo ? (
                        <img src={profile.logo} alt={storeName} className="h-9 w-9 rounded-xl object-cover shadow-sm border border-slate-100" />
                    ) : (
                        <div className="h-9 w-9 rounded-xl bg-[var(--primary-color)] flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                            {storeName.charAt(0)}
                        </div>
                    )}
                    <span className="font-semibold text-lg tracking-tight text-slate-900">{storeName}</span>
                </div>

                <div className="hidden md:flex items-center gap-10 font-medium text-sm text-slate-500">
                    <a href="#menu" className="hover:text-[var(--primary-color)] transition-colors">Menu</a>
                    <a href="#offers" className="hover:text-[var(--primary-color)] transition-colors">Offers</a>
                    <a href="#about-us" className="hover:text-[var(--primary-color)] transition-colors">About Us</a>
                    <button
                        className="bg-[var(--primary-color)] text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                        onClick={() => window.location.href = '/customer'}
                    >
                        <ShoppingBag size={16} /> Order Now
                    </button>
                </div>

                <button onClick={() => setIsOpen(true)} className="md:hidden p-2 text-slate-600 bg-slate-50 rounded-full">
                    <Menu size={20} strokeWidth={2} />
                </button>
            </nav>

            <div className={`fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />
            <div className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-400 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex items-center justify-between border-b border-slate-50">
                    <span className="font-semibold text-xl">Menu</span>
                    <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>
                <div className="p-6 flex flex-col gap-2 text-base font-medium text-slate-700">
                    <a href="#menu" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">Browse Menu <ArrowRight size={18} className="text-slate-300" /></a>
                    <a href="#offers" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">Special Offers <ArrowRight size={18} className="text-slate-300" /></a>
                    <a href="#about-us" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">About Store <ArrowRight size={18} className="text-slate-300" /></a>
                </div>
                <div className="mt-auto p-6 border-t border-slate-50">
                    <button
                        className="w-full bg-[var(--primary-color)] text-white py-4 rounded-2xl font-medium flex justify-center items-center gap-2 text-base shadow-lg shadow-[var(--primary-color)]/20"
                        onClick={() => window.location.href = '/customer'}
                    >
                        <ShoppingBag size={20} strokeWidth={2} /> Start Order
                    </button>
                </div>
            </div>
        </>
    );
}

function SectionRenderer({ section, storeInfo, products, discounts, festiveDeals, categories }) {
    const { section_key, data = {} } = section;

    switch (section_key) {
        case "hero": return <HeroSection data={data} />;
        case "top_selling": return <TopSellingSection data={data} products={products} />;
        case "offers": return <OffersSection data={data} discounts={discounts} />;
        case "festive_deals": return <FestiveDealsSection data={data} festiveDeals={festiveDeals} />;
        case "categories": return <CategoriesSection data={data} categories={categories} />;
        case "about_us": return <AboutUsSection data={data} storeInfo={storeInfo} />;
        case "about": return <AboutSection data={data} storeInfo={storeInfo} />;
        case "testimonials": return <TestimonialsSection data={data} />;
        case "gallery": return <GallerySection data={data} />;
        case "store_info": return <StoreInfoSection storeInfo={storeInfo} />;
        case "stats": return <StatsSection data={data} />;
        case "faq": return <FAQSection data={data} />;
        case "newsletter": return <NewsletterSection data={data} />;
        case "footer": return <FooterSection data={data} storeInfo={storeInfo} />;
        default: return null;
    }
}

/* ---------- 1. Hero ---------- */
function HeroSection({ data }) {
    const { banners = [], heading, subheading } = data;
    const banner = banners[0];

    return (
        <section className="px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1 flex flex-col items-start text-left pt-8 md:pt-0">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-medium text-xs mb-6 tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-pulse"></span>
                    Welcome to our store
                </div>
                <h1 className="text-4xl md:text-[3.5rem] font-semibold tracking-tight leading-[1.15] text-slate-900 mb-6">
                    {heading || "Delicious Food, Delivered."}
                </h1>
                <p className="text-lg text-slate-500 font-normal mb-10 max-w-md leading-relaxed">
                    {subheading || "Experience the best taste in town, freshly prepared and delivered straight to your door."}
                </p>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={() => window.location.href = '/customer'}
                        className="flex-1 md:flex-none bg-[var(--primary-color)] text-white px-8 py-3.5 rounded-full font-medium text-base hover:shadow-lg hover:shadow-[var(--primary-color)]/30 transition-all"
                    >
                        Order Now
                    </button>
                    <a href="#menu" className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-full font-medium text-base hover:bg-slate-50 text-center transition-colors">
                        View Menu
                    </a>
                </div>
            </div>
            {banner?.image && (
                <div className="flex-1 w-full relative group">
                    <div className="absolute inset-0 bg-[var(--primary-color)] rounded-[2rem] rotate-3 scale-105 opacity-10 blur-xl group-hover:rotate-6 transition-transform duration-700"></div>
                    <img src={banner.image} alt="Hero" className="relative w-full h-[350px] md:h-[500px] object-cover rounded-[2rem] border border-white shadow-md" />
                </div>
            )}
        </section>
    );
}

/* ---------- 2. Top Selling ---------- */
function TopSellingSection({ data, products = [] }) {
    const list = data.products?.length > 0 ? data.products : (data.mode === "manual" && data.product_ids?.length ? products.filter((p) => data.product_ids.includes(p._id)) : products.slice(0, 4));

    if (!list.length) return null;

    return (
        <section id="menu" className="px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="flex items-end justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">{data.title || "Top Selling"}</h2>
                <button onClick={() => window.location.href = '/customer'} className="hidden md:flex items-center gap-1 font-medium text-slate-500 hover:text-[var(--primary-color)] transition-colors text-sm">
                    View full menu <ArrowRight size={16} strokeWidth={1.5} />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {list.map((p) => (
                    <div key={p._id} onClick={() => window.location.href = '/customer'} className="group flex flex-col cursor-pointer bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden mb-4 bg-slate-50">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                            {p.offer_price && (
                                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                    Special Offer
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col flex-1 px-2 pb-1">
                            <h3 className="font-medium text-lg leading-snug mb-1 text-slate-900 group-hover:text-[var(--primary-color)] transition-colors line-clamp-1">{p.name}</h3>
                            <p className="text-sm text-slate-500 font-normal mb-4 line-clamp-1">{p.category || "Delicious item"}</p>
                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-lg text-slate-900">₹{p.offer_price || p.price}</span>
                                    {p.offer_price && <span className="text-xs text-slate-400 line-through">₹{p.price}</span>}
                                </div>
                                <div className="bg-slate-50 text-slate-600 group-hover:text-white group-hover:bg-[var(--primary-color)] transition-all duration-300 p-2.5 rounded-full">
                                    <ShoppingBag size={18} strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ---------- 3. Offers & Deals (Ticket UI) ---------- */
function OffersSection({ data, discounts = [] }) {
    const sourceDiscounts = data.discounts?.length > 0 ? data.discounts : discounts;

    const activeDiscounts = sourceDiscounts.filter(d => d.is_active === true);

    const dbOffers = activeDiscounts.map(d => ({
        title: `${d.discount_type === 'percentage' ? d.discount_value + '%' : '₹' + d.discount_value} OFF`,
        description: d.description,
        code: d.code,
    }));

    const offers = dbOffers.length > 0 ? dbOffers : (data.items || []);

    if (!offers.length) return null;

    return (
        <section id="offers" className="px-6 md:px-12 max-w-7xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8 text-slate-900">{data.title || "Latest Offers"}</h2>
            <div className="flex overflow-x-auto pb-6 -mx-6 px-6 md:mx-0 md:px-0 gap-6 snap-x hide-scrollbar">
                {offers.map((offer, i) => (
                    <div key={i} className="min-w-[280px] md:min-w-[340px] snap-center bg-white border border-slate-100 rounded-[2rem] p-6 relative flex flex-col justify-between shadow-sm hover:border-[var(--primary-color)] transition-colors group">

                        {/* Ticket Cutouts Design */}
                        <div className="absolute -left-3 top-[60%] -translate-y-1/2 w-6 h-6 bg-[#FCFCFD] rounded-full border-r border-slate-100 group-hover:border-[var(--primary-color)] transition-colors"></div>
                        <div className="absolute -right-3 top-[60%] -translate-y-1/2 w-6 h-6 bg-[#FCFCFD] rounded-full border-l border-slate-100 group-hover:border-[var(--primary-color)] transition-colors"></div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-[1rem] bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center shrink-0">
                                <TicketPercent size={24} strokeWidth={1.5} />
                            </div>
                            <div className="pt-1 flex-1">
                                <h3 className="text-xl font-semibold text-slate-900 leading-snug mb-1">{offer.title || "Special Offer"}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2" title={offer.description}>
                                    {offer.description || "Apply at checkout to avail this exclusive offer."}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-slate-200 pt-5 flex items-center justify-between px-2">
                            <span className="font-mono font-semibold text-[var(--primary-color)] tracking-wider">
                                {offer.code || offer.discount_tag}
                            </span>
                            <button
                                className="flex items-center gap-1.5 text-xs font-medium bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-[var(--primary-color)] hover:text-white transition-colors cursor-pointer"
                                onClick={() => navigator.clipboard.writeText(offer.code || offer.discount_tag)}
                            >
                                <Copy size={14} /> Copy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ---------- 4. Festive Deals ---------- */
function FestiveDealsSection({ data, festiveDeals = [] }) {
    const sourceDeals = data.active_deals?.length > 0 ? data.active_deals : festiveDeals;
    const activeDeals = sourceDeals.filter(deal => {
        if (deal.is_active === false) return false;
        const now = Date.now();
        const start = deal.start_date ? new Date(deal.start_date).getTime() : null;
        const end = deal.end_date ? new Date(deal.end_date).getTime() : null;
        return (!start || now >= start) && (!end || now <= end);
    });

    if (!activeDeals.length) return null;
    const deal = activeDeals[0];

    return (
        <section className="px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="w-full bg-slate-900 rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary-color)] rounded-full blur-[90px] opacity-20 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

                <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
                    <div className="inline-block bg-white/10 text-white font-medium px-5 py-2 rounded-full text-xs tracking-wider mb-5 border border-white/10 backdrop-blur-sm">
                        ✨ Festive Special
                    </div>
                    <h2 className="text-3xl md:text-5xl font-semibold mb-4 leading-tight">{data.title || deal.title}</h2>
                    <p className="text-base font-light opacity-80 max-w-md">Celebrate the season with exclusive discounts on your favorites.</p>
                </div>
                <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[1.5rem] text-center w-full md:w-auto min-w-[200px]">
                    <p className="text-xs font-medium text-slate-300 mb-3 uppercase tracking-wider">Use Promo Code</p>
                    <p className="text-2xl font-semibold text-white tracking-widest bg-white/10 px-6 py-3 rounded-xl border border-white/20 font-mono shadow-inner">{deal.coupon_code || "FESTIVE"}</p>
                </div>
            </div>
        </section>
    );
}

/* ---------- 5. Categories ---------- */
function CategoriesSection({ data, categories = [] }) {
    const cats = data.category_list?.length > 0 ? data.category_list : (categories.length > 0 ? categories : (data.categories || []));

    const activeCats = cats.filter(c => c.is_active !== false);

    if (!activeCats.length) return null;

    return (
        <section className="px-6 md:px-12 max-w-7xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8 text-slate-900">
                {data.title || "Explore Menu"}
            </h2>

            <div className="flex overflow-x-auto pb-6 -mx-6 px-6 md:mx-0 md:px-0 gap-4 md:gap-6 hide-scrollbar snap-x">
                {activeCats.map((cat, i) => (
                    <a
                        key={i}
                        href={`/menu?category=${cat.key || cat._id || ''}`}
                        className="snap-center flex flex-col items-center gap-4 group cursor-pointer min-w-[100px] md:min-w-[120px]"
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-center p-2 group-hover:border-[var(--primary-color)] group-hover:shadow-md transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1">
                            {cat.image ? (
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500 ease-out"
                                />
                            ) : (
                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center group-hover:from-[var(--primary-color)] group-hover:to-[var(--accent-color)] transition-colors duration-500">
                                    <span className="text-3xl font-semibold text-slate-400 group-hover:text-white transition-colors duration-500">
                                        {cat.name?.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <span className="font-medium text-sm md:text-base text-slate-600 group-hover:text-[var(--primary-color)] transition-colors text-center leading-tight">
                            {cat.name}
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
}

const DEFAULT_ABOUT_US_FEATURES = [
    { title: "Fresh Ingredients", text: "Sourced daily and prepared fresh for every single order, never frozen." },
    { title: "Made With Care", text: "Every recipe is crafted with attention to detail and a passion for great taste." },
    { title: "Fast Delivery", text: "Hot food delivered to your door quickly, so you enjoy it at its best." },
];

const DEFAULT_ABOUT_US_STATS = [
    { value: "9+", label: "Years of Service" },
    { value: "100+", label: "Dishes on Menu" },
    { value: "10k+", label: "Happy Customers" },
    { value: "4.8★", label: "Average Rating" },
];

function AnimatedStatValue({ value }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [display, setDisplay] = useState(null);

    const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
    const target = match ? parseFloat(match[1]) : null;
    const suffix = match ? match[2] : "";
    const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;

    useEffect(() => {
        if (!isInView || target === null) return;
        const controls = animate(0, target, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (v) => setDisplay(v.toFixed(decimals)),
        });
        return () => controls.stop();
    }, [isInView, target, decimals]);

    if (target === null) return <span ref={ref}>{value}</span>;

    return <span ref={ref}>{display ?? "0"}{suffix}</span>;
}

/* ---------- 5.5 About Us ---------- */
function AboutUsSection({ data, storeInfo }) {
    const { eyebrow, title } = data;

    const profile = storeInfo?.store_profile || {};
    const business = storeInfo?.business_info || {};
    const contact = storeInfo?.contact_info || {};
    const tax = storeInfo?.tax_settings || {};
    const image = data.image || profile.banner || aboutUsDefaultImage;
    const storeName = profile.store_name || storeInfo?.business_name || "We";
    const businessType = (business.business_type || "food service business").toLowerCase();
    const locationLine = [contact.city, contact.state].filter(Boolean).join(", ");

    const NOT_AVAILABLE = "Not available";
    const address = [contact.address, contact.city, contact.state].filter(Boolean).join(", ");
    const businessDetails = [
        { label: "Address", value: address || NOT_AVAILABLE },
        contact.website
            ? { label: "Website", value: contact.website, href: contact.website.startsWith("http") ? contact.website : `https://${contact.website}` }
            : { label: "Website", value: NOT_AVAILABLE },
        contact.business_email
            ? { label: "Email", value: contact.business_email, href: `mailto:${contact.business_email}` }
            : { label: "Email", value: NOT_AVAILABLE },
        { label: "FSSAI Lic. No.", value: business.fssai_license || NOT_AVAILABLE },
        { label: "GSTIN", value: tax.gst_number || NOT_AVAILABLE },
    ];

    const descriptionParagraphs = data.description
        ? [data.description]
        : profile.description
            ? [profile.description]
            : [
                `${storeName} is a ${businessType}${locationLine ? ` based in ${locationLine}` : ""}, committed to providing customers with quality food and a reliable ordering experience. We take pride in preparing every order with care and in maintaining consistent standards of hygiene, freshness, and service.`,
                `Our platform allows customers to browse our menu, place orders online, and make secure payments through trusted payment partners. We continuously work to improve our offerings based on customer feedback and to ensure that every interaction with our business is smooth and transparent.`,
                `We value the trust our customers place in us and are committed to protecting their personal information, honouring our stated policies, and delivering a dependable service on every order. For any queries or assistance, our support team can be reached using the contact details provided on this page.`,
            ];
    const features = data.features?.length > 0 ? data.features : DEFAULT_ABOUT_US_FEATURES;
    const stats = data.stats?.length > 0 ? data.stats : DEFAULT_ABOUT_US_STATS;

    return (
        <section id="about-us" className="px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div>
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="flex-1 flex flex-col items-start text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-medium text-xs mb-5 tracking-wide uppercase">
                            {eyebrow || "About Us"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-slate-900 mb-5">
                            {title || "Serving great food with heart"}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {descriptionParagraphs.map((para, i) => (
                                <p key={i} className="text-base md:text-lg text-slate-500 font-normal leading-relaxed">
                                    {para}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <img
                            src={image}
                            alt={title || "About us"}
                            className="w-full h-[280px] md:h-[360px] object-cover rounded-[1.5rem] border border-slate-100 shadow-sm"
                        />
                    </div>
                </div>

                {features.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12 md:mt-16 pt-12 md:pt-16 border-t border-slate-100 text-center md:text-left">
                        {features.map((f, i) => (
                            <div key={i} className="flex flex-col items-center md:items-start gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center font-semibold text-xl">
                                    {i + 1}
                                </div>
                                <h4 className="font-semibold text-base text-slate-900">{f.title}</h4>
                                <p className="text-sm font-normal text-slate-500 leading-relaxed">{f.text}</p>
                            </div>
                        ))}
                    </div>
                )}

                {stats.length > 0 && (
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 mt-10 border-t border-slate-100 ${features.length > 0 ? "" : "mt-12 md:mt-16 pt-12 md:pt-16"}`}>
                        {stats.map((s, i) => (
                            <div key={i} className="flex flex-col items-center text-center px-2">
                                <span className="text-2xl md:text-3xl font-semibold text-[var(--primary-color)] mb-1">
                                    <AnimatedStatValue value={s.value} />
                                </span>
                                <span className="font-medium text-slate-500 text-xs md:text-sm uppercase tracking-wide">{s.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {businessDetails.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-10 pt-10 border-t border-slate-100 text-sm">
                        {businessDetails.map((d, i) => (
                            <div key={i}>
                                <p className="text-slate-400 font-medium mb-1">{d.label}</p>
                                {d.href
                                    ? <a href={d.href} target={d.label === "Website" ? "_blank" : undefined} rel="noreferrer" className="text-slate-700 hover:text-[var(--primary-color)] break-words">{d.value}</a>
                                    : <p className={`break-words ${d.value === NOT_AVAILABLE ? "text-slate-400 italic" : "text-slate-700"}`}>{d.value}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ---------- 6. Why Choose Us ---------- */
function AboutSection({ data, storeInfo }) {
    const text = data.description || storeInfo?.store_profile?.description;
    return (
        <section id="about" className="px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-[2rem] p-10 md:p-16 border border-slate-100 text-center max-w-4xl mx-auto shadow-sm">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-slate-900">{data.title || "Our Story"}</h2>
                {text && <p className="text-base md:text-lg text-slate-500 font-light leading-relaxed mb-12 max-w-2xl mx-auto">{text}</p>}

                {data.features?.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
                        {data.features.map((f, i) => (
                            <div key={i} className="flex flex-col items-center md:items-start gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center font-semibold text-xl">
                                    {i + 1}
                                </div>
                                <h4 className="font-semibold text-base text-slate-900">{f.title}</h4>
                                <p className="text-sm font-normal text-slate-500 leading-relaxed">{f.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ---------- 7. Testimonials ---------- */
function TestimonialsSection({ data }) {
    const reviews = data.reviews || [];
    if (!reviews.length) return null;

    return (
        <section className="px-6 md:px-12 max-w-7xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-10 text-center text-slate-900">{data.title || "Loved by Customers"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {reviews.map((r, i) => (
                    <div key={i} className="bg-white p-8 rounded-[1.5rem] border border-slate-100 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-1 text-yellow-400">
                            {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill={idx < (r.rating || 5) ? "currentColor" : "none"} strokeWidth={1.5} className={idx >= (r.rating || 5) ? "text-slate-200" : ""} />)}
                        </div>
                        <p className="text-base font-normal text-slate-600 leading-relaxed flex-1">"{r.comment}"</p>
                        <div className="flex items-center gap-4 mt-auto border-t border-slate-50 pt-5">
                            {r.photo ? <img src={r.photo} alt={r.name} className="w-10 h-10 rounded-full object-cover bg-slate-50" /> : <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold">{r.name?.charAt(0)}</div>}
                            <span className="font-medium text-sm text-slate-900">{r.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ---------- 8. Gallery ---------- */
function GallerySection({ data }) {
    if (!data.images?.length) return null;
    return (
        <section className="px-6 md:px-12 max-w-7xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-10 text-slate-900">{data.title || "Gallery"}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {data.images.map((img, i) => (
                    <div key={i} className={`rounded-[1.5rem] overflow-hidden bg-slate-50 ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ---------- 9. Store Info ---------- */
function StoreInfoSection({ storeInfo }) {
    const { contact_info = {}, business_hours = {} } = storeInfo;

    return (
        <section className="px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-14 flex flex-col md:flex-row gap-12 md:gap-20 shadow-sm">
                <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-10 text-slate-900">Visit Us</h2>
                    <div className="flex flex-col gap-8">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-color)]/10 flex items-center justify-center shrink-0 text-[var(--primary-color)]">
                                <MapPin size={22} strokeWidth={1.5} />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-medium text-base mb-1 text-slate-900">Address</h4>
                                <p className="text-slate-500 font-normal text-sm leading-relaxed">{contact_info.address}, {contact_info.city}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-color)]/10 flex items-center justify-center shrink-0 text-[var(--primary-color)]">
                                <Phone size={22} strokeWidth={1.5} />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-medium text-base mb-1 text-slate-900">Contact</h4>
                                <p className="text-slate-500 font-normal text-sm">{contact_info.primary_phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-100">
                    <h3 className="text-xl font-semibold mb-6 text-slate-900">Opening Hours</h3>
                    <div className="flex flex-col gap-4 text-sm">
                        {Object.entries(business_hours).map(([day, hrs]) => (
                            <div key={day} className="flex justify-between items-center border-b border-slate-200/60 pb-3 last:border-0 last:pb-0">
                                <span className="font-normal capitalize text-slate-600">{day}</span>
                                <span className={`font-medium ${hrs.is_closed ? 'text-red-400' : 'text-slate-900'}`}>
                                    {hrs.is_closed ? "Closed" : `${hrs.open} - ${hrs.close}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------- 10. Stats ---------- */
function StatsSection({ data }) {
    if (!data.items?.length) return null;
    return (
        <section className="px-6 md:px-12 max-w-7xl mx-auto w-full py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {data.items.map((s, i) => (
                    <div key={i} className="flex flex-col items-center text-center px-4">
                        <span className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2">{s.value}</span>
                        <span className="font-medium text-slate-500 text-xs md:text-sm uppercase tracking-wide">{s.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ---------- 11. FAQ ---------- */
function FAQSection({ data }) {
    const [openIndex, setOpenIndex] = useState(null);
    if (!data.faqs?.length) return null;

    return (
        <section className="px-6 md:px-12 max-w-3xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-10 text-center text-slate-900">{data.title || "Got Questions?"}</h2>
            <div className="flex flex-col gap-4">
                {data.faqs.map((f, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all hover:border-[var(--primary-color)]/20 shadow-sm">
                        <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                            <span className="font-medium text-base text-slate-800">{f.question}</span>
                            <div className={`shrink-0 ml-4 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-[var(--primary-color)]' : 'text-slate-400'}`}>
                                <ChevronDown size={20} strokeWidth={1.5} />
                            </div>
                        </button>
                        <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <p className="text-slate-500 font-normal leading-relaxed text-sm">{f.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ---------- 12. Newsletter ---------- */
function NewsletterSection({ data }) {
    return (
        <section className="px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="bg-slate-50 rounded-[2.5rem] p-10 md:p-16 text-center border border-slate-100 flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-slate-900">{data.title || "Join the Club"}</h2>
                <p className="text-base text-slate-500 font-normal mb-10 max-w-lg">{data.subtitle || "Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals."}</p>
                <form className="w-full max-w-md flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-full border border-slate-200 shadow-sm focus-within:border-[var(--primary-color)] transition-colors">
                    <input type="email" placeholder="Enter your email address" required className="flex-1 bg-transparent px-5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none font-normal text-sm" />
                    <button type="submit" className="bg-slate-900 text-white font-medium px-6 py-2.5 rounded-full hover:bg-slate-800 transition-colors text-sm">
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
}

/* ---------- 13. Footer ---------- */
function FooterSection({ data, storeInfo }) {
    return (
        <footer className="w-full bg-white border-t border-slate-100 pt-16 pb-8 mt-12 md:mt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-8">
                <span className="font-semibold text-2xl tracking-tight text-slate-900">{storeInfo.business_name}</span>
                <p className="max-w-md text-slate-500 font-normal text-sm">{data.about_text || "Delivering happiness and great taste, every single day."}</p>
                <div className="flex flex-wrap justify-center gap-8 font-medium text-slate-500 text-sm">
                    {data.links?.map((l, i) => <a key={i} href={l.url} className="hover:text-[var(--primary-color)] transition-colors">{l.label}</a>)}
                </div>
                <div className="w-full max-w-2xl h-px bg-slate-100 my-4"></div>
                <p className="text-slate-400 font-normal text-xs">{data.copyright_text || `© ${new Date().getFullYear()} ${storeInfo.business_name}. All rights reserved.`}</p>
            </div>
        </footer>
    );
}