const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const Assignment = require("../models/Assignment");
const { protect } = require("../middleware/auth");

// @route   POST /api/quizzes
// @desc    Create/save a new quiz for an assignment
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { assignmentId, questions } = req.body;

    if (!assignmentId || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide assignmentId and questions",
      });
    }

    // Check if assignment exists and belongs to user
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || assignment.userId.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check if quiz already exists for this assignment
    let quiz = await Quiz.findOne({ assignmentId });

    if (quiz) {
      // Update existing quiz
      quiz.questions = questions;
      quiz.updatedAt = Date.now();
      await quiz.save();
    } else {
      // Create new quiz
      quiz = await Quiz.create({
        assignmentId,
        userId: req.user.id,
        questions,
      });
    }

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/quizzes/:assignmentId
// @desc    Get quiz for an assignment
// @access  Private
router.get("/:assignmentId", protect, async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Check if assignment exists and belongs to user
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || assignment.userId.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const quiz = await Quiz.findOne({ assignmentId });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found for this assignment",
      });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/quizzes/:assignmentId
// @desc    Delete quiz for an assignment
// @access  Private
router.delete("/:assignmentId", protect, async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Check if assignment exists and belongs to user
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || assignment.userId.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const quiz = await Quiz.findOneAndDelete({ assignmentId });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
