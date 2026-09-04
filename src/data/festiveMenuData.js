export const festiveMenuData = [
  {
    id: 1,
    name: "Diwali Special Menu",
    festival: "Diwali",
    banner:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",

    description:
      "Special sweets, snacks and festive combos for Diwali.",

    status: "active",

    totalProducts: 18,

    totalCombos: 6,

    createdOn: "2026-09-18",

    goLive: "2026-10-20T08:00",

    endsOn: "2026-10-27T23:59",

    revenue: 128400,

    orders: 462,
  },

  {
    id: 2,

    name: "Christmas Feast",

    festival: "Christmas",

    banner:
      "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800",

    description:
      "Family meals, cakes and winter beverages.",

    status: "scheduled",

    totalProducts: 24,

    totalCombos: 8,

    createdOn: "2026-11-25",

    goLive: "2026-12-20T09:00",

    endsOn: "2026-12-27T23:59",

    revenue: 0,

    orders: 0,
  },

  {
    id: 3,

    name: "Holi Celebration",

    festival: "Holi",

    banner:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800",

    description:
      "Festival colours with sweets and special drinks.",

    status: "draft",

    totalProducts: 14,

    totalCombos: 4,

    createdOn: "2026-02-15",

    goLive: "",

    endsOn: "",

    revenue: 0,

    orders: 0,
  },

  {
    id: 4,

    name: "Eid Delights",

    festival: "Eid",

    banner:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",

    description:
      "Traditional Eid meals and desserts.",

    status: "expired",

    totalProducts: 20,

    totalCombos: 7,

    createdOn: "2026-03-05",

    goLive: "2026-03-20T10:00",

    endsOn: "2026-03-31T23:59",

    revenue: 98400,

    orders: 358,
  },
];

export const festiveStats = {
  totalMenus: festiveMenuData.length,

  active: festiveMenuData.filter(
    (menu) => menu.status === "active"
  ).length,

  scheduled: festiveMenuData.filter(
    (menu) => menu.status === "scheduled"
  ).length,

  draft: festiveMenuData.filter(
    (menu) => menu.status === "draft"
  ).length,

  expired: festiveMenuData.filter(
    (menu) => menu.status === "expired"
  ).length,
};

export const festiveStatus = [
  "All",
  "active",
  "scheduled",
  "draft",
  "expired",
];