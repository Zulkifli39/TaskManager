const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");

// === EXPORT TASKS REPORT ===
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email profileImageUrl");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    //  Kolom worksheet
    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 25 },
      { header: "Description", key: "description", width: 30 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 40 },
    ];

    //  Isi data
    tasks.forEach((task) => {
      // Pastikan assignedTo adalah array
      let assignedToNames = "Unassigned";
      if (Array.isArray(task.assignedTo) && task.assignedTo.length > 0) {
        assignedToNames = task.assignedTo
          .map((user) => `${user.name} (${user.email})`)
          .join(", ");
      }

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description || "-",
        priority: task.priority || "-",
        status: task.status || "-",
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "-",
        assignedTo: assignedToNames,
      });
    });

    //  Kirim file Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=tasks_report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting tasks:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// === EXPORT USERS REPORT ===
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate("assignedTo", "name email");

    // Pemetaan user → jumlah tugas
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
      if (Array.isArray(task.assignedTo)) {
        task.assignedTo.forEach((assignedUser) => {
          const userData = userTaskMap[assignedUser._id];
          if (userData) {
            userData.taskCount += 1;

            switch (task.status) {
              case "Pending":
                userData.pendingTasks += 1;
                break;
              case "In Progress":
                userData.inProgressTasks += 1;
                break;
              case "Completed":
                userData.completedTasks += 1;
                break;
            }
          }
        });
      }
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users Report");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Task Count", key: "taskCount", width: 15 },
      { header: "Pending Tasks", key: "pendingTasks", width: 15 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    Object.values(userTaskMap).forEach((user) => worksheet.addRow(user));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=users_report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting users:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { exportTasksReport, exportUsersReport };
