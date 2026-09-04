import {
  Clock3,
  Flame,
  Leaf,
  Circle,
  Truck,
  ChefHat,
} from "lucide-react";

export default function ProductInfo({ product }) {
  return (
    <div className="space-y-5">

      {/* Description */}

      <div>
        <p className="text-[15px] leading-7 text-gray-600 dark:text-slate-400">
          {product?.description ||
            "Classic delight with 100% real mozzarella cheese, fresh vegetables, premium toppings and our signature homemade pizza sauce baked to perfection."}
        </p>
      </div>

      {/* Quick Information */}

     


     

    </div>
  );
}