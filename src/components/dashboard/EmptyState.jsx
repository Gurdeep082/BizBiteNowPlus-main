import React from "react";
import { Inbox } from "lucide-react";
import Button from "../UI/Button";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No Data Found",
  description = "There is nothing to display right now.",
  buttonText,
  onButtonClick,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-10 w-10 text-black" />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-black">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm text-black">
        {description}
      </p>

      {buttonText && (
        <Button
          onClick={onButtonClick}
          className="mt-6"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}