import { Schema, model } from "mongoose";

const courceSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "course name is required"],
    },
    level: {
      type: String,
      require: [true, "course level is required"],
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    description: {
      type: String,
      require: [true, "course description is required"],
    },
    image: {
      type: String,
      require: [true, "course name is required"],
    },
    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
  },
  { timestamps: true }
);

const Course = model("Course", courceSchema);

export default Course;
