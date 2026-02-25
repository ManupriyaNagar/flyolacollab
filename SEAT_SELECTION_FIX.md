# Seat Selection Fix

## Issue
Seat selection component is blinking and not working properly on `/booking` page.

## Root Cause
The new refactored `SeatSelector` component is more complex than needed and has issues with:
1. Auto-selection logic causing re-renders
2. Complex hold/release logic
3. Multiple useEffect dependencies causing loops

## Old Working Implementation
The old booking page had simpler seat selection:
- Direct API calls to `${BASE_URL}/booked-seat/available-seats`
- Simple seat toggle without complex validation
- Auto-select first N seats on load
- Hold seats immediately on selection

## Solution Options

### Option 1: Simplify SeatSelector (Recommended)
Keep the modular approach but simplify the logic:
- Remove auto-selection from SeatSelector
- Let parent component handle initial selection
- Simplify hold logic - only hold when user clicks
- Remove complex dependency chains

### Option 2: Use Old Implementation
Copy the working seat selection code from `page.jsx.old-backup` into the new booking page.

## Implementation

I'll simplify the SeatSelector to match the old working behavior while keeping the modular structure.
