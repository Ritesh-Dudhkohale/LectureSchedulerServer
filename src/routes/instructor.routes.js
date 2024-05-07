import { Router } from "express";
import { getMySchedule } from "../controller/instructor.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate);

router.route("/schedule").get(getMySchedule);

export default router;
