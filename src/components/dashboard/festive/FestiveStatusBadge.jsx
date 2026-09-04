import { CheckCircle2, Clock3, FileText, Archive } from "lucide-react";
import Badge from "../../../components/UI/Badge";

const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    variant: "success",
  },
  scheduled: {
    label: "Scheduled",
    icon: Clock3,
    variant: "warning",
  },
  draft: {
    label: "Draft",
    icon: FileText,
    variant: "secondary",
  },
  expired: {
    label: "Expired",
    icon: Archive,
    variant: "danger",
  },
};

const FestiveStatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} size="md" className="!px-3 !py-1.5 !rounded-full">
      <Icon size={14} className="mr-1.5" />
      {config.label}
    </Badge>
  );
};

export default FestiveStatusBadge;