

export const FESTIVE_VALIDITY_DAYS = {
  diwali: 5,
  eid: 3,
  holi: 2,
  newyear: 7,
};

export const DEFAULT_TEMPLATES = [
  {
    id: "diwali",
    label: "Diwali",
    body:
      "Diwali ki hardik shubhkamnayein! 🪔 Use code {code} for {discount} off your next order. — {shop}\n\nHappy Diwali! Use code {code} for {discount} off your next order.",
  },
  {
    id: "eid",
    label: "Eid",
    body:
      "Eid Mubarak! 🌙 {code} code se aapko milega {discount} off. — {shop}\n\nEid Mubarak! Use code {code} for {discount} off.",
  },
  {
    id: "holi",
    label: "Holi",
    body:
      "Holi hai! 🎨 Rang bhi, offer bhi — {code} se {discount} off. — {shop}\n\nHappy Holi! Use code {code} for {discount} off.",
  },
  {
    id: "newyear",
    label: "New Year",
    body:
      "Naya saal, nayi shuruaat! 🎉 {code} se {discount} off pehle order pe. — {shop}\n\nHappy New Year! Use code {code} for {discount} off your next order.",
  },
  {
    id: "generic",
    label: "Generic",
    body: "Aapke liye khaas offer! Use code {code} for {discount} off your next order. — {shop}",
  },
];

export function fillTemplate(body, { code, shop, discount }) {
  let out = body.replaceAll("{code}", code).replaceAll("{shop}", shop);
  if (discount != null) out = out.replaceAll("{discount}", discount);
  return out;
}