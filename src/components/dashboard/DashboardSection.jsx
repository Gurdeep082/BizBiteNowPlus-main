import Card from "../UI/Card";

const DashboardSection = ({
  title,
  subtitle,
  action,
  children,
  className = "",
}) => {
  return (
    <Card className={`h-full ${className}`}>
      {(title || subtitle || action) && (
        <div className="mb-6 flex items-start justify-between">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-[#1A4D2E]">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>

          {action}
        </div>
      )}

      {children}
    </Card>
  );
};

export default DashboardSection;