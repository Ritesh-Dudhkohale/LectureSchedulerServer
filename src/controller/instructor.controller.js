import User from "../models/user.model.js";
import Lecture from "../models/lecture.model.js";
import APIResponse from "../utils/APIResponse.js";
import CustomError from "../utils/CustomError.js";

const getMySchedule = async (req, res) => {
  try {
    const instructorID = req.user._id;

    const lectures = await Lecture.find({ instructor: instructorID })
      .populate({
        path: "course",
        select: "name level description image",
      })
      .select("-instructor")
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

export { getMySchedule };
