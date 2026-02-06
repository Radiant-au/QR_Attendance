import { Router } from "express";
import AuthRoute from "@routes/AuthRoute"
import UserRoute from "./UserRoute";
import ActivityRoute from "./ActivityRoute";
import ActivityRegistrationRoute from "./ActivityRegistrationRoute";
import { authenticateUserToken } from "@middlewares/AuthMiddleware";
const router = Router();

router.use("/auth", AuthRoute);
router.use("/user", UserRoute)
router.use("/activity", ActivityRoute)
router.use("/activity-registration", authenticateUserToken, ActivityRegistrationRoute)


export default router;