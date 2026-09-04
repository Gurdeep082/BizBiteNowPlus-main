import {
  Bike,
  Phone,
  MessageCircle,
  MapPin,
} from "lucide-react";

const ContactDeliveryCard = ({
  order,
}) => {
  const partner =
    order?.deliveryPartner ||
    order?.deliveryBoy ||
    {};

  return (
    <div
      className="
        rounded-3xl

        bg-white
        p-4

      "
    >


      {/* Buttons */}

      <div className="mt-5 ">

   {order?.status === "Out for Delivery" && (
<div className="mt-5 flex justify-center">
  <button
    className="
      flex
      w-60
      items-center
      justify-center
      gap-2
      rounded-xl
      bg-green-900
      py-3
      text-sm
      font-semibold
      text-white
      transition
      hover:bg-green-800
    "
  >
    <Phone size={18} />
    Contact Delivery Partner
  </button>
</div>
   )}



      </div>
    </div>
  );
};

export default ContactDeliveryCard;