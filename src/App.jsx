import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/Auth/Login";
import ForgotPin from "./pages/Auth/ForgotPin";
import RegisterSeller from "./pages/Auth/RegisterSeller";
import RegisterSuccess from "./pages/Auth/RegisterSuccess";

// Shared Seller Layout
import DashboardLayout from "./components/Shared/DashboardLayout";

// Seller Pages
import SellerDashboard from "./pages/Dashboards/Seller/SellerDashboard";
import Orders from "./pages/Dashboards/Seller/Orders";
import OrderDetails from "./pages/Dashboards/Seller/OrderDetails";
import Profile from "./pages/Dashboards/Seller/profile";
import Products from "./pages/Dashboards/Seller/Products";
import AddEditProduct from "./pages/Dashboards/Seller/AddEditProducts";
import Settings from "./pages/Dashboards/Seller/Settings";
import Analytics from "./pages/Dashboards/Seller/Analytics";
import DineIn from "./pages/Dashboards/Seller/DineIn";
import Earnings from "./pages/Dashboards/Seller/Earnings";
import RegularCustomersPage from "./pages/Dashboards/Seller/RegularCustomersPage";

// Delivery
import DeliveryManagement from "./pages/Dashboards/DeliveryDashboard/DeliveryManagement";

// Seller Modules
import SpecialOffers from "./components/special offers/SpecialOffers";
import FestiveMenu from "./pages/Dashboards/Seller/FestiveMenu";
import FestiveMenuDetails from "./pages/Dashboards/Seller/FestiveMenuDetails";
import CreateFestiveMenu from "./pages/Dashboards/Seller/CreateFestiveMenu";
import FestiveMenuHistory from "./pages/Dashboards/Seller/FestiveMenuHistory";
import { FestiveMenuProvider } from "./context/FestiveMenuContext";

// Customer Layout
import CustomerLayout from "./components/customer/layout/CustomerLayout";

// Customer Pages
import Home from "./pages/customer/Home";
import Menu from "./pages/customer/Menu";
import Product from "./pages/customer/ProductDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import OrderSuccess from "./pages/customer/OrderSuccess";
import CustomerOrders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetails";
import Rewards from "./pages/customer/Rewards";
import CustomerProfile from "./pages/customer/Profile";
import PersonalDetails from "./pages/customer/PersonalDetails";
import Language from "./pages/customer/Language";
import Appearance from "./pages/customer/Appearance";
import HelpSupport from "./pages/customer/HelpSupport";
import TermsPolicy from "./pages/customer/TermsPolicy";
import PolicyDetail from "./pages/customer/PolicyDetail";
import PrivacySecurity from "./pages/customer/PrivacySecurity";
import Favourites from "./pages/customer/Favourites";
import Notifications from "./pages/customer/Notifications";
import CustomerRegister from "./pages/Auth/CustomerRegister";
import QRScanPage from "./components/customer/home/scanner/QrScanPage";
import ScanConfirmation from "./pages/customer/ScanConfirmation";

// 🆕 Naye full-page customer settings screens (AppSettings removed)
import AccountSettings from "./pages/customer/AccountSettings";
import PaymentMethod from "./pages/customer/PaymentMethod";
import Addresses from "./pages/customer/Addresses";

// 🆕 Language context — poore customer app ko wrap karega
import { LanguageProvider } from "./context/LanguageContext";
import ContactPage from "./pages/customer/ContactPage";
import Policies from "./pages/customer/Policies";
import BookTable from "./pages/customer/BookTable";
import BookingHistory from "./pages/customer/BookingHistory";
import Billing from "./pages/Dashboards/Seller/Billing";
import StaffList from "./pages/Dashboards/Seller/StaffList";
import StaffForm from "./pages/Dashboards/Seller/StaffForm";
import LandingPage from "./pages/customer/LandingPage";
import SellerLandingPageManagement from "./pages/Dashboards/Seller/LandingPageManagement";
import ManageCategories from "./pages/Dashboards/Seller/CategoryManagement";

export default function App() {
  return (
    <LanguageProvider>
      <div className="w-full min-h-screen bg-slate-100 m-0 p-0 box-border overflow-x-hidden">
        <Routes>

          {/* Default Route */}
          <Route path="/" element={<Navigate replace to="/customer" />} />

          {/* Authentication */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-pin" element={<ForgotPin />} />
          <Route path="/seller/register" element={<RegisterSeller />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/auth/register-success" element={<RegisterSuccess />} />

          {/* ======================
              CUSTOMER APP ROUTES
          ====================== */}
          <Route path="/about-us" element={<LandingPage />} />
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="scan-qr" element={<QRScanPage />} />
            <Route path="scan-confirmation" element={<ScanConfirmation />} />
            <Route path="book-table" element={<BookTable />} />
            <Route path="booking-history" element={<BookingHistory />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="menu" element={<Menu />} />
            <Route path="menu/:table_token" element={<Menu />} />
            <Route path="favorites" element={<Favourites />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="product/:id/:table_token" element={<Product />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="profile/personal-details" element={<PersonalDetails />} />
            <Route path="profile/language" element={<Language />} />
            <Route path="profile/appearance" element={<Appearance />} />
            <Route path="profile/help-support" element={<HelpSupport />} />
            <Route path="profile/terms-policy/:policyId" element={<PolicyDetail />} />
            <Route path="profile/privacy-security" element={<PrivacySecurity />} />
            <Route path="profile/terms-policy" element={<TermsPolicy />} />
            <Route path="profile/account-settings" element={<AccountSettings />} />
            <Route path="profile/payment-methods" element={<PaymentMethod />} />
            <Route path="profile/addresses" element={<Addresses />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="policies" element={<Policies />} />
          </Route>

          {/* ======================
              SELLER DASHBOARD ROUTES
          ====================== */}
          <Route
            path="/seller"
            element={
              <FestiveMenuProvider>
                <DashboardLayout />
              </FestiveMenuProvider>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="billing" element={<Billing />} />

            <Route path="delivery" element={<DeliveryManagement />} />
            <Route path="special-offers" element={<SpecialOffers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<ManageCategories />} />
            {/* 🆕 Full-page Add / Edit Product (replaces the old modal) */}
            <Route path="products/add" element={<AddEditProduct />} />
            <Route path="products/edit/:id" element={<AddEditProduct />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="dine-in" element={<DineIn />} />
            <Route path="landing-page" element={<SellerLandingPageManagement />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="/seller/customers" element={<RegularCustomersPage />} />
            <Route path="/seller/staff" element={<StaffList />} />
            <Route path="/seller/staff/new" element={<StaffForm />} />
            <Route path="/seller/staff/:id/edit" element={<StaffForm />} />
            <Route path="profile" element={<Profile />} />


            {/* Festive Menu */}
            <Route path="festivemenu" element={<FestiveMenu />} />
            <Route path="festivemenu/create" element={<CreateFestiveMenu />} />
            <Route path="festivemenu/edit/:id" element={<CreateFestiveMenu />} />
            <Route path="festivemenu/:id" element={<FestiveMenuDetails />} />
            <Route path="festivemenu/history" element={<FestiveMenuHistory />} />
          </Route>

          {/* Registration Success */}
          <Route
            path="/register-success"
            element={
              <div className="min-h-screen w-full bg-[#f4fbf7] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center space-y-4 border border-emerald-100 shadow-xl">
                  <h3 className="text-lg font-black text-slate-900">
                    Registration Successful!
                  </h3>
                  <p className="text-slate-400">
                    Your seller account has been created successfully.
                  </p>

                  <a
                    href="/customer"
                    className="block w-full bg-[#059669] text-white py-2.5 rounded-xl font-black text-center"
                  >
                    Go To Storefront
                  </a>
                </div>
              </div>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/customer" replace />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}
