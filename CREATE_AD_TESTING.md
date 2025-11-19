# Create Ad / Publish Post - Testing Guide

## Quick Test (5 minutes)

### Test 1: Create Ad as User
```
1. Login to account
2. Click "Post Ad" button
3. Fill in form:
   - Title: "Test iPhone 13"
   - Category: "Informatique et Multimedia"
   - Location: "Tunis"
   - Description: "Brand new iPhone 13 with all accessories"
   - Price: "1500"
4. Upload image
5. Review and click "Publish Ad"
6. ✅ Should see success message
7. ✅ Should redirect to /my-ads
8. ✅ Ad should show with status "pending"
```

### Test 2: Approve Ad as Admin
```
1. Login as admin
2. Go to Admin Dashboard
3. Click "Pending" tab
4. Find the test ad
5. Click "Approve" button
6. ✅ Ad status should change to "active"
7. ✅ Ad should move to "Active" tab
```

### Test 3: Verify Ad on Marketplace
```
1. Go to home page
2. Search for the ad or scroll
3. ✅ Ad should appear
4. ✅ Can click to view details
5. ✅ Can contact seller
```

## Detailed Testing

### Test Suite 1: Ad Creation

#### Test 1.1: Create Ad with All Fields
**Steps:**
1. Login to account
2. Click "Post Ad" button
3. Fill all fields:
   - Title: "iPhone 13 Pro Max"
   - Category: "Informatique et Multimedia"
   - Location: "Tunis"
   - Description: "Brand new, never used, with original box and all accessories"
   - Price: "2500"
4. Upload 3 images
5. Review information
6. Click "Publish Ad"

**Expected Results:**
- ✅ Success message shown
- ✅ Redirected to /my-ads
- ✅ Ad visible with status "pending"
- ✅ Images uploaded successfully

**Pass Criteria:**
- [x] Ad created
- [x] Status is "pending"
- [x] Images uploaded
- [x] User redirected

#### Test 1.2: Create Ad with Minimum Fields
**Steps:**
1. Login to account
2. Click "Post Ad"
3. Fill minimum fields:
   - Title: "Test Item"
   - Description: "This is a test item for sale"
   - Price: "100"
4. Upload 1 image
5. Publish

**Expected Results:**
- ✅ Ad created successfully
- ✅ Status "pending"
- ✅ Can proceed to admin approval

**Pass Criteria:**
- [x] Ad created with minimum data
- [x] Validation passed

#### Test 1.3: Validation - Missing Title
**Steps:**
1. Click "Post Ad"
2. Leave title empty
3. Try to go to next step

**Expected Results:**
- ✅ Error message: "Title is required"
- ✅ Can't proceed

**Pass Criteria:**
- [x] Validation works
- [x] Error shown

#### Test 1.4: Validation - Short Title
**Steps:**
1. Click "Post Ad"
2. Enter title: "Hi"
3. Try to proceed

**Expected Results:**
- ✅ Error: "Title must be at least 5 characters"

**Pass Criteria:**
- [x] Validation enforced

#### Test 1.5: Validation - Missing Description
**Steps:**
1. Go to step 2
2. Leave description empty
3. Try to proceed

**Expected Results:**
- ✅ Error: "Description is required"

**Pass Criteria:**
- [x] Validation works

#### Test 1.6: Validation - Short Description
**Steps:**
1. Enter description: "Short"
2. Try to proceed

**Expected Results:**
- ✅ Error: "Description must be at least 20 characters"

**Pass Criteria:**
- [x] Validation enforced

#### Test 1.7: Validation - Invalid Price
**Steps:**
1. Enter price: "-100" or "0"
2. Try to proceed

**Expected Results:**
- ✅ Error: "Please enter a valid price"

**Pass Criteria:**
- [x] Price validation works

#### Test 1.8: Validation - No Images
**Steps:**
1. Go to step 3
2. Don't upload any images
3. Try to proceed

**Expected Results:**
- ✅ Error: "Please add at least one image"

**Pass Criteria:**
- [x] Image validation works

### Test Suite 2: Image Upload

#### Test 2.1: Upload Valid Image
**Steps:**
1. Go to step 3
2. Upload a PNG/JPG image (< 5MB)
3. Check preview

**Expected Results:**
- ✅ Image uploaded
- ✅ Preview shown
- ✅ Can remove image

**Pass Criteria:**
- [x] Image uploaded
- [x] Preview visible

#### Test 2.2: Upload Multiple Images
**Steps:**
1. Upload 5 images
2. Check all previews
3. Try to upload 6th image

**Expected Results:**
- ✅ First 5 uploaded
- ✅ 6th upload blocked
- ✅ Error: "Maximum 5 images allowed"

**Pass Criteria:**
- [x] Max 5 images enforced

#### Test 2.3: Upload Invalid File Type
**Steps:**
1. Try to upload PDF or TXT file
2. Check error

**Expected Results:**
- ✅ Error: "Only image files are allowed"

**Pass Criteria:**
- [x] File type validation works

#### Test 2.4: Upload Large Image
**Steps:**
1. Try to upload image > 5MB
2. Check error

**Expected Results:**
- ✅ Error: "Image size must be less than 5MB"

**Pass Criteria:**
- [x] File size validation works

#### Test 2.5: Remove Image
**Steps:**
1. Upload 3 images
2. Hover over image
3. Click X button
4. Check if removed

**Expected Results:**
- ✅ Image removed
- ✅ Preview updated
- ✅ Count decreased

**Pass Criteria:**
- [x] Image removal works

### Test Suite 3: Admin Approval

#### Test 3.1: Approve Ad
**Steps:**
1. Create ad as user
2. Login as admin
3. Go to Admin Dashboard
4. Click "Pending" tab
5. Find ad
6. Click "Approve" button

**Expected Results:**
- ✅ Ad status changes to "active"
- ✅ Ad moves to "Active" tab
- ✅ No errors

**Pass Criteria:**
- [x] Ad approved
- [x] Status updated
- [x] Tab updated

#### Test 3.2: Reject Ad
**Steps:**
1. Create ad
2. Go to Admin Dashboard
3. Click "Pending" tab
4. Find ad
5. Click "Reject" button

**Expected Results:**
- ✅ Ad status changes to "rejected"
- ✅ Ad moves to "Rejected" tab

**Pass Criteria:**
- [x] Ad rejected
- [x] Status updated

#### Test 3.3: View Pending Ads
**Steps:**
1. Create 3 ads
2. Go to Admin Dashboard
3. Click "Pending" tab
4. Count ads

**Expected Results:**
- ✅ All 3 ads shown
- ✅ Correct count
- ✅ All with status "pending"

**Pass Criteria:**
- [x] All pending ads visible
- [x] Correct count

### Test Suite 4: Marketplace Visibility

#### Test 4.1: Pending Ad Not Visible
**Steps:**
1. Create ad (status: pending)
2. Go to home page
3. Search for ad
4. Check if visible

**Expected Results:**
- ✅ Ad NOT visible to other users
- ✅ Only visible to owner in /my-ads

**Pass Criteria:**
- [x] Pending ad hidden

#### Test 4.2: Active Ad Visible
**Steps:**
1. Create ad
2. Approve in admin panel
3. Go to home page
4. Search for ad

**Expected Results:**
- ✅ Ad visible
- ✅ Can click to view
- ✅ Can contact seller

**Pass Criteria:**
- [x] Active ad visible

#### Test 4.3: Rejected Ad Not Visible
**Steps:**
1. Create ad
2. Reject in admin panel
3. Go to home page
4. Search for ad

**Expected Results:**
- ✅ Ad NOT visible
- ✅ Only visible to owner

**Pass Criteria:**
- [x] Rejected ad hidden

### Test Suite 5: User Experience

#### Test 5.1: Success Message
**Steps:**
1. Create and publish ad
2. Check for success message

**Expected Results:**
- ✅ Message: "Ad published successfully! It will appear after admin approval."
- ✅ Clear and helpful

**Pass Criteria:**
- [x] Message shown
- [x] Message is clear

#### Test 5.2: Navigation After Publish
**Steps:**
1. Publish ad
2. Check where redirected

**Expected Results:**
- ✅ Redirected to /my-ads
- ✅ Ad visible in list

**Pass Criteria:**
- [x] Correct redirect

#### Test 5.3: View Own Pending Ad
**Steps:**
1. Create ad
2. Go to /my-ads
3. Check if visible

**Expected Results:**
- ✅ Ad visible with status "pending"
- ✅ Can edit
- ✅ Can delete

**Pass Criteria:**
- [x] Ad visible to owner

### Test Suite 6: Edge Cases

#### Test 6.1: Create Ad Without Login
**Steps:**
1. Don't login
2. Try to access /create-ad

**Expected Results:**
- ✅ Redirected to login
- ✅ Can't create ad

**Pass Criteria:**
- [x] Protected route works

#### Test 6.2: Create Multiple Ads
**Steps:**
1. Create 5 ads
2. Go to /my-ads
3. Check all visible

**Expected Results:**
- ✅ All 5 ads visible
- ✅ All with status "pending"

**Pass Criteria:**
- [x] Multiple ads work

#### Test 6.3: Edit Pending Ad
**Steps:**
1. Create ad
2. Click edit
3. Change title
4. Save

**Expected Results:**
- ✅ Ad updated
- ✅ Still status "pending"

**Pass Criteria:**
- [x] Edit works
- [x] Status unchanged

#### Test 6.4: Delete Pending Ad
**Steps:**
1. Create ad
2. Click delete
3. Confirm

**Expected Results:**
- ✅ Ad deleted
- ✅ Not in /my-ads
- ✅ Not in admin panel

**Pass Criteria:**
- [x] Delete works

## Test Checklist

### Before Testing
- [ ] Dev server running
- [ ] Logged in as user
- [ ] Have admin account
- [ ] Browser open
- [ ] Console available (F12)

### During Testing
- [ ] Monitor console
- [ ] Check network requests
- [ ] Watch for errors
- [ ] Note any issues

### After Testing
- [ ] Document results
- [ ] Note any failures
- [ ] Check performance
- [ ] Report issues

## Expected Results Summary

| Test | Expected | Status |
|------|----------|--------|
| Create ad | Status "pending" | ✅ |
| Upload images | Images saved | ✅ |
| Validation | Errors shown | ✅ |
| Admin approval | Status "active" | ✅ |
| Marketplace visibility | Active ads visible | ✅ |
| Pending ads hidden | Not visible | ✅ |
| Success message | Shown to user | ✅ |
| Navigation | Redirect to /my-ads | ✅ |

## Troubleshooting

### Ad Not Created
1. Check console for errors
2. Verify all fields filled
3. Check image upload
4. Check Supabase connection

### Ad Not Visible in Admin
1. Check if logged in as admin
2. Check "Pending" tab
3. Refresh page
4. Check console for errors

### Images Not Uploaded
1. Check file size (max 5MB)
2. Check file type (PNG, JPG, GIF)
3. Check storage permissions
4. Try again

### Can't Approve Ad
1. Check if admin
2. Check console for errors
3. Refresh page
4. Check Supabase logs

## Success Criteria

✅ Ad created with status "pending"
✅ Images uploaded successfully
✅ Validation works
✅ Admin can approve/reject
✅ Active ads visible on marketplace
✅ Pending ads hidden
✅ User gets success message
✅ Redirected to /my-ads

## Status

🟢 **Ready for Testing**

---

**Last Updated:** November 19, 2025
**Time to Test:** 15-20 minutes
