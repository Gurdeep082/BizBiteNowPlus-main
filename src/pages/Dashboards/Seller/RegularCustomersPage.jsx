import { useEffect, useMemo, useState } from "react";
import {
    Search, ArrowDownAZ, ArrowUpAZ, Crown, Medal, Award, Users, ShoppingBag, IndianRupee, Loader2
} from "lucide-react";
import API from "../../../api/axios";

// UI Components
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";
import Badge from "../../../components/UI/Badge";
import EmptyState from "../../../components/UI/EmptyState";

const getTier = (orders) => {
    if (orders >= 20) return "Gold";
    if (orders >= 10) return "Silver";
    return "Bronze";
};

const formatLastOrder = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} Days Ago`;
};

const TIER_BADGE = {
    Gold: { icon: Crown, variant: "warning" },
    Silver: { icon: Medal, variant: "secondary" },
    Bronze: { icon: Award, variant: "danger" },
};

export default function RegularCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("orders");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await API.get("/orders/customers");
                if (response.data?.success && response.data?.customers) {
                    setCustomers(response.data.customers);
                }
            } catch (error) {
                console.error("Failed to fetch customers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = useMemo(() => {
        const enriched = customers.map((c) => {
            const orderCount = c.orders || c.orders_count || 0;
            const estimatedSpent = c.totalSpent || (orderCount * 500);

            return {
                ...c,
                name: c.name || "Customer",
                phone: c.phone || "N/A",
                spent: estimatedSpent,
                orders: orderCount,
                status: getTier(orderCount),
                lastOrder: formatLastOrder(c.lastOrderAt),
            };
        });

        const filtered = enriched.filter((customer) =>
            `${customer.name} ${customer.status} ${customer.phone}`.toLowerCase().includes(search.toLowerCase())
        );

        return [...filtered].sort((a, b) => {
            const direction = sortOrder === "asc" ? 1 : -1;
            if (sortBy === "spent") return (a.spent - b.spent) * direction;
            return (a.orders - b.orders) * direction;
        });
    }, [customers, search, sortBy, sortOrder]);

    const stats = useMemo(() => {
        const totalCustomers = filteredCustomers.length;
        const totalSpent = filteredCustomers.reduce((sum, c) => sum + c.spent, 0);
        const totalOrders = filteredCustomers.reduce((sum, c) => sum + c.orders, 0);
        const averageSpent = totalCustomers > 0 ? Math.round(totalSpent / totalCustomers) : 0;
        return { totalCustomers, totalSpent, totalOrders, averageSpent };
    }, [filteredCustomers]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 size={32} className="animate-spin text-[#1A4D2E]" />
                <Typography variant="small" weight="medium" color="text-slate-400">Loading customers...</Typography>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <Typography variant="h3" className="text-xl sm:text-2xl">Regular Customers</Typography>
                    <Typography variant="small" className="mt-1 text-sm text-slate-500">Your most valuable repeat customers.</Typography>
                </div>
                <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
                    <div className="flex-1 lg:w-64">
                        <Input
                            type="text"
                            placeholder="Search name/phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftIcon={<Search size={16} />}
                            className="!py-2"
                        />
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-[42px] rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10 cursor-pointer transition-all"
                    >
                        <option value="orders">Sort by Orders</option>
                        <option value="spent">Sort by Spending</option>
                    </select>
                    <Button
                        variant="outline"
                        onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                        className="!h-[42px] !px-4 !text-sm !font-semibold !bg-white hover:!border-[#1A4D2E] hover:!text-[#1A4D2E]"
                    >
                        {sortOrder === "desc" ? (
                            <>
                                <ArrowDownAZ size={15} />
                                Desc
                            </>
                        ) : (
                            <>
                                <ArrowUpAZ size={15} />
                                Asc
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
                    <div className="flex items-center justify-between">
                        <Typography variant="small" weight="medium" className="text-xs">Customers</Typography>
                        <Users size={15} className="text-violet-600" />
                    </div>
                    <Typography variant="h3" className="mt-2 text-xl">{stats.totalCustomers}</Typography>
                </Card>
                <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
                    <div className="flex items-center justify-between">
                        <Typography variant="small" weight="medium" className="text-xs">Orders</Typography>
                        <ShoppingBag size={15} className="text-sky-600" />
                    </div>
                    <Typography variant="h3" className="mt-2 text-xl">{stats.totalOrders}</Typography>
                </Card>
                <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
                    <div className="flex items-center justify-between">
                        <Typography variant="small" weight="medium" className="text-xs">Est. Lifetime Spend</Typography>
                        <IndianRupee size={15} className="text-[#1A4D2E]" />
                    </div>
                    <Typography variant="h3" className="mt-2 text-xl">₹{stats.totalSpent.toLocaleString("en-IN")}</Typography>
                </Card>
                <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
                    <div className="flex items-center justify-between">
                        <Typography variant="small" weight="medium" className="text-xs">Est. Avg Spend</Typography>
                        <Award size={15} className="text-[#F4A300]" />
                    </div>
                    <Typography variant="h3" className="mt-2 text-xl">₹{stats.averageSpent.toLocaleString("en-IN")}</Typography>
                </Card>
            </div>

            {filteredCustomers.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No customers found"
                    description="No customers match your current search or sort options."
                    className="!mt-8 !py-16 !border-dashed"
                />
            ) : (
                <>
                    <div className="mt-6 hidden xl:block border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Customer</th>
                                    <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Tier</th>
                                    <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Orders</th>
                                    <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Est. Spend</th>
                                    <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Last Order</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {filteredCustomers.map((customer) => {
                                    const badge = TIER_BADGE[customer.status];
                                    const BadgeIcon = badge.icon;
                                    return (
                                        <tr key={customer.phone} className="border-b border-slate-50 transition hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-[#1A4D2E]">
                                                        {customer.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <Typography variant="h6" className="text-sm">{customer.name}</Typography>
                                                        <Typography variant="small" className="text-xs">{customer.phone}</Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Badge variant={badge.variant} size="sm" className="!px-2.5 !py-1 !text-[11px]">
                                                    <BadgeIcon size={12} className="mr-1.5" />
                                                    {customer.status}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-4 text-sm font-semibold text-slate-700">{customer.orders}</td>
                                            <td className="px-5 py-4 text-sm font-bold text-[#1A4D2E]">
                                                ₹{customer.spent.toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-500">{customer.lastOrder}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 space-y-3 xl:hidden">
                        {filteredCustomers.map((customer) => {
                            const badge = TIER_BADGE[customer.status];
                            const BadgeIcon = badge.icon;
                            return (
                                <Card key={customer.phone} padding="p-4" className="shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-[#1A4D2E]">
                                                {customer.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <Typography variant="h6" className="text-sm">{customer.name}</Typography>
                                                <Typography variant="small" className="text-xs">{customer.phone}</Typography>
                                            </div>
                                        </div>
                                        <Badge variant={badge.variant} size="sm" className="!px-2.5 !py-1 !text-[11px]">
                                            <BadgeIcon size={12} className="mr-1.5" />
                                            {customer.status}
                                        </Badge>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                                            <Typography variant="small" className="text-[10px]">Orders</Typography>
                                            <Typography variant="h4" className="mt-1 text-lg">{customer.orders}</Typography>
                                        </div>
                                        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                                            <Typography variant="small" className="text-[10px]">Est. Spend</Typography>
                                            <Typography variant="h4" color="text-[#1A4D2E]" className="mt-1 text-lg">₹{customer.spent.toLocaleString("en-IN")}</Typography>
                                        </div>
                                    </div>
                                    <div className="mt-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
                                        <Typography variant="small" className="text-[10px]">Last Order</Typography>
                                        <Typography variant="p" weight="semibold" className="mt-0.5 text-sm">{customer.lastOrder}</Typography>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}