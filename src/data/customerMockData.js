import chocoLavaCake from "../assets/choco-lava-cake.jpg";

const image = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const MOCK_SELLER_ID = "mock-bizbite-store";

export const mockProducts = [
  ["mock-1", "Truffle Mushroom Pizza", "A crisp sourdough base with wild mushrooms, truffle oil, and mozzarella.", 499, "Pizza", "photo-1513104890138-7c749659a591"],
  ["mock-2", "Smoky Paneer Tikka Pizza", "Tandoori paneer, roasted peppers, onion, and our smoky masala sauce.", 429, "Pizza", "photo-1594007654729-407eedc4be65"],
  ["mock-3", "Garden Pesto Pizza", "Basil pesto, cherry tomatoes, olives, and creamy bocconcini.", 449, "Pizza", "photo-1552539618-7eec9b4d1796"],
  ["mock-4", "Classic Margherita", "San Marzano tomato, fresh basil, and a generous layer of cheese.", 329, "Pizza", "photo-1574071318508-1cdbab80d002"],
  ["mock-5", "Crispy Chicken Burger", "Buttermilk fried chicken, pickles, lettuce, and house burger sauce.", 289, "Burgers", "photo-1568901346375-23c9450c58cd"],
  ["mock-6", "Smashhouse Double", "Two caramelized patties, American cheese, onions, and signature sauce.", 349, "Burgers", "photo-1550547660-d9450f859349"],
  ["mock-7", "Peri Peri Fries", "Golden fries tossed with house peri peri seasoning and lime.", 159, "Sides", "photo-1576107232684-1279f390859f"],
  ["mock-8", "Loaded Cheese Fries", "Fries covered in cheddar sauce, jalapenos, and spring onion.", 219, "Sides", "photo-1585109649139-366815a0d713"],
  ["mock-9", "Chipotle Rice Bowl", "Mexican rice, black beans, corn salsa, avocado, and chipotle crema.", 319, "Bowls", "photo-1546793665-c74683f339c1"],
  ["mock-10", "Korean Crunch Bowl", "Sticky gochujang tofu, sesame greens, rice, and pickled cucumber.", 339, "Bowls", "photo-1547592180-85f173990554"],
  ["mock-43", "Dal Makhani", "Slow-cooked black lentils finished with butter, cream, and aromatic spices.", 220, "Main Course", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPeHzAaKI1kLjjI_MbNXJYgnakwOekCFonPoqhwgTSyTZMQ05YvrdYBbfd&s=10"],
  ["mock-44", "Butter Chicken", "Tender chicken simmered in a rich, buttery tomato gravy.", 320, "Main Course", "photo-1603894584373-5ac82b2ae398"],
  ["mock-45", "Mutton Rara", "Slow-cooked mutton in a rich onion, tomato, and whole-spice gravy.", 380, "Main Course", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIquCAPDKeblmDQMasFvfeKMG0fJdZtulnTIcFtG8i5T8Bj1dD9Lk9WZIf&s=10"],
  ["mock-46", "Mutton Curry", "Tender mutton cooked slowly in a fragrant, homestyle curry.", 360, "Main Course", "photo-1596797038530-2c107229654b"],
  ["mock-47", "Garlic Naan", "Soft, oven-baked naan topped with garlic, herbs, and a lightly crisped finish.", 59, "Main Course", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEGgK4BZuIfF0SsMdE39nxbIEFuxz9LUXy7yoZGx2C0C9QezAxBHdI4MY&s=10"],
  ["mock-48", "Butter Naan", "Soft naan brushed with melted butter and baked fresh to order.", 69, "Main Course", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmTaQLwccHiDnIH-ZnyxtXyGvV1OedS5VfT1-rIovxpcEe5Nb3sd9U9U4&s=10"],
  ["mock-49", "Missi Roti", "Rustic gram flour and wheat flatbread seasoned with herbs and spices.", 59, "Main Course", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiIk-hDznhKaCVkjwrfqr_HHOCqsgeEYohhie4wxIKF-VE3zzPtGO_NqsD&s=10"],
  ["mock-11", "Mango Mint Cooler", "Fresh mango, mint, lime, and a little fizz.", 129, "Drinks", "photo-1546173159-315724a31696"],
  ["mock-12", "Cold Brew Tonic", "Slow-steeped coffee brightened with citrus tonic.", 149, "Drinks", "photo-1517701604599-bb29b565090c"],
  ["mock-13", "Chocolate Lava Cake", "Warm chocolate cake with a molten center.", 199, "Desserts", "LOCAL_LAVA_CAKE"],
  ["mock-14", "Berry Cheesecake Jar", "Silky cheesecake, berry compote, and a biscuit crumb.", 229, "Desserts", "photo-1565958011703-44f9829ba187"],
  ["mock-15", "Cinnamon Churros", "Crisp churros with cinnamon sugar and dark chocolate dip.", 179, "Desserts", "photo-1624371414361-e670edf4898d"],
  ["mock-16", "Veg Supreme Burger", "Crispy vegetable patty with lettuce, tomato, onion, and cheese.", 219, "Burgers", "photo-1550317138-10000687a72b"],
  ["mock-17", "BBQ Chicken Sandwich", "Grilled chicken breast with smoky BBQ sauce and crunchy slaw.", 269, "Burgers", "photo-1520072959219-c595dc870360"],
  ["mock-32", "Grilled Chicken Burger", "Juicy grilled chicken patty with lettuce, tomato, onion, and smoky sauce.", 299, "Burgers", "photo-1553979459-d2229ba7433b"],
  ["mock-33", "Classic Veg Burger", "Crispy vegetable patty with fresh salad, cheese, and burger sauce.", 199, "Burgers", "photo-1594212699903-ec8a3eca50f5"],
  ["mock-34", "Paneer Tikka Burger", "Spiced paneer tikka, crunchy onions, lettuce, and mint mayo in a toasted bun.", 249, "Burgers", "photo-1568901346375-23c9450c58cd"],
  ["mock-35", "Cheese Corn Burger", "Golden corn and vegetable patty layered with melted cheese and fresh salad.", 229, "Burgers", "photo-1572802419224-296b0aeee0d9"],
  ["mock-18", "Cheese Burst Pizza", "Loaded with extra cheese and a buttery crust stuffed with mozzarella.", 539, "Pizza", "https://cdn.uengage.io/uploads/66344/image-PSXADT-1772017531.png"],
  ["mock-19", "Paneer Tikka Pizza", "Smoky paneer cubes, peppers, onions, and tandoori sauce.", 469, "Pizza", "photo-1534308983496-4fabb1a015ee"],
  ["mock-20", "Veggie Supreme Pasta", "Pasta tossed with seasonal vegetables, herbs, garlic, and pesto sauce.", 289, "Pasta", "photo-1555949258-eb67b1ef0ceb"],
  ["mock-21", "Chicken Alfredo Pasta", "Creamy Alfredo sauce with grilled chicken, parmesan, and herbs.", 329, "Pasta", "photo-1621996346565-e3dbc646d9a9"],
  ["mock-22", "Lemon Iced Tea", "Fresh lemon-infused iced tea with a zesty citrus finish.", 119, "Drinks", "photo-1497534446932-c925b458314e"],
  ["mock-23", "Strawberry Shake", "Creamy strawberry shake blended with fresh fruit and ice cream.", 169, "Drinks", "photo-1572490122747-3968b75cc699"],
  ["mock-36", "Fanta", "Chilled orange soda with a bright, refreshing citrus flavour.", 79, "Beverages", "https://mir-s3-cdn-cf.behance.net/project_modules/1400/f3f5e5121277365.60c24befd4606.jpg"],
  ["mock-37", "Coca-Cola", "Classic chilled cola with a crisp, refreshing finish.", 79, "Beverages", "https://t4.ftcdn.net/jpg/05/82/97/27/360_F_582972760_T0T4qTwlZDolGql8CJaD1kMIPrG4vIew.jpg"],
  ["mock-38", "Mojito", "Refreshing mint and lime cooler served chilled with a sparkling finish.", 129, "Beverages", "photo-1551024709-8f23befc6f87"],
  ["mock-39", "Diet Coke", "Light and refreshing cola with zero sugar.", 89, "Beverages", "https://a.storyblok.com/f/102932/1240x697/855e00e321/diet-coke-the-devil-wears-prada-2-ogilvy.jpg"],
  ["mock-40", "Sprite", "Chilled lemon-lime soda with a clean, sparkling taste.", 79, "Beverages", "https://t4.ftcdn.net/jpg/07/28/12/49/360_F_728124950_3PqKu72phocmQHgwPw38C3vPanyWc1wO.jpg"],
  ["mock-41", "Mountain Dew", "Bold citrus soda served ice-cold for an energetic refreshment.", 89, "Beverages", "https://t4.ftcdn.net/jpg/03/94/42/45/360_F_394424569_8nb37jmFz6vHTknvC6IvhK9xxFUeWqeU.jpg"],
  ["mock-42", "Red Bull", "Energy drink with a crisp taste to keep you going.", 149, "Beverages", "https://media.istockphoto.com/id/458735615/photo/red-bull-can-in-ice.jpg?s=612x612&w=0&k=20&c=pbHCB92pg_LkYRiWPMLI6nYWO2sefI7tmPwZLmQxSQA="],
  ["mock-24", "Red Velvet Cupcake", "Soft red velvet cupcake with smooth cream cheese frosting.", 129, "Desserts", "photo-1486427944299-d1955d23e34d"],
  ["mock-25", "Fudge Brownie", "Dense and rich chocolate brownie topped with cocoa dust.", 149, "Desserts", "photo-1606313564200-e75d5e30476c"],
  ["mock-26", "Samosa", "Crispy golden samosa stuffed with spiced potato and peas.", 79, "Snacks", "photo-1601050690597-df0568f70950"],
  ["mock-27", "Paneer Pakoda", "Crispy paneer cubes marinated in spices and gram flour batter.", 149, "Snacks", "https://sinfullyspicy.com/wp-content/uploads/2021/11/1200-by-1200-images.jpg"],
  ["mock-28", "Mix Pakoda", "A crisp mix of onion, potato, chilli, and gram flour fritters.", 139, "Snacks", "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2019/1/07/0/FNK_Mixed-Vegetable-Pakoras_s4x3.jpg.rend.hgtvcom.616.462.suffix/1546894450671.webp"],
  ["mock-29", "Vada Pav", "Mumbai-style potato vada in a soft pav with chutneys and chilli.", 89, "Snacks", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZe0hkrA6757JsjiPN0YbbIA9DnaroY6L3KBzHVOTuCaz0EYb_DBJVq0V0&s=10"],
  ["mock-30", "Cheese Garlic Bread", "Toasted bread topped with garlic butter and melted mozzarella cheese.", 179, "Snacks", "https://media.istockphoto.com/id/1441714834/photo/fresh-garlic-bread-with-cheese-and-spices-on-the-wooden-table.jpg?s=612x612&w=0&k=20&c=5hWb8Az0zutl1UDoiqm6MIFSa1fHJLje1pw7eQagAcI="],
  ["mock-31", "Veg Roll", "Crispy vegetable rolls with crunchy veggies and a savoury, homestyle filling.", 129, "Snacks", "https://media.istockphoto.com/id/486940812/photo/baked-spring-rolls-with-deep-vegetables-and-rice.jpg?s=612x612&w=0&k=20&c=rQ5NCxvLHt8zhO3oXFCU8QCfoVG_94jKTMWjti05Bso="],
].map(([id, name, description, price, category, photo], index) => ({
  _id: id,
  id,
  name,
  description,
  price,
  category,
  image: photo === "LOCAL_LAVA_CAKE" ? chocoLavaCake : /^https?:\/\//i.test(photo) ? photo : image(photo, 700),
  isVeg: !["Crispy Chicken Burger", "Smashhouse Double", "BBQ Chicken Sandwich", "Grilled Chicken Burger", "Butter Chicken", "Mutton Rara", "Mutton Curry"].includes(name),
  is_available: true,
  is_combo: index === 1 || index === 8,
  rating: Number((4.5 + (index % 5) / 10).toFixed(1)),
  review_count: 42 + index * 17,
  variants: category === "Pizza" ? [{ name: "Regular", price_delta: 0 }, { name: "Large", price_delta: 120 }] : [],
}));

export const mockFestiveDeals = [
  { _id: "deal-weekend", title: "Weekend Feast", description: "Save 20% on any two mains and a side.", code: "FEAST20", discount_type: "percentage", discount_value: 20, min_order_value: 599, end_date: "2027-12-31", banner_image: image("photo-1547592180-85f173990554", 1200), applies_to_all_products: true },
  { _id: "deal-combo", title: "Pizza Night Combo", description: "Two pizzas, one side, and two coolers for ₹899.", code: "PIZZANIGHT", discount_type: "fixed", discount_value: 180, min_order_value: 899, end_date: "2027-12-31", banner_image: image("photo-1574071318508-1cdbab80d002", 1200), applicable_products: [mockProducts[0], mockProducts[4], mockProducts[6], mockProducts[10]] },
];

export const mockBanners = [
  { _id: "banner-1", tag: "NEW MENU", title: "Big flavour, zero fuss", subtitle: "Freshly made favourites for the table", image_url: image("photo-1513104890138-7c749659a591", 1200), cta_text: "Explore menu" },
  { _id: "banner-2", tag: "LIMITED TIME", title: "Your midweek mood fix", subtitle: "Comfort food delivered with 15% off", image_url: image("photo-1568901346375-23c9450c58cd", 1200), cta_text: "View offer" },
];

export const mockCategoryImages = {
  All: image("photo-1513104890138-7c749659a591", 400),
  Pizza: image("photo-1574071318508-1cdbab80d002", 400),
  Burgers: image("photo-1568901346375-23c9450c58cd", 400),
  Sides: image("photo-1576107232684-1279f390859f", 400),
  Snacks: image("photo-1573080496219-bb080dd4f877", 400),
  "Main Course": image("photo-1546833999-b9f581a1996d", 400),
  Beverages: image("photo-1544145945-f90425340c7e", 400),
  Bowls: image("photo-1512621776951-a57141f2eefd", 400),
  Drinks: image("photo-1546173159-315724a31696", 400),
  Beverages: image("photo-1546173159-315724a31696", 400),
  Desserts: image("photo-1565958011703-44f9829ba187", 400),
};

export const mockDiscounts = [
  { _id: "discount-1", title: "First Bite", code: "BITE15", description: "15% off your first order", discount_type: "percentage", discount_value: 15, min_order_value: 399, valid_until: "2027-12-31", is_active: true, usage_limit_total: 1000, used_count: 120 },
  { _id: "discount-2", title: "Free Delivery", code: "EASYDEL", description: "Free delivery on orders above ₹699", discount_type: "fixed", discount_value: 60, min_order_value: 699, valid_until: "2027-12-31", is_active: true },
];

export const mockTables = Array.from({ length: 8 }, (_, index) => ({ _id: `table-${index + 1}`, table_number: index + 1, is_active: true, display_url: `/order/mock-table-${index + 1}` }));

export const mockOrders = [
  { _id: "order-1008", order_number: "BBN-1008", delivery_status: "preparing", total_amount: 847, createdAt: "2027-03-12T18:20:00.000Z", items: [{ name: "Truffle Mushroom Pizza", quantity: 1 }, { name: "Mango Mint Cooler", quantity: 2 }] },
  { _id: "order-1007", order_number: "BBN-1007", delivery_status: "delivered", total_amount: 629, createdAt: "2027-03-08T13:10:00.000Z", items: [{ name: "Smashhouse Double", quantity: 1 }, { name: "Peri Peri Fries", quantity: 1 }] },
  { _id: "order-1006", order_number: "BBN-1006", delivery_status: "delivered", total_amount: 1099, createdAt: "2027-03-01T19:45:00.000Z", items: [{ name: "Weekend Feast", quantity: 1 }] },
];

export const mockRewardCoupons = [{ coupon_code: "STAMPFREE", discount_type: "percentage", discount_value: 20, description: "A 20% thank-you reward for being a regular." }];
export const mockLoyaltySettings = { target_stamps: 5 };