import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  Crown,
  MapPin,
  Pencil,
} from "lucide-react";

import Card from "../common/Card";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import PrimaryButton from "../common/PrimaryButton";

const ProfileCard = ({
  user,
  onEdit,
  onAvatarChange,
}) => {
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card
        padding="none"
        className="overflow-hidden"
      >
        {/* Cover */}

        <div
          className="
            relative
            h-40
            overflow-hidden
          "
          style={{
            background:
              "linear-gradient(135deg,var(--primary),#111827)",
          }}
        >
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />

          <div className="absolute -bottom-2 -left-8 h-36 w-36 rounded-full bg-white/10" />
        </div>

        {/* Profile */}

        <div className="relative px-6 pb-6">
          {/* Avatar */}

          <div className="-mt-16 flex flex-col items-center">
            <Avatar
              src={user.avatar}
              alt={user.name}
              name={user.name}
              size="xl"
              editable
              onChange={onAvatarChange}
            />

            <h2 className="mt-5 text-center text-3xl font-bold text-slate-900">
              {user.name}
            </h2>

            <Badge
              variant="premium"
              className="mt-3"
            >
              <Crown size={15} />

              {user.membership}
            </Badge>
          </div>

          {/* Information */}

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <InfoItem
              icon={<Mail size={18} />}
              title="Email"
              value={user.email}
            />

            <InfoItem
              icon={<Phone size={18} />}
              title="Phone"
              value={user.phone}
            />

            <InfoItem
              icon={<Calendar size={18} />}
              title="Member Since"
              value={user.joined}
            />

            <InfoItem
              icon={<MapPin size={18} />}
              title="City"
              value={user.city}
            />
          </div>

          {/* Edit */}

          <div className="mt-8">
            <PrimaryButton
              fullWidth
              icon={Pencil}
              onClick={onEdit}
            >
              Edit Profile
            </PrimaryButton>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

function InfoItem({
  icon,
  title,
  value,
}) {
  return (
    <Card
      shadow="none"
      className="bg-slate-50"
    >
      <div className="flex items-center gap-4">
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            text-white
          "
          style={{
            background: "var(--primary)",
          }}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-500">
            {title}
          </p>

          <h4 className="truncate font-semibold text-slate-900">
            {value}
          </h4>
        </div>
      </div>
    </Card>
  );
}

export default ProfileCard;