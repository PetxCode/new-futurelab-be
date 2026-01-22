const express = require("express");
const router = express.Router();
const Module = require("../models/Module");
const { protect } = require("../middleware/auth");

// Get all modules for an outline
router.get("/outline/:outlineId", async (req, res) => {
  try {
    const modules = await Module.find({
      outlineId: req.params.outlineId,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      modules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get module by ID
router.get("/:id", async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate("outlineId");
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }
    res.status(200).json({
      success: true,
      module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create module (admin only)
router.post("/", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can create modules",
      });
    }

    const { outlineId, title, description, order } = req.body;

    if (!outlineId || !title) {
      return res.status(400).json({
        success: false,
        message: "Outline ID and title are required",
      });
    }

    const newModule = new Module({
      outlineId,
      title,
      description: description || "",
      order: order || 0,
    });

    await newModule.save();

    res.status(201).json({
      success: true,
      message: "Module created successfully",
      module: newModule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update module (admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can update modules",
      });
    }

    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const { title, description, order } = req.body;
    if (title) module.title = title;
    if (description) module.description = description;
    if (order !== undefined) module.order = order;

    await module.save();

    res.status(200).json({
      success: true,
      message: "Module updated successfully",
      module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete module (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete modules",
      });
    }

    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Module deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
