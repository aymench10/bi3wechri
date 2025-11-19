# Data Consistency Testing Guide

## Test Environment Setup

### Prerequisites
1. Development server running: `npm run dev`
2. Browser DevTools open: Press `F12`
3. Console tab active to see logs
4. Network tab available to monitor requests

## Test Suite 1: Retry Logic Verification

### Test 1.1: Verify Retry on Transient Failure
**Objective:** Confirm that failed requests are retried automatically

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Throttle network: Set to "Slow 3G"
4. Navigate to Admin Dashboard
5. Watch console for retry messages

**Expected Results:**
```
[dataService] Fetch admin stats - attempt 1
[dataService] Fetch admin stats - attempt 2 (retry after 1000ms)
[dataService] Fetch admin stats - success
```

**Pass Criteria:**
- ✅ See retry messages in console
- ✅ Page loads successfully despite slow network
- ✅ Data appears correctly

### Test 1.2: Verify Exponential Backoff
**Objective:** Confirm delays increase between retries

**Steps:**
1. Open Console tab
2. Add breakpoints in dataService.js
3. Trigger a request that will fail
4. Monitor delay times

**Expected Results:**
- First retry: ~1000ms delay
- Second retry: ~2000ms delay
- Third retry: ~4000ms delay

**Pass Criteria:**
- ✅ Delays increase exponentially
- ✅ Max delay doesn't exceed 5000ms
- ✅ Backoff multiplier is 2x

## Test Suite 2: Error Handling Verification

### Test 2.1: Network Disconnection
**Objective:** Verify app handles network errors gracefully

**Steps:**
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Offline" checkbox
4. Try to load Admin Dashboard
5. Check error message displayed

**Expected Results:**
- Error message shown to user
- App doesn't crash
- Retry logic still attempts
- Console shows error details

**Pass Criteria:**
- ✅ User sees error message
- ✅ App remains functional
- ✅ No console errors/crashes
- ✅ Can retry when online

### Test 2.2: Invalid Data Response
**Objective:** Verify app handles malformed data

**Steps:**
1. Modify a data response in DevTools
2. Trigger data fetch
3. Check error handling

**Expected Results:**
- Error caught and logged
- User sees error message
- App doesn't crash

**Pass Criteria:**
- ✅ Error properly caught
- ✅ User feedback provided
- ✅ No app crash

## Test Suite 3: Data Consistency Verification

### Test 3.1: Consistent Data Across Refreshes
**Objective:** Verify data remains consistent after page refresh

**Steps:**
1. Go to Admin Dashboard
2. Note the stats (total ads, pending, etc.)
3. Refresh page (F5)
4. Compare stats with previous values

**Expected Results:**
- Stats identical before and after refresh
- No missing or duplicate data
- Same number of ads shown

**Pass Criteria:**
- ✅ Stats match exactly
- ✅ No data loss
- ✅ No duplicates

### Test 3.2: Data Consistency Across Components
**Objective:** Verify same data appears in different components

**Steps:**
1. Go to Home page
2. Note an ad's details (title, price, location)
3. Click on the ad to view details
4. Compare with home page data

**Expected Results:**
- Ad details identical
- No discrepancies
- All fields match

**Pass Criteria:**
- ✅ Data matches exactly
- ✅ No inconsistencies
- ✅ All fields present

### Test 3.3: Data Consistency After Updates
**Objective:** Verify data updates consistently across app

**Steps:**
1. Go to Admin Dashboard
2. Approve a pending ad
3. Check MyAds page
4. Verify ad status changed

**Expected Results:**
- Ad status updated immediately
- Reflected in all views
- Stats updated correctly

**Pass Criteria:**
- ✅ Update reflected everywhere
- ✅ Stats recalculated
- ✅ No stale data

## Test Suite 4: Component-Specific Tests

### Test 4.1: AdminDashboard Data Loading
**Objective:** Verify admin dashboard loads all data correctly

**Steps:**
1. Navigate to Admin Dashboard
2. Wait for data to load
3. Check all sections:
   - Stats cards
   - Pending ads list
   - Active ads list
   - Users list
4. Verify counts match

**Expected Results:**
- All sections load
- Counts are accurate
- No missing data
- Proper sorting

**Pass Criteria:**
- ✅ All sections populated
- ✅ Counts accurate
- ✅ Data sorted correctly
- ✅ No loading errors

### Test 4.2: MyAds Page Data Loading
**Objective:** Verify user's ads load correctly

**Steps:**
1. Login as user
2. Go to MyAds page
3. Check all ads displayed
4. Apply filters (active, pending, rejected)
5. Verify filtered results

**Expected Results:**
- All user's ads shown
- Filters work correctly
- Counts accurate
- Proper sorting

**Pass Criteria:**
- ✅ All ads displayed
- ✅ Filters work
- ✅ Counts correct
- ✅ Sorting works

### Test 4.3: Similar Ads Loading
**Objective:** Verify similar ads load on ad detail page

**Steps:**
1. Go to ad detail page
2. Scroll to Similar Ads section
3. Verify ads load
4. Check category/location match

**Expected Results:**
- Similar ads displayed
- Correct category/location
- No duplicates
- Proper count

**Pass Criteria:**
- ✅ Ads displayed
- ✅ Relevant to current ad
- ✅ No duplicates
- ✅ Correct count

## Test Suite 5: Performance Tests

### Test 5.1: Data Loading Speed
**Objective:** Verify data loads within acceptable time

**Steps:**
1. Open DevTools Network tab
2. Go to Admin Dashboard
3. Measure load time
4. Check console for timing

**Expected Results:**
- Admin dashboard loads < 3 seconds
- Data appears within 2 seconds
- No excessive retries

**Pass Criteria:**
- ✅ Load time < 3 seconds
- ✅ Data visible quickly
- ✅ Minimal retries

### Test 5.2: Multiple Concurrent Requests
**Objective:** Verify app handles multiple requests

**Steps:**
1. Open multiple pages quickly
2. Monitor network requests
3. Check for race conditions
4. Verify data consistency

**Expected Results:**
- All requests complete
- No race conditions
- Data consistent
- No crashes

**Pass Criteria:**
- ✅ All requests succeed
- ✅ No race conditions
- ✅ Data consistent
- ✅ App stable

## Test Suite 6: Edge Cases

### Test 6.1: Empty Data Sets
**Objective:** Verify app handles empty results

**Steps:**
1. Create user with no ads
2. Go to MyAds page
3. Check empty state message
4. Verify no errors

**Expected Results:**
- Empty state shown
- No errors
- Proper message displayed
- Can create new ad

**Pass Criteria:**
- ✅ Empty state handled
- ✅ No errors shown
- ✅ User can proceed

### Test 6.2: Large Data Sets
**Objective:** Verify app handles large amounts of data

**Steps:**
1. Create many ads (50+)
2. Go to Admin Dashboard
3. Check performance
4. Verify all data loads

**Expected Results:**
- All data loads
- Performance acceptable
- No crashes
- Pagination works

**Pass Criteria:**
- ✅ All data loads
- ✅ Performance good
- ✅ No crashes
- ✅ Pagination works

### Test 6.3: Missing Related Data
**Objective:** Verify app handles missing related records

**Steps:**
1. Delete a user profile
2. Try to view their ads
3. Check error handling
4. Verify graceful degradation

**Expected Results:**
- App doesn't crash
- Error handled gracefully
- Partial data shown
- User informed

**Pass Criteria:**
- ✅ No crash
- ✅ Error handled
- ✅ Partial data shown
- ✅ User informed

## Test Suite 7: User Actions

### Test 7.1: Approve Ad
**Objective:** Verify ad approval works correctly

**Steps:**
1. Go to Admin Dashboard
2. Find pending ad
3. Click approve
4. Verify status changed
5. Check stats updated

**Expected Results:**
- Ad status changes to active
- Stats update
- Ad appears in active list
- Removed from pending list

**Pass Criteria:**
- ✅ Status changed
- ✅ Stats updated
- ✅ Lists updated
- ✅ No errors

### Test 7.2: Reject Ad
**Objective:** Verify ad rejection works correctly

**Steps:**
1. Go to Admin Dashboard
2. Find pending ad
3. Click reject
4. Verify status changed
5. Check stats updated

**Expected Results:**
- Ad status changes to rejected
- Stats update
- Ad appears in rejected list
- Removed from pending list

**Pass Criteria:**
- ✅ Status changed
- ✅ Stats updated
- ✅ Lists updated
- ✅ No errors

### Test 7.3: Delete Ad
**Objective:** Verify ad deletion works correctly

**Steps:**
1. Go to Admin Dashboard
2. Find ad to delete
3. Click delete
4. Confirm deletion
5. Verify ad removed

**Expected Results:**
- Ad deleted
- Stats updated
- Ad removed from lists
- Count decreased

**Pass Criteria:**
- ✅ Ad deleted
- ✅ Stats updated
- ✅ Lists updated
- ✅ Count correct

## Test Checklist

### Before Testing
- [ ] Dev server running
- [ ] DevTools open
- [ ] Console visible
- [ ] Network tab ready
- [ ] Test data available

### During Testing
- [ ] Monitor console logs
- [ ] Check network requests
- [ ] Watch for errors
- [ ] Note timing
- [ ] Record issues

### After Testing
- [ ] Document results
- [ ] Note any failures
- [ ] Check performance
- [ ] Verify consistency
- [ ] Report issues

## Automated Testing Commands

### Run Console Tests
```javascript
// Test data service
import { fetchAllAds, validateDataConsistency } from './src/lib/dataService.js'

// Test fetch
const result = await fetchAllAds({ limit: 10 })
console.log('Fetch result:', result)

// Test validation
const validation = await validateDataConsistency()
console.log('Validation:', validation)
```

### Monitor Retry Logic
```javascript
// Add to console to see retry attempts
window.addEventListener('error', (e) => {
  console.log('Error caught:', e.message)
})
```

## Performance Benchmarks

### Expected Performance
- Admin Dashboard load: < 3 seconds
- MyAds load: < 2 seconds
- Ad Detail load: < 2 seconds
- Similar Ads load: < 1.5 seconds
- Data update: < 1 second

### Acceptable Retry Count
- Network issue: 1-2 retries
- Timeout: 2-3 retries
- Server error: 1-2 retries

## Reporting Issues

### Issue Template
```
Title: [Component] Data not appearing correctly

Environment:
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Network: [Normal/Slow/Offline]

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
- Data should appear

Actual Result:
- Data doesn't appear

Console Errors:
- [Paste error messages]

Screenshots:
- [Attach if possible]
```

## Success Criteria

✅ All tests pass
✅ No data inconsistencies
✅ Retry logic works
✅ Error handling works
✅ Performance acceptable
✅ No crashes
✅ User experience smooth

---

**Last Updated:** November 19, 2025
**Status:** Ready for Testing
