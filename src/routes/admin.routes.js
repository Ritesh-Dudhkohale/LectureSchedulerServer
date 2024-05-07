import { Router } from "express";
import {
  assignLecture,
  createCourse,
  getAllCourses,
  getAllInstructor,
  getAllSchedule,
  getCourse,
} from "../controller/admin.controller.js";
import upload from "../middlewares/multer.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate);

router
  .route("/courses")
  .get(getAllCourses)
  .post(upload.single("image"), createCourse);

router.route("/courses/:courseID").get(getCourse);

router.route("/lectures").get(getAllSchedule).post(assignLecture);

router.route("/instructors").get(getAllInstructor);

export default router;
