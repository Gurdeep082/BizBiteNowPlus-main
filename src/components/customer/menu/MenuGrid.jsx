const MenuGrid = ({
  children,
  columns = "auto",
  className = "",
}) => {
  const gridColumns = {
    auto: `
      grid-cols-2
      sm:grid-cols-3
      lg:grid-cols-4
      2xl:grid-cols-6
    `,

    two: `
      grid-cols-2
    `,

    three: `
      grid-cols-3
    `,

    four: `
      grid-cols-4
    `,
  };

  return (
    <section
      className={`
        grid
        gap-3

        ${gridColumns[columns] || gridColumns.auto}

        ${className}
      `}
    >
      {children}
    </section>
  );
};

export default MenuGrid;