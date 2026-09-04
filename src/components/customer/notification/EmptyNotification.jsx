import { motion } from "framer-motion";
import { BellOff } from "lucide-react";

const EmptyNotifications = ({
  title = "No Notifications",
  description = "We'll notify you when something important happens.",
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-dashed
        border-slate-200
        bg-white
        px-6
        py-16
        text-center
      "
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <BellOff
          size={34}
          className="text-slate-400"
        />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </motion.div>
  );
};

export default EmptyNotifications;