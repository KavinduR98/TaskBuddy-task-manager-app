import React from "react";

const StatCard = ({ label, value, bg }) => {
  return (
    <div className="flex items-center justify-start gap-2 mb-2">
      <span className={`w-2 h-6 rounded-sm ${bg}`}></span>
      <p className="text-sm font-bold">{value}</p>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

export default StatCard;
