const Task = require("../models/Task");
const User = require("../models/User");

const excelJS = require("exceljs");

const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email profileImageUrl");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columss = [
      {header: "Task ID", key: "_id", width: 25},
      {header: "Title", key: "title", width: 25},
      {header: "Description", key: "description", width: 25},
      {header: "Priority", key: "priority", width: 25},
      {header: "Status", key: "status", width: 25},
      {header: "Due Date", key: "dueDate", width: 25},
      {header: "Assigned To", key: "assignedTo", width: 25},
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo.map((user) => `${user.name} (${user.email})`).join(", ");

      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Unassigned",
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=tasks_report.xlsx");

    return workbook.xlsx.write(res).then(() => res.end());
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate("assignedTo", "name email profileImageUrl");

    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
            if (task.status === "Pending") {
              userTaskMap[task.assignedTo._id].pendingTasks += 1;
            } else if (task.status === "In Progress") {
              userTaskMap[task.assignedTo._id].inProgressTasks += 1;
            } else if (task.status === "Completed") {
              userTaskMap[task.assignedTo._id].completedTasks += 1;
            }
          }
        });
      }
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users Report");

    worksheet.columns = [
      {header: "Name", key: "name", width: 25},
      {header: "Email", key: "email", width: 25},
      {header: "Task Count", key: "taskCount", width: 25},
      {header: "Pending Tasks", key: "pendingTasks", width: 25},
      {header: "In Progress Tasks", key: "inProgressTasks", width: 25},
      {header: "Completed Tasks", key: "completedTasks", width: 25},
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=tasks_report.xlsx");

    return workbook.xlsx.write(res).then(() => res.end());
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

module.exports = {exportTasksReport, exportUsersReport};
