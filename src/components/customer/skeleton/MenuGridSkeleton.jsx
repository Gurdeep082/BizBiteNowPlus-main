import ProductCardSkeleton from "./ProductCardSkeleton";

const MenuGridSkeleton = ({
  count = 12,
}) => {
  return (
    <div
      className="
        hidden
        lg:grid

        grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5

        gap-6
      "
    >
      {Array.from({
        length: count,
      }).map((_, index) => (
        <ProductCardSkeleton
          key={index}
        />
      ))}
    </div>
  );
};

export default MenuGridSkeleton;