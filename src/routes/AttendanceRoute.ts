import { Router } from "express";;
import { authenticateAdminToken, authenticateUserToken } from "@middlewares/AuthMiddleware";
import { AttendanceController } from "@controllers/AttendanceController";

const router = Router();
const attendanceController = new AttendanceController();

// Attendance Routes
router.post("/mark", authenticateAdminToken, attendanceController.markAttendance);
router.post("/leave", authenticateUserToken, attendanceController.requestLeave);

export default router;