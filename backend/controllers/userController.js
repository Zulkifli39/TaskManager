const Task = require("../models/Task");
const User = require("../models/User"); // Perbaiki huruf besar
const bcrypt = require("bcryptjs");

// Get all members with task counts
const getUser = async (req, res) => {
  try {
    const users = await User.find({role: "member"}).select("-password");

    // Tambahkan jumlah task ke setiap user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({assignedTo: user._id, status: "Pending"});
        const inProgressTasks = await Task.countDocuments({assignedTo: user._id, status: "In progress"});
        const completedTasks = await Task.countDocuments({assignedTo: user._id, status: "Completed"});

        return {
          ...user._doc,
          pendingTasks, 
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.json(usersWithTaskCounts);
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({message: "User not found"});
    res.json(user);
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({message: "User not found"});
    res.json({message: "User deleted successfully"});
  } catch (error) {
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

module.exports = {getUser, getUserById, deleteUser};
