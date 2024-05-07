import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../constant.js";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please enter Fullname"],
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
    },
    role: {
      type: String,
      default: "instructor",
      required: [true, "Please enter role"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const secretKey = config.ACCESS_TOKEN_SECRET;
const expiry = config.ACCESS_TOKEN_EXPIRY;

userSchema.methods.generateJWT = async function () {
  return jwt.sign(
    {
      _id: this._id,
      fullname: this.fullname,
      role: this.role,
    },
    secretKey,
    { expiresIn: expiry }
  );
};

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

export default User;
