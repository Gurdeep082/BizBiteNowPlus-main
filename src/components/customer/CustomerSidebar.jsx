import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, ShoppingCart, User, LogOut } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { isCustomerLoggedIn, logoutCustomer } from "../../api/customer/authApi";

const CustomerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();

  const handleLogout = async () => {
    await logoutCustomer();
    window.location.href = "/";
  };

  const sidebarItems = [
    { icon: LayoutGrid, label: "Menu", action: () => navigate("/menu"), match: ["/storefront", "/menu"] },
    {
      icon: ShoppingCart,
      label: "Cart",
      action: () => navigate("/cart"),
      badge: totalItems,
      match: ["/cart"],
    },
    {
      icon: User,
      label: "Profile",
      action: () =>
        navigate(isCustomerLoggedIn() ? "/customer/profile" : "/customer/onboarding"),
      match: ["/customer/profile"],
    },
  ];

  return (
    <aside
      className="hidden lg:flex flex-col items-center gap-2 py-3 bg-white rounded-2xl shadow-sm mx-3 mt-4 mb-4 sticky top-20 h-fit shrink-0"
      style={{ width: "72px" }}
    >
      {sidebarItems.map(({ icon: Icon, label, action, badge, match }) => {
        const active = match?.includes(location.pathname);
        return (
          <button
            key={label}
            onClick={action}
            title={label}
            className="relative flex items-center justify-center rounded-xl transition-colors shrink-0 cursor-pointer"
            style={{
              width: "44px",
              height: "44px",
              color: active ? "#E8622D" : "#9CA3AF",
              backgroundColor: active ? "#FBE7DD" : "transparent",
            }}
          >
            <Icon size={20} />
            {badge > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-[#E8622D] text-white font-bold rounded-full flex items-center justify-center"
                style={{ fontSize: "10px", width: "16px", height: "16px" }}
              >
                {badge > 9 ? "9+" : badge}
              </span>
            )}
          </button>
        );
      })}

      <div className="w-full h-px bg-gray-100 my-1" />

      <button
        onClick={handleLogout}
        title="Log out"
        className="flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
        style={{ width: "44px", height: "44px" }}
      >
        <LogOut size={20} />
      </button>
    </aside>
  );
};

export default CustomerSidebar;
