const img = (id) =>
  `https://images.unsplash.com/photo-${id}?w=400&auto=format&fit=crop&q=80`;

export const categories = [
  {
    id: 1,
    name: "Starters",
    products: [
      {
        id: 1,
        name: "Paneer Tikka",
        price: 180,
        description:
          "Grilled cottage cheese marinated in aromatic spices, served with mint chutney.",
        image: img("1666001120694-3ebe8fd207be"),
        category: "Starters",
        isVeg: true,
      },
      {
        id: 2,
        name: "Veg Spring Rolls",
        price: 120,
        description:
          "Crispy golden rolls filled with mixed vegetables and glass noodles.",
        image: img("1695712641569-05eee7b37b6d"),
        category: "Starters",
        isVeg: true,
      },
      {
        id: 3,
        name: "Samosa (2 pcs)",
        price: 60,
        description: "Classic fried pastry filled with spiced potato and peas.",
        image: img("1601050690597-df0568f70950"),
        category: "Starters",
        isVeg: true,
      },
      {
        id: 11,
        name: "Chicken Seekh Kebab",
        price: 240,
        description:
          "Skewered minced chicken grilled with roasted spices and herbs.",
        image: img("1555939594-58d7cb561ad1"),
        category: "Starters",
        isVeg: false,
      },
      {
        id: 12,
        name: "Fish Amritsari",
        price: 260,
        description:
          "Crispy fried fish fillets marinated in a tangy spiced batter.",
        image: img("1579208030886-b937da0925dc"),
        category: "Starters",
        isVeg: false,
      },
    ],
  },
  {
    id: 2,
    name: "Main Course",
    products: [
      {
        id: 4,
        name: "Dal Makhani",
        price: 220,
        description:
          "Slow cooked black lentils simmered overnight in a rich buttery gravy.",
        image: img("1505253758473-96b7015fcd40"),
        category: "Main Course",
        isVeg: true,
      },
      {
        id: 5,
        name: "Paneer Butter Masala",
        price: 260,
        description:
          "Soft cottage cheese cubes in a creamy, mildly spiced tomato sauce.",
        image: img("1585937421612-70a008356fbe"),
        category: "Main Course",
        isVeg: true,
      },
      {
        id: 6,
        name: "Veg Biryani",
        price: 200,
        description:
          "Fragrant basmati rice layered with spiced seasonal vegetables.",
        image: img("1697155406055-2db32d47ca07"),
        category: "Main Course",
        isVeg: true,
      },
      {
        id: 7,
        name: "Chole Bhature",
        price: 150,
        description:
          "Spicy Punjabi chickpea curry served with fluffy deep-fried bread.",
        image: img("1666190092159-3171cf0fbb12"),
        category: "Main Course",
        isVeg: true,
      },
      {
        id: 13,
        name: "Butter Chicken",
        price: 320,
        description:
          "Tandoori chicken simmered in a rich, buttery tomato gravy.",
        image: img("1603894584373-5ac82b2ae398"),
        category: "Main Course",
        isVeg: false,
      },
      {
        id: 14,
        name: "Egg Curry",
        price: 180,
        description: "Boiled eggs cooked in a spiced onion-tomato masala.",
        image: img("1764315197254-94385571df22"),
        category: "Main Course",
        isVeg: false,
      },
      {
        id: 15,
        name: "Mutton Rogan Josh",
        price: 380,
        description:
          "Slow braised mutton in an aromatic Kashmiri red chilli gravy.",
        image: img("1596797038530-2c107229654b"),
        category: "Main Course",
        isVeg: false,
      },
    ],
  },
  {
    id: 3,
    name: "Desserts",
    products: [
      {
        id: 8,
        name: "Gulab Jamun",
        price: 80,
        description:
          "Soft milk solid dumplings soaked in rose-flavoured sugar syrup.",
        image: img("1551024601-bec78aea704b"),
        category: "Desserts",
        isVeg: true,
      },
      {
        id: 9,
        name: "Rasgulla",
        price: 70,
        description:
          "Light spongy cottage cheese balls dipped in chilled sugar syrup.",
        image: img("1714799263412-2e0c1f875959"),
        category: "Desserts",
        isVeg: true,
      },
      {
        id: 10,
        name: "Kheer",
        price: 90,
        description:
          "Creamy slow-cooked rice pudding with cardamom and dry fruits.",
        image: img("1590055619273-44b5b6ce52e8"),
        category: "Desserts",
        isVeg: true,
      },
    ],
  },
];

export const allProducts = categories.flatMap((c) => c.products);
