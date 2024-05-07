import config from "./constant.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import instructorRouter from "./routes/instructor.routes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/admins", adminRouter);
app.use("/api/instructors", instructorRouter);

export default app;
