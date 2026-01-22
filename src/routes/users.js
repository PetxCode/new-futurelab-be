const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { uploadToCloudinary } = require("../utils/cloudinaryUtils");

// @route   GET /api/users/:id
// @desc    Get user by id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        grade: user.grade,
        class: user.class,
        academicLevel: user.academicLevel,
        levelProgress: user.levelProgress,
        points: user.points,
        achievements: user.achievements,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const { name, grade, avatar } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Make sure user is updating their own profile
    if (user._id.toString() !== req.user.id && req.user.id !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
    }

    // Update fields
    if (name) user.name = name;
    if (grade) user.grade = grade;
    if (avatar) user.avatar = avatar;
    user.updatedAt = Date.now();

    user = await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        grade: user.grade,
        academicLevel: user.academicLevel,
        levelProgress: user.levelProgress,
        points: user.points,
        achievements: user.achievements,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/users/:id/points
// @desc    Get user points
// @access  Private
router.get("/:id/points", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      points: user.points,
      academicLevel: user.academicLevel,
      levelProgress: user.levelProgress,
      grade: user.grade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/users/:id/add-points
// @desc    Add points to user
// @access  Private
router.post("/:id/add-points", protect, async (req, res) => {
  try {
    const { points } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid points",
      });
    }

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.points += points;

    // Update level progress (every 100 points level up)
    const previousLevel = user.academicLevel;
    user.academicLevel = Math.floor(user.points / 100) + 1;
    user.levelProgress = user.points % 100;

    // Add achievement if leveled up
    if (user.academicLevel > previousLevel) {
      const newAchievement = `Reached Level ${user.academicLevel}`;
      if (!user.achievements.includes(newAchievement)) {
        user.achievements.push(newAchievement);
      }
    }

    user = await user.save();

    res.status(200).json({
      success: true,
      points: user.points,
      academicLevel: user.academicLevel,
      levelProgress: user.levelProgress,
      achievements: user.achievements,
      message: `+${points} points awarded!`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/users/:id/add-achievement
// @desc    Add achievement to user
// @access  Private
router.post("/:id/add-achievement", protect, async (req, res) => {
  try {
    const { achievement } = req.body;

    if (!achievement) {
      return res.status(400).json({
        success: false,
        message: "Please provide an achievement",
      });
    }

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.achievements.includes(achievement)) {
      user.achievements.push(achievement);
    }

    user = await user.save();

    res.status(200).json({
      success: true,
      achievements: user.achievements,
      message: "Achievement unlocked!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/users/:id/upload-avatar
// @desc    Upload avatar to Cloudinary
// @access  Private
router.post(
  "/:id/upload-avatar",
  protect,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if user is updating their own profile
      // req.user.id is the ObjectId from JWT, user._id is also an ObjectId
      if (user._id.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this profile",
        });
      }

      // Upload to Cloudinary
      try {
        if (!req.file || !req.file.buffer) {
          return res.status(400).json({
            success: false,
            message: "File buffer is empty",
          });
        }

        console.log("📤 Uploading file:", {
          fileName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          userId: user._id,
        });

        const cloudinaryResult = await uploadToCloudinary(
          req.file.buffer,
          `avatar_${user._id}`
        );

        user.avatar = cloudinaryResult.secure_url;
        user.cloudinaryPublicId = cloudinaryResult.public_id;
        user.updatedAt = Date.now();

        await user.save();

        res.status(200).json({
          success: true,
          message: "Avatar uploaded successfully",
          avatar: user.avatar,
        });
      } catch (cloudinaryError) {
        console.error("❌ Cloudinary error in route:", cloudinaryError);
        return res.status(500).json({
          success: false,
          message: `Upload failed: ${cloudinaryError.message}`,
        });
      }
    } catch (error) {
      console.error("Upload endpoint error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
module.exports = router;
