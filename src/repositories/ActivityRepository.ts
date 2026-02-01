import { AppDataSource } from "@config/data-source";
import { Activity } from "@entities/Activity";

export const ActivityRepository = AppDataSource.getRepository(Activity);