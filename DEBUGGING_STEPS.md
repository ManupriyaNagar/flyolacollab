# Debugging Steps - VehicleCard Not Showing Data

## What I've Added

I've added comprehensive console logging throughout the data flow to help identify where the issue is:

### 1. API Fetch Logging
- Shows how many records are fetched from each API endpoint
- Location: `fetchData()` function in both pages

### 2. Data Processing Logging  
- Shows filtering criteria and results
- Location: `getFilteredAndSortedFlightSchedules()` and `getFilteredAndSortedHelicopterSchedules()`

### 3. Card Rendering Logging
- Shows what data is being passed to each VehicleCard
- Location: Before each `<VehicleCard />` component

### 4. VehicleCard Props Logging
- Shows what props VehicleCard receives
- Location: Inside VehicleCard component

## How to Debug

### Step 1: Open Browser Console
1. Open your app in browser
2. Press F12 (or Cmd+Option+I on Mac)
3. Go to Console tab

### Step 2: Navigate to Page
Go to either:
- `http://localhost:3000/scheduled-flight`
- `http://localhost:3000/helicopter-flight`

### Step 3: Check Console Logs

You should see logs in this order:

```
[ScheduledFlight] API Response: { schedules: X, flights: Y, airports: Z }
[ScheduledFlight] Normalized schedules: X
[ScheduledFlight] Filtering data: { schedules: X, flights: Y, airports: Z, filters: {...} }
[ScheduledFlight] Filtered result: X
[ScheduledFlight] Rendering card: { scheduleId: 1, flightNumber: "FL001", ... }
[VehicleCard] Rendering: { type: "flight", scheduleId: 1, ... }
```

## Common Issues & Solutions

### Issue 1: No API Data
**Symptoms:**
```
[ScheduledFlight] API Response: { schedules: 0, flights: 0, airports: 0 }
```

**Solutions:**
1. Check if backend is running
2. Check if database has data for current month
3. Check Network tab for API errors
4. Verify API base URL is correct

### Issue 2: Data Filtered Out
**Symptoms:**
```
[ScheduledFlight] API Response: { schedules: 10, ... }
[ScheduledFlight] Filtered result: 0
```

**Solutions:**
1. Click "Clear All Filters" button in FilterSidebar
2. Check if selected date has schedules
3. Verify filter criteria in console logs
4. Try selecting a different date

### Issue 3: Cards Not Rendering
**Symptoms:**
```
[ScheduledFlight] Filtered result: 5
(No "Rendering card" logs)
```

**Solutions:**
1. Check browser console for React errors
2. Verify VehicleCard component is imported correctly
3. Check if there's a JavaScript error breaking the render

### Issue 4: Cards Show "Unknown"
**Symptoms:**
```
[VehicleCard] Rendering: { vehicleNumber: "Unknown", departure: "Unknown" }
```

**Solutions:**
1. Check if flight/helicopter IDs match schedule IDs
2. Verify airport/helipad IDs match
3. Check API response structure matches expected format

## Quick Fixes

### Fix 1: Restart Development Server
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Fix 2: Clear Browser Cache
1. Open DevTools
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Check API Endpoints
Open these URLs directly in browser to verify data:
- `http://localhost:YOUR_PORT/flights`
- `http://localhost:YOUR_PORT/flight-schedules?user=true&month=2024-02`
- `http://localhost:YOUR_PORT/airports`
- `http://localhost:YOUR_PORT/helicopters`
- `http://localhost:YOUR_PORT/helicopter-schedules?user=true&month=2024-02`
- `http://localhost:YOUR_PORT/helipads`

## What to Share

If you still have issues, please share:
1. **All console logs** (copy/paste from browser console)
2. **Network tab** screenshots showing API responses
3. **Any error messages** in console
4. **Browser and version** you're using

## Expected Data Flow

```
API Fetch → Normalize Data → Apply Filters → Map to Cards → Render VehicleCard
    ↓            ↓               ↓              ↓              ↓
  10 items    10 items        5 items       5 items       5 cards shown
```

If any step shows 0 items, that's where the problem is!

## Next Steps

After checking the console logs, we can:
1. Identify exactly where data is lost
2. Fix the specific issue (API, filtering, or rendering)
3. Verify the fix works with real data

The console logs will tell us everything we need to know!
