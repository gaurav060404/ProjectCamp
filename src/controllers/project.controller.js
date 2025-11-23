import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

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

export { createProject, getProjects, getMembers, getProjectDetails };
