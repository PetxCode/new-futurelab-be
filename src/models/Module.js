const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema(
  {
    outlineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseOutline",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", ModuleSchema);
