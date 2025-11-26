import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

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

  const files = req.files || [];

  const promisedFiles = files.map((file) => {
    return uploadOnCloudinary(file.path);
  });

  const resolvedFiles = await Promise.all(promisedFiles);

  const filesUrl = resolvedFiles.map((file) => file?.secure_url);

  const task = await Task.create({
    title,
    description,
    assignee: assigneeId,
    status,
    project: projectId,
    files: filesUrl,
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

const getTaskDetails = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  if (!(projectId && taskId)) {
    throw new ApiError(400, "Project id and task id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  let task = await Task.findById(taskId).populate("subTasks");
  if (!task) {
    throw new ApiError(404, "Task doesn't exists");
  }

  if (req.user.role === "member") {
    task = {
      title: task.title,
      description: task.description,
      status: task.status,
      projecId: task.project,
    };
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  let { projectId, taskId, subTaskId } = req.params;
  if (!taskId) {
    taskId = subTaskId;
  }
  if (!(projectId && taskId)) {
    throw new ApiError(400, "Project id and task id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  let task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task doesn't exists");
  }

  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title, description, assigneeId, status } = req.body;
  if (!(projectId && taskId)) {
    throw new ApiError(400, "Project id and task id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  let task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task doesn't exists");
  }

  const files = req.files || [];

  const promisedFiles = files.map((file) => {
    return uploadOnCloudinary(file.path);
  });

  const resolvedFiles = await Promise.all(promisedFiles);

  const filesUrl = resolvedFiles.map((file) => file?.secure_url);

  task.title = title;
  task.description = description;
  task.assignee = assigneeId;
  task.status = status;
  task.files = filesUrl;
  await task.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        updatedTask: task,
      },
      "Task updated successfully",
    ),
  );
});

const createSubTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title, description, assigneeId, status } = req.body;
  if (!(projectId && taskId)) {
    throw new ApiError(400, "Project id and task id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  let task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task doesn't exists");
  }

  const members = project.members || [];
  const isMember = members.some((mId) => mId.toString() === assigneeId);

  if (!isMember) {
    throw new ApiError("Assignee should be a member of this project");
  }

  const files = req.files || [];

  const promisedFiles = files.map((file) => {
    return uploadOnCloudinary(file.path);
  });

  const resolvedFiles = await Promise.all(promisedFiles);

  const filesUrl = resolvedFiles.map((file) => file?.secure_url);

  const createdTask = await Task.create({
    title,
    description,
    assignee: assigneeId,
    status,
    project: projectId,
    files: filesUrl,
  });

  task.subTasks.push(new mongoose.Types.ObjectId(createdTask._id));
  await task.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subTasks: createdTask,
      },
      "Sub task created successfully",
    ),
  );
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { projectId, subTaskId } = req.params;
  const { title, description, assigneeId, status } = req.body;

  if (req.user.role === "member" && assigneeId) {
    throw new ApiError(401, "Unauthorized to assign any tasks");
  }

  if (!(projectId && subTaskId)) {
    throw new ApiError(400, "Project id and task id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  let task = await Task.findById(subTaskId);
  if (!task) {
    throw new ApiError(404, "Task doesn't exists");
  }

  const files = req.files || [];

  const promisedFiles = files.map((file) => {
    return uploadOnCloudinary(file.path);
  });

  const resolvedFiles = await Promise.all(promisedFiles);

  const filesUrl = resolvedFiles.map((file) => file?.secure_url);

  if (title) task.title = title;
  if (description) task.description = description;
  if (typeof status !== "undefined") task.status = status;
  if (assigneeId) task.assignee = assigneeId;
  if (filesUrl) task.files = filesUrl;

  await task.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        updatedSubTask: task,
      },
      "SubTask updated successfully",
    ),
  );
});

export {
  createTask,
  getTasks,
  getTaskDetails,
  deleteTask,
  updateTask,
  createSubTask,
  updateSubTask,
};
