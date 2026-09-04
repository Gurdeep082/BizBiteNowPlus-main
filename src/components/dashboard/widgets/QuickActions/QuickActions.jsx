import DashboardWidget from "../../DashboardWidget";
import QuickActionCard from "./QuickActionCard";
import { QUICK_ACTIONS } from "./actions.js";

const QuickActions = () => {
  return (
    <DashboardWidget
      title="Action Center"
      subtitle="Frequently used shortcuts"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard
            key={action.id}
            action={action}
          />
        ))}
      </div>
    </DashboardWidget>
  );
};

export default QuickActions;