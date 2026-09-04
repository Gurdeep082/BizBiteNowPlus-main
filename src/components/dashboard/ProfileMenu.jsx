import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ProfileMenu({
  seller = {
    name: "Gurdeep Singh",
    role: "Plus Seller",
    avatar: "",
  },
}) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  // 🟢 Handle Logout Action
  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate("/login"); // Adjust route if your login path is different
  };

  // 🟢 Get dynamic initial letter from seller name
  const sellerInitial = seller?.name ? seller.name.charAt(0).toUpperCase() : "S";

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          group
          flex
          items-center
          gap-3
          rounded-xl
          px-3
          py-2
          transition-all
          duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]
          hover:bg-[#FDFDF5]
          hover:shadow-sm
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-[#1A4D2E]
            text-sm
            font-bold
            text-white
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:-translate-y-0.5
          "
        >
          {sellerInitial}
        </div>

        <div className="hidden text-left md:block">
          <h4 className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">
            {seller.name}
          </h4>

          <p className="text-xs text-slate-500">
            {seller.role}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`
            transition-all
            duration-300
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.96,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            className="
              absolute
              right-0
              z-50
              mt-3
              w-64
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-xl
              origin-top-right
            "
          >
            <div className="border-b border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 truncate">
                {seller.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {seller.role}
              </p>
            </div>

            <div className="py-2">
              <MenuItem
                icon={User}
                title="My Profile"
                onClick={() =>
                  handleNavigate("/seller/profile")
                }
              />

              <MenuItem
                icon={Settings}
                title="Settings"
                onClick={() =>
                  handleNavigate("/seller/settings")
                }
              />

              <MenuItem
                icon={HelpCircle}
                title="Help Center"
                onClick={() =>
                  handleNavigate("/seller/help")
                }
              />

              <div className="my-2 border-t border-slate-200" />

              {/* 🟢 Logout Menu Item Added */}
              <MenuItem
                icon={LogOut}
                title="Log Out"
                danger={true}
                onClick={handleLogout}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  title,
  danger = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group
        flex
        w-full
        items-center
        gap-3
        px-5
        py-3
        text-sm
        font-medium
        transition-all
        duration-300
        ease-[cubic-bezier(0.22,1,0.36,1)]
        cursor-pointer
        ${
          danger
            ? "text-red-600 hover:bg-red-50"
            : "text-slate-700 hover:bg-[#FDFDF5]"
        }
      `}
    >
      <Icon
        size={18}
        className={`
          shrink-0
          transition-all
          duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:-translate-y-0.5
          ${
            danger
              ? "group-hover:text-red-700"
              : "group-hover:text-[#1A4D2E]"
          }
        `}
      />

      <span
        className={`
          transition-all
          duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:-translate-y-0.5
          ${
            danger
              ? "group-hover:text-red-700"
              : "group-hover:text-[#1A4D2E]"
          }
        `}
      >
        {title}
      </span>
    </button>
  );
}