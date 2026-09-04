const SectionTitle = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-3xl font-bold text-black">
          {title}
        </h2>

        {subtitle && (
          <p className="text-black mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {action}
    </div>
  );
};

export default SectionTitle;