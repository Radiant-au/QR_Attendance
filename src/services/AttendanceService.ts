import { AttendanceResponse, LeaveRequest, MarkAttendance } from "@dtos/AttendanceDto";
import { ActivityRegistrationRepository } from "@repositories/ActivityRegistrationRepository";
import { ActivityRepository } from "@repositories/ActivityRepository";
import { AttendanceRepository } from "@repositories/AttendanceRepository";
import { AppError } from "@utils/AppError";
import { QrSignature } from "@utils/Signature";


export class AttendanceService {

  //initialize attendance record for activity
  static async initializeAttendance(activityId: string) {
    // Get all registered users
    const registrations = await ActivityRegistrationRepository.find({
      where: { activityId: activityId },
    });

    if (registrations.length === 0) {
      return; // No registrations, nothing to initialize
    }

    // Create attendance records for all registered users
    const attendances = registrations.map(reg =>
      AttendanceRepository.create({
        userId: reg.userId,
        activityId: activityId,
        registrationId: reg.id,
        attendanceType: 'registered',
        isPresent: false, // Not present yet
        scanMethod: 'auto',
        notes: 'Auto-created when activity started'
      })
    );

    await AttendanceRepository.save(attendances);

    console.log(`Initialized ${attendances.length} attendance records for activity ${activityId}`);
  }

  //mark attendance for user
  static async markAttendance(data: MarkAttendance): Promise<AttendanceResponse> {
    // Verify QR signature and expiration
    const verification = QrSignature.verifyQrToken(data.qrToken);

    if (!verification.isValid) {
      throw new AppError('Invalid or expired QR code', 400);
    }

    const userId = verification.userId!;

    // Check if activity exists and is ongoing
    const activity = await ActivityRepository.findOne({
      where: { id: data.activityId }
    });

    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    if (activity.status !== 'ongoing') {
      throw new AppError('Activity is not ongoing', 400);
    }

    // Check if attendance record exists
    let attendance = await AttendanceRepository.findOne({
      where: {
        userId: userId,
        activityId: data.activityId
      }
    });

    if (attendance) {
      // Registered user - mark present
      if (attendance.attendanceType === 'leave') {
        throw new AppError('User requested leave for this activity', 400);
      }

      if (attendance.isPresent) {
        throw new AppError('User already marked present', 400);
      }

      attendance.isPresent = true;
      attendance.scannedAt = new Date();
      attendance.scannedById = data.scannedById;
      attendance.scanMethod = data.scanMethod;
    } else {
      // Walk-in user
      const registration = await ActivityRegistrationRepository.findOne({
        where: {
          userId,
          activityId: data.activityId
        }
      });

      attendance = AttendanceRepository.create({
        userId,
        activityId: data.activityId,
        registrationId: registration?.id || undefined,
        attendanceType: 'walk-in',
        isPresent: true,
        scannedAt: new Date(),
        scannedById: data.scannedById,
        scanMethod: data.scanMethod,
        notes: 'Walk-in via QR scan'
      });
    }

    await AttendanceRepository.save(attendance);

    return {
      userName: attendance.user.fullName,
      attendanceType: attendance.attendanceType,
      message: attendance.attendanceType === 'walk-in'
        ? 'Walk-in attendee marked present'
        : 'Attendance marked successfully'
    };
  }

  static async requestLeave(data: LeaveRequest) {
    const attendance = await AttendanceRepository.findOneByOrFail({ id: data.userId });
    attendance.attendanceType = 'leave';
    attendance.isPresent = false;
    attendance.notes = data.notes;
    await AttendanceRepository.save(attendance);
    return {
      userName: attendance.user.fullName,
      attendanceType: attendance.attendanceType,
      message: 'Leave submitted successfully'
    };
  }

}