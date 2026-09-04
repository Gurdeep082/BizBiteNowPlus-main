import {
  Bell,
  Gift,
  ShoppingBag,
  Mail,
  ShieldCheck,
} from "lucide-react";

import Card from "../common/Card";

const notificationGroups = [
  {
    id: "orders",
    title: "Order Updates",
    description: "Track your orders in real time.",
    icon: ShoppingBag,
  },
  {
    id: "offers",
    title: "Offers & Discounts",
    description: "Receive exclusive deals and promotions.",
    icon: Gift,
  },
  {
    id: "rewards",
    title: "Rewards & Loyalty",
    description:
      "Stay updated with loyalty points and gifts.",
    icon: Bell,
  },
  {
    id: "email",
    title: "Email Notifications",
    description:
      "Receive invoices and account updates.",
    icon: Mail,
  },
  {
    id: "security",
    title: "Security Alerts",
    description:
      "Login alerts and account activity.",
    icon: ShieldCheck,
  },
];

const Toggle = ({
  checked,
  onChange,
}) => (
  <button
    onClick={onChange}
    className={`
      relative
      h-7
      w-14
      rounded-full
      transition-all
      duration-300

      ${checked ? "" : "bg-slate-300 dark:bg-slate-600"}
    `}
    style={{
      background: checked
        ? "var(--primary)"
        : undefined,
    }}
  >
    <span
      className={`
        absolute
        top-1

        h-5
        w-5

        rounded-full
        bg-white

        shadow-md

        transition-all
        duration-300

        ${
          checked
            ? "left-8"
            : "left-1"
        }
      `}
    />
  </button>
);

const NotificationSettings = ({
  settings = {},
  onToggle,
}) => {
  return (
    <section className="space-y-6">
      {/* Settings */}

      <div className="space-y-5">
        {notificationGroups.map(
          (item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.id}
                shadow="sm"
              >
                <div className="flex items-center gap-5">
                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-14
                      w-14

                      shrink-0

                      items-center
                      justify-center

                      rounded-2xl

                      text-white
                    "
                    style={{
                      background:
                        "var(--primary)",
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  {/* Content */}

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {
                        item.description
                      }
                    </p>
                  </div>

                  {/* Toggle */}

                  <Toggle
                    checked={
                      settings[item.id]
                    }
                    onChange={() =>
                      onToggle?.(
                        item.id,
                        !settings[
                          item.id
                        ]
                      )
                    }
                  />
                </div>
              </Card>
            );
          }
        )}
      </div>

      {/* Footer */}

      <Card
        shadow="none"
        className="border-[var(--primary-border)] bg-[var(--primary-light)]"
      >
        <p
          className="font-medium"
          style={{
            color: "var(--primary)",
          }}
        >
          Changes are saved automatically.
        </p>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          You can change these
          preferences anytime.
        </p>
      </Card>
    </section>
  );
};

export default NotificationSettings;