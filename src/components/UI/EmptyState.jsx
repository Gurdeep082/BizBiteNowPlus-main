import React from "react";
import { PackageOpen } from "lucide-react";
import Button from "./Button";

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = "Nothing here yet",
  description = "There is no data available at the moment.",
  primaryAction,
  secondaryAction,
  className = "",
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        rounded-2xl border border-dashed border-gray-300
        bg-white p-10 text-center
        ${className}
      `}
    >
      <div className="mb-6 rounded-full bg-[#1A4D2E]/10 p-5">
        <Icon
          size={48}
          className="text-[#1A4D2E]"
        />
      </div>

      <h2 className="text-2xl font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-gray-500">
        {description}
      </p>

      {(primaryAction || secondaryAction) && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {secondaryAction && (
            <Button
              variant="secondary"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}

          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;