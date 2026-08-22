# DAYFLOW HRMS - Backend API Documentation & Contracts

> **For Frontend Lead (Adhi)**  
> **Backend Author**: Kavin (Backend Lead)  
> **Base URL**: `http://localhost:3000`  
> **Interactive Swagger UI**: `http://localhost:3000/api/docs`  
> **Shared Types Package**: `@dayflow/shared-types`

---

## 1. Global API Standards

### Standard Success Response Envelope
All API endpoints wrap payloads in the standard response envelope:
```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "timestamp": "2026-08-22T11:40:00.000Z"
}
```

### Standard Error Response Envelope
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description message",
  "errors": ["Specific field validation messages"],
  "path": "/api/endpoint",
  "timestamp": "2026-08-22T11:40:00.000Z"
}
```

### Authentication Header
For all protected endpoints, pass the JWT access token in the `Authorization` header:
```http
Authorization: Bearer <accessToken>
```

---

## 2. Authentication & First-Login Aadhaar KYC Flow

### `POST /auth/register`
- **Auth Required**: No (Public)
- **Role Required**: None
- **Request Body**:
```json
{
  "employeeId": "EMP005",
  "email": "priya.sharma@dayflow.com",
  "password": "StrongPassword@123",
  "role": "EMPLOYEE",
  "firstName": "Priya",
  "lastName": "Sharma",
  "phone": "+91 9876543219",
  "department": "Engineering",
  "designation": "Software Engineer"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "user": {
      "id": "uuid",
      "employeeId": "EMP005",
      "email": "priya.sharma@dayflow.com",
      "role": "EMPLOYEE",
      "emailVerified": true,
      "aadhaarVerified": false,
      "firstLoginCompleted": false,
      "isActive": true,
      "createdAt": "2026-08-22T06:00:00.000Z"
    },
    "accessToken": "jwt.token.string",
    "requiresAadhaarVerification": true,
    "verificationSessionId": "uuid"
  }
}
```

---

### `POST /auth/login`
- **Auth Required**: No (Public)
- **Request Body**:
```json
{
  "email": "sarah.connor@dayflow.com",
  "password": "Password@123"
}
```
- **Response Case A: First Login (Aadhaar KYC Required)**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": "uuid-sarah",
      "employeeId": "EMP003",
      "email": "sarah.connor@dayflow.com",
      "role": "EMPLOYEE",
      "emailVerified": true,
      "aadhaarVerified": false,
      "firstLoginCompleted": false,
      "isActive": true,
      "createdAt": "2026-08-22T06:00:00.000Z"
    },
    "requiresAadhaarVerification": true,
    "verificationSessionId": "uuid-sarah"
  }
}
```
- **Response Case B: Normal Login (Active Session)**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": "uuid-kavin",
      "employeeId": "EMP001",
      "email": "kavin@dayflow.com",
      "role": "EMPLOYEE",
      "emailVerified": true,
      "aadhaarVerified": true,
      "firstLoginCompleted": true,
      "isActive": true,
      "createdAt": "2026-08-22T06:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "requiresAadhaarVerification": false
  }
}
```

---

### `POST /auth/verify-aadhaar`
- **Auth Required**: Optional (Accepts JWT or email in body)
- **Request Body**:
```json
{
  "email": "sarah.connor@dayflow.com",
  "aadhaarNumber": "123456789012",
  "otp": "123456",
  "consent": true
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": "uuid-sarah",
      "employeeId": "EMP003",
      "email": "sarah.connor@dayflow.com",
      "role": "EMPLOYEE",
      "aadhaarVerified": true,
      "firstLoginCompleted": true,
      "isActive": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "requiresAadhaarVerification": false,
    "message": "Aadhaar e-KYC verified successfully. First-time login completed."
  }
}
```

---

### `GET /auth/me`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Response (200 OK)**: Returns full user profile and attached documents.

### `POST /auth/logout`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Response (200 OK)**: `{ "success": true, "data": { "message": "Logged out successfully." } }`

---

## 3. Employee Profile Management

### `GET /users/me`
- **Auth Required**: Yes (EMPLOYEE or ADMIN)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "employeeId": "EMP001",
    "email": "kavin@dayflow.com",
    "role": "EMPLOYEE",
    "profile": {
      "firstName": "Kavin",
      "lastName": "Prabhu",
      "phone": "+91 9876543211",
      "address": "12 Cyber Street, Silicon Oasis, Bangalore",
      "profilePictureUrl": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
      "department": "Engineering",
      "designation": "Senior Backend Engineer",
      "dateOfJoining": "2023-03-01T00:00:00.000Z"
    }
  }
}
```

### `PATCH /users/me`
- **Auth Required**: Yes (Self-service)
- **Editable Fields**: Only `phone`, `address`, `profilePictureUrl`.
- **Request Body**:
```json
{
  "phone": "+91 9876500000",
  "address": "New Apartment, Bangalore",
  "profilePictureUrl": "https://images.unsplash.com/new-avatar.jpg"
}
```

---

## 4. Admin - Employee Management

### `GET /admin/employees`
- **Auth Required**: Yes (`ADMIN` role only)
- **Query Params**: `?page=1&limit=10&search=kavin&department=Engineering&role=EMPLOYEE`
- **Response (200 OK)**: Paginated `{ items: [...], total, page, limit, totalPages }`.

### `GET /admin/employees/:id`
- **Auth Required**: Yes (`ADMIN` role only)
- **Response (200 OK)**: Full employee profile including recent attendance, leaves, and payroll records.

### `PATCH /admin/employees/:id`
- **Auth Required**: Yes (`ADMIN` role only)
- **Request Body**:
```json
{
  "role": "ADMIN",
  "isActive": true,
  "department": "Engineering",
  "designation": "Staff Software Engineer"
}
```

---

## 5. Attendance Module

### `POST /attendance/check-in`
- **Auth Required**: Yes (EMPLOYEE / ADMIN)
- **Request Body**: `{ "remarks": "Working from office" }`
- **Response (201 Created)**: Returns attendance record with `status: "PRESENT"`.
- **Error (409 Conflict)**: Returned if already checked in today.

### `POST /attendance/check-out`
- **Auth Required**: Yes (EMPLOYEE / ADMIN)
- **Request Body**: `{ "remarks": "Daily sprint tasks finished" }`
- **Response (200 OK)**: Auto-calculates `workHours` and updates `status` (`HALF_DAY` if < 4 hrs, `PRESENT` if >= 4 hrs).
- **Error (400 Bad Request)**: If not checked in today or already checked out.

### `GET /attendance/me`
- **Auth Required**: Yes (Self)
- **Query Params**: `?from=2026-08-01&to=2026-08-31&status=PRESENT`
- **Response (200 OK)**: Array of attendance records for the current employee.

### `GET /admin/attendance`
- **Auth Required**: Yes (`ADMIN` role only)
- **Query Params**: `?from=2026-08-01&to=2026-08-31&employeeId=EMP001&status=PRESENT&page=1&limit=20`

---

## 6. Leave Management Module

### `POST /leave`
- **Auth Required**: Yes (EMPLOYEE / ADMIN)
- **Request Body**:
```json
{
  "leaveType": "PAID",
  "startDate": "2026-09-01",
  "endDate": "2026-09-03",
  "reason": "Attending annual engineering conference"
}
```
- **Leave Types**: `PAID`, `SICK`, `UNPAID`
- **Response (201 Created)**: Returns created record with `status: "PENDING"`.
- **Error (409 Conflict)**: Returned if overlapping active leave exists.

### `GET /leave/me`
- **Auth Required**: Yes (Self)
- **Query Params**: `?status=PENDING&leaveType=PAID&page=1&limit=10`
- **Response (200 OK)**: Paginated leave records.

### `GET /leave/:id`
- **Auth Required**: Yes (Owner or ADMIN)

### `GET /admin/leave`
- **Auth Required**: Yes (`ADMIN` role only)
- **Query Params**: `?status=PENDING&leaveType=SICK&employeeId=EMP002&page=1&limit=10`

### `PATCH /admin/leave/:id/approve`
- **Auth Required**: Yes (`ADMIN` role only)
- **Request Body**: `{ "adminRemarks": "Approved. Have a great conference!" }`
- **Response (200 OK)**: Updated record with `status: "APPROVED"`, reviewer info, and auto-generates in-app employee notification.

### `PATCH /admin/leave/:id/reject`
- **Auth Required**: Yes (`ADMIN` role only)
- **Request Body**: `{ "adminRemarks": "Critical deployment sprint week." }`

---

## 7. Payroll Module

### `GET /payroll/me`
- **Auth Required**: Yes (EMPLOYEE read-only)
- **Response (200 OK)**:
```json
[
  {
    "id": "uuid",
    "month": 8,
    "year": 2026,
    "baseSalary": 120000,
    "allowances": 15000,
    "deductions": 5000,
    "netSalary": 130000,
    "status": "GENERATED",
    "paymentDate": null,
    "remarks": "Standard payroll disbursement for 8/2026"
  }
]
```

### `GET /admin/payroll`
- **Auth Required**: Yes (`ADMIN` role only)
- **Query Params**: `?month=8&year=2026&status=GENERATED&page=1&limit=10`

### `PATCH /admin/payroll/:employeeId`
- **Auth Required**: Yes (`ADMIN` role only)
- **Request Body**:
```json
{
  "baseSalary": 130000,
  "allowances": 20000,
  "deductions": 6000,
  "status": "PAID",
  "paymentDate": "2026-08-30T00:00:00.000Z",
  "remarks": "Annual performance appraisal increment"
}
```
- **Response (200 OK)**: Auto-computes `netSalary = baseSalary + allowances - deductions` (144000).

### `GET /admin/payroll/:employeeId/slip`
- **Auth Required**: Yes (`ADMIN` role only, or owner)
- **Query Params**: `?month=8&year=2026`
- **Response (200 OK)**: Formatted payslip data for print/download.

---

## 8. Notifications & Reports Module

### `GET /notifications/me`
- **Auth Required**: Yes
- **Response (200 OK)**: List of in-app alerts (leave approval/rejection, attendance, payroll).

### `PATCH /notifications/:id/read`
- **Auth Required**: Yes

### `GET /admin/reports/attendance`
- **Auth Required**: Yes (`ADMIN` role only)
- **Query Params**: `?from=2026-08-01&to=2026-08-31`
- **Response (200 OK)**:
```json
{
  "totalEmployees": 4,
  "totalPresent": 8,
  "totalAbsent": 0,
  "totalHalfDay": 1,
  "totalLeave": 1,
  "averageAttendanceRate": 94.44,
  "period": { "from": "2026-08-01", "to": "2026-08-22" }
}
```

### `GET /admin/reports/payroll`
- **Auth Required**: Yes (`ADMIN` role only)
- **Query Params**: `?month=8&year=2026`
- **Response (200 OK)**: Total disbursements, taxes/deductions, and base salary totals.

---

## 9. Development Seed Accounts for Testing

| Email | Password | Role | Employee ID | First Login KYC Status |
| :--- | :--- | :--- | :--- | :--- |
| `admin@dayflow.com` | `Admin@123` | `ADMIN` | `ADMIN001` | Completed |
| `kavin@dayflow.com` | `Password@123` | `EMPLOYEE` | `EMP001` | Completed |
| `adhi@dayflow.com` | `Password@123` | `EMPLOYEE` | `EMP002` | Completed |
| `sarah.connor@dayflow.com` | `Password@123` | `EMPLOYEE` | `EMP003` | **Pending First-Login Aadhaar KYC** |
| `john.doe@dayflow.com` | `Password@123` | `EMPLOYEE` | `EMP004` | Completed |
