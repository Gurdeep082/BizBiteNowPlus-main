import { Gift, Plus, Sparkles } from "lucide-react";
import Card from "../../../components/UI/Card";
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import EmptyState from "../../../components/UI/EmptyState";

export default function FestiveEmptyState({ search = "", onCreate }) {
  const isSearching = search.trim().length > 0;

  if (isSearching) {
    return (
      <EmptyState
        icon={Gift}
        title="No Matching Festive Menus"
        description="We couldn't find any festive menu matching your search or filters. Try changing the keywords or filters."
      />
    );
  }

  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50">
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#F4A300]/20 text-[#F4A300] shadow-sm">
          <Gift size={44} />
        </div>

        <Typography variant="h3" className="mt-8 tracking-tight text-slate-900">
          No Festive Menus Yet
        </Typography>

        <Typography variant="small" weight="medium" className="mt-4 max-w-xl leading-relaxed text-slate-500">
          Create beautiful seasonal menus for festivals like Diwali, Christmas, Eid, New Year, Valentine's Day and more. Schedule them to go live automatically and delight your customers.
        </Typography>

        <div className="mt-10 grid w-full max-w-3xl gap-4 md:grid-cols-3">
          <Card padding="p-6" hover={true} className="text-left">
            <Sparkles size={24} className="mb-4 text-[#F4A300]" />
            <Typography variant="h6" className="text-sm">Beautiful Themes</Typography>
            <Typography variant="small" weight="medium" className="mt-2 text-xs leading-relaxed">
              Customize festive branding, banners, colors and product highlights.
            </Typography>
          </Card>
          <Card padding="p-6" hover={true} className="text-left">
            <Gift size={24} className="mb-4 text-emerald-500" />
            <Typography variant="h6" className="text-sm">Festival Specials</Typography>
            <Typography variant="small" weight="medium" className="mt-2 text-xs leading-relaxed">
              Offer limited-time festive combos, discounts and exclusive products.
            </Typography>
          </Card>
          <Card padding="p-6" hover={true} className="text-left">
            <Plus size={24} className="mb-4 text-blue-500" />
            <Typography variant="h6" className="text-sm">Auto Schedule</Typography>
            <Typography variant="small" weight="medium" className="mt-2 text-xs leading-relaxed">
              Publish and revert menus automatically without manual work.
            </Typography>
          </Card>
        </div>

        <Button
          variant="secondary"
          onClick={onCreate}
          className="mt-10 !h-12 !px-8 shadow-md"
        >
          <Plus size={18} />
          Create Festive Menu
        </Button>
      </div>
    </div>
  );
}