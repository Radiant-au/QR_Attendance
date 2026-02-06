export interface MarkAttendance {
    activityId: string;
    qrToken: string;
    scannedById: string;
    scanMethod: string;
}

export interface AttendanceResponse {
    userName: string;
    attendanceType: string;
    message: string;
}

export interface LeaveRequest {
    activityId: string;
    userId: string;
    notes: string;
}