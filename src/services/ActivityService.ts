import {  ActivityResponseDTO, CreateActivityDTO, RegisterAttendanceResponseDTO, UpdateActivityStatusDTO } from "@dtos/ActivityDto";
import { Activity } from "@entities/Activity";
import { ActivityRepository } from "@repositories/ActivityRepository";
import { AppError } from "@utils/AppError";
import { AttendanceService } from "./AttendanceService";
import { ActivityRegistrationService } from "./ActivityRegistrationService";

export class ActivityService {

  static async updateActivityStatus(data: UpdateActivityStatusDTO) {
    const activity = await ActivityRepository.findOneBy({ id: data.activityId });
    if (!activity) {
      throw new AppError("Activity not found", 404);
    }
    const oldStatus = activity.status;
    activity.status = data.status;
    if (oldStatus === 'upcoming' && data.status === 'closed') {
      //some attendance creation
      await AttendanceService.initializeAttendance(activity.id);
    }
    if (oldStatus === 'ongoing' && data.status === 'completed') {
      activity.endDateTime = new Date();
    }
    const result = await ActivityRepository.save(activity);
    return result ? "success" : "failed";
  }

  // create 
  static async createActivity(
    creatorId: string,
    data: CreateActivityDTO
  ): Promise<string> {

    const activity = new Activity();
    activity.title = data.title;
    activity.description = data.description;
    activity.startDateTime = data.startDateTime;
    activity.endDateTime = data.endDateTime;
    activity.location = data.location;
    activity.createdById = creatorId;
    activity.status = 'upcoming';
    const result = await ActivityRepository.save(activity);

    return result ? "success" : "failed";
  }

  // read all 
  static async getAllActivities(): Promise<ActivityResponseDTO[]> {
    const activities = await ActivityRepository.find();

    return activities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      startDateTime: activity.startDateTime,
      endDateTime: activity.endDateTime,
      location: activity.location,
      status: activity.status,
      createdAt: activity.createdAt
    }))
  }

  // data
  static async getActivityAttendanceRegistraion(id: string): Promise<RegisterAttendanceResponseDTO> {
    const registrations = await ActivityRegistrationService.getRegistrationsByActivityId(id);
    const attendance = await AttendanceService.getAttendanceByActivityId(id);
    return {
      registration: registrations,
      attendance: attendance
    };
  }

  // update
  static async updateActivity(
    id: string,
    data: CreateActivityDTO
  ): Promise<string> {
    const activity = await ActivityRepository.findOne({
      where: { id },
    });

    if (!activity) {
      throw new AppError("User not found", 404);
    }

    Object.assign(activity, data);

    const updatedActivity = await ActivityRepository.save(activity);

    return updatedActivity ? "success" : "failed";
  }

  // delete
  static async deleteActivity(id: string): Promise<string> {
    const activity = await ActivityRepository.findOneBy({ id });

    if (!activity) {
      throw new AppError("Activity not found", 404);
    }

    const result = await ActivityRepository.remove(activity);
    return result ? "success" : "failed";
  }
}