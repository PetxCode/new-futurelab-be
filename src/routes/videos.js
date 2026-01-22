const express = require("express");
const router = express.Router();
const Video = require("../models/Video");
const { protect } = require("../middleware/auth");

// Get all videos for a module
router.get("/module/:moduleId", async (req, res) => {
  try {
    const videos = await Video.find({
      moduleId: req.params.moduleId,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get video by ID
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("moduleId");
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }
    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create video (admin only)
router.post("/", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can create videos",
      });
    }

    const {
      moduleId,
      title,
      description,
      videoUrl,
      duration,
      thumbnail,
      order,
    } = req.body;

    if (!moduleId || !title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "Module ID, title, and video URL are required",
      });
    }

    const newVideo = new Video({
      moduleId,
      title,
      description: description || "",
      videoUrl,
      duration: duration || 0,
      thumbnail: thumbnail || "",
      order: order || 0,
    });

    await newVideo.save();

    res.status(201).json({
      success: true,
      message: "Video created successfully",
      video: newVideo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update video (admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can update videos",
      });
    }

    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const { title, description, videoUrl, duration, thumbnail, order } =
      req.body;

    if (title) video.title = title;
    if (description) video.description = description;
    if (videoUrl) video.videoUrl = videoUrl;
    if (duration !== undefined) video.duration = duration;
    if (thumbnail) video.thumbnail = thumbnail;
    if (order !== undefined) video.order = order;

    await video.save();

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete video (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete videos",
      });
    }

    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
