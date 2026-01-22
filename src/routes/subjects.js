const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const { protect } = require("../middleware/auth");

// Get all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().populate("createdBy", "name email");
    res.status(200).json({
      success: true,
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get subject by ID
router.get("/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }
    res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create subject (admin only)
router.post("/", protect, async (req, res) => {
  try {
    // Check if user is admin
    console.log("User making request:", req.user);
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can create subjects",
      });
    }

    const { name, description, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    const newSubject = new Subject({
      name,
      description: description || "",
      icon: icon || "📚",
      color: color || "#6366f1",
      createdBy: req.user.id,
    });

    await newSubject.save();
    await newSubject.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject: newSubject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update subject (admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can update subjects",
      });
    }

    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const { name, description, icon, color } = req.body;
    if (name) subject.name = name;
    if (description) subject.description = description;
    if (icon) subject.icon = icon;
    if (color) subject.color = color;

    await subject.save();
    await subject.populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete subject (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete subjects",
      });
    }

    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
