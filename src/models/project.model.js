import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    memberCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.pre("save", function (next) {
  this.memberCount = this.members.length;
  next();
});

export const Project = mongoose.model("Project", projectSchema);
