import React from "react";

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "In Progress": "bg-blue-100 text-blue-700 border border-blue-200",
  Completed: "bg-green-100 text-green-700 border border-green-200",
  Failed: "bg-red-100 text-red-700 border border-red-200",
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-600 border border-gray-200";

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-full ${style}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
