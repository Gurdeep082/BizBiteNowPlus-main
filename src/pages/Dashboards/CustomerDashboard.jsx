import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Star, MapPin, User,
  CheckCircle2, CreditCard, Wallet, Plus, Minus,
  Award, Search, ChevronRight, X, Gift, ListOrdered,
  Store, Trash2, LogOut, RefreshCw, Percent
} from 'lucide-react';
import { getMyProfile, logoutCustomer } from '../../api/customer/authApi';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  
  // --- ECO-FRIENDLY WHITELABEL BRAND METADATA ---
  const storeMeta = {
    business_name: "Imperial Organic Cafe",
    theme_color: "#059669", 
    accent_light: "#ecfdf5", 
    banner_url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1000", 
    logo_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150"
  };

  // --- SUB-ROUTING VERTICAL STATE ---
  const [activeTab, setActiveTab] = useState('home'); 
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // --- MONGOOSE PRODUCT MOCK ARRAY ---
  const [products] = useState([
    { _id: 'P1', name: 'Eggers Madhouse Combo', price: 200, description: 'Fresh farm eggs & whole wheat toast', category: 'Fast Food', rating: '4.0', discount: '20% OFF', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', is_available: true },
    { _id: 'P2', name: 'Pizza Central Pizza', price: 250, description: 'Hand-tossed organic dough, fresh basil', category: 'Pizza', rating: '4.1', discount: '20% OFF', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500', is_available: true },
    { _id: 'P3', name: 'Zoe Juices & Shakes', price: 300, description: '100% cold-pressed fruit juices, zero sugar', category: 'Juices, Beverages', rating: '4.5', discount: '20% OFF', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', is_available: true }
  ]);

  const mohallaClusters = ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar", "Mahanagar"];

  // --- MONGOOSE CUSTOMER SCHEMA COMPLIANT STATES ---
  const [customerProfile, setCustomerProfile] = useState({
    customer_name: "Shresth Saxena",
    customer_phone: "9876543210",
    stamps_earned: 8,
    stamps_redeemed: 3,
    birthday: { day: 8, month: 7 }, 
    rewards: [
      { reward_code: "ORGANIC_50", discount_value: 50, issued_at: "2026-06-10", redeemed_at: null }, 
      { reward_code: "REWARD_SHR_A29B", discount_value: 100, issued_at: "2026-05-01", redeemed_at: "2026-05-20" } 
    ]
  });

  // Multiple Address Array
  const [addresses, setAddresses] = useState([
    { id: 'AD1', type: 'Home', mohalla: 'Gomti Nagar', full_address: 'Flat 402, Green Apartments, Gomti Nagar' },
    { id: 'AD2', type: 'Work', mohalla: 'Hazratganj', full_address: 'Cyber Tech Node Tower, Floor 3, Hazratganj' }
  ]);

  // Orders History Ledger Mock Data Mapping Fields
  const [orderHistory] = useState([
    { id: 'ORD-7612', date: '2026-06-18', items: '1x Pizza Central Pizza, 1x Zoe Juices', productIds: ['P2', 'P3'], total_amount: 550, payment_method: 'ONLINE', delivery_status: 'Delivered' },
    { id: 'ORD_6541', date: '2026-06-02', items: '2x Eggers Madhouse Combo', productIds: ['P1', 'P1'], total_amount: 400, payment_method: 'COD', delivery_status: 'Delivered' }
  ]);

  // --- OPERATION FORM STATES ---
  const [cart, setCart] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [activeAppliedCoupon, setActiveAppliedCoupon] = useState(null);

  const [editProfileForm, setEditProfileForm] = useState({ ...customerProfile });
  const [newAddressForm, setNewAddressForm] = useState({ type: 'Home', mohalla: 'Gomti Nagar', full_address: '' });
  const [selectedAddressId, setSelectedAddressId] = useState('AD1');
  const [checkoutForm, setCheckoutData] = useState({ payment_method: 'COD', coupon_input: '' });

  // --- BASKET MUTATIONS ---
  const addToCart = (id) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart(prev => {
    const updated = { ...prev };
    if (updated[id] <= 1) delete updated[id]; else updated[id] -= 1;
    return updated;
  });

  const getCartSubtotal = () => Object.entries(cart).reduce((t, [id, qty]) => t + ((products.find(p => p._id === id)?.price || 0) * qty), 0);
  const getFinalPayableAmount = () => {
    const subtotal = getCartSubtotal();
    if (activeAppliedCoupon) {
      return Math.max(0, subtotal - (subtotal * activeAppliedCoupon.discount_value) / 100);
    }
    return subtotal;
  };
  const totalCartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // 🚀 DYNAMIC REORDER CONTEXT MANAGER FUNCTION
  const handleReorderAction = (productIdsArray) => {
    const reorderedCart = {};
    productIdsArray.forEach(id => {
      reorderedCart[id] = (reorderedCart[id] || 0) + 1;
    });
    setCart(reorderedCart);
    setCheckoutOpen(true);
    setStatusMsg({ type: 'success', text: 'Purana order direct cart basket mein roll back ho gaya!' });
  };

  // 🚀 RE-INITIALIZE AUTHENTICATION CONTEXT FLOWS ON LOGOUT
  const handleLogoutAction = async () => {
    await logoutCustomer();
    navigate('/customer/onboarding', { replace: true });
  };

  // 🚀 LOAD REAL CUSTOMER PROFILE FROM AUTH SESSION ON MOUNT
  useEffect(() => {
    getMyProfile()
      .then((user) => {
        setCustomerProfile((prev) => ({
          ...prev,
          customer_name: user.name || prev.customer_name,
          customer_phone: user.phone || prev.customer_phone,
        }));
      })
      .catch(() => {});
  }, []);

  const handleApplyCouponAction = (couponObject) => {
    if (getCartSubtotal() === 0) {
      setStatusMsg({ type: 'error', text: 'Cart empty hai! Pehle items select kijiye.' });
      return;
    }
    setActiveAppliedCoupon(couponObject);
    setCheckoutData(prev => ({ ...prev, coupon_input: couponObject.reward_code }));
    setStatusMsg({ type: 'success', text: `🎉 Coupon [${couponObject.reward_code}] apply ho gaya!` });
  };

  const handleRemoveCoupon = () => {
    setActiveAppliedCoupon(null);
    setCheckoutData(prev => ({ ...prev, coupon_input: '' }));
  };

  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    setCustomerProfile({ ...editProfileForm });
    setStatusMsg({ type: 'success', text: 'DOB aur identity settings successfully save ho gayi hain!' });
  };

  const handleAddNewAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddressForm.full_address) return;
    const addedNode = {
      id: 'AD' + (addresses.length + 1),
      type: newAddressForm.type,
      mohalla: newAddressForm.mohalla,
      full_address: newAddressForm.full_address
    };
    setAddresses([...addresses, addedNode]);
    setNewAddressForm({ type: 'Home', mohalla: 'Gomti Nagar', full_address: '' });
    setStatusMsg({ type: 'success', text: 'Naya address successfully add ho gaya!' });
  };

  const handleDeleteAddressNode = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setOrderSuccess({ id: 'BBN-ECO-' + Math.floor(Math.random() * 9000 + 1000), total: getFinalPayableAmount() });
    setCart({});
    setActiveAppliedCoupon(null);
    setCheckoutOpen(false);
  };

  const activeSelectedAddressObj = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  // ---------------- CORE MAIN STOREFRONT INTERFACE NAVIGATION SIDEBAR ----------------
  return (
    <div className="min-h-screen w-full bg-[#f4fbf7] text-slate-800 flex flex-col lg:flex-row m-0 p-0 overflow-x-hidden">
      
      {/* 1. LEFT SIDEBAR NAVIGATION GRID */}
      <div className="w-full lg:w-64 bg-slate-900 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0 text-slate-100">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <img src={storeMeta.logo_url} className="w-8 h-8 rounded-full object-cover border border-emerald-500" alt="" />
            <div>
              <span className="text-sm font-black tracking-tight text-white uppercase truncate block max-w-[160px]">{storeMeta.business_name}</span>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Client Terminal</p>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-black">
              {customerProfile.customer_name.substring(0,1)}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-200 truncate">{customerProfile.customer_name}</h4>
              <p className="text-[11px] truncate font-mono text-slate-500">{customerProfile.customer_phone}</p>
            </div>
          </div>

          <div className="space-y-1">
            <button onClick={() => setActiveTab('home')} className={`w-full flex items-center space-x-3 text-xs font-bold p-2.5 rounded-xl border ${activeTab === 'home' ? 'bg-[#059669]/20 border-[#059669] text-white' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
              <Store size={16} /> <span>Storefront Market</span>
            </button>
            <button onClick={() => { setEditProfileForm({ ...customerProfile }); setActiveTab('profile'); }} className={`w-full flex items-center space-x-3 text-xs font-bold p-2.5 rounded-xl border ${activeTab === 'profile' ? 'bg-[#059669]/20 border-[#059669] text-white' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
              <User size={16} /> <span>My Account Profile</span>
            </button>
            <button onClick={() => setActiveTab('coupons')} className={`w-full flex items-center space-x-3 text-xs font-bold p-2.5 rounded-xl border ${activeTab === 'coupons' ? 'bg-[#059669]/20 border-[#059669] text-white' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
              <Gift size={16} /> <span>Coupons & Rewards</span>
            </button>
            <button onClick={() => setActiveTab('history')} className={`w-full flex items-center space-x-3 text-xs font-bold p-2.5 rounded-xl border ${activeTab === 'history' ? 'bg-[#059669]/20 border-[#059669] text-white' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
              <ListOrdered size={16} /> <span>Orders History Log</span>
            </button>
            <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center space-x-3 text-xs font-bold p-2.5 rounded-xl border ${activeTab === 'addresses' ? 'bg-[#059669]/20 border-[#059669] text-white' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}>
              <MapPin size={16} /> <span>Addresses Ledger</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-800">
          <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/40 text-center text-xs text-emerald-400 font-bold flex items-center justify-center space-x-1.5">
            <Award size={13} /> <span>Total Stamps: {customerProfile.stamps_earned}</span>
          </div>
          <button disabled={totalCartItemsCount === 0} onClick={() => setCheckoutOpen(true)} style={{ backgroundColor: totalCartItemsCount > 0 ? storeMeta.theme_color : '#334155' }} className="w-full text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center space-x-2 shadow cursor-pointer disabled:opacity-50">
            <ShoppingCart size={14} /> <span>Checkout Basket ({totalCartItemsCount})</span>
          </button>
          
          <button onClick={handleLogoutAction} className="text-xs font-bold text-rose-400 p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-xl w-full flex items-center justify-center space-x-2 cursor-pointer hover:bg-rose-500/10 transition mt-1">
            <LogOut size={14} /> <span>Logout Account</span>
          </button>
        </div>
      </div>

      {/* 2. RIGHT CONTENT AREA DYNAMIC CANVAS */}
      <div className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
        
        <div className="bg-[#e6f9f0] p-4 rounded-xl border border-emerald-200 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-xl font-black flex items-center tracking-tight" style={{ color: '#0f172a' }}>{storeMeta.business_name} Storefront</h1>
            <p className="text-xs font-bold text-emerald-800 mt-0.5 uppercase tracking-wide">White-label Direct Logistics Delivery Ecosystem</p>
          </div>
        </div>

        {statusMsg.text && <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs rounded-xl font-black">{statusMsg.text}</div>}

        {/* ---------------- MODULE A: HOME BROWSING STOREFRONT ---------------- */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-3 text-emerald-600/60" size={15} />
                <input type="text" placeholder="Search healthy dishes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#fbfdfb] border border-emerald-100 rounded-xl pl-9 pr-4 py-2 text-xs outline-none text-slate-900 focus:border-emerald-400 font-medium" />
              </div>
              <div className="flex space-x-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
                {['All', 'Fast Food', 'Pizza', 'Beverages'].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ backgroundColor: selectedCategory === cat ? storeMeta.theme_color : '#f0fdf4', color: selectedCategory === cat ? '#ffffff' : '#065f46' }} className="px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer">{cat}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {products
                .filter(p => selectedCategory === 'All' || p.category.includes(selectedCategory))
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((prod) => (
                  <div key={prod._id} className="bg-white rounded-2xl p-4 flex items-start gap-4 border border-emerald-100 shadow-sm relative hover:border-emerald-300 transition duration-300">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-slate-50 overflow-hidden relative shrink-0 border border-emerald-50">
                      <img src={prod.image} alt="Dish" className="w-full h-full object-cover" />
                      {prod.discount && <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase shadow-sm">{prod.discount}</span>}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-28 sm:h-32">
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-extrabold text-base text-slate-900 truncate leading-tight">{prod.name}</h3>
                          <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center shrink-0 shadow-sm"><span>{prod.rating}</span><Star size={8} className="fill-current ml-0.5" /></span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-700/70 truncate">{prod.category}</p>
                        <p className="text-xs font-black text-slate-700">Cost ₹{prod.price} for one</p>
                        <p className="text-[11px] font-medium text-slate-400 line-clamp-1 mt-0.5">{prod.description}</p>
                      </div>
                      <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                        <span className="text-sm font-black text-slate-900">₹{prod.price}</span>
                        {cart[prod._id] ? (
                          <div className="flex items-center space-x-2 border rounded-xl bg-emerald-50/50 p-1 border-emerald-200">
                            <button onClick={() => removeFromCart(prod._id)} className="p-1 hover:bg-emerald-100 rounded text-emerald-800"><Minus size={11} /></button>
                            <span className="text-xs font-black px-1 text-emerald-900">{cart[prod._id]}</span>
                            <button onClick={() => addToCart(prod._id)} className="p-1 hover:bg-emerald-100 rounded text-emerald-800"><Plus size={11} /></button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(prod._id)} style={{ border: `1px solid ${storeMeta.theme_color}`, color: storeMeta.theme_color }} className="px-4 py-1.5 rounded-xl text-xs font-black bg-white hover:bg-emerald-50/30 transition cursor-pointer">ADD +</button>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- MODULE B: ACCOUNT PROFILE & DOB ---------------- */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-6 max-w-2xl">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3"><User className="text-emerald-600" size={18} /><h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Identity Settings Profile</h3></div>
            
            <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="font-bold text-slate-600">Customer Full Name *</label>
                  <input type="text" required value={editProfileForm.customer_name} onChange={(e)=>setEditProfileForm({...editProfileForm, customer_name: e.target.value})} className="w-full bg-[#fbfdfb] border border-slate-200 rounded-xl p-3 text-slate-900 font-bold outline-none focus:border-emerald-400" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-bold text-slate-400">Registered Phone Gateway</label>
                  <input type="text" readOnly value={editProfileForm.customer_phone} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-400 font-mono font-bold outline-none cursor-not-allowed" />
                </div>

                <div className="flex flex-col space-y-1.5 sm:col-span-2 bg-[#f4fbf7] p-4 rounded-xl border border-emerald-100">
                  <label className="font-black text-emerald-800 uppercase text-[10px] tracking-wider flex items-center"><Gift size={13} className="mr-1 text-emerald-600" /> Birthday Validation Hooks (Mongoose Matcher)</label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Calendar Day (1-31) *</label>
                      <input type="number" min={1} max={31} required placeholder="DD" value={editProfileForm.birthday.day || ''} onChange={(e)=>setEditProfileForm({...editProfileForm, birthday: { ...editProfileForm.birthday, day: Number(e.target.value) }})} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-center font-mono font-bold text-slate-900 outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Calendar Month (1-12) *</label>
                      <input type="number" min={1} max={12} required placeholder="MM" value={editProfileForm.birthday.month || ''} onChange={(e)=>setEditProfileForm({...editProfileForm, birthday: { ...editProfileForm.birthday, month: Number(e.target.value) }})} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-center font-mono font-bold text-slate-900 outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" style={{ backgroundColor: storeMeta.theme_color }} className="text-white font-bold px-5 py-2.5 rounded-xl shadow cursor-pointer">
                Commit Identity Metadata
              </button>
            </form>
          </div>
        )}

        {/* ---------------- MODULE C: COUPONS REPOSITORY ---------------- */}
        {activeTab === 'coupons' && (
          <div className="space-y-4 max-w-2xl">
            <div className="border-b border-emerald-100 pb-2"><h2 className="text-lg font-black text-slate-900 uppercase">Available Discount Ledger Vault</h2></div>
            <div className="grid grid-cols-1 gap-3">
              {customerProfile.rewards.map((rew, i) => {
                const isOccupied = rew.redeemed_at !== null;
                return (
                  <div key={i} className={`p-4 rounded-xl border flex items-center justify-between text-xs ${isOccupied ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white border-emerald-100 shadow-sm'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isOccupied ? 'bg-slate-200 text-slate-400' : 'bg-emerald-600 text-white'}`}><Percent size={14} /></div>
                      <div>
                        <p className={`font-mono font-black ${isOccupied ? 'line-through text-slate-400' : 'text-slate-900'}`}>{rew.reward_code}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Value deduction factor: {rew.discount_value}% OFF</p>
                      </div>
                    </div>
                    {isOccupied ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-200 text-slate-400 px-2 py-1 rounded">Used / Occupied</span>
                    ) : (
                      <button type="button" onClick={() => handleApplyCouponAction(rew)} className="px-3 py-1 bg-emerald-600 text-white font-black uppercase text-[10px] rounded-lg cursor-pointer">Apply Coupon</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- MODULE D: ORDERS HISTORY LOG (WITH UPGRADED REORDER TRIGGER) ---------------- */}
        {activeTab === 'history' && (
          <div className="space-y-4 max-w-4xl">
            <div className="border-b border-slate-100 pb-2"><h2 className="text-lg font-black text-slate-900 uppercase">Your Orders History Log</h2></div>
            
            <div className="space-y-3">
              {orderHistory.map((log) => (
                <div key={log.id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-slate-900 text-sm">{log.id}</span>
                      <span className="text-slate-400 font-medium">{log.date}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border font-mono">{log.payment_method}</span>
                    </div>
                    <p className="font-bold text-slate-700 text-sm pt-0.5">{log.items}</p>
                    <p className="text-xs font-black text-emerald-600">Net Gross Paid: ₹{log.total_amount}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100 font-bold">
                      <CheckCircle2 size={13} /> <span>{log.delivery_status}</span>
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => handleReorderAction(log.productIds)}
                      style={{ border: `1px solid ${storeMeta.theme_color}`, color: storeMeta.theme_color }}
                      className="px-3 py-1.5 bg-white font-black rounded-xl hover:bg-emerald-50/40 transition flex items-center space-x-1 cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- MODULE E: MULTIPLE ADDRESSES ---------------- */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase">Addresses Management Hub</h2>
            </div>

            <form onSubmit={handleAddNewAddressSubmit} className="bg-white border border-emerald-100 p-5 rounded-2xl space-y-4 text-xs shadow-sm">
              <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider block border-b pb-1">Link New Address Destination</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col space-y-1.5">
                  <label className="font-bold text-slate-600">Address Type Selector *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setNewAddressForm({ ...newAddressForm, type: 'Home' })} className={`py-2 rounded-xl border flex items-center justify-center space-x-1 font-bold cursor-pointer ${newAddressForm.type === 'Home' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200'}`}><span>Home</span></button>
                    <button type="button" onClick={() => setNewAddressForm({ ...newAddressForm, type: 'Work' })} className={`py-2 rounded-xl border flex items-center justify-center space-x-1 font-bold cursor-pointer ${newAddressForm.type === 'Work' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200'}`}><span>Work</span></button>
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="font-bold text-slate-600">Mohalla Region Block *</label>
                  <select value={newAddressForm.mohalla} onChange={(e)=>setNewAddressForm({...newAddressForm, mohalla: e.target.value})} className="w-full bg-[#fbfdfb] border border-slate-200 rounded-xl p-2.5 font-bold outline-none">
                    {mohallaClusters.map(moh => <option key={moh} value={moh}>{moh}</option>)}
                  </select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="font-bold text-slate-600">Complete Address Target *</label>
                  <input type="text" required placeholder="House No, Lane..." value={newAddressForm.full_address} onChange={(e)=>setNewAddressForm({...newAddressForm, full_address: e.target.value})} className="w-full bg-[#fbfdfb] border border-slate-200 rounded-xl p-2 text-slate-900 outline-none" />
                </div>
              </div>

              <button type="submit" style={{ backgroundColor: storeMeta.theme_color }} className="text-white font-bold px-4 py-2 rounded-xl shadow cursor-pointer">Append Destination</button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white border border-emerald-100 p-4 rounded-xl flex justify-between items-start shadow-sm">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-slate-900 uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-slate-100 border">{addr.type}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({addr.mohalla})</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 pt-1 leading-relaxed">{addr.full_address}</p>
                  </div>
                  <button onClick={() => handleDeleteAddressNode(addr.id)} className="text-slate-300 hover:text-rose-500 p-1 cursor-pointer"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ---------------- ACTIVE CART INVOICE CHECKOUT GATEWAY ---------------- */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-emerald-100">
            <div className="p-5 border-b border-emerald-100 flex justify-between items-center bg-[#f4fbf7]">
              <h3 className="font-black text-slate-900 text-base flex items-center"><ShoppingCart size={16} className="mr-1.5 text-emerald-600" /> Finalize Order Node</h3>
              <button onClick={() => setCheckoutOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-800 block tracking-wider">Invoice Statement</span>
                {Object.entries(cart).map(([id, qty]) => {
                  const p = products.find(prod => prod._id === id);
                  return p ? (
                    <div key={id} className="flex justify-between font-bold text-slate-700">
                      <span>{p.name} (x{qty})</span> <span>₹{p.price * qty}</span>
                    </div>
                  ) : null;
                })}
                {activeAppliedCoupon && (
                  <div className="flex justify-between font-bold text-emerald-700 bg-emerald-100/50 px-2 py-1 rounded border border-emerald-200 text-[11px]">
                    <span>Coupon Applied: {activeAppliedCoupon.reward_code}</span> <span>-{activeAppliedCoupon.discount_value}%</span>
                  </div>
                )}
                <div className="border-t border-emerald-100 pt-2 mt-1 flex justify-between font-black text-sm text-slate-900">
                  <span>Net Payable Amount:</span><span className="text-emerald-700 text-base">₹{getFinalPayableAmount()}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Reward Offer Code</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. ORGANIC_50" value={checkoutForm.coupon_input || ''} onChange={(e) => setCheckoutData({ ...checkoutForm, coupon_input: e.target.value })} className="flex-1 bg-[#fbfdfb] border border-slate-200 rounded-xl p-2.5 outline-none font-mono font-bold text-slate-900 focus:border-emerald-400" />
                  {activeAppliedCoupon ? (
                    <button type="button" onClick={handleRemoveCoupon} className="px-3 bg-rose-50 text-rose-600 font-bold border border-rose-200 rounded-xl">Remove</button>
                  ) : (
                    <button type="button" onClick={() => {
                      const match = customerProfile.rewards.find(r => r.reward_code === checkoutForm.coupon_input?.trim().toUpperCase() && !r.redeemed_at);
                      if (match) handleApplyCouponAction(match); else setStatusMsg({ type: 'error', text: 'Invalid or Used Code!' });
                    }} className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl transition">Apply</button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">Choose Delivery Destination Address *</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {addresses.map((a) => (
                    <label key={a.id} className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${selectedAddressId === a.id ? 'bg-emerald-50/60 border-emerald-500' : 'bg-white border-slate-200'}`}>
                      <input type="radio" name="checkout_addr" checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} className="mt-0.5 accent-emerald-600" />
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 flex items-center gap-1 text-[11px]">{a.type} Mapping ({a.mohalla})</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{a.full_address}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">Select Checkout Payment Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setCheckoutData(prev => ({ ...prev, payment_method: 'COD' }))} className={`p-3 rounded-xl border flex items-center justify-center space-x-1.5 font-bold cursor-pointer transition ${checkoutForm.payment_method === 'COD' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200'}`}><Wallet size={13} /> <span>COD (Cash/UPI)</span></button>
                  <button type="button" onClick={() => setCheckoutData(prev => ({ ...prev, payment_method: 'ONLINE' }))} className={`p-3 rounded-xl border flex items-center justify-center space-x-1.5 font-bold cursor-pointer transition ${checkoutForm.payment_method === 'ONLINE' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200'}`}><CreditCard size={13} /> <span>Razorpay Secure</span></button>
                </div>
              </div>

              <button type="submit" style={{ backgroundColor: storeMeta.theme_color }} className="w-full text-white font-black py-3 rounded-xl shadow flex items-center justify-center space-x-1 cursor-pointer">
                <span>Place Order (₹{getFinalPayableAmount()})</span> <ChevronRight size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center space-y-4 text-xs shadow-2xl">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border"><CheckCircle2 size={30} /></div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Order Registered Successfully!</h3>
            <p className="text-slate-400 font-medium">Order successfully place ho gaya hai!</p>
            <div className="bg-[#f4fbf7] p-3 text-left border rounded-xl space-y-1 font-bold">
              <p>Target Mohalla: <span className="text-slate-900 font-mono">{activeSelectedAddressObj?.mohalla}</span></p>
              <p>Net Bill: <span className="text-emerald-700">₹{orderSuccess.total}</span></p>
            </div>
            <button onClick={() => setOrderSuccess(null)} style={{ backgroundColor: storeMeta.theme_color }} className="w-full text-white py-2.5 rounded-xl font-black shadow">Back To Storefront</button>
          </div>
        </div>
      )}

    </div>
  );
}