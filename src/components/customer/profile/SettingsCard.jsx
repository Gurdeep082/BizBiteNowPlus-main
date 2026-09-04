import {
  ChevronRight,
  Globe,
  Shield,
  CircleHelp,
  FileText,
  Palette,
  Heart,
} from "lucide-react";

const settings = [
  {
    id: "appearance",
    title: "Appearance",
    subtitle: "Customize your app experience",
    icon: Palette,
  },
  {
    id: "language",
    title: "Language",
    subtitle: "English",
    icon: Globe,
  },
  {
    id: "favorites",
    title: "Favorite",
    subtitle: "Manage your favourites",
    icon: Heart,
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    subtitle: "Password, permissions & privacy",
    icon: Shield,
  },
  {
    id: "support",
    title: "Help & Support",
    subtitle: "FAQs and Contact Us",
    icon: CircleHelp,
  },
  {
    id: "terms",
    title: "Terms & Privacy Policy",
    subtitle: "Read our policies",
    icon: FileText,
  },
];

const SettingsCard = ({ onItemClick }) => {
  return (
    <section className="w-full space-y-4">
      {/* Settings Container */}
      <div
        className="
        overflow-hidden
        rounded-[28px] sm:rounded-[32px]
        border
        bg-white dark:bg-[#181A1B]
        shadow-sm
        divide-y divide-slate-100 dark:divide-white/10
      "
        style={{
          borderColor: "var(--secondary-color)",
        }}
      >
        {settings.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className="
              flex
              w-full
              items-center
              justify-between

              px-5
              py-4

              sm:px-6
              sm:py-5

              text-left

              transition-all
              duration-200

              cursor-pointer
              group

              hover:bg-black/5
              active:bg-black/10
              dark:hover:bg-white/5
              dark:active:bg-white/10
            "
            >
              {/* Left: Primary-colored Icon & Details */}

              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                <div
                  className="
                  flex
                  h-11
                  w-11

                  sm:h-12
                  sm:w-12

                  items-center
                  justify-center

                  rounded-2xl

                  shadow-xs

                  transition-transform
                  duration-200

                  group-hover:scale-105

                  shrink-0
                "
                  style={{
                    background: "var(--primary-color)",
                    color: "var(--accent-color)",
                  }}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </div>

                <div className="min-w-0">
                  <h3
                    className="
                    font-bold
                    text-sm

                    sm:text-base

                    text-slate-900
                    dark:text-white

                    truncate

                    transition-colors
                    group-hover:opacity-90
                  "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                    mt-0.5
                    text-xs

                    sm:text-sm

                    font-medium

                    text-slate-500
                    dark:text-slate-400

                    truncate
                  "
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Right: Chevron Arrow */}

              <ChevronRight
                size={19}
                className="
                transition-all
                duration-200

                group-hover:translate-x-0.5

                shrink-0
                ml-3
              "
                style={{
                  color: "var(--secondary-color)",
                }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default SettingsCard;