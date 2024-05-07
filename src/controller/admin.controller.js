import APIResponse from "../utils/APIResponse.js";
import CustomError from "../utils/CustomError.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryFileupload.js";
import { ObjectId } from "mongodb";
import Lecture from "../models/lecture.model.js";

const createCourse = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (!userRole || userRole !== "admin") {
      throw new CustomError(400, "Only admin can create course");
    }

    const { name, level, description } = req.body;

    if (!name || name.trim() === "") {
      throw new CustomError(400, "Course name is required");
    }

    if (!level || level.trim() === "") {
      throw new CustomError(400, "Course level is required");
    }

    if (!description || description.trim() === "") {
      throw new CustomError(400, "Course description is required");
    }

    const imagePath = req.file?.path;
    if (!imagePath) {
      throw new CustomError(400, "Course image is required");
    }
    console.log(3);
    const image = await uploadOnCloudinary(imagePath);

    console.log(4);
    if (!image) {
      throw CustomError(400, "Images file is not uploaded");
    }

    const course = await Course.create({
      name,
      level,
      description,
      image: image.url,
    });

    const savedCourse = await Course.findById(course._id).orFail(() => {
      throw new CustomError(500, "Course is not saved");
    });

    return res
      .status(201)
      .json(new APIResponse(201, "Course saved successfully", savedCourse));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new APIResponse(
          error.statusCode || 500,
          error.message || "Internal server error",
          null,
          false
        )
      );
  }
};

const getAllCourses = async (req, res) => {
  try {
    const role = req.user.role;

    if (!role || role !== "admin") {
      throw new CustomError(400, "Only admin can see all courses");
    }

    const courses = await Course.find();

    if (courses.length === 0) {
      throw new CustomError(200, "courses is not available/registered");
    }

    return res
      .status(200)
      .json(new APIResponse(200, "Following Courses are available", courses));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new APIResponse(
          error.statusCode || 500,
          error.message || "Internal server error",
          null,
          false
        )
      );
  }
};
const getCourse = async (req, res) => {
  try {
    const role = req.user.role;

    if (!role || role !== "admin") {
      throw new CustomError(400, "Only admin can see all courses");
    }
    const id = req.param.courseID;
    if (!id) {
      throw new CustomError(400, "Course Id is required");
    }

    const courses = await Course.findById(id);

    if (courses.length === 0) {
      throw new CustomError(200, "courses is not available/registered");
    }

    return res
      .status(200)
      .json(new APIResponse(200, "Courses are available", courses));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new APIResponse(
          error.statusCode || 500,
          error.message || "Internal server error",
          null,
          false
        )
      );
  }
};

const assignLecture = async (req, res) => {
  try {
    const role = req.user.role;

    if (!role || role !== "admin") {
      throw new CustomError(400, "Only admin can assign lectures");
    }

    const { courseID, instructorID, date } = req.body;

    if (!courseID || !ObjectId.isValid(courseID)) {
      throw new CustomError("Course Id is required");
    }

    if (!instructorID || !ObjectId.isValid(instructorID)) {
      throw new CustomError("Instructor Id is required");
    }

    const user = await User.findById(instructorID);

    if (user.role !== "instructor") {
      throw new CustomError(400, "Lecture is only assignable to instructor");
    }

    if (!date) {
      throw new CustomError("Date is required");
    }

    if (date >= new Date()) {
      throw new CustomError("select current date or future date");
    }

    const isInstructorAvailable = await Lecture.findOne({
      instructor: instructorID,
      date,
    });

    if (isInstructorAvailable) {
      throw new Error("Instructor is not available on this date");
    }

    const lecture = await Lecture.create({
      course: courseID,
      instructor: instructorID,
      date,
    });

    const assignedLecture = await Lecture.findById(lecture._id)
      .populate({ path: "course", select: "name level description image" })
      .populate({ path: "instructor", select: "password createdAt updatedAt" });

    if (!assignedLecture) {
      throw new CustomError(500, "Lecture is assigned");
    }

    return res
      .status(201)
      .json(
        new APIResponse(200, "Lecture assigned successfully", assignedLecture)
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new APIResponse(
          error.statusCode || 500,
          error.message || "Internal server error",
          null,
          false
        )
      );
  }
};

const getAllSchedule = async (req, res) => {
  try {
    const role = req.user.role;

    if (!role || role !== "admin") {
      throw new CustomError(400, "Only admin can see all schedule");
    }
    const lectures = await Lecture.find()
      .populate({
        path: "course",
        select: "name level",
      })
      .populate({ path: "instructor", select: "fullname" })
      .sort({ date: -1 });

    if (lectures.length === 0) {
      throw new CustomError(200, "No Lectures assigned to the instructor");
    }

    return res
      .status(200)
      .json(new APIResponse(200, "Following lectures are sheduled", lectures));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new APIResponse(
          error.statusCode || 500,
          error.message || "Internal server error",
          null,
          false
        )
      );
  }
};

const getAllInstructor = async (req, res) => {
  try {
    const role = req.user.role;

    if (!role || role !== "admin") {
      throw new CustomError(400, "Only admin can see all instructors");
    }

    const instructors = await User.find({ role: "instructor" }).select(
      "-password"
    );

    if (instructors.length === 0) {
      throw new CustomError(200, "Instructors are not available/registered");
    }

    return res
      .status(200)
      .json(
        new APIResponse(200, "Following instructors are available", instructors)
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new APIResponse(
          error.statusCode || 500,
          error.message || "Internal server error",
          null,
          false
        )
      );
  }
};

export {
  createCourse,
  getAllCourses,
  getAllInstructor,
  assignLecture,
  getAllSchedule,
  getCourse,
};
