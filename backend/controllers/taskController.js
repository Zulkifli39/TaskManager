const Task = require("../models/Task");

// Untuk Mengambil Semua Task yang Ada
const getTasks = async (req, res) => {
  try {
    const {status} = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
    } else {
      tasks = await Task.find({...filter, assignedTo: req.user._id}).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }

    // Add Completed todoCheckList count to  each
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const compeletedCount = task.todoCheckList.filter((item) => item.completed).length;

        return {
          ...task._doc,
          completedTodoCount: compeletedCount,
        };
      })
    );

    // Status summary counts
    const allTasks = await Task.countDocuments(req.user.role === "admin" ? {} : {assignedTo: req.user._id});

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && {assignedTo: req.user._id}),
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In progress",
      ...(req.user.role !== "admin" && {assignedTo: req.user._id}),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && {assignedTo: req.user._id}),
    });

    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

const getTaskById = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

// Untuk Menambahkan Task
const createTask = async (req, res) => {
  try {
    const {title, description, priority, dueDate, assignedTo, attachments, todoCheckList} = req.body;

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({message: "Assigned to must be an array"});
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      CreatedBy: req.user._id,
      todoCheckList,
      attachments,
    });

    res.status(201).json({message: "Task created successfully", task});
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

// Untuk Update atau Edit Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({message: "Task not found"});

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.status = req.body.status || task.status;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assisgnedTo) {
      if (!Array.isArray(req.body.assisgnedTo)) {
        return res.status(400).json({message: "Assigned to must be an array"});
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updateTask = await task.save();
    res.json({message: "Task updated successfully", updateTask});
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

// Untuk Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({message: "Task not found"});
    res.json({message: "Task deleted successfully"});
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

// Untuk Melakukan Update Task Status
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({message: "Task not found"});

    const isAssigned = task.assignedTo.some((userId) => userId.toString() === req.user._id.toString());

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({message: "Not Authorized"});
    }

    const {status} = req.body;

    if (!status) {
      return res.status(403).json({message: "Status is required"});
    }

    //  Update only when status = "Completed"
    task.status = status;

    if (task.status === "Completed") {
      task.todoCheckList.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({message: "Task status updated successfully", task});
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

// Untuk Melakukan Update Task ketika di Checklist
const updateTaskChecklist = async (req, res) => {
  try {
    const {todoCheckList} = req.body;

    const task = await Task.findById(req.params.id);

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res.status(404).json({message: "Not Authorized to update checklist"});
    }

    task.todoCheckList = todoCheckList; //Replace Update

    // Auto Update progress checlist
    const completedCount = task.todoCheckList.filter((item) => item.completed).length;

    const totalItems = task.todoCheckList.length;
    task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress === 0) {
      task.status = "Pending";
    } else {
      task.status = "In Progress";
    }

    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");
    res.json({message: "Task checklist updated successfully", updatedTask});
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

const getDashboardData = async (req, res) => {
  try {
    // Count summary
    const totalTasks = await Task.countDocuments({});
    const pendingTasks = await Task.countDocuments({status: "Pending"});
    const completedTasks = await Task.countDocuments({status: "Completed"});
    const overdueTasks = await Task.countDocuments({
      status: {$ne: "Completed"},
      dueDate: {$lt: new Date()},
    });

    // Task distribution by status
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([{$group: {_id: "$status", count: {$sum: 1}}}]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "_").toLowerCase();
      const found = taskDistributionRaw.find((item) => item._id === status);
      acc[formattedKey] = found ? found.count : 0;
      return acc;
    }, {});

    taskDistribution["all"] = totalTasks; // add total

    // Priority distribution
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([{$group: {_id: "$priority", count: {$sum: 1}}}]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      const found = taskPriorityLevelsRaw.find((item) => item._id === priority);
      acc[priority.toLowerCase()] = found ? found.count : 0;
      return acc;
    }, {});

    // Recent 10 tasks
    const recentTasks = await Task.find({})
      .sort({createdAt: -1})
      .limit(10)
      .select("title status priority dueDate createdAt");

    // Response
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalTasks = await Task.countDocuments({assignedTo: userId});
    const pendingTasks = await Task.countDocuments({assisgnedTo: userId, status: "Pending"});
    const completedTasks = await Task.countDocuments({assignedTo: userId, status: "Completed"});
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: {$ne: "Completed"},
      dueDate: {$lt: new Date()},
    });

    // Task by status
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistibution = await Task.aggregate([
      {$match: {assignedTo: userId}},
      {$group: {_id: "$status", count: {$sum: 1}}},
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "_").toLowerCase();
      const found = taskDistibution.find((item) => item._id === status);
      acc[formattedKey] = found ? found.count : 0;
      return acc;
    }, {});
    taskDistibution["all"] = totalTasks;

    // Task by priority
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {$match: {assignedTo: userId}},
      {$group: {_id: "$priority", count: {$sum: 1}}},
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)
        ? taskPriorityLevelsRaw.find((item) => item._id === priority).count
        : 0;
      return acc;
    }, {});

    const recentTasks = await Task.find({
      assignedTo: userId,
    })
      .sort({createdAt: -1})
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
    });
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
