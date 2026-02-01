import { AppDataSource } from "@config/data-source";
import { ActivityRegistration } from "@entities/ActivityRegistration";

export const ActivityRegistrationRepository = AppDataSource.getRepository(ActivityRegistration);