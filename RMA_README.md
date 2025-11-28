# RMA (Return Merchandise Authorization) System

Complete frontend implementation for managing product returns in the SOS Asset Management system.

## 📋 Features

### For Users:
- **Submit RMA Requests** with:
  - Serial Number
  - Invoice Number
  - Purchase Order (PO) Number
  - Reason for return (Defective, Damaged, Wrong Item, Performance Issues, Other)
  - Detailed description
  - File attachments (Photos and PDFs)
- **Track RMA Status** with visual progress timeline
- **View Request History** with complete details and attachments

### For Admins:
- **View All RMA Requests** from all users
- **Filter and Search** by serial number, invoice, or PO number
- **Update Request Status**:
  - Pending
  - Approved
  - Rejected
  - Processing
  - Completed
- **Add Admin Notes** for communication
- **Dashboard Statistics** showing total, pending, approved, and rejected requests

## 🗂️ File Structure

```
src/pages/RMA/
├── RMASubmit.jsx       # User submission form
├── RMAList.jsx         # User's RMA requests list
├── RMAAdmin.jsx        # Admin management dashboard
└── index.js            # Module exports
```

## 🚀 Usage

### User Workflow

1. **Navigate to RMA:**
   - Click on "RMA" in the sidebar navigation
   - Or go to `/rma/list`

2. **Submit New Request:**
   - Click "New RMA Request" button
   - Fill in all required fields:
     - Serial Number (required)
     - Invoice Number (required)
     - PO Number (required)
     - Reason (optional)
     - Description (optional)
   - Upload files (at least 1 required):
     - Product photos showing defect
     - Invoice copy (PDF)
     - Purchase order (PDF)
   - Click "Submit RMA Request"

3. **Track Status:**
   - View all your submitted requests on the list page
   - See status: Pending, Approved, Rejected, Processing, or Completed
   - Progress bar shows completion percentage
   - Click "View Details" to see full information

### Admin Workflow

1. **Access Admin Dashboard:**
   - Navigate to `/rma/admin` (admin role required)

2. **View Statistics:**
   - Dashboard shows total requests, pending, approved, and rejected counts

3. **Manage Requests:**
   - Search by serial number, invoice, or PO
   - Filter by status (all, pending, approved, rejected, processing, completed)
   - Click "View" to see full request details

4. **Update Status:**
   - From pending: Approve, Process, or Reject
   - From processing: Mark as Completed
   - Add admin notes for communication
   - User receives updated status

## 🎨 UI Components

### RMASubmit Page
- Clean form layout with validation
- Drag-and-drop file upload
- File previews (images and PDFs)
- Real-time validation
- Informational alerts

### RMAList Page
- Card-based layout for easy scanning
- Status badges with color coding
- Visual progress timeline
- Quick actions for viewing details
- Empty state with call-to-action

### RMAAdmin Page
- Statistics dashboard at top
- Search and filter functionality
- Sortable table view
- Modal for detailed view and actions
- Bulk action capabilities

## 🔗 Routes

```javascript
// User Routes
/rma/submit          // Submit new RMA request
/rma/list            // View my RMA requests

// Admin Routes
/rma/admin           // Manage all RMA requests (admin only)
```

## 🎯 API Integration

The frontend expects these backend endpoints:

### User Endpoints:
- `POST /api/rma/submit` - Submit new RMA request
- `GET /api/rma/my-requests` - Get user's RMA requests

### Admin Endpoints:
- `GET /api/rma/admin/all` - Get all RMA requests
- `PUT /api/rma/admin/update/:id` - Update RMA status

See `RMA_BACKEND_API_GUIDE.md` for complete backend implementation details.

## 📦 Dependencies

All dependencies are already included in the project:

```json
{
  "react": "^19.1.1",
  "react-router-dom": "^7.9.1",
  "lucide-react": "^0.544.0",
  "react-hot-toast": "^2.6.0"
}
```

## 🔐 Authentication

- All RMA endpoints require authentication
- Uses Bearer token from localStorage
- Admin endpoints require admin role
- Token sent in Authorization header: `Bearer <token>`

## 📁 File Upload

### Supported Formats:
- **Images:** PNG, JPG, JPEG
- **Documents:** PDF

### Validation:
- Maximum file size: 10MB per file
- At least 1 file required
- Multiple files supported
- Client-side validation before upload

### Storage:
- Files sent as `multipart/form-data`
- Backend handles file storage
- URLs returned in response

## 🎨 Status Colors

```javascript
pending    → Yellow (⏳ Clock icon)
approved   → Green  (✓ CheckCircle icon)
rejected   → Red    (✗ XCircle icon)
processing → Blue   (↻ RefreshCcw icon)
completed  → Gray   (✓ CheckCircle icon)
```

## 🔔 Notifications

Uses React Hot Toast for notifications:
- Success messages (green)
- Error messages (red)
- Loading states
- Auto-dismiss after 3 seconds

## 📱 Responsive Design

- Mobile-friendly layout
- Responsive grid system
- Touch-friendly buttons
- Optimized for tablets and phones
- Sidebar collapses on mobile

## 🛠️ Customization

### Adding New Status:
1. Update status enum in backend schema
2. Add status to `statusConfig` in components
3. Update progress calculation logic

### Modifying Form Fields:
1. Edit `formData` state in `RMASubmit.jsx`
2. Update backend validation
3. Adjust layout in JSX

### Changing Colors:
- Edit Tailwind classes in components
- Update `statusConfig` objects
- Modify CSS in component files

## 🐛 Troubleshooting

### Files Not Uploading:
- Check file size (max 10MB)
- Verify file type is allowed
- Ensure backend endpoint accepts multipart/form-data
- Check CORS configuration

### Status Not Updating:
- Verify admin role in localStorage
- Check authentication token
- Ensure backend endpoint is accessible
- Check browser console for errors

### Missing Data:
- Verify API_URL environment variable
- Check network tab for failed requests
- Ensure backend is running
- Verify database connection

## 🔄 Future Enhancements

Potential features to add:

1. **Email Notifications:**
   - Notify user when admin updates status
   - Send confirmation on submission

2. **RMA Number Generation:**
   - Auto-generate unique RMA numbers
   - Display prominently on request

3. **Comments/Chat:**
   - Allow back-and-forth communication
   - Thread-based discussion

4. **Export Functionality:**
   - Export RMA list to CSV/Excel
   - Generate PDF reports

5. **Advanced Filters:**
   - Date range picker
   - Multiple status selection
   - Custom field filters

6. **File Management:**
   - Download all attachments as ZIP
   - Preview PDFs in modal
   - Image zoom functionality

## 📝 Testing Checklist

- [ ] Submit RMA with all required fields
- [ ] Upload multiple file types
- [ ] View submitted requests in list
- [ ] Check status progress bar updates
- [ ] Admin can view all requests
- [ ] Admin can update status
- [ ] Search functionality works
- [ ] Filter by status works
- [ ] Modal displays correctly
- [ ] File downloads work
- [ ] Responsive on mobile devices
- [ ] Toast notifications appear
- [ ] Navigation works correctly

## 🤝 Contributing

When modifying the RMA system:
1. Update this README with changes
2. Test all user and admin flows
3. Verify backend integration
4. Check responsive design
5. Update API documentation if needed

## 📄 License

Part of the SOS Asset Management System.
© SOS ASSET 2024

---

For backend implementation, see `RMA_BACKEND_API_GUIDE.md`
