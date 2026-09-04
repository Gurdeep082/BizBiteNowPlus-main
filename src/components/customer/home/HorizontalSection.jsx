import CompactProductCard from "./CompactProductCard";

const HorizontalSection = ({
  title,
  subtitle,
  buttonText = "View All",
  onViewAll,
  products = [],
  cartItems = [],
  favouriteProducts = [],
  onProductClick,
  onFavourite,
  onAdd,
  onIncrease,
  onDecrease,
}) => {
  if (!products.length) return null;

  return (
    <section className="space-y-4 pl-3 pr-3">
      {/* Header */}

      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="
              text-sm
              font-semibold
              transition
              hover:opacity-80
              text-[var(--primary)]
              dark:text-white
            "
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* Horizontal Scroll */}

      <div
        className="
          flex
          gap-4
          overflow-x-auto
          pb-2
          scrollbar-hide

          snap-x
          snap-mandatory
        "
      >
        {products.map((product) => {
          const quantity =
            cartItems.find((item) => {
              const pid =
                typeof item.product_id === "object"
                  ? item.product_id?._id
                  : (item.product_id ?? item.productId ?? item.product?._id);
              return pid === product.id;
            })?.quantity || 0;

          const favourite = favouriteProducts.some(
            (item) => item.id === product.id,
          );

          return (
            <div
              key={product.id}
              className="snap-start"
            >
              <CompactProductCard
                product={product}
                quantity={quantity}
                isFavourite={favourite}
                onClick={() =>
                  onProductClick?.(product)
                }
                onFavourite={() =>
                  onFavourite?.(product.id)
                }
                onAdd={() => onAdd?.(product)}
                onIncrease={() =>
                  onIncrease?.(product)
                }
                onDecrease={() =>
                  onDecrease?.(product)
                }
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HorizontalSection;