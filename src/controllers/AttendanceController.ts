import { Request, Response } from "express";
import { asyncHandler } from "@middlewares/handler";
import { AttendanceService } from "@services/AttendanceService";
import { AuthRequest } from "@middlewares/AuthMiddleware";

export class AttendanceController {

    markAttendance = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const scannerId = req.user?.id;
        const attendanceData = req.body;
        const response = await AttendanceService.markAttendance(scannerId, attendanceData);
        res.status(200).json(response);
    })

    requestLeave = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const leaveData = req.body;
        const response = await AttendanceService.requestLeave(userId, leaveData);
        res.status(200).json(response);
    })
}
