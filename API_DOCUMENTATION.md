# API Documentation

This document provides a detailed description of the API endpoints for the QR Attendance system.

## Base URL

All API endpoints are prefixed with `/api/v1`. This is not explicitly in the code, but it is a common convention. I will assume this is the case. If not, the frontend developer can adjust.

## Authentication

Some endpoints require a JSON Web Token (JWT) to be sent in the `Authorization` header of the request. The header should be in the format: `Bearer <token>`.

There are two types of authentication:

-   **Admin:** Requires a token from an admin user.
-   **User:** Requires a token from any authenticated user.

---

## Auth

### `POST /auth/admin`

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
      "token": "string"
    }
    ```

### `POST /auth/user`

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
      "token": "string"
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
-   **Response:** (`UserResponse`)
    ```json
    {
      "id": "string",
      "username": "string",
      "fullName": "string",
      "major": "string",
      "year": "string",
      "isProfileCompleted" : "string",
      "role": "string",
      "createdAt": "Date"
    }
    ```

### `GET /getQR/:id`

-   **Description:** Gets a user's QR code token.
-   **Authentication:** User
-   **Response:**
    ```json
    {
      "qrToken": "string"
    }
    ```

### `GET /`

-   **Description:** Gets all users.
-   **Authentication:** Admin
-   **Response:** An array of `UserResponse` objects.

### `GET /:id`

-   **Description:** Gets a user by ID.
-   **Authentication:** User
-   **Response:** A `UserResponse` object.

### `PUT /:id`

-   **Description:** Updates a user.
-   **Authentication:** Admin
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
-   **Response:** (`ActivityResponseDTO`)
    ```json
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "startDateTime": "Date",
      "endDateTime": "Date",
      "location": "string",
      "status": "string"
    }
    ```

### `GET /`

-   **Description:** Gets all activities.
-   **Authentication:** Admin
-   **Response:** An array of `ActivityResponseDTO` objects.

### `GET /user`

-   **Description:** Gets all activities.
-   **Authentication:** User
-   **Response:** An array of `ActivityResponseDTO` objects.

### `PUT /status/change`

-   **Description:** Updates the status of an activity.
-   **Authentication:** Admin
-   **Request Body:** (`UpdateActivityStatusDTO`)
    ```json
    {
      "activityId": "string",
      "status": "string"
    }
    ```
-   **Response:** An updated `ActivityResponseDTO` object.

### `PUT /:id`

-   **Description:** Updates an activity.
-   **Authentication:** Admin
-   **Request Body:** (`CreateActivityDTO`)
-   **Response:** An updated `ActivityResponseDTO` object.

### `DELETE /:id`

-   **Description:** Deletes an activity.
-   **Authentication:** Admin
-   **Response:**
    ```json
    {
      "message": "Activity deleted successfully"
    }
    ```

---

## Activity Registrations

Base path: `/activity-registration`

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
-   **Response:** A success message or registration object.

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
-   **Response:** A success message or updated registration object.

---

## Attendance

There are currently no API endpoints exposed for managing attendance. The `AttendanceController` is not used in any routes. However, attendance is initialized when a new activity is created.
