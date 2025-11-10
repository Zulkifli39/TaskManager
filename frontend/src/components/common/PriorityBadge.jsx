import React from "react";

const PRIORITY_STYLES = {
  Low: "bg-green-100 text-green-700 border border-green-200",
  Medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  High: "bg-red-100 text-red-700 border border-red-200",
};

const PriorityBadge = ({ priority }) => {
  const style =
    PRIORITY_STYLES[priority] ||
    "bg-gray-100 text-gray-600 border border-gray-200";

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-full ${style}`}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
