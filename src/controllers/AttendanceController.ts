import { Request, Response } from "express";
import { asyncHandler } from "@middlewares/handler";
import { AttendanceService } from "@services/AttendanceService";

export class AttendanceController {

    markAttendance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const activityId = req.body;
        const response = await AttendanceService.markAttendance(activityId);
        res.status(200).json(response);
    })

    // CREATE SHOP
    InitializeAttendance = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const activityId = req.params.id as string;
            const user = await AttendanceService.initializeAttendance(activityId);
            res.status(201).json(user);
        }
    );
}