import User from "../models/user.model.js";
import CustomError from "../utils/CustomError.js";
import APIResponse from "../utils/APIResponse.js";
import { ObjectId } from "mongodb";

const registerUser = async (req, res) => {
  try {
    const { fullname, email, role, password, confirmPassword } = req.body;

    if (!fullname || fullname.trim() === "")
      throw new CustomError(401, "Fullname is required");

    if (!email || email.trim() === "")
      throw new CustomError(401, "Email is required");

    if (!role || role.trim() === "")
      throw new CustomError(401, "role is  required");

    if (!password || password.trim() === "")
      throw new CustomError(401, "password is required");

    if (!confirmPassword || confirmPassword.trim() === "")
      throw new CustomError(401, "Confirm password is required");

    const existingUser = await User.findOne({ email: email });

    if (existingUser) throw new CustomError(409, "Email already exists");

    if (password != confirmPassword) {
      throw new CustomError("Password and Confirm Password not matched");
    }

    const user = await User.create({
      fullname,
      email,
      password,
      role,
    });

    const savedUser = await User.findById(user._id)
      .select("-password")
      .orFail(() => {
        throw new CustomError(
          500,
          "Something went wrong while registering user!!!"
        );
      });

    return res
      .status(201)
      .json(new APIResponse(201, "User registered successfully", savedUser));
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new APIResponse(error.statusCode, error.message, null, false));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      throw new CustomError(400, "Email is required.");
    }

    if (!password || !password.trim()) {
      throw new CustomError(400, "Password is required.");
    }

    const userExists = await User.findOne({ email: email }).orFail(() => {
      throw new CustomError(400, "User not found!!!");
    });

    const isPasswordValid = await userExists.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new CustomError(401, "Invalid User password!!!");
    }

    const accessToken = await userExists.generateJWT();

    const loggedInUser = await User.findOne(userExists?._id).select(
      "-password"
    );

    return res.status(200).json(
      new APIResponse(200, "User logged in successfully...", {
        loggedInUser,
        accessToken,
      })
    );
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new APIResponse(error.statusCode, error.message, null, false));
  }
};

const deleteUser = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== "admin") {
      throw new CustomError(400, "Only admin can delete user");
    }

    const userID = req.params.id;

    if (!userID) {
      throw new CustomError(400, "User id is required");
    }

    if (!ObjectId.isValid(userID)) {
      throw new CustomError(400, "Invalid user id");
    }

    const user = await User.findByIdAndDelete(userID).orFail(() => {
      throw new CustomError(200, "User does not exists");
    });

    return res
      .status(200)
      .json(new APIResponse(200, "User deleted successfully", null));
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new APIResponse(error.statusCode, error.message, null, false));
  }
};

export { registerUser, loginUser, deleteUser };
