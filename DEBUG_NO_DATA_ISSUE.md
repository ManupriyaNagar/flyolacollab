# Debugging: No Flight/Helicopter Data Showing

## Issue
VehicleCard components are not showing any flight or helicopter data on the pages.

## Debugging Steps Added

### 1. Console Logging
I've added comprehensive console logging to help identify where the data flow breaks:

#### In `/scheduled-flight/page.jsx`:
- `[ScheduledFlight] API Response:` - Shows how many records fetched from API
- `[ScheduledFlight] Normalized schedules:` - Shows how many schedules after normalization
- `[ScheduledFlight] Missing data:` - Shows if any data arrays are missing
- `[ScheduledFlight] Filtering data:` - Shows filter criteria being applied
- `[ScheduledFlight] Filtered result:` - Shows final count after filtering

#### In `/helicopter-flight/page.jsx`:
- `[HelicopterFlight] API Response:` - Shows API fetch results
- `[HelicopterFlight] Normalized schedules:` - Shows normalized data count

#### In `VehicleCard.jsx`:
- `[VehicleCard] Rendering:` - Shows props received by each card

### 2. How to Debug

1. **Open Browser Console** (F12 or Cmd+Option+I)
2. **Navigate to the page** (e.g., `/scheduled-flight`)
3. **Check the console logs** in this order:

```
Expected Log Flow:
1. [ScheduledFlight] API Response: { schedules: X, flights: Y, airports: Z }
2. [ScheduledFlight] Normalized schedules: X
3. [ScheduledFlight] Filtering data: { schedules: X, flights: Y, airports: Z, filters: {...} }
4. [ScheduledFlight] Filtered result: X
5. [VehicleCard] Rendering: { type, scheduleId, vehicleNumber, ... } (for each card)
```

### 3. Common Issues to Check

#### Issue A: API Returns Empty Data
**Symptoms**: 
```
[ScheduledFlight] API Response: { schedules: 0, flights: 0, airports: 0 }
```

**Possible Causes**:
- Backend API is not running
- No data in database for the selected month
- API authentication issues
- CORS issues

**Solution**:
- Check backend server is running
- Verify database has flight schedules for current month
- Check browser Network tab for API errors
- Verify API endpoints are correct

#### Issue B: Data Fetched But Filtered Out
**Symptoms**:
```
[ScheduledFlight] API Response: { schedules: 10, flights: 5, airports: 3 }
[ScheduledFlight] Filtered result: 0
```

**Possible Causes**:
- Filters are too restrictive
- Date mismatch (schedule dates don't match selected date)
- Status filter excluding all results
- Departure/arrival city mismatch

**Solution**:
- Check the filter values in console
- Try clearing all filters
- Verify `searchCriteria.date` matches schedule dates
- Check if `filterStatus` is set correctly

#### Issue C: Data Exists But Cards Don't Render
**Symptoms**:
```
[ScheduledFlight] Filtered result: 5
(No VehicleCard logs)
```

**Possible Causes**:
- VehicleCard component has rendering error
- Props mapping is incorrect
- React key issues

**Solution**:
- Check browser console for React errors
- Verify VehicleCard import is correct
- Check props being passed to VehicleCard

#### Issue D: Cards Render But Show "Unknown"
**Symptoms**:
```
[VehicleCard] Rendering: { vehicleNumber: "Unknown", departure: "Unknown", arrival: "Unknown" }
```

**Possible Causes**:
- Flight/helicopter data not matching schedule IDs
- Airport/helipad data not matching location IDs
- Data structure mismatch

**Solution**:
- Check if `flights.find((f) => f.id === fs.flight_id)` returns data
- Verify airport/helipad IDs match
- Check API response structure

### 4. Quick Fixes to Try

#### Fix 1: Clear All Filters
The FilterSidebar has a "Clear All Filters" button. Click it to reset all filters to defaults.

#### Fix 2: Check Date Selection
Make sure the selected date has schedules. Try selecting today's date or a future date.

#### Fix 3: Verify API Endpoints
Check that these endpoints are working:
- `/flights` - Returns flight data
- `/flight-schedules?user=true&month=YYYY-MM` - Returns schedules
- `/airports` - Returns airport data
- `/helicopters` - Returns helicopter data
- `/helicopter-schedules?user=true&month=YYYY-MM` - Returns helicopter schedules
- `/helipads` - Returns helipad data

#### Fix 4: Check Network Tab
1. Open DevTools → Network tab
2. Reload the page
3. Look for failed requests (red)
4. Check response data for each API call

### 5. Data Structure Expected

#### Flight Schedule Object:
```javascript
{
  id: 1,
  flight_id: 1,
  departure_airport_id: 1,
  arrival_airport_id: 2,
  departure_date: "2024-02-26",
  departure_time: "09:00:00",
  arrival_time: "10:30:00",
  price: "5000",
  via_stop_id: "[]",
  availableSeats: 4
}
```

#### Flight Object:
```javascript
{
  id: 1,
  flight_number: "FL001",
  seat_limit: 6,
  status: 0
}
```

#### Airport Object:
```javascript
{
  id: 1,
  city: "Delhi",
  airport_code: "DEL"
}
```

### 6. Next Steps

1. **Run the app** and open browser console
2. **Navigate to** `/scheduled-flight` or `/helicopter-flight`
3. **Copy all console logs** and share them
4. **Check Network tab** for API responses
5. **Try the quick fixes** above

This will help identify exactly where the data flow is breaking!
