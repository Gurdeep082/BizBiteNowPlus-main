import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const FestiveDealCard = ({
  deal,
  onClick,
}) => {

  return (
    <motion.div
      whileHover={{
        y:-5,
      }}
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        dark:border-[#A9BDCF]/40
        bg-white
        dark:bg-[#181A1B]
        shadow-md
        cursor-pointer
      "
      onClick={onClick}
    >

      <div className="relative h-44">

        <img
          src={deal.banner_image}
          alt={deal.title}
          className="
            h-full
            w-full
            object-cover
          "
        />


        <div
          className="
            absolute
            top-3
            left-3
            flex
            items-center
            gap-1
            rounded-full
            bg-[var(--primary)]
            px-3
            py-1
            text-xs
            font-bold
            text-white
          "
        >

          <Sparkles size={14}/>

          FESTIVE

        </div>


      </div>


      <div className="p-4">


        <h3
          className="
            text-lg
            font-bold
            text-slate-900
            dark:text-white
          "
        >
          {deal.title}
        </h3>


        <p
          className="
            mt-1
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          {deal.description}
        </p>


        <div
          className="
            mt-3
            inline-flex
            rounded-xl
            bg-green-100
            px-3
            py-2
            text-sm
            font-bold
            text-green-700
          "
        >

          {deal.discount_value}% OFF

        </div>


      </div>


    </motion.div>
  );
};


export default FestiveDealCard;