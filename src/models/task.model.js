import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus } from "../utils/constants";

const taskSchema = new Schema({
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
    id: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: AvailableTaskStatus,
    required: true,
  },
});

export const Task = mongoose.model("Task", taskSchema);
