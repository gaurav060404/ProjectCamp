import mongoose from "mongoose";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.model.js";

const createProject = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;

  const existingProject = await Project.findOne({ name });
  if (existingProject) {
    throw new ApiError(409, "Project already exists");
  }

  const project = await Project.create({ name, description, members });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project Created Successfully"));
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find();
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        projects,
      },
      "Projects retreived successfully",
    ),
  );
});

const getMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }

  const project = await Project.findById(projectId).populate("members");
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  if (project.memberCount === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Members are not assigned yet."));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        members: project.members,
      },
      "Members retrieved successfully",
    ),
  );
});

const getProjectDetails = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }

  const project = await Project.findById(projectId).populate("members");
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  if (req.user.role === "member") {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          projectDetails: {
            projectName: project.name,
            projectDescription: project.description,
            membersCount: project.memberCount,
          },
        },
        "Project details retrieved successfully",
      ),
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        projectDetails: {
          projectName: project.name,
          projectDescription: project.description,
          members: project.members.map((m) => ({
            username: m.username,
            email: m.email,
            role: m.role,
            id: m._id,
          })),
          membersCount: project.memberCount,
        },
      },
      "Project details retrieved successfully",
    ),
  );
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    new ApiError(400, "Project id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project Doesn't Exists");
  }

  await Project.findByIdAndDelete(projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project deleted successfully"));
});

const removeMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  if (!projectId || !userId) {
    throw new ApiError(400, "Project id and user id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project Doesn't Exists");
  }

  const updatedMembers = project.members.filter((mId) => !mId.equals(userId));
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      $set: {
        members: updatedMembers,
        memberCount: updatedMembers.length,
      },
    },
    { new: true },
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        project: updatedProject,
      },
      "Project member removed successfully",
    ),
  );
});

const addProjectMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { memberId } = req.body;
  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project Doesn't Exists");
  }

  const alreadyMember = project.members.some((id) => id.equals(memberId));
  if (alreadyMember) {
    throw new ApiError(400, "User is already a member of this project");
  }

  project.members.push(new mongoose.Types.ObjectId(memberId));
  const savedProject = await project.save({ validateBeforeSave: false });
  const addedMember = await User.findById(memberId).select(
    "username email role _id",
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        member: addedMember,
        project_id: savedProject._id,
        project_members_count: savedProject.memberCount,
      },
      "Member added successfully",
    ),
  );
});



export {
  createProject,
  getProjects,
  getMembers,
  getProjectDetails,
  deleteProject,
  removeMember,
  addProjectMember,
};
