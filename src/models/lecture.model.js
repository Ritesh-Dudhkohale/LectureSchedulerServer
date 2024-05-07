import { Schema, model } from "mongoose";

const lectureSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Lecture = model("Lecture", lectureSchema);

export default Lecture;
