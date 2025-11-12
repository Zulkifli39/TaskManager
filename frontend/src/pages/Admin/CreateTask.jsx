import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import { LuTrash } from "react-icons/lu";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import SelectDropDown from "../../components/inputs/SelectDropDown";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";
import AddAttachmentInput from "../../components/inputs/AddAttachmentInput";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect } from "react";

const CreateTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { taskId } = location.state || {};

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoCheckList: [],
    attachments: [],
  });


  const [currentTask, setCurrentTask] = useState(null)

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // 🔹 Handle perubahan nilai form
  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  // 🔹 Reset form
  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoCheckList: [],
      attachments: [],
    });
  };

  // 🔹 Create Task
const createTask = async () => {
  setLoading(true);

  try {
    const todoList = taskData.todoCheckList?.map((item) => ({
      title: item.title,
      completed: item.completed,
    }));

    const payload = {
      ...taskData,
      dueDate: new Date(taskData.dueDate).toISOString(),
      todoCheckList: todoList,
    };

    console.log("📦 Data yang dikirim ke backend:", payload);

    await axiosInstance.post(API_PATHS.TASK.CREATE_TASK, payload);

    toast.success("Task created successfully");
    clearData();
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error);
  } finally {
    setLoading(false);
  }
};

const updateTask = async () => {
  setLoading(true);
  try {
    const todoList = taskData.todoCheckList?.map((item) => {
      if (typeof item === "object") {
        return {
          title: item.title,
          completed: item.completed || false,
        };
      }

      // Jika item berupa string (baru ditambahkan)
      const prevTodoCheckList = currentTask?.todoCheckList || [];
      const matchedTask = prevTodoCheckList.find(
        (task) => task.title === item
      );

      return {
        title: item,
        completed: matchedTask?.completed || false,
      };
    });

    // Payload lengkap untuk dikirim ke backend
    const payload = {
      ...taskData,
      dueDate: new Date(taskData.dueDate).toISOString(),
      todoCheckList: todoList,
    };

    console.log("📤 Payload update task:", payload);

    // Pastikan menggunakan PUT dengan path yang benar
    const response = await axiosInstance.put(
      API_PATHS.TASK.UPDATE_TASK(taskId),
      payload
    );

    toast.success("Task updated successfully");

    // Perbarui data di state agar form langsung sinkron
    if (response.data?.updateTask) {
      setCurrentTask(response.data.updateTask);
    }

    navigate("/admin/tasks");

  } catch (error) {
    console.error("Error updating task:", error.response?.data || error);
    toast.error("Failed to update task");
  } finally {
    setLoading(false);
  }
};

  // 🔹 Validasi & Submit
  const handleSubmit = async () => {
    setError("");

    if (!taskData.title.trim()) return setError("Task title is required");
    if (!taskData.description.trim()) return setError("Task description is required");
    if (!taskData.priority.trim()) return setError("Priority is required");
    if (!taskData.dueDate) return setError("Task due date is required");
    if (taskData.assignedTo?.length === 0) return setError("Assigned user is required");
    if (taskData.todoCheckList?.length === 0) return setError("Todo checklist is required");

    if (taskId) {
      updateTask();
      return;
    }
    createTask();
  };

const getTaskDetailById = async (id) => {
  try {
    const response = await axiosInstance.get(API_PATHS.TASK.GET_TASK_BY_ID(id));

    if (response.data) {
      const taskInfo = response.data;

      setCurrentTask(taskInfo);

      setTaskData({
        title: taskInfo.title || "",
        description: taskInfo.description || "",
        priority: taskInfo.priority || "Low",
        dueDate: taskInfo.dueDate
          ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
          : "",
        assignedTo: taskInfo?.assignedTo?.map((user) => user._id) || [], 
        todoCheckList:
          taskInfo.todoCheckList?.map((item) => ({
            title: item.title,
            completed: item.completed,
          })) || [],
        attachments: taskInfo.attachments || [],
      });
    }
  } catch (error) {
    console.error("Error fetching task by ID:", error);
  }
};


  // Delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASK.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success("Expense detail deleted succesfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error deleting task:", error.response?.data?.message || error.message);
    }

  }

useEffect(() => {
  if (taskId) {
    getTaskDetailById(taskId);
  }
}, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="form-card col-span-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  onClick={() => setOpenDeleteAlert(true)}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-200 hover:border-rose-400 cursor-pointer"
                >
                  <LuTrash className="text-base" /> Delete
                </button>
              )}
            </div>

            {/* Title */}
            <div className="mt-4">
              <label className="text-xs font-medium text-gray-600">Task Title</label>
              <input
                type="text"
                placeholder="Create App UI"
                className="form-input w-full mt-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
                value={taskData.title}
                onChange={({ target }) => handleValueChange("title", target.value)}
              />
            </div>

            {/* Description */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Description</label>
              <textarea
                placeholder="Describe Task"
                className="form-input w-full mt-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
                rows={4}
                value={taskData.description}
                onChange={({ target }) => handleValueChange("description", target.value)}
              ></textarea>
            </div>

            {/* Priority, Due Date, Assigned */}
            <div className="grid grid-cols-12 gap-4 mt-3">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Priority</label>
                <SelectDropDown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Due Date</label>
                <input
                  type="date"
                  className="form-input w-full mt-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
                  value={taskData.dueDate}
                  onChange={({ target }) => handleValueChange("dueDate", target.value)}
                />
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Assigned To</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => handleValueChange("assignedTo", value)}
                />
              </div>
            </div>

            {/* Todo Checklist */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">TODO Checklist</label>
              <TodoListInput
                todoList={taskData.todoCheckList}
                setTodoList={(value) => handleValueChange("todoCheckList", value)}
              />
            </div>

            {/* Attachments */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Add Attachments</label>
              <AddAttachmentInput
                attachments={taskData.attachments}
                setAttachments={(value) => handleValueChange("attachments", value)}
              />
            </div>

            {/* Error Message */}
            {error && <div className="text-xs text-rose-500 mt-2">{error}</div>}

            {/* Submit Button */}
            <div className="flex justify-end mt-7">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`add-btn transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-100 hover:border-blue-200"
                }`}
              >
                {loading ? "Processing..." : taskId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>



      <Modal isOpen={openDeleteAlert} onClose={() => setOpenDeleteAlert(false)}
      title="Delete Task"
       >
          <DeleteAlert content="Are youn sure you want to delete this task?" onDelete={() => deleteTask()}/>
       </Modal>

      </DashboardLayout>
  );
};

export default CreateTask;
