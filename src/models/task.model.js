import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus } from "../utils/constants.js";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: AvailableTaskStatus,
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    files: {
      type: [String], //cloudinary url
      default: [],
    },
    subTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task"
      }
    ]
  },
  { timestamps: true },
);

export const Task = mongoose.model("Task", taskSchema);
