const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, "Please provide a subject"],
  },
  dueDate: {
    type: Date,
    required: [true, "Please provide a due date"],
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Review", "Completed"],
    default: "Not Started",
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
});

module.exports = mongoose.model("Assignment", assignmentSchema);
