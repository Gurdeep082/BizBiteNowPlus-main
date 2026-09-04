import Button from "./Button";

const OrderTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex w-full rounded-xl bg-gray-100 p-1 shadow-sm">
      <Button
        variant="outline"
        onClick={() => setActiveTab("new")}
        className={`flex-1 border-0 py-3 rounded-lg ${
          activeTab === "new"
            ? "bg-[#1A4D2E] text-white hover:bg-[#245C39]"
            : "bg-transparent text-black-600 hover:bg-gray-200 hover:text-[#1A4D2E]"
        }`}
      >
        New Orders
      </Button>

      <Button
        variant="outline"
        onClick={() => setActiveTab("completed")}
        className={`flex-1 border-0 py-3 rounded-lg ${
          activeTab === "completed"
            ? "bg-[#1A4D2E] text-white hover:bg-[#245C39]"
            : "bg-transparent text-black-600 hover:bg-gray-200 hover:text-[#1A4D2E]"
        }`}
      >
        Completed Orders
      </Button>
    </div>
  );
};

export default OrderTabs;