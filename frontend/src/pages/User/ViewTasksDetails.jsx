import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const ViewTasksDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingIndex, setUpdatingIndex] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-cyan-50 text-cyan-500 border-cyan-500/10";
      case "In Progress":
        return "bg-violet-50 text-violet-500 border-violet-500/100";
      case "Completed":
        return "bg-lime-50 text-lime-500 border-lime-500/10";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // Ambil data task berdasarkan ID
  const getTaskDetailById = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.TASK.GET_TASK_BY_ID(id));
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task by ID:", error);
      toast.error("Failed to fetch task");
    } finally {
      setLoading(false);
    }
  };

  // Update checklist (local + server)
  const updateTodoCheckList = async (index) => {
    if (!task?.todoCheckList || !task.todoCheckList[index]) return;

    const updatedList = [...task.todoCheckList];
    updatedList[index].completed = !updatedList[index].completed;

    // Optimistic update
    setTask((prev) => ({ ...prev, todoCheckList: updatedList }));
    setUpdatingIndex(index);

    try {
      const response = await axiosInstance.put(
        API_PATHS.TASK.UPDATE_TASK_CHECKLIST(id),
        { todoCheckList: updatedList }
      );

      if (response.status === 200) {
        setTask(response.data?.task || { ...task, todoCheckList: updatedList });
        toast.success("Checklist updated");
      } else {
        throw new Error("Failed to update checklist");
      }
    } catch (error) {
      console.error("Error updating checklist:", error);
      toast.error("Failed to update checklist");
      // Revert change if failed
      updatedList[index].completed = !updatedList[index].completed;
      setTask((prev) => ({ ...prev, todoCheckList: updatedList }));
    } finally {
      setUpdatingIndex(null);
    }
  };

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) link = "https://" + link;
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) getTaskDetailById();
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {loading ? (
          <p className="text-center text-gray-500 text-sm">Loading task details...</p>
        ) : task ? (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-base md:text-xl font-medium">{task?.title}</h2>
                <div
                  className={`text-[13px] font-medium ${getStatusTagColor(
                    task?.status
                  )} px-4 py-0.5 rounded`}
                >
                  {task?.status}
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <InfoBox label="Description" value={task?.description || "-"} />
              </div>

              {/* Info Section */}
              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task?.priority || "-"} />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("YYYY-MM-DD")
                        : "-"
                    }
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">
                    Assigned To
                  </label>
                  <AvatarGroup
                    className=""
                    avatars={
                      task?.assignedTo?.map((item) => item?.profileImageUrl) || []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>

              {/* Todo Checklist */}
              <div className="mt-4">
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>

                {task?.todoCheckList?.length > 0 ? (
                  task.todoCheckList.map((item, index) => (
                    <TodoCheckList
                      key={`todo_${index}`}
                      title={item.title}
                      isChecked={item.completed}
                      loading={updatingIndex === index}
                      onChange={() => updateTodoCheckList(index)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    No checklist available
                  </p>
                )}
              </div>

              {/* Attachments */}
              {task?.attachments?.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>
                  {task.attachments.map((link, index) => (
                    <Attachments
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm">Task not found</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTasksDetails;

/* InfoBox Component */
const InfoBox = ({ label, value }) => (
  <div>
    <label className="text-xs md:text-[13px] font-medium text-slate-500">
      {label}
    </label>
    <p className="text-[13px] md:text-[13px] font-medium text-gray-700 mt-0.5">
      {value}
    </p>
  </div>
);

/* TodoCheckList Component */
const TodoCheckList = ({ title, isChecked, onChange, loading }) => (
  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md mt-2">
    <input
      type="checkbox"
      checked={isChecked}
      disabled={loading}
      onChange={onChange}
      className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer disabled:opacity-50"
    />
    <p
      className={`text-[13px] ${
        isChecked ? "line-through text-gray-400" : "text-gray-800"
      }`}
    >
      {loading ? "Updating..." : title}
    </p>
  </div>
);

/* Attachments Component */
const Attachments = ({ link, index, onClick }) => (
  <div
    className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer hover:bg-gray-100"
    onClick={onClick}
  >
    <div className="flex-1 flex items-center gap-3">
      <span className="text-xs text-gray-400 font-semibold mr-2">
        {index < 9 ? `0${index + 1}` : index + 1}
      </span>
      <p className="text-xs text-black truncate">{link}</p>
    </div>
    <LuSquareArrowOutUpRight className="text-gray-400" />
  </div>
);
