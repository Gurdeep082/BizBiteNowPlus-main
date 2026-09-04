import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Search, Plus, Minus, IndianRupee, ShoppingCart, CheckCircle2, AlertCircle, X } from "lucide-react";

import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";

import { generateOrderBillPDF } from "../../../util/generateBill";
import { getStore } from "../../../api/customerApi";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function CounterBilling({ onOrderSuccess }) {
    const [products, setProducts] = useState([]);
    const [storeProfile, setStoreProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [discountCode, setDiscountCode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);

    useEffect(() => {
        fetchProducts();
        getStore()
            .then((res) => {
                if (res?.data?.success && res.data.data) {
                    setStoreProfile(res.data.data);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/products/dashboard/all?is_available=true`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            const data = await res.json();
            if (data.success) {
                setProducts(data.products || data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const categories = useMemo(() => {
        const cats = new Set(
            products
                .map((p) => (typeof p.category === "object" && p.category !== null ? p.category.name : p.category))
                .filter(Boolean)
        );
        return ["All", ...Array.from(cats)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const productCategory = typeof p.category === "object" && p.category !== null ? p.category.name : p.category;
            const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === "All" || productCategory === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, search, selectedCategory]);

    const getAddonsForVariant = (product, variant) => {
        if (!product || !product.addons) return [];
        return product.addons.filter((addon) => {
            const applicable = addon.applicable_variants || [];
            if (applicable.length === 0) return true;
            if (!variant) return false;
            return applicable.some(
                (ref) => String(ref) === String(variant._id) || String(ref) === String(variant.name)
            );
        });
    };

    const handleProductClick = (product) => {
        if ((product.variants && product.variants.length > 0) || (product.addons && product.addons.length > 0)) {
            const initialVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
            setCurrentProduct(product);
            setSelectedVariant(initialVariant);
            setSelectedAddons([]);
            setModalOpen(true);
        } else {
            addToCart(product, null, []);
        }
    };

    const handleSelectVariant = (variant) => {
        setSelectedVariant(variant);
        const stillVisible = getAddonsForVariant(currentProduct, variant);
        setSelectedAddons(prev => prev.filter(a => stillVisible.some(v => v._id === a._id)));
    };

    const toggleAddon = (addon) => {
        setSelectedAddons(prev => {
            const exists = prev.find(a => a._id === addon._id);
            if (exists) {
                return prev.filter(a => a._id !== addon._id);
            }
            return [...prev, addon];
        });
    };

    const visibleAddons = useMemo(() => {
        return getAddonsForVariant(currentProduct, selectedVariant);
    }, [currentProduct, selectedVariant]);

    const addToCart = (product, variant, addons) => {
        const cartItemId = `${product._id}-${variant ? variant._id : 'base'}-${addons.map(a => a._id).sort().join('-')}`;

        setCart(prev => {
            const existing = prev.find(item => item.cartItemId === cartItemId);
            if (existing) {
                return prev.map(item =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                cartItemId,
                product_id: product._id,
                name: product.name,
                base_price: product.price,
                tax_percent: product.tax_percent || 0,
                quantity: 1,
                variant: variant ? { name: variant.name, price_delta: variant.price_delta } : null,
                addons: addons.map(a => ({ name: a.name, price: a.price }))
            }];
        });

        setModalOpen(false);
        setCurrentProduct(null);
        setSelectedVariant(null);
        setSelectedAddons([]);
    };

    const updateQuantity = (cartItemId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.cartItemId === cartItemId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const calculateItemTotal = (item) => {
        const base = item.variant ? item.variant.price_delta : item.base_price;
        const addonsTotal = item.addons.reduce((sum, a) => sum + a.price, 0);
        return (base + addonsTotal) * item.quantity;
    };

    const calculateItemTax = (item) => {
        const total = calculateItemTotal(item);
        return (total * (item.tax_percent || 0)) / 100;
    };

    const cartSubTotal = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const cartTaxTotal = cart.reduce((sum, item) => sum + calculateItemTax(item), 0);
    const cartGrandTotal = cartSubTotal + cartTaxTotal;

    const handleGenerateBill = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        setMessage(null);

        try {
            const token = localStorage.getItem("token");
            const payload = {
                customer_name: customerName,
                customer_phone: customerPhone,
                items: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    variant: item.variant,
                    addons: item.addons
                })),
                payment_method: paymentMethod,
                discount_code: discountCode,
                tax_amount: cartTaxTotal
            };

            const res = await fetch(`${API_BASE}/orders/counter-billing`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setMessage({ type: "success", text: "Bill generated successfully" });

                if (data.order) {
                    const enrichedOrder = {
                        ...data.order,
                        items: data.order.items.map((orderItem, idx) => {
                            const matchedCartItem = cart[idx] || cart.find(c => c.product_id === orderItem.product_id?.toString() || c.product_id === orderItem.product_id);
                            return {
                                ...orderItem,
                                name: matchedCartItem?.name || orderItem.name || "Item",
                                tax_percent: matchedCartItem?.tax_percent || 0,
                                base_price: matchedCartItem?.base_price ?? orderItem.base_price,
                                variant: matchedCartItem?.variant ?? orderItem.variant,
                                addons: matchedCartItem?.addons ?? orderItem.addons,
                            };
                        })
                    };
                    generateOrderBillPDF(enrichedOrder, storeProfile).catch(err => console.error(err));
                }

                setCart([]);
                setCustomerName("");
                setCustomerPhone("");
                setDiscountCode("");
                if (onOrderSuccess) onOrderSuccess();
            } else {
                setMessage({ type: "error", text: data.message || "Failed to generate bill" });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Server error occurred" });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(null), 4000);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 relative">
            <Card padding="p-4" className="flex-1 min-h-[600px] flex flex-col shadow-sm">
                <div className="mb-3">
                    <Input
                        type="text"
                        placeholder="Search products to add"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        leftIcon={<Search size={18} />}
                        className="!py-2.5 !text-sm"
                    />
                </div>

                {!loading && categories.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${selectedCategory === cat
                                        ? "bg-[#1A4D2E] text-white border-[#1A4D2E]"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader2 className="animate-spin text-[#1A4D2E]" size={32} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto pr-2 pb-4">
                        {filteredProducts.map(product => (
                            <div
                                key={product._id}
                                onClick={() => handleProductClick(product)}
                                className="border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-[#1A4D2E] hover:bg-slate-50 transition-all flex flex-col justify-between relative"
                            >
                                {((product.variants && product.variants.length > 0) || (product.addons && product.addons.length > 0)) && (
                                    <span className="absolute top-2 right-2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded z-10">Customizable</span>
                                )}
                                <div className="mb-2">
                                    <div className="w-full h-24 bg-slate-100 rounded-md mb-2 overflow-hidden">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <Typography variant="p" weight="medium" className="text-sm line-clamp-2">{product.name}</Typography>
                                </div>
                                <Typography variant="small" weight="bold" color="text-[#1A4D2E]" className="text-sm flex items-center mt-auto">
                                    <IndianRupee size={12} className="mr-0.5" />{product.price}
                                </Typography>
                            </div>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-10 text-slate-400">
                                <Typography variant="small">No products found</Typography>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            <Card padding="p-0" className="w-full lg:w-[400px] flex flex-col h-[600px] shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl flex items-center gap-2">
                    <ShoppingCart size={18} className="text-[#1A4D2E]" />
                    <Typography variant="h6" className="text-base">Current Bill</Typography>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <ShoppingCart size={48} className="mb-3 opacity-20" />
                            <Typography variant="small">Cart is empty</Typography>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.cartItemId} className="flex justify-between items-start border-b border-slate-50 pb-3">
                                    <div className="flex-1 pr-2">
                                        <Typography variant="p" weight="medium" className="text-sm line-clamp-1">{item.name}</Typography>
                                        {(item.variant || item.addons.length > 0) && (
                                            <div className="text-[11px] text-slate-500 mt-0.5">
                                                {item.variant && <span>{item.variant.name}</span>}
                                                {item.addons.length > 0 && <span> {item.variant ? '+' : ''} {item.addons.map(a => a.name).join(", ")}</span>}
                                            </div>
                                        )}
                                        <Typography variant="small" className="text-xs flex items-center mt-1">
                                            <IndianRupee size={10} />{(item.variant ? item.variant.price_delta : item.base_price) + item.addons.reduce((s, a) => s + a.price, 0)} each
                                        </Typography>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2 bg-slate-100 rounded-md p-1 mt-1">
                                            <button onClick={() => updateQuantity(item.cartItemId, -1)} className="p-1 bg-white rounded shadow-sm text-slate-600 hover:text-rose-600"><Minus size={14} /></button>
                                            <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.cartItemId, 1)} className="p-1 bg-white rounded shadow-sm text-slate-600 hover:text-[#1A4D2E]"><Plus size={14} /></button>
                                        </div>
                                        <Typography variant="small" weight="semibold" color="text-slate-800" className="text-sm">
                                            ₹{calculateItemTotal(item)}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl space-y-3">
                    <Input
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="!text-sm !p-2"
                    />
                    <div className="flex gap-2">
                        <Input
                            type="tel"
                            placeholder="Phone Number"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="!text-sm !p-2"
                        />
                        <Input
                            type="text"
                            placeholder="Discount Code"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            className="!text-sm !p-2 uppercase"
                        />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <Typography variant="small" className="text-sm">Payment Mode</Typography>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-sm border border-slate-200 rounded-md p-1 outline-none focus:border-[#1A4D2E] focus:ring-1 focus:ring-[#1A4D2E] bg-white"
                        >
                            <option value="CASH">Cash</option>
                            <option value="ONLINE">Online</option>
                        </select>
                    </div>

                    <div className="border-t border-slate-200 mt-3 pt-2 space-y-1">
                        <div className="flex justify-between items-center">
                            <Typography variant="small" className="text-sm">Subtotal</Typography>
                            <Typography variant="small" weight="semibold" className="text-slate-800">
                                ₹{cartSubTotal.toFixed(2)}
                            </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="small" className="text-sm">GST (Tax)</Typography>
                            <Typography variant="small" weight="semibold" className="text-slate-800">
                                ₹{cartTaxTotal.toFixed(2)}
                            </Typography>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-100 mt-1">
                            <Typography variant="small" weight="semibold" className="text-slate-800">Grand Total</Typography>
                            <Typography variant="h5" color="text-[#1A4D2E]">
                                ₹{cartGrandTotal.toFixed(2)}
                            </Typography>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-2 rounded text-xs flex items-center gap-1.5 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                            {message.text}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        onClick={handleGenerateBill}
                        disabled={cart.length === 0 || isSubmitting}
                        className="w-full !h-10 mt-1"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Generate Bill"}
                    </Button>
                </div>
            </Card>

            {modalOpen && currentProduct && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100">
                            <Typography variant="h6" className="text-lg line-clamp-1">{currentProduct.name}</Typography>
                            <Button
                                variant="outline"
                                onClick={() => setModalOpen(false)}
                                className="!w-8 !h-8 !p-0 !border-transparent !bg-slate-100 hover:!bg-slate-200"
                            >
                                <X size={18} />
                            </Button>
                        </div>

                        <div className="p-4 overflow-y-auto flex-1">
                            {currentProduct.variants && currentProduct.variants.length > 0 && (
                                <div className="mb-6">
                                    <Typography variant="small" weight="semibold" className="text-sm mb-3">Select Variation</Typography>
                                    <div className="space-y-2">
                                        {currentProduct.variants.map(variant => (
                                            <div
                                                key={variant._id}
                                                onClick={() => handleSelectVariant(variant)}
                                                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${selectedVariant?._id === variant._id ? 'border-[#1A4D2E] bg-[#1A4D2E]/5' : 'border-slate-200 hover:border-slate-300'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedVariant?._id === variant._id ? 'border-[#1A4D2E]' : 'border-slate-300'}`}>
                                                        {selectedVariant?._id === variant._id && <div className="w-2 h-2 bg-[#1A4D2E] rounded-full" />}
                                                    </div>
                                                    <Typography variant="small" weight="medium" className="text-sm">{variant.name}</Typography>
                                                </div>
                                                <Typography variant="small" weight="semibold" className="text-sm text-slate-900">₹{variant.price_delta}</Typography>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {visibleAddons.length > 0 && (
                                <div>
                                    <Typography variant="small" weight="semibold" className="text-sm mb-3">
                                        Add-ons
                                        {selectedVariant && (
                                            <span className="ml-1.5 text-[11px] font-medium text-slate-400">
                                                for {selectedVariant.name}
                                            </span>
                                        )}
                                    </Typography>
                                    <div className="space-y-2">
                                        {visibleAddons.map(addon => {
                                            const isSelected = selectedAddons.some(a => a._id === addon._id);
                                            return (
                                                <div
                                                    key={addon._id}
                                                    onClick={() => toggleAddon(addon)}
                                                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-[#1A4D2E] bg-[#1A4D2E]/5' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'border-[#1A4D2E] bg-[#1A4D2E]' : 'border-slate-300 bg-white'}`}>
                                                            {isSelected && <CheckCircle2 size={12} className="text-white" />}
                                                        </div>
                                                        <Typography variant="small" weight="medium" className="text-sm">{addon.name}</Typography>
                                                    </div>
                                                    <Typography variant="small" weight="semibold" className="text-sm text-slate-900">+₹{addon.price}</Typography>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-between items-center">
                            <div>
                                <Typography variant="small" className="text-xs mb-0.5">Total Item Price</Typography>
                                <Typography variant="h5" color="text-[#1A4D2E]">
                                    ₹{(selectedVariant ? selectedVariant.price_delta : currentProduct.price) + selectedAddons.reduce((sum, a) => sum + a.price, 0)}
                                </Typography>
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => addToCart(currentProduct, selectedVariant, selectedAddons)}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}