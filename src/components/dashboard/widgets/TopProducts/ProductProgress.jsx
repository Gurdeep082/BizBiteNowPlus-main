const ProductProgress = ({ value }) => {
  const progress = Math.min(value, 100);

  return (
    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full bg-[#1A4D2E] transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProductProgress;