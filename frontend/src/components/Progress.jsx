import React from "react";

const Progress = ({ progress, status }) => {
  const getColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-cyan-500";
      case "Completed":
        return "bg-indigo-500";
      case "Pending":
        return "bg-violet-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
      <div
        className={`${getColor()} h-1.5 rounded-full transition-all duration-300`}
        style={{ width: `${progress || 0}%` }}
      ></div>
    </div>
  );
};

export default Progress;
