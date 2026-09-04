import { CalendarHeart, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";
import Badge from "../../../components/UI/Badge";

const FestiveHeader = ({ onCreate }) => {
  const navigate = useNavigate();
  return (
    <Card padding="p-6" className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between shadow-sm">
      <div className="text-left">
        <Badge variant="warning" size="sm" className="mb-2 !bg-orange-100 !text-orange-700 !border-0 uppercase tracking-wide">
          <CalendarHeart size={16} className="mr-1.5 text-orange-600" />
          Plus Feature
        </Badge>

        <Typography variant="h2" className="text-3xl">
          Festive & Special Menu
        </Typography>

        <Typography variant="p" className="mt-2 max-w-3xl leading-7">
          Create festival-specific menus, schedule automatic activation, switch
          back to your regular menu automatically, manage previous festive menus
          and duplicate last year's menu in one click.
        </Typography>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onClick={() => navigate("/seller/festivemenu/history")}
          className="!h-11 !px-5 !border-slate-200 !text-slate-700 hover:!border-[#1A4D2E] hover:!text-[#1A4D2E]"
        >
          View History
        </Button>

        <Button
          variant="primary"
          onClick={onCreate}
          className="!h-11 !px-5"
        >
          <Plus size={18} />
          Create Festive Menu
        </Button>
      </div>
    </Card>
  );
};

export default FestiveHeader;