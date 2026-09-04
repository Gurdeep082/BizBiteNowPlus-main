import { ChevronRight } from "lucide-react";
import BackButton from "./BackButton";

const SectionHeader = ({
  title,
  subtitle,
  action,
  onAction,
  icon: Icon,
  className = "",
  centered = false,
  showBack = false,
  rightContent = null,
  horizontal = false,
  actionClassName = "",
}) => {
  return (
    <div
      className={`
        flex
        ${horizontal ? "flex-row items-center justify-between" : "flex-col sm:flex-row sm:items-center sm:justify-between"}
        gap-3

        lg:gap-4

        ${centered ? "text-center sm:text-left" : ""}

        ${className}
      `}
    >

      {/* Left */}

        <div className="flex min-w-0 items-center gap-3 lg:gap-4">
          {showBack && <BackButton />}
          <div className="min-w-0">

        <div className="flex items-center gap-2 lg:gap-3">

          {Icon && (
            <div
              className="
                flex
                h-9
                w-9

                items-center
                justify-center

                rounded-xl

                text-white

                shadow-md

                lg:h-12
                lg:w-12
                lg:rounded-2xl
              "
              style={{
                background: "var(--primary)",
              }}
            >
              <Icon size={16} className="lg:hidden" />
              <Icon size={22} className="hidden lg:block" />
            </div>
          )}


          <div>

            <h2
              className="
                text-base

                font-bold

                text-slate-900 dark:text-white

                lg:text-xl
              "
            >
              {title}
            </h2>


            {subtitle && (
              <p
                className="
                  mt-0.5

                  text-xs

                  text-slate-500 dark:text-slate-400

                  lg:mt-1
                  lg:text-sm
                "
              >
                {subtitle}
              </p>
            )}

          </div>


        </div>

      </div>

      </div>


      {/* Right */}

      {rightContent ? rightContent : action ? (
        <button onClick={onAction} className={`inline-flex h-10 min-w-[84px] shrink-0 items-center justify-center gap-1.5 self-center rounded-[12px] px-4 text-[12px] font-bold text-white shadow-[0_6px_14px_rgba(194,24,91,0.28)] transition hover:brightness-95 active:scale-95 ${actionClassName}`} style={{ backgroundColor: "#c2185b" }}>
          {action}
          <ChevronRight size={14} className="lg:hidden" />
          <ChevronRight size={16} className="hidden lg:block" />
        </button>
      ) : null}

    </div>
  );
};

export default SectionHeader;
