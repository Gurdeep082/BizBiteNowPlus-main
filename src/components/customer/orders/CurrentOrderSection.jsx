const CurrentOrderSection = ({
  title,
  subtitle,
  children,
}) => {
  if (!children) return null;

  return (
    <section className="space-y-4 px-3">
      {/* Header */}

      {(title || subtitle) && (
        <div>
          {title && (
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Horizontal Scroll */}

      <div
        className="
    flex
    gap-4
    overflow-x-auto
    snap-x
    snap-mandatory
    scrollbar-hide
    pb-2
  "
      >
        {children}
      </div>
    </section>
  );
};

export default CurrentOrderSection;