export interface MarkAttendance {
    activityId: string;
    qrToken: string;
    scanMethod: string;
}

export interface AttendanceResponse {
    userId: string;
    attendanceType: string;
    message: string;
}

export interface LeaveRequest {
    activityId: string;
    notes: string;
}

export interface AttendanceRecord {
    id: string;
    userName: string;
    major: string;
    year: string;
    attendanceType: string;
    isPresent: boolean;
    notes: string;
}
