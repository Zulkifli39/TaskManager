import React, {useState} from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {PRIORITY_DATA} from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";
import toast from "react-hot-toast";
import {useLocation, useNavigate} from "react-router-dom";
import moment from "moment";
import {LuTrash} from "react-icons/lu";
import SelectDropDown from "../../components/inputs/SelectDropDown";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";

const CreateTask = () => {
  const location = useLocation(); // ✅ perbaikan
  const {taskId} = location.state || {};

  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [], // ✅ perbaikan typo
    todoCheckList: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({...prevData, [key]: value}));
  };

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

  // Placeholder untuk fungsi API (belum diisi)
  const createTask = async () => {};
  const updateTask = async () => {};
  const handleSubmit = async () => {};
  const getTaskDetailById = async () => {};
  const deleteTask = async () => {};

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{taskId ? "Update Task" : "Create Task"}</h2>

              {taskId && (
                <button
                  onClick={() => setOpenDeleteAlert(true)}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-200 hover:border-rose-400 cursor-pointer">
                  <LuTrash className="text-base" /> Delete
                </button>
              )}
            </div>

            {/* Task Title */}
            <div className="mt-4">
              <label className="text-xs font-medium text-gray-600">Task Title</label>
              <input
                type="text"
                placeholder="Create App UI"
                className="form-input w-full mt-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
                value={taskData.title}
                onChange={({target}) => handleValueChange("title", target.value)}
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
                onChange={({target}) => handleValueChange("description", target.value)}></textarea>
            </div>

            {/* Priority & Due Date */}
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
                  placeholder="Create App UI"
                  type="date"
                  className="form-input w-full mt-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
                  value={taskData.dueDate}
                  onChange={({target}) => handleValueChange("dueDate", target.value)}
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

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 "> TODO CheckList</label>
              <TodoListInput
                todoList={taskData?.todoCheckList}
                setTodoList={(value) => handleValueChange("todoCheckList", value)}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
