import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import APIResponse from "../utils/APIResponse.js";
import CustomError from "../utils/CustomError.js";
import config from "../constant.js";

const secretKey = config.ACCESS_TOKEN_SECRET;

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) throw new CustomError(401, "Unauthorized Request");

    const decodedToken = jwt.verify(token, secretKey);

    const user = await User.findById(decodedToken._id)
      .select("-password")
      .orFail(() => {
        throw new CustomError(401, "Invalid Access Token");
      });

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new APIResponse(error.statusCode, error.message, null, false));
  }
};

export default authenticate;
