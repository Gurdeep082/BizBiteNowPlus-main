import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActionCard = ({ action }) => {
  const Icon = action.icon;

  return (
    <Link
      to={action.to}
      className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#1A4D2E] hover:shadow-lg"
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
      >
        <Icon size={22} />
      </div>

      <h3 className="font-semibold text-gray-900">
        {action.title}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {action.description}
      </p>

      <div className="mt-4 flex items-center text-sm font-medium text-[#1A4D2E]">
        Open
        <ArrowRight
          size={16}
          className="ml-2 transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
};

export default QuickActionCard;