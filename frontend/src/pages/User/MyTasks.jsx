import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/card/TaskCard";

const MyTasks = () => {
  const [allTask, setAllTask] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  // Ambil semua task
  const getAllTask = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASK.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTask(response.data?.tasks || []);

      const statusSummary = response.data?.statusSummary || {};
      setTabs([
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ]);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleClick = (id) => {
    navigate(`/user/tasks-details/${id}`);
  };

  useEffect(() => {
    getAllTask();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Task">
      <div className="my-5">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full lg:w-auto gap-3">
            <h2 className="text-xl font-medium">My Tasks</h2>
          </div>

          {allTask.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            </div>
          )}
        </div>

        {/* List Task */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTask.map((item) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map((u) => u.profileImageUrl)}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoCheckList={item.todoCheckList || []}
              onClick={() => handleClick(item._id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
