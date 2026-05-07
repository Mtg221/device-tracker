# Region-Based Fleet System - Senegal

## Overview

The fleet selection system now requires users to first choose a region from all 14 regions of Senegal, then view all fleet admins and their cars in that region.

## Senegal Regions (14 Total)

1. **Dakar** - Capital: Dakar
2. **Thiès** - Capital: Thiès
3. **Saint-Louis** - Capital: Saint-Louis
4. **Diourbel** - Capital: Diourbel
5. **Louga** - Capital: Louga
6. **Tambacounda** - Capital: Tambacounda
7. **Kaolack** - Capital: Kaolack
8. **Mbacké** - Capital: Mbacké
9. **Fatick** - Capital: Fatick
10. **Matam** - Capital: Matam
11. **Ziguinchor** - Capital: Ziguinchor
12. **Kolda** - Capital: Kolda
13. **Sédhiou** - Capital: Sédhiou
14. **Kaffrine** - Capital: Kaffrine
15. **Kédougou** - Capital: Kédougou

## User Flow

### Step 1: Click "Fleet" in Navigation
- User clicks on "Fleet" in the navbar
- Automatically redirected to `/fleet/regions`

### Step 2: Select Region
- User sees a grid of all 14 Senegal regions
- Each region card shows:
  - Region name
  - Capital city
  - Location icon (📍)
- Click on any region to view fleets in that region

### Step 3: View Fleets & Cars
- Shows all fleet admins operating in the selected region
- Each admin card displays:
  - Admin name and avatar
  - Fleet name
  - All cars in their fleet (with CarCard component)
- Users can click on any car to book it

### Step 4: Book a Car
- Click "Book Now" on any car
- Opens booking modal
- Complete the booking process

## Backend API Endpoints

### Region-Based Routes

**Get Admins by Region**
```
GET /api/admin/regions/:regionId/admins
```
- Returns all fleet admins in the specified region
- Public endpoint (no auth required)

**Get Cars by Region**
```
GET /api/admin/regions/:regionId/cars
```
- Returns all cars from all admins in the specified region
- Includes admin information for each car
- Public endpoint

**Get Region Statistics**
```
GET /api/admin/regions/stats
```
- Returns stats for all regions:
  - Region ID and name
  - Number of admins per region
  - Number of cars per region
- Used for displaying region counts

## Database Schema Updates

### User Model (Updated)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "user" | "admin" | "superadmin",
  fleetName: String,
  region: String  // NEW: Region ID from SENEGAL_REGIONS
}
```

## Frontend Components

### New Components

**`RegionSelector.jsx`**
- Displays grid of all Senegal regions
- Handles region selection
- Shows region cards with icons

**`RegionsPage.jsx`**
- Main page for region-based fleet browsing
- Shows region selector initially
- Displays selected region's fleets and cars
- Handles back navigation to region selection

### Updated Components

**`FleetPage.jsx`**
- Now redirects to `/fleet/regions`
- Acts as a router page

**`App.jsx`**
- Added route for `fleet/regions`
- Renders RegionsPage component

**`SuperAdminPage.jsx`**
- Added region selector when creating new admins
- Region dropdown with all 14 regions

## Admin Features

### Creating Admins with Regions

When a super admin creates a new fleet admin:
1. Go to Admin Dashboard
2. Click "+ Add Admin"
3. Fill in details:
   - Name
   - Email
   - Password
   - Fleet Name
   - **Region** (dropdown with all 14 regions)
4. Click "Create Admin"

The new admin will be associated with the selected region and their fleet will appear when users browse that region.

## Default Admin Setup

The default admin is created with:
- **Email**: admin@driveelite.com
- **Password**: admin123
- **Region**: dakar
- **Fleet Name**: Default Fleet

## CSS Styling

### Region Selector Styles
- Grid layout for region cards
- Hover effects with gold border
- Selected state highlighting
- Responsive design

### Admin/Fleet Cards
- Card layout showing admin info
- Avatar with initials
- Grid of cars below each admin
- Clean, modern design matching the theme

## Navigation Flow

``
Home → Fleet → Select Region → View Fleets → Select Car → Book
``

## Features

✅ **14 Senegal Regions**: All official regions included
✅ **Region Selection**: Beautiful grid layout with cards
✅ **Fleet Display**: Shows all admins and their cars per region
✅ **Car Booking**: Full booking flow from regional view
✅ **Back Navigation**: Easy return to region selection
✅ **Responsive Design**: Works on all screen sizes
✅ **Admin Region Assignment**: Super admins assign regions
✅ **Public API**: Region browsing requires no authentication
✅ **Statistics**: Track admins and cars per region

## Files Modified/Created

### Backend
- ✅ `models/users.js` - Added region field
- ✅ `routes/admin.js` - Added region-based endpoints
- ✅ `connection/connection.js` - Default admin with region

### Frontend
- ✅ `data/regions.js` - NEW: Senegal regions data
- ✅ `components/RegionSelector.jsx` - NEW: Region selector
- ✅ `pages/RegionsPage.jsx` - NEW: Region browsing page
- ✅ `pages/FleetPage.jsx` - Updated to redirect
- ✅ `pages/SuperAdminPage.jsx` - Added region selector
- ✅ `App.jsx` - Added routes
- ✅ `styles/fleet.css` - Added region styles

## Usage Example

```javascript
// Import regions
import { SENEGAL_REGIONS } from './data/regions'

// Get region by ID
const region = getRegionById('dakar')

// Use in component
<RegionSelector onSelect={(regionId) => console.log(regionId)} />
```

## Future Enhancements

- [ ] Filter by region in admin dashboard
- [ ] Region-based statistics dashboard
- [ ] Map view of regions
- [ ] Region-specific promotions
- [ ] Multi-language support for region names
