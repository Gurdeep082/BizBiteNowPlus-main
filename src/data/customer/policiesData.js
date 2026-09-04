import {
  FileText,
  ShieldCheck,
  RotateCcw,
  Truck,
  Gift,
  Users,
  Copyright,
} from "lucide-react";

export const policies = [
  {
    id: "terms",
    icon: FileText,
    title: "Terms of Service",
    desc: "Read the terms and conditions.",
    lastUpdated: "20 May 2024",
    intro:
      "Welcome to BizBiteNow. By accessing or using our app, website or services, you agree to be bound by the following terms and conditions.",
    sections: [
      {
        title: "Use of Services",
        desc: "You agree to use BizBiteNow only for lawful purposes and in accordance with these Terms.",
      },
      {
        title: "User Accounts",
        desc: "You are responsible for maintaining the confidentiality of your account and for all activities under your account.",
      },
      {
        title: "Orders & Payments",
        desc: "All orders are subject to availability. Prices are inclusive of applicable taxes. We accept Cash on Delivery only.",
      },
      {
        title: "Cancellations",
        desc: "You can cancel your order before it is confirmed by the restaurant. Once confirmed, cancellations are not allowed.",
      },
      {
        title: "Limitation of Liability",
        desc: "BizBiteNow shall not be liable for any indirect, incidental or consequential damages arising from the use of our services.",
      },
    ],
  },
  {
    id: "privacy",
    icon: ShieldCheck,
    title: "Privacy Policy",
    desc: "How we collect and protect your data.",
    lastUpdated: "20 May 2024",
    intro:
      "This Privacy Policy explains how BizBiteNow collects, uses, and safeguards your personal information when you use our app and services.",
    sections: [
      {
        title: "Information We Collect",
        desc: "We collect your name, phone number, delivery address, and order history to provide our services.",
      },
      {
        title: "How We Use Your Data",
        desc: "Your information is used to process orders, improve our services, and send order-related notifications.",
      },
      {
        title: "Data Sharing",
        desc: "We do not sell your personal data. Information is shared only with delivery partners as required to fulfil your order.",
      },
      {
        title: "Your Rights",
        desc: "You can request access to, correction of, or deletion of your personal data at any time from your profile.",
      },
    ],
  },
  {
    id: "refund",
    icon: RotateCcw,
    title: "Refund & Cancellation Policy",
    desc: "Learn about refunds and cancellations.",
    lastUpdated: "20 May 2024",
    intro:
      "This policy outlines when and how refunds are processed, and the conditions under which an order may be cancelled.",
    sections: [
      {
        title: "Eligibility for Refund",
        desc: "Refunds are applicable only for orders that were not delivered, delivered incorrectly, or cancelled before confirmation.",
      },
      {
        title: "Refund Timeline",
        desc: "Approved refunds are processed within 3-5 business days back to the original payment method.",
      },
      {
        title: "Non-Refundable Cases",
        desc: "Orders that have already been prepared or dispatched are not eligible for a refund.",
      },
    ],
  },
  {
    id: "shipping",
    icon: Truck,
    title: "Shipping & Delivery Policy",
    desc: "Delivery process and related policies.",
    lastUpdated: "20 May 2024",
    intro:
      "This policy explains our delivery process, estimated timings, and applicable delivery charges.",
    sections: [
      {
        title: "Delivery Areas",
        desc: "We currently deliver within a limited radius of the restaurant location. Availability is shown at checkout.",
      },
      {
        title: "Delivery Time",
        desc: "Estimated delivery time is 25-35 minutes depending on order volume and distance.",
      },
      {
        title: "Delivery Charges",
        desc: "A delivery fee applies to orders below the free-delivery threshold shown at checkout.",
      },
    ],
  },
  {
    id: "loyalty",
    icon: Gift,
    title: "Terms for Loyalty Program",
    desc: "Stamp system terms and conditions.",
    lastUpdated: "20 May 2024",
    intro:
      "These terms govern your participation in the BizBiteNow rewards and loyalty program.",
    sections: [
      {
        title: "Earning Points",
        desc: "Points are earned on every successful order and credited to your account automatically.",
      },
      {
        title: "Redeeming Rewards",
        desc: "Points can be redeemed for coupons and offers shown on your Rewards page.",
      },
      {
        title: "Expiry",
        desc: "Loyalty points expire 12 months after they are earned if not redeemed.",
      },
    ],
  },
  {
    id: "conduct",
    icon: Users,
    title: "Content & User Conduct",
    desc: "User behavior and content guidelines.",
    lastUpdated: "20 May 2024",
    intro:
      "These guidelines describe acceptable behaviour and content when using BizBiteNow's reviews, ratings, and support channels.",
    sections: [
      {
        title: "Respectful Communication",
        desc: "Abusive, threatening, or discriminatory language towards staff or delivery partners is not tolerated.",
      },
      {
        title: "Genuine Reviews",
        desc: "Reviews and ratings must reflect a genuine experience with the restaurant or order.",
      },
    ],
  },
  {
    id: "ip",
    icon: Copyright,
    title: "Intellectual Property",
    desc: "Ownership of content and trademarks.",
    lastUpdated: "20 May 2024",
    intro:
      "All content, logos, and trademarks on BizBiteNow are the property of BizBiteNow and its licensors.",
    sections: [
      {
        title: "Ownership",
        desc: "The BizBiteNow name, logo, and app design are protected trademarks and may not be used without permission.",
      },
      {
        title: "Restricted Use",
        desc: "You may not copy, modify, or distribute any part of our app or content without prior written consent.",
      },
    ],
  },
];
