import React from "react";
import { ChevronRight } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        {/* Breadcrumb - Text size wapas text-xs/sm kiya, par font-medium hi rakha */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500">
          <span>Seller</span>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-700">
            {title}
          </span>
        </div>

        {/* Title - Custom size [28px] lagaya jo na zyada bada hai na chota */}
        <h1 className="mt-1.5 text-2xl sm:text-[28px] font-bold text-slate-900 leading-tight">
          {title}
        </h1>

        {/* Subtitle - Readable text-xs/sm size rakha */}
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action Buttons (if any) */}
      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
}