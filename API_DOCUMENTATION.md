# 📡 WorkNest - API Documentation

This document provides detailed documentation for the WorkNest Employee Management System (EMS) REST API endpoints.

---

## 🔒 Authentication & Headers

WorkNest uses a **secure HTTP-Only JWT Cookie** authentication mechanism.
- The JWT is signed with the user's `employeeId` and `role`.
- It is saved in the browser under the cookie name `token`.
- On cross-domain hosting deployments, the cookie is set with `secure: true` and `sameSite: "none"` to facilitate secure transmission between frontend and backend.
- All endpoints except `/api/auth/login` require the `token` cookie to be present.

### Error Status Codes
* **401 Unauthorized**: No token cookie supplied, or token has expired.
* **403 Forbidden**: Token verified, but the user's role has insufficient permissions.
* **404 Not Found**: The requested resource does not exist.
* **409 Conflict**: Duplicate constraints failed (e.g., trying to use an already registered email or employee ID).
* **400 Bad Request**: Payload failed schema validation rules.

---

## 🔑 Authentication Endpoints

### 1. Log In
Authenticates credentials and sets the JWT in an HTTP-only cookie.

* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Auth Required:** No
* **Request Body:**
```json
{
  "email": "admin@worknest.com",
  "password": "password123"
}
```
* **Success Response (200 OK):**
```json
{
  "user": {
    "id": "e4a2c5a0-9759-40e9-b5fe-68b3294372e9",
    "employeeId": "EMP-001",
    "name": "Super Admin",
    "email": "admin@worknest.com",
    "phone": "1234567890",
    "department": "Management",
    "designation": "CEO",
    "salary": "100000.00",
    "joiningDate": "2026-07-19T17:00:00.000Z",
    "status": "ACTIVE",
    "role": "SUPER_ADMIN",
    "profileImage": null,
    "isDeleted": false,
    "reportingManagerId": null,
    "createdAt": "2026-07-19T17:01:25.000Z",
    "updatedAt": "2026-07-19T17:01:25.000Z"
  }
}
```

### 2. Log Out
Clears the JWT session cookie.

* **URL:** `/api/auth/logout`
* **Method:** `POST`
* **Auth Required:** No
* **Success Response (200 OK):**
```json
{
  "message": "Logged out successfully."
}
```

### 3. Get Current User Session
Returns basic details of the logged-in user retrieved from the JWT token.

* **URL:** `/api/auth/me`
* **Method:** `GET`
* **Auth Required:** Yes (Any Role)
* **Success Response (200 OK):**
```json
{
  "id": "e4a2c5a0-9759-40e9-b5fe-68b3294372e9",
  "employeeId": "EMP-001",
  "name": "Super Admin",
  "email": "admin@worknest.com",
  "phone": "1234567890",
  "department": "Management",
  "designation": "CEO",
  "status": "ACTIVE",
  "role": "SUPER_ADMIN"
}
```

---

## 👥 Employee Directory Endpoints

### 1. List All Employees
Fetches a paginated, filterable, and sortable list of active employees.

* **URL:** `/api/employees`
* **Method:** `GET`
* **Auth Required:** Yes (`SUPER_ADMIN`, `HR_MANAGER`)
* **Query Parameters:**
  * `search` (Optional): Query string to search across `name` and `email` (case-insensitive contains).
  * `department` (Optional): Filter exactly by department.
  * `role` (Optional): Filter by system role (`SUPER_ADMIN`, `HR_MANAGER`, `EMPLOYEE`).
  * `status` (Optional): Filter by status (`ACTIVE`, `INACTIVE`).
  * `sortBy` (Optional, Default: `name`): Field to sort by (`name` or `joiningDate`).
  * `order` (Optional, Default: `asc`): Sort ordering direction (`asc` or `desc`).
  * `page` (Optional, Default: `1`): Page number for pagination.
  * `limit` (Optional, Default: `10`): Number of rows to return per page.
* **Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "e4a2c5a0-9759-40e9-b5fe-68b3294372e9",
      "employeeId": "EMP-001",
      "name": "Super Admin",
      "email": "admin@worknest.com",
      "phone": "1234567890",
      "department": "Management",
      "designation": "CEO",
      "salary": "100000.00",
      "joiningDate": "2026-07-19T17:00:00.000Z",
      "status": "ACTIVE",
      "role": "SUPER_ADMIN",
      "profileImage": null,
      "reportingManagerId": null,
      "createdAt": "2026-07-19T17:01:25.000Z",
      "updatedAt": "2026-07-19T17:01:25.000Z",
      "manager": null
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

### 2. Create Employee
Registers a new employee.

* **URL:** `/api/employees`
* **Method:** `POST`
* **Auth Required:** Yes (`SUPER_ADMIN`, `HR_MANAGER`)
  * *Note: HR Managers cannot assign the `SUPER_ADMIN` role.*
* **Request Body:**
```json
{
  "employeeId": "EMP002",
  "name": "Jane Smith",
  "email": "jane@worknest.com",
  "password": "securepassword",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": 85000,
  "joiningDate": "2026-07-19T00:00:00.000Z",
  "status": "ACTIVE",
  "role": "EMPLOYEE",
  "profileImage": "https://example.com/avatar.jpg"
}
```
* **Success Response (201 Created):**
```json
{
  "id": "d5b128c1-19b8-4c12-8874-8b630e2f5f14",
  "employeeId": "EMP002",
  "name": "Jane Smith",
  "email": "jane@worknest.com",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": "85000.00",
  "joiningDate": "2026-07-19T00:00:00.000Z",
  "status": "ACTIVE",
  "role": "EMPLOYEE",
  "profileImage": "https://example.com/avatar.jpg",
  "isDeleted": false,
  "reportingManagerId": null,
  "createdAt": "2026-07-19T17:15:30.000Z",
  "updatedAt": "2026-07-19T17:15:30.000Z"
}
```

### 3. Get Logged-In User Profile
Returns the complete profile details of the logged-in user, including their manager and direct reports.

* **URL:** `/api/employees/me`
* **Method:** `GET`
* **Auth Required:** Yes (Any Role)
* **Success Response (200 OK):**
```json
{
  "id": "d5b128c1-19b8-4c12-8874-8b630e2f5f14",
  "employeeId": "EMP002",
  "name": "Jane Smith",
  "email": "jane@worknest.com",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": "85000.00",
  "joiningDate": "2026-07-19T00:00:00.000Z",
  "status": "ACTIVE",
  "role": "EMPLOYEE",
  "profileImage": "https://example.com/avatar.jpg",
  "reportingManagerId": "e4a2c5a0-9759-40e9-b5fe-68b3294372e9",
  "manager": {
    "id": "e4a2c5a0-9759-40e9-b5fe-68b3294372e9",
    "name": "Super Admin",
    "designation": "CEO",
    "department": "Management"
  },
  "reportees": []
}
```

### 4. Get Employee By ID
Fetches details of a specific employee profile.

* **URL:** `/api/employees/:id`
* **Method:** `GET`
* **Auth Required:** Yes (`SUPER_ADMIN`, `HR_MANAGER`, or `EMPLOYEE` own profile only)
* **Success Response (200 OK):**
```json
{
  "id": "d5b128c1-19b8-4c12-8874-8b630e2f5f14",
  "employeeId": "EMP002",
  "name": "Jane Smith",
  "email": "jane@worknest.com",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": "85000.00",
  "joiningDate": "2026-07-19T00:00:00.000Z",
  "status": "ACTIVE",
  "role": "EMPLOYEE",
  "profileImage": "https://example.com/avatar.jpg",
  "reportingManagerId": null,
  "manager": null,
  "reportees": []
}
```

### 5. Update Employee Details
Modifies an existing employee record.

* **URL:** `/api/employees/:id`
* **Method:** `PUT`
* **Auth Required:** Yes (`SUPER_ADMIN`, `HR_MANAGER`)
  * *Note: HR Managers cannot elevate any account to `SUPER_ADMIN`.*
* **Request Body:** (All fields optional)
```json
{
  "name": "Jane Doe Smith",
  "salary": 90000
}
```
* **Success Response (200 OK):**
```json
{
  "id": "d5b128c1-19b8-4c12-8874-8b630e2f5f14",
  "employeeId": "EMP002",
  "name": "Jane Doe Smith",
  "email": "jane@worknest.com",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": "90000.00",
  "joiningDate": "2026-07-19T00:00:00.000Z",
  "status": "ACTIVE",
  "role": "EMPLOYEE"
}
```

### 6. Delete Employee (Soft Delete)
Sets the `isDeleted` flag on the employee profile to `true`, shielding it from directory queries.

* **URL:** `/api/employees/:id`
* **Method:** `DELETE`
* **Auth Required:** Yes (`SUPER_ADMIN` only)
* **Success Response (200 OK):**
```json
{
  "message": "Employee deleted successfully."
}
```

---

## 🌳 Hierarchy & Organization Endpoints

### 1. Get Organizational Tree
Retrieves a fully nested tree structure representing the entire reporting hierarchy.
* Root nodes represent employees with no managers assigned.

* **URL:** `/api/organization/tree`
* **Method:** `GET`
* **Auth Required:** Yes (`SUPER_ADMIN`, `HR_MANAGER`)
* **Success Response (200 OK):**
```json
[
  {
    "id": "e4a2c5a0-9759-40e9-b5fe-68b3294372e9",
    "employeeId": "EMP-001",
    "name": "Super Admin",
    "designation": "CEO",
    "department": "Management",
    "status": "ACTIVE",
    "role": "SUPER_ADMIN",
    "profileImage": null,
    "reportingManagerId": null,
    "children": [
      {
        "id": "d5b128c1-19b8-4c12-8874-8b630e2f5f14",
        "employeeId": "EMP002",
        "name": "Jane Smith",
        "designation": "Software Engineer",
        "department": "Engineering",
        "status": "ACTIVE",
        "role": "EMPLOYEE",
        "profileImage": "https://example.com/avatar.jpg",
        "reportingManagerId": "e4a2c5a0-9759-40e9-b5fe-68b3294372e9",
        "children": []
      }
    ]
  }
]
```

### 2. Get Direct Reportees
Lists direct reports (one level down) for a specific employee.

* **URL:** `/api/employees/:id/reportees`
* **Method:** `GET`
* **Auth Required:** Yes (`SUPER_ADMIN`, `HR_MANAGER`)
* **Success Response (200 OK):**
```json
[
  {
    "id": "d5b128c1-19b8-4c12-8874-8b630e2f5f14",
    "employeeId": "EMP002",
    "name": "Jane Smith",
    "email": "jane@worknest.com",
    "designation": "Software Engineer",
    "department": "Engineering",
    "status": "ACTIVE",
    "role": "EMPLOYEE",
    "profileImage": "https://example.com/avatar.jpg"
  }
]
```

### 3. Assign Reporting Manager
Updates the manager relationship for an employee. Walks the manager tree recursively to ensure no circular dependency loops are formed.

* **URL:** `/api/employees/:id/manager`
* **Method:** `PATCH`
* **Auth Required:** Yes (`SUPER_ADMIN` only)
* **Request Body:**
```json
{
  "managerId": "e4a2c5a0-9759-40e9-b5fe-68b3294372e9"
}
```
* **Success Response (200 OK):**
```json
{
  "message": "Manager assigned successfully.",
  "employee": {
    "id": "d5b128c1-19b8-4c12-8874-8b630e2f5f14",
    "employeeId": "EMP002",
    "name": "Jane Smith",
    "reportingManagerId": "e4a2c5a0-9759-40e9-b5fe-68b3294372e9"
  }
}
```
