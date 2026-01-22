const express = require("express");
const router = express.Router();
const CourseOutline = require("../models/CourseOutline");
const { protect } = require("../middleware/auth");

// Get all outlines for a subject
router.get("/subject/:subjectId", async (req, res) => {
  try {
    const outlines = await CourseOutline.find({
      subjectId: req.params.subjectId,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      outlines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get outline by ID
router.get("/:id", async (req, res) => {
  try {
    const outline = await CourseOutline.findById(req.params.id).populate(
      "subjectId"
    );
    if (!outline) {
      return res.status(404).json({
        success: false,
        message: "Course outline not found",
      });
    }
    res.status(200).json({
      success: true,
      outline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create outline (admin only)
router.post("/", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can create course outlines",
      });
    }

    const { subjectId, title, description, order } = req.body;

    if (!subjectId || !title) {
      return res.status(400).json({
        success: false,
        message: "Subject ID and title are required",
      });
    }

    const newOutline = new CourseOutline({
      subjectId,
      title,
      description: description || "",
      order: order || 0,
    });

    await newOutline.save();

    res.status(201).json({
      success: true,
      message: "Course outline created successfully",
      outline: newOutline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update outline (admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can update course outlines",
      });
    }

    const outline = await CourseOutline.findById(req.params.id);
    if (!outline) {
      return res.status(404).json({
        success: false,
        message: "Course outline not found",
      });
    }

    const { title, description, order } = req.body;
    if (title) outline.title = title;
    if (description) outline.description = description;
    if (order !== undefined) outline.order = order;

    await outline.save();

    res.status(200).json({
      success: true,
      message: "Course outline updated successfully",
      outline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete outline (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete course outlines",
      });
    }

    const outline = await CourseOutline.findByIdAndDelete(req.params.id);
    if (!outline) {
      return res.status(404).json({
        success: false,
        message: "Course outline not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course outline deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
