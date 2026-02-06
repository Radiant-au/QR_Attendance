import { asyncHandler } from "@middlewares/handler";
import { ActivityRegistrationService } from "@services/ActivityRegistrationService";
import { Request, Response } from "express";

export class ActivityRegistrationController {

    registerActivity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const activityRegistrationData = req.body;
        const response = await ActivityRegistrationService.registerActivity(activityRegistrationData);
        res.status(201).json(response);
    })

    // CREATE SHOP
    cancel = asyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const cancelData = req.body;
            const response = await ActivityRegistrationService.cancelActivity(cancelData);
            res.status(200).json(response);
        }
    );
}