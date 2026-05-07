# Multi-Admin Fleet Management System

## Overview

This system supports multiple fleet administrators, each managing their own fleet of cars, with a super admin who oversees everything.

## User Roles

### 1. **Super Admin** (`superadmin`)
- Can view all cars from all fleets
- Can view all bookings across all fleets
- Can create new fleet admins
- Can delete fleet admins (and their entire fleet)
- Can view platform-wide statistics

### 2. **Fleet Admin** (`admin`)
- Can add cars to their own fleet
- Can delete only their own cars
- Can view bookings only for their fleet's cars
- Can view statistics for their own fleet

### 3. **Regular User** (`user`)
- Can browse all cars from all fleets
- Can book any car
- Can view only their own bookings

## Default Accounts

After first run, these accounts are created automatically:

### Super Admin
- **Email**: `superadmin@driveelite.com`
- **Password**: `superadmin123`

### Fleet Admin (Demo)
- **Email**: `admin@driveelite.com`
- **Password**: `admin123`

## API Endpoints

### Admin Management (Super Admin Only)
- `GET /api/admin/admins` - Get all fleet admins
- `POST /api/admin/admins` - Create new fleet admin
- `DELETE /api/admin/admins/:id` - Delete admin and their fleet
- `GET /api/admin/cars` - Get all cars (all fleets)
- `GET /api/admin/bookings` - Get all bookings (all fleets)
- `GET /api/admin/stats` - Get platform-wide statistics

### Fleet Management (Fleet Admin)
- `GET /api/cars/admin/fleet` - Get admin's own fleet
- `POST /api/cars` - Add car to own fleet (auto-assigns adminId)
- `PUT /api/cars/:id` - Update own car only
- `DELETE /api/cars/:id` - Delete own car only

### Bookings
- `GET /api/bookings` - User's bookings OR fleet's bookings OR all bookings (based on role)
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking
- `PUT /api/bookings/:id` - Update booking status
- `GET /api/bookings/admin/stats` - Fleet statistics

## Database Schema Changes

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "user" | "admin" | "superadmin",
  fleetName: String
}
```

### Car Model
```javascript
{
  make: String,
  model: String,
  year: Number,
  category: String,
  // ... other fields
  adminId: ObjectId (ref: "User") // Owner of the car
}
```

## Frontend Pages

- `/admin` - Auto-redirects based on role
- `/fleetadmin` - Fleet Admin Dashboard (for `admin` role)
- `/superadmin` - Super Admin Dashboard (for `superadmin` role)

## How It Works

1. **Super Admin creates a Fleet Admin**:
   - Creates admin account with fleet name
   - Admin can then log in and manage their fleet

2. **Fleet Admin adds cars**:
   - Admin adds cars through their dashboard
   - Cars are automatically tagged with admin's ID
   - Only admin can delete their own cars

3. **Users book cars**:
   - Users see all cars from all fleets
   - When booking, the booking is associated with the car
   - Fleet admin sees bookings for their cars only
   - Super admin sees all bookings

4. **Revenue tracking**:
   - Each fleet admin sees revenue from their cars only
   - Super admin sees total platform revenue

## Security

- All admin routes require authentication
- Fleet admins can only manage their own resources
- Super admin has full access
- Regular users cannot access admin endpoints
