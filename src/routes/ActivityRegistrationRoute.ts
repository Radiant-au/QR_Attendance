import { Router } from "express";;
import { validateBody } from "@middlewares/ValidationMiddleware";
import { ActivityRegistrationController } from "@controllers/ActivityRegistrationController";
import { CancelActivityReqDto, RegisterActivityReqDto } from "@dtos/ActivityRegistrationDto";

const router = Router();
const activityRegistrationController = new ActivityRegistrationController();

// Activity Routes
router.post("/", validateBody(RegisterActivityReqDto), activityRegistrationController.registerActivity);
router.put("/cancel", validateBody(CancelActivityReqDto), activityRegistrationController.cancel);

export default router;