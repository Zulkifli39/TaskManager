import React from "react";

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => setActiveTab(tab.label)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md ${
            activeTab === tab.label
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } transition`}
        >
          <span>{tab.label}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === tab.label
                ? "bg-white text-primary"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskStatusTabs;
