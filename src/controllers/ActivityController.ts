import { AuthRequest } from "@middlewares/AuthMiddleware";
import { asyncHandler } from "@middlewares/handler";
import { ActivityService } from "@services/ActivityService";
import { Request, Response } from "express";

export class ActivityController {

    getAllActivities = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const activities = await ActivityService.getAllActivities();
        res.status(200).json(activities);
    })

    createActivity = asyncHandler(
        async (req: AuthRequest, res: Response): Promise<void> => {
            const activityData = req.body;
            const creatorId = req.user?.id;
            const activity = await ActivityService.createActivity(creatorId, activityData);
            res.status(201).json(activity);
        }
    );

    updateActivityStatus = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const statusData = req.body;
            const status = await ActivityService.updateActivityStatus(statusData);
            res.status(200).json(status);
        }
    );

    getActivityAttendanceRegistraion = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const activityId = req.params.id as string;
            const activity = await ActivityService.getActivityAttendanceRegistraion(activityId);
            res.status(200).json(activity);
        }
    );

    updateActivity = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const activityId = req.params.id as string;
            const activityData = req.body;
            const activity = await ActivityService.updateActivity(activityId, activityData);
            res.status(200).json(activity);
        }
    );

    deleteActivity = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const activityId = req.params.id as string;
            const activity = await ActivityService.deleteActivity(activityId);
            res.status(200).json(activity);
        }
    );
}