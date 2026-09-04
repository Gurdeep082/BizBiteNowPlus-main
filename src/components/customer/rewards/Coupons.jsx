import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import CouponCard from "./CouponCard";

import Card from "../common/Card";
import Chip from "../common/Chip";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";

const tabs = [
  { id: "available", label: "Available" },
  { id: "used", label: "Used" },
  { id: "expired", label: "Expired" },
];

const Coupons = ({
  coupons = [],
  appliedCoupon = null,
  usedCoupons = [],
  onApply,
  onCopy,
}) => {
  const [activeTab, setActiveTab] = useState("available");
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);

    setCopiedCode(code);

    onCopy?.(code);

    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const isUsed = usedCoupons.includes(coupon.code) || usedCoupons.includes(coupon.id);
      const isExpired = Boolean(coupon.expired);

      // 🟢 Mutually exclusive categorization: available / used / expired
      let tabMatch = false;
      if (activeTab === "available") {
        tabMatch = !isExpired && !isUsed;
      } else if (activeTab === "used") {
        tabMatch = isUsed;
      } else if (activeTab === "expired") {
        tabMatch = isExpired && !isUsed; // used takes priority over expired
      }

      const searchMatch =
        coupon.code
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        coupon.title
          .toLowerCase()
          .includes(search.toLowerCase());

      return tabMatch && searchMatch;
    });
  }, [
    coupons,
    activeTab,
    search,
    usedCoupons,
  ]);

  return (
    <div className="space-y-4 lg:space-y-6">

      <SectionHeader
        title="Active Coupons"
        subtitle="Available rewards ready to use."
      />


      {/* Search */}

      <Card shadow="none" className="!p-2 lg:!p-4">
        <div className="relative flex items-center">

          <Search
            size={16}
            className="
            absolute
            left-3
            lg:left-4
            lg:size-[18px]
          "
            style={{
              color: "var(--secondary-color)",
            }}
          />


          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search coupon..."
            className="
            w-full
            bg-transparent
            py-0.5
            pl-9
            pr-2
            text-sm
            leading-tight
            outline-none
            placeholder:text-[color:var(--secondary-color)]

            lg:py-1
            lg:pl-12
            lg:text-base
          "
            style={{
              color: "var(--primary-color)",
            }}
          />

        </div>
      </Card>


      {/* Tabs */}

      <div className="flex gap-2 overflow-x-auto scrollbar-hide lg:gap-3">

        {tabs.map((tab) => (
          <Chip
            key={tab.id}
            label={tab.label}
            selected={activeTab === tab.id}
            onClick={() =>
              setActiveTab(tab.id)
            }
          />
        ))}

      </div>


      {/* Coupons */}

      {filteredCoupons.length === 0 ? (
        <EmptyState
          icon="search"
          title="No Coupons"
          description="Nothing available here."
        />
      ) : (
        <div
          className="
          flex
          gap-3
          overflow-x-auto
          scrollbar-hide
          pb-2
          snap-x
          snap-mandatory

          lg:gap-5
        "
        >
          {filteredCoupons.map((coupon) => (
            <div
              key={coupon.code}
              className="snap-center shrink-0 w-full lg:w-auto lg:shrink"
            >
              <CouponCard
                coupon={coupon}
                copied={
                  copiedCode === coupon.code
                }
                used={
                  usedCoupons.includes(coupon.code) ||
                  usedCoupons.includes(coupon.id)
                }
                onCopy={handleCopy}
                onApply={onApply}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Coupons;