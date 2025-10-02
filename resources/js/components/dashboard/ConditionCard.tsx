interface ConditionCardProps {
  title: string;
  value: string;
  status: "optimal" | "warning" | "critical";
  range: string;
}

const ConditionCard = ({ title, value, status, range }: ConditionCardProps) => {
  const statusColors = {
    optimal: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className={`p-3 md:p-4 rounded-lg border ${statusColors[status]}`}>
      <h3 className="font-medium text-xs md:text-sm">{title}</h3>
      <p className="text-lg md:text-2xl font-bold mt-1">{value}</p>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-1 text-xs">
        <span className="truncate">Optimal: {range}</span>
        <span className="capitalize font-medium">{status}</span>
      </div>
    </div>
  );
};

export default ConditionCard;
