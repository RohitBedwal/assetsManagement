# Notification System Integration Guide

## Overview
I've successfully integrated a notification system into your Assets Management application. Now you'll get real-time notifications whenever items are added to any category (devices, vendors, or categories).

## What Was Implemented

### 1. **NotificationContext** (`src/context/NotificationContext.jsx`)
Created a global notification context that:
- Manages notification state across the entire app
- Persists notifications to localStorage (survives page refreshes)
- Provides methods to add, read, and clear notifications
- Tracks unread count for the badge

### 2. **Updated NotificationDropdown** (`src/components/NotificationDropdown.jsx`)
- Now uses the global NotificationContext instead of local state
- Automatically updates when new notifications are added
- Shows unread count badge on the bell icon

### 3. **Integrated Notification Triggers**

#### Categories (`src/pages/devices/Category/DeviceCategories.jsx`)
When you add a new category, a notification is created:
```javascript
addNotification(
  "New Category Added",
  `Category "${newCategory.name}" has been created successfully.`
);
```

#### Devices (`src/pages/devices/allDevices/Devices.jsx`)
When you add a new device, a notification is created:
```javascript
addNotification(
  "New Device Added",
  `Device "${data.sku}" (Serial: ${data.serial}) has been added to ${category?.name}.`
);
```

#### Vendors (`src/pages/Vendors/index.jsx`)
When you add or update a vendor, notifications are created:
- **New Vendor:**
  ```javascript
  addNotification(
    "New Vendor Added",
    `Vendor "${data.vendor}" (Contact: ${data.contact}) has been added successfully.`
  );
  ```
- **Updated Vendor:**
  ```javascript
  addNotification(
    "Vendor Updated",
    `Vendor "${data.vendor}" has been updated successfully.`
  );
  ```

## How to Use

### For Users
1. **Adding Items:** When you add a category, device, or vendor, you'll see:
   - A toast notification (temporary popup)
   - A new notification in the bell icon dropdown
   - The bell icon badge will show the unread count

2. **Managing Notifications:**
   - Click the bell icon to view all notifications
   - Click "Mark read" on individual notifications
   - Click "Mark all read" to mark everything as read
   - Click "Clear" to remove all notifications
   - Click "View all" to navigate to the reports page

3. **Persistence:** Your notifications are saved in localStorage, so they'll persist even if you refresh or close the browser.

### For Developers - Adding More Notifications

To add notifications in other parts of your app:

1. **Import the hook:**
   ```javascript
   import { useNotifications } from "../context/NotificationContext";
   ```

2. **Use the hook in your component:**
   ```javascript
   const { addNotification } = useNotifications();
   ```

3. **Call it when an action occurs:**
   ```javascript
   addNotification(
     "Title of Notification",
     "Detailed message about what happened"
   );
   ```

### Examples of Where to Add More Notifications

- **Device Assignment:**
  ```javascript
  addNotification(
    "Device Assigned",
    `Device "${device.sku}" has been assigned to project "${projectName}".`
  );
  ```

- **Device Unassignment:**
  ```javascript
  addNotification(
    "Device Unassigned",
    `Device "${device.sku}" is now back in stock.`
  );
  ```

- **Category Deletion:**
  ```javascript
  addNotification(
    "Category Deleted",
    `Category "${categoryName}" has been removed.`
  );
  ```

- **Vendor Deletion:**
  ```javascript
  addNotification(
    "Vendor Removed",
    `Vendor "${vendorName}" has been deleted.`
  );
  ```

- **Warranty Expiry Alerts:**
  ```javascript
  addNotification(
    "Warranty Expiring Soon",
    `Device "${device.sku}" warranty expires in ${daysLeft} days.`
  );
  ```

## Files Modified

1. **Created:**
   - `src/context/NotificationContext.jsx` - New notification context

2. **Modified:**
   - `src/main.jsx` - Added NotificationProvider wrapper
   - `src/components/NotificationDropdown.jsx` - Uses global context
   - `src/pages/devices/Category/DeviceCategories.jsx` - Adds notifications
   - `src/pages/devices/allDevices/Devices.jsx` - Adds notifications
   - `src/pages/Vendors/index.jsx` - Adds notifications

## Features

✅ **Real-time Updates:** Notifications appear instantly when actions occur  
✅ **Persistent Storage:** Notifications saved in localStorage  
✅ **Unread Badge:** Visual indicator of unread notifications  
✅ **Mark as Read:** Individual or bulk marking  
✅ **Clear All:** Remove all notifications at once  
✅ **Timestamps:** Shows relative time (e.g., "10 minutes ago")  
✅ **Responsive UI:** Works on all screen sizes  

## Testing

To test the notification system:

1. **Add a Category:**
   - Go to Device Categories page
   - Click "Add Category"
   - Fill the form and submit
   - Check the bell icon - you should see a notification

2. **Add a Device:**
   - Navigate to a category
   - Click "Add Device"
   - Fill the form and submit
   - Check the bell icon for the notification

3. **Add/Edit a Vendor:**
   - Go to Vendors page
   - Click "New Vendor" or edit existing
   - Submit the form
   - Check the bell icon for the notification

4. **Persistence Test:**
   - Add some notifications
   - Refresh the page
   - The notifications should still be there

## Troubleshooting

**Issue:** Notifications not appearing  
**Solution:** Make sure the NotificationProvider is wrapping your app in `main.jsx`

**Issue:** Notifications disappear on refresh  
**Solution:** Check browser console for localStorage errors

**Issue:** Bell icon doesn't show badge  
**Solution:** Verify the `unreadCount` is being calculated correctly in the context

## Future Enhancements

Consider adding:
- Notification sound/audio alerts
- Different notification types (info, warning, error, success)
- Notification categories/filters
- Push notifications (requires service worker)
- Notification preferences/settings
- Email notifications for critical alerts
- Notification history page with pagination
- Search/filter notifications

## Support

If you encounter any issues or need help extending the notification system, refer to:
- `src/context/NotificationContext.jsx` for the core logic
- `src/components/NotificationDropdown.jsx` for the UI component
