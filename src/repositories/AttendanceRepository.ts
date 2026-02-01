import { AppDataSource } from "@config/data-source";
import { Attendance } from "@entities/Attendance";

export const AttendanceRepository = AppDataSource.getRepository(Attendance);