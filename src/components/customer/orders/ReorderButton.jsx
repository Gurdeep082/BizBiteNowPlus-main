import { RotateCcw } from "lucide-react";

const ReorderButton = ({
  onReorder,
}) => {
  return (
    <button
      onClick={onReorder}
      className="
        flex
        items-center
        gap-2

        rounded-2xl

        px-5
        py-3

        font-semibold

        text-white

        transition

        hover:scale-[1.02]
      "
      style={{
        background:
          "var(--primary)",
      }}
    >
      <RotateCcw size={18} />

      Reorder
    </button>
  );
};

export default ReorderButton;