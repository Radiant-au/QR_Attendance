# API Documentation

This document provides a detailed description of the API endpoints for the QR Attendance system.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

Some endpoints require a JSON Web Token (JWT).

The token can be provided in either of these ways:

-   **Cookie (browser):** `token` (HTTP-only cookie)
-   **Authorization header:** `Authorization: Bearer <token>`

There are two types of authentication:

-   **Admin:** Requires a token from an admin user.
-   **User:** Requires a token from any authenticated user.

---

## Auth

Base path: `/auth`

### `POST /admin`

-   **Description:** Logs in an admin user.
-   **Authentication:** None
-   **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
-   **Response:**
    ```json
    {
      "user": {},
      "token": "string"
    }
    ```

### `POST /user`

-   **Description:** Logs in a regular user.
-   **Authentication:** None
-   **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
-   **Response:**
    ```json
    {
      "user": {},
      "token": "string"
    }
    ```

### `GET /me`

-   **Description:** Returns the current authenticated user.
-   **Authentication:** User
-   **Response:**
    ```json
    {
      "user": {}
    }
    ```

---

## Users

Base path: `/user`

### `POST /`

-   **Description:** Creates a new user.
-   **Authentication:** Admin
-   **Request Body:** (`CreateUserRequestDto`)
    ```json
    {
      "username": "string",
      "password": "string",
      "role": "string"
    }
    ```
-   **Response:**
    ```json
    "success"
    ```

### `GET /getQR/:id`

-   **Description:** Gets a user's QR code token.
-   **Authentication:** User
-   **Response:**
    ```json
    "string"
    ```

### `GET /`

-   **Description:** Gets all users.
-   **Authentication:** Admin
-   **Response:** An array of `UserResponse` objects.

### `GET /:id`

-   **Description:** Gets a user by ID.
-   **Authentication:** User
-   **Response:** (`OneUserResponse`)
    ```json
    {
      "id": "string",
      "username": "string",
      "role": "string",
      "fullName": "string",
      "major": "string",
      "registrations": ["string"],
      "attendances": [
        {
          "actvityName": "string",
          "isPresent": true,
          "scanMethod": "string"
        }
      ],
      "isProfileCompleted": true,
      "year": "string",
      "createdAt": "Date"
    }
    ```

### `PUT /:id`

-   **Description:** Updates a user.
-   **Authentication:** User
-   **Request Body:** (`UpdateUserRequestDto`)
    ```json
    {
      "fullName": "string",
      "major": "string",
      "year": "string"
    }
    ```
-   **Response:** An updated `UserResponse` object.

### `DELETE /:id`

-   **Description:** Deletes a user.
-   **Authentication:** Admin
-   **Response:**
    ```json
    {
      "message": "User deleted successfully"
    }
    ```

---

## Activities

Base path: `/activity`

### `POST /`

-   **Description:** Creates a new activity.
-   **Authentication:** Admin
-   **Request Body:** (`CreateActivityDTO`)
    ```json
    {
      "title": "string",
      "description": "string",
      "startDateTime": "Date",
      "endDateTime": "Date",
      "location": "string",
      "status": "string"
    }
    ```
-   **Response:**
    ```json
    "success"
    ```

### `GET /`

-   **Description:** Gets all activities.
-   **Authentication:** User
-   **Response:** An array of `ActivityResponseDTO` objects.

### `GET /:id/attendance`

-   **Description:** Gets attendance/registration information for a specific activity.
-   **Authentication:** User
-   **Response:** An array of attendance/registration objects.

### `PATCH /status/change`

-   **Description:** Updates the status of an activity.
-   **Authentication:** Admin
-   **Request Body:** (`UpdateActivityStatusDTO`)
    ```json
    {
      "activityId": "string",
      "status": "string"
    }
    ```
-   **Response:**
    ```json
    "success"
    ```

### `PUT /:id`

-   **Description:** Updates an activity.
-   **Authentication:** Admin
-   **Request Body:** (`CreateActivityDTO`)
-   **Response:**
    ```json
    "success"
    ```

### `DELETE /:id`

-   **Description:** Deletes an activity.
-   **Authentication:** Admin
-   **Response:**
    ```json
    "success"
    ```

---

## Activity Registrations

Base path: `/activity-registration`

All endpoints under this base path require **User** authentication.

### `POST /`

-   **Description:** Registers a user for an activity.
-   **Authentication:** User
-   **Request Body:** (`RegisterActivityReqDto`)
    ```json
    {
      "userId": "string",
      "activityId": "string"
    }
    ```
-   **Response:**
    ```json
    "success"
    ```

### `PUT /cancel`

-   **Description:** Cancels a user's registration for an activity.
-   **Authentication:** User
-   **Request Body:** (`CancelActivityReqDto`)
    ```json
    {
      "cancellationReason": "string",
      "activityId": "string"
    }
    ```
-   **Response:**
    ```json
    "success"
    ```

---

## Attendance

Base path: `/attendance`

### `POST /mark`

-   **Description:** Marks a user as present for an ongoing activity by scanning their QR token.
-   **Authentication:** Admin
-   **Request Body:** (`MarkAttendance`)
    ```json
    {
      "activityId": "string",
      "qrToken": "string",
      "scanMethod": "string"
    }
    ```
-   **Response:** (`AttendanceResponse`)
    ```json
    {
      "userName": "string",
      "attendanceType": "string",
      "message": "string"
    }
    ```

### `POST /leave`

-   **Description:** Requests leave for an activity.
-   **Authentication:** User
-   **Request Body:** (`LeaveRequest`)
    ```json
    {
      "activityId": "string",
      "notes": "string"
    }
    ```
-   **Response:** (`AttendanceResponse`)
    ```json
    {
      "userName": "string",
      "attendanceType": "string",
      "message": "string"
    }
    ```

Attendance is initialized internally when an activity status changes from `closed` to `ongoing`.
