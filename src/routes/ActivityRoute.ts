import { Router } from "express";;
import { validateBody } from "@middlewares/ValidationMiddleware";
import { ActivityController } from "@controllers/ActivityController";
import { CreateActivityDTO, UpdateActivityStatusDTO } from "@dtos/ActivityDto";
import { authenticateAdminToken, authenticateUserToken } from "@middlewares/AuthMiddleware";

const router = Router();
const activityController = new ActivityController();

// Activity Routes
router.post("/", authenticateAdminToken, validateBody(CreateActivityDTO), activityController.createActivity);
router.get("/", authenticateAdminToken, activityController.getAllActivities);
router.get("/user", authenticateUserToken, activityController.getAllActivities);
router.put("/status/change", authenticateAdminToken, validateBody(UpdateActivityStatusDTO), activityController.updateActivityStatus);
router.put("/:id", authenticateAdminToken, validateBody(CreateActivityDTO), activityController.updateActivity);
router.delete("/:id", authenticateAdminToken, activityController.deleteActivity);

export default router;