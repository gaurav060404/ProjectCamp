import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";

const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assigneeId, status } = req.body;
  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  const members = project.members || [];
  const isMember = members.some((mId) => mId.toString() === assigneeId);

  if (!isMember) {
    throw new ApiError("Assignee should be a member of this project");
  }

  const task = await Task.create({
    title,
    description,
    assignee: assigneeId,
    status,
    project: projectId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  const userRole = req.user.role;
  const query = { project: projectId };
  if (userRole === "member") {
    query.assignee = req.user._id;
  }

  const tasks = await Task.find(query)
    .populate("assignee", "username role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

export { createTask, getTasks };
