# 👤 User API Documentation - Trimora (Production)

Complete API documentation for frontend developers - **PRODUCTION READY**

**🌐 Base URL:** `https://tromora-v1.vercel.app/api/v1`

---

## 📋 Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [User Management](#user-management)
3. [Password Reset (OTP)](#password-reset-otp)
4. [Referral System](#referral-system)
5. [Quick Start](#quick-start-for-frontend)

---

## 🔐 Authentication Endpoints

### 1. Check Email Availability

Check if an email is already registered.

**Endpoint:** `POST https://tromora-v1.vercel.app/api/v1/user/check-email`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "exists": true
}
```

---

### 2. Register New User

Create a new user account.

**Endpoint:** `POST https://tromora-v1.vercel.app/api/v1/user/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phoneNumber": "9876543210",
  "dob": "1995-05-15",
  "referralCode": "ABC123XYZ",
  "role": "user"
}
```

**Required:**
- `name` (string)
- `email` (string, unique, lowercase)
- `password` (string, min 8 chars)

**Optional:**
- `phoneNumber` (string, 10-15 digits)
- `dob` (ISO date string, YYYY-MM-DD)
- `referralCode` (string, uppercase)
- `role` (string, default: "user")

**Success Response (201):**
```json
{
  "status": "success",
  "user": {
    "id": "64abc123def456...",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "dob": "1995-05-15T00:00:00.000Z",
    "roles": ["user"],
    "referralCode": "JD789XYZ",
    "referredBy": null
  }
}
```

**Error (400):**
```json
{
  "message": "Name, email, and password are required"
}
```

---

### 3. Login

Authenticate user and get access tokens.

**Endpoint:** `POST https://tromora-v1.vercel.app/api/v1/user/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123def456...",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "roles": ["user"],
    "profilePicture": "",
    "referralCode": "JD789XYZ"
  }
}
```

**Error (401):**
```json
{
  "message": "Invalid credentials"
}
```

**💡 Note:** 
- `accessToken` expires in 15 minutes
- `refreshToken` expires in 7 days
- Store tokens securely (localStorage/httpOnly cookies)

---

### 4. Refresh Access Token

Get new access token using refresh token.

**Endpoint:** `POST https://tromora-v1.vercel.app/api/v1/user/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 5. Get Current User (Me)

Get logged-in user's information.

**Endpoint:** `GET https://tromora-v1.vercel.app/api/v1/user/me`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "id": "64abc123def456...",
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "9876543210",
  "dob": "1995-05-15T00:00:00.000Z",
  "role": "user",
  "referralCode": "JD789XYZ",
  "rewardPoints": 150,
  "referralCount": 3
}
```

---

### 6. Logout

Logout user and invalidate tokens.

**Endpoint:** `POST https://tromora-v1.vercel.app/api/v1/user/logout`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## 🔑 Password Reset (OTP)

### 7. Forgot Password (Request OTP)

Send 6-digit OTP to user's email.

**Endpoint:** `POST https://tromora-v1.vercel.app/api/v1/user/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Password reset OTP has been sent to your email."
}
```

**🔔 Important:**
- OTP is 6 digits (100000-999999)
- Valid for 10 minutes only
- User receives email with OTP
- Returns success even if email doesn't exist (security)

---

### 8. Reset Password (with OTP)

Reset password using OTP from email.

**Endpoint:** `POST https://tromora-v1.vercel.app/api/v1/user/reset-password`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "password": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Password has been reset successfully. You can now log in with your new password."
}
```

**Error Responses:**

Invalid/Expired OTP (400):
```json
{
  "status": "error",
  "message": "Invalid or expired OTP. Please request a new password reset."
}
```

Passwords don't match (400):
```json
{
  "status": "error",
  "message": "Passwords do not match"
}
```

---

## 👥 User Management

### 9. Get All Users (Admin Only)

Get list of all registered users.

**Endpoint:** `GET https://tromora-v1.vercel.app/api/v1/user`

**Headers:**
```
Authorization: Bearer <adminAccessToken>
```

**Success Response (200):**
```json
{
  "status": "success",
  "users": [
    {
      "_id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["user"],
      "phoneNumber": "9876543210",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    }
  ]
}
```

---

### 10. Get User by ID

Get specific user details.

**Endpoint:** `GET https://tromora-v1.vercel.app/api/v1/user/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Access:** Admin or the user themselves

**Success Response (200):**
```json
{
  "status": "success",
  "user": {
    "_id": "64abc123def456...",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "dob": "1995-05-15T00:00:00.000Z",
    "roles": ["user"],
    "referralCode": "JD789XYZ",
    "rewardPoints": 150,
    "referralCount": 3,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 11. Update User

Update user information.

**Endpoint:** `PUT https://tromora-v1.vercel.app/api/v1/user/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Access:** Admin or the user themselves

**Request Body:**
```json
{
  "name": "John Updated Doe",
  "phoneNumber": "9999888877",
  "profilePicture": "https://cloudinary.com/..."
}
```

**❌ Cannot Update:** `password`, `email`, `refreshToken`

**Success Response (200):**
```json
{
  "status": "success",
  "user": {
    "_id": "64abc123def456...",
    "name": "John Updated Doe",
    "email": "john@example.com",
    "phoneNumber": "9999888877",
    "profilePicture": "https://cloudinary.com/...",
    "roles": ["user"]
  }
}
```

---

### 12. Delete User (Admin Only)

Delete a user account.

**Endpoint:** `DELETE https://tromora-v1.vercel.app/api/v1/user/:id`

**Headers:**
```
Authorization: Bearer <adminAccessToken>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User deleted"
}
```

---

### 13. Add Role to User (Admin Only)

Add additional role to existing user.

**Endpoint:** `POST https://tromora-v1.vercel.app/api/v1/user/:id/roles`

**Headers:**
```
Authorization: Bearer <adminAccessToken>
```

**Request Body:**
```json
{
  "role": "salonOwner"
}
```

**Available Roles:**
- `user`
- `salonOwner`

**Success Response (200):**
```json
{
  "status": "success",
  "user": {
    "id": "64abc123def456...",
    "email": "john@example.com",
    "roles": ["user", "salonOwner"]
  }
}
```

---

## 🎁 Referral System

### 14. Get Referral Info

Get user's referral code, points, and referred users list.

**Endpoint:** `GET https://tromora-v1.vercel.app/api/v1/user/referral-info`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "status": "success",
  "referralInfo": {
    "referralCode": "JD789XYZ",
    "rewardPoints": 150,
    "referralCount": 3,
    "referredUsers": [
      {
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "joinedAt": "2024-02-01T12:00:00.000Z"
      },
      {
        "name": "Bob Williams",
        "email": "bob@example.com",
        "joinedAt": "2024-02-05T14:30:00.000Z"
      }
    ]
  }
}
```

---

## 🚀 Quick Start for Frontend

### Installation

```bash
npm install axios
```

### Axios Setup

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tromora-v1.vercel.app/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          'https://tromora-v1.vercel.app/api/v1/user/refresh',
          { refreshToken }
        );
        
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Usage Examples

```javascript
import api from './api';

// ✅ Check Email
export const checkEmail = async (email) => {
  const { data } = await api.post('/user/check-email', { email });
  return data.exists;
};

// ✅ Register
export const register = async (userData) => {
  const { data } = await api.post('/user/register', userData);
  return data;
};

// ✅ Login
export const login = async (email, password) => {
  const { data } = await api.post('/user/login', { email, password });
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data.user;
};

// ✅ Get Current User
export const getCurrentUser = async () => {
  const { data } = await api.get('/user/me');
  return data;
};

// ✅ Forgot Password
export const forgotPassword = async (email) => {
  const { data } = await api.post('/user/forgot-password', { email });
  return data;
};

// ✅ Reset Password
export const resetPassword = async (email, otp, password, confirmPassword) => {
  const { data } = await api.post('/user/reset-password', {
    email,
    otp,
    password,
    confirmPassword
  });
  return data;
};

// ✅ Update User
export const updateUser = async (userId, updates) => {
  const { data } = await api.put(`/user/${userId}`, updates);
  return data.user;
};

// ✅ Get Referral Info
export const getReferralInfo = async () => {
  const { data } = await api.get('/user/referral-info');
  return data.referralInfo;
};

// ✅ Logout
export const logout = async () => {
  await api.post('/user/logout');
  localStorage.clear();
};
```

---

## ⚠️ Common Error Responses

| Status Code | Message | Reason |
|------------|---------|--------|
| 400 | Name, email, and password are required | Missing required fields |
| 400 | Invalid referral code | Referral code doesn't exist |
| 400 | Passwords do not match | confirmPassword ≠ password |
| 401 | Invalid credentials | Wrong email/password |
| 401 | Invalid refresh token | Token expired or invalid |
| 403 | Forbidden | Insufficient permissions |
| 404 | User not found | User ID doesn't exist |
| 500 | Internal server error | Server-side error |

---

## 📦 TypeScript Types

```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  dob?: string;
  profilePicture?: string;
  authMethod: 'local' | 'google';
  roles: ('user' | 'salonOwner')[];
  referralCode?: string;
  referredBy?: string;
  rewardPoints: number;
  referralCount: number;
  firstBookingDiscountUsed: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  status: 'success';
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface ReferralInfo {
  referralCode: string;
  rewardPoints: number;
  referralCount: number;
  referredUsers: {
    name: string;
    email: string;
    joinedAt: string;
  }[];
}
```

---

## 🎯 All Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/user/check-email` | Public | Check if email exists |
| POST | `/user/register` | Public | Register new user |
| POST | `/user/login` | Public | Login user |
| POST | `/user/refresh` | Public | Refresh access token |
| GET | `/user/me` | User/Admin | Get current user |
| POST | `/user/logout` | User/Admin | Logout user |
| POST | `/user/forgot-password` | Public | Request OTP |
| POST | `/user/reset-password` | Public | Reset password with OTP |
| GET | `/user` | Admin | Get all users |
| GET | `/user/:id` | User/Admin | Get user by ID |
| PUT | `/user/:id` | User/Admin | Update user |
| DELETE | `/user/:id` | Admin | Delete user |
| POST | `/user/:id/roles` | Admin | Add role to user |
| GET | `/user/referral-info` | User/Admin | Get referral info |

---

**🌐 Production URL:** `https://tromora-v1.vercel.app/api/v1`

**📚 Postman Collection:** Import `postman_collection_user.json`

**Happy Coding! 🚀**
