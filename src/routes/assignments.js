const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// @route   POST /api/assignments
// @desc    Create new assignment
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { title, subject, dueDate, priority, points, description } = req.body;

    if (!title || !subject || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, subject, and due date",
      });
    }

    const assignment = await Assignment.create({
      userId: req.user.id,
      title,
      subject,
      dueDate,
      priority: priority || "Medium",
      points: points || 0,
      description: description || "",
    });

    res.status(201).json({
      success: true,
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/assignments
// @desc    Get all assignments for user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.user.id }).sort({
      dueDate: 1,
    });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get single assignment
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check if user owns this assignment
    if (assignment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this assignment",
      });
    }

    res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update assignment
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check if user owns this assignment
    if (assignment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this assignment",
      });
    }

    const { title, subject, dueDate, priority, status, points, description } =
      req.body;

    // Track if status changed to completed
    const wasCompleted = assignment.status === "Completed";
    const isNowCompleted = status === "Completed";
    const justCompleted = !wasCompleted && isNowCompleted;

    if (title) assignment.title = title;
    if (subject) assignment.subject = subject;
    if (dueDate) assignment.dueDate = dueDate;
    if (priority) assignment.priority = priority;
    if (status) assignment.status = status;
    if (points) assignment.points = points;
    if (description) assignment.description = description;

    if (isNowCompleted && !assignment.completedAt) {
      assignment.completedAt = Date.now();
    }

    assignment = await assignment.save();

    // Award points if just completed
    if (justCompleted && assignment.points > 0) {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { points: assignment.points },
      });
    }

    res.status(200).json({
      success: true,
      assignment,
      pointsAwarded: justCompleted ? assignment.points : 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check if user owns this assignment
    if (assignment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this assignment",
      });
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
