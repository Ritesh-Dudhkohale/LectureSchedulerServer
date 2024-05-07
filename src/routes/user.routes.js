import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import {
  deleteUser,
  loginUser,
  registerUser,
} from "../controller/user.controller.js";

const router = Router();

// public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.use(authenticate);

router.route("/:id").delete(deleteUser);

export default router;
