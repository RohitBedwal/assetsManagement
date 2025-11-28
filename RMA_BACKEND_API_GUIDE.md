# RMA Backend API Implementation Guide

This document outlines the backend API endpoints required for the RMA (Return Merchandise Authorization) system.

## Database Schema

### RMA Model (MongoDB/Mongoose)

```javascript
const rmaSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    trim: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    trim: true
  },
  poNumber: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    enum: ['Defective', 'Damaged', 'Wrong Item', 'Performance Issues', 'Other'],
    default: 'Other'
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processing', 'completed'],
    default: 'pending'
  },
  attachments: [{
    filename: String,
    url: String,
    type: String, // 'image' or 'pdf'
    uploadedAt: Date
  }],
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminNotes: {
    type: String
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: true
});
```

## API Endpoints

### 1. Submit RMA Request (User)

**Endpoint:** `POST /api/rma/submit`

**Authentication:** Required (Bearer Token)

**Content-Type:** `multipart/form-data`

**Request Body:**
```
serialNumber: String (required)
invoiceNumber: String (required)
poNumber: String (required)
reason: String (optional)
description: String (optional)
attachments: Files[] (required - at least 1 file)
```

**Implementation Example:**
```javascript
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/rma/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'rma-' + uniqueSuffix + path.extname(file.original name));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

router.post('/submit', authenticateToken, upload.array('attachments', 10), async (req, res) => {
  try {
    const { serialNumber, invoiceNumber, poNumber, reason, description } = req.body;
    
    if (!serialNumber || !invoiceNumber || !poNumber) {
      return res.status(400).json({ message: 'Serial number, invoice number, and PO number are required' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one attachment is required' });
    }
    
    const attachments = req.files.map(file => ({
      filename: file.originalname,
      url: `/uploads/rma/${file.filename}`,
      type: file.mimetype.startsWith('image') ? 'image' : 'pdf',
      uploadedAt: new Date()
    }));
    
    const rma = new RMA({
      serialNumber,
      invoiceNumber,
      poNumber,
      reason,
      description,
      attachments,
      submittedBy: req.user.id,
      status: 'pending'
    });
    
    await rma.save();
    
    res.status(201).json({
      message: 'RMA request submitted successfully',
      rma
    });
  } catch (error) {
    console.error('RMA submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
```

**Response (Success - 201):**
```json
{
  "message": "RMA request submitted successfully",
  "rma": {
    "_id": "60d5f4849c0b2c001c8d1234",
    "serialNumber": "SN123456",
    "invoiceNumber": "INV-2024-001",
    "poNumber": "PO-2024-001",
    "reason": "Defective",
    "status": "pending",
    "attachments": [...],
    "submittedBy": "60d5f4849c0b2c001c8d1111",
    "createdAt": "2024-11-28T10:00:00.000Z"
  }
}
```

---

### 2. Get User's RMA Requests

**Endpoint:** `GET /api/rma/my-requests`

**Authentication:** Required (Bearer Token)

**Implementation Example:**
```javascript
router.get('/my-requests', authenticateToken, async (req, res) => {
  try {
    const rmaRequests = await RMA.find({ submittedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'name email')
      .populate('processedBy', 'name email');
    
    res.json({
      message: 'RMA requests fetched successfully',
      requests: rmaRequests
    });
  } catch (error) {
    console.error('Error fetching RMA requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
```

**Response (Success - 200):**
```json
{
  "message": "RMA requests fetched successfully",
  "requests": [
    {
      "_id": "60d5f4849c0b2c001c8d1234",
      "serialNumber": "SN123456",
      "invoiceNumber": "INV-2024-001",
      "poNumber": "PO-2024-001",
      "status": "pending",
      "submittedBy": {
        "_id": "60d5f4849c0b2c001c8d1111",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-11-28T10:00:00.000Z",
      "updatedAt": "2024-11-28T10:00:00.000Z"
    }
  ]
}
```

---

### 3. Get All RMA Requests (Admin)

**Endpoint:** `GET /api/rma/admin/all`

**Authentication:** Required (Bearer Token + Admin Role)

**Implementation Example:**
```javascript
// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const rmaRequests = await RMA.find()
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'name email')
      .populate('processedBy', 'name email');
    
    res.json({
      message: 'All RMA requests fetched successfully',
      requests: rmaRequests
    });
  } catch (error) {
    console.error('Error fetching RMA requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
```

**Response (Success - 200):**
```json
{
  "message": "All RMA requests fetched successfully",
  "requests": [...]
}
```

---

### 4. Update RMA Status (Admin)

**Endpoint:** `PUT /api/rma/admin/update/:id`

**Authentication:** Required (Bearer Token + Admin Role)

**Request Body:**
```json
{
  "status": "approved",
  "adminNotes": "Approved for return. RMA number assigned."
}
```

**Implementation Example:**
```javascript
router.put('/admin/update/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const validStatuses = ['pending', 'approved', 'rejected', 'processing', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const rma = await RMA.findByIdAndUpdate(
      id,
      {
        status,
        adminNotes,
        processedBy: req.user.id,
        processedAt: new Date()
      },
      { new: true }
    ).populate('submittedBy', 'name email');
    
    if (!rma) {
      return res.status(404).json({ message: 'RMA request not found' });
    }
    
    // Optional: Send email notification to user about status update
    // sendEmailNotification(rma.submittedBy.email, status, rma);
    
    res.json({
      message: 'RMA status updated successfully',
      rma
    });
  } catch (error) {
    console.error('Error updating RMA:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
```

**Response (Success - 200):**
```json
{
  "message": "RMA status updated successfully",
  "rma": {
    "_id": "60d5f4849c0b2c001c8d1234",
    "serialNumber": "SN123456",
    "status": "approved",
    "adminNotes": "Approved for return. RMA number assigned.",
    "processedBy": "60d5f4849c0b2c001c8d2222",
    "processedAt": "2024-11-28T11:00:00.000Z"
  }
}
```

---

## Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
```

---

## File Upload Configuration

### Required npm packages:
```bash
npm install multer
```

### Create uploads directory:
```javascript
const fs = require('fs');
const uploadDir = 'uploads/rma';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
```

### Serve static files (Express):
```javascript
app.use('/uploads', express.static('uploads'));
```

---

## Environment Variables

Add to `.env`:
```
JWT_SECRET=your_jwt_secret_key
```

---

## Security Considerations

1. **File Upload Security:**
   - Validate file types (only images and PDFs)
   - Limit file size (10MB per file)
   - Sanitize filenames
   - Store files outside web root if possible

2. **Authentication:**
   - Use JWT tokens
   - Implement token expiration
   - Validate user roles for admin endpoints

3. **Input Validation:**
   - Sanitize all user inputs
   - Validate required fields
   - Check for SQL/NoSQL injection attempts

4. **Rate Limiting:**
   - Implement rate limiting on submission endpoint
   - Prevent abuse of file upload functionality

---

## Testing Endpoints

### Using cURL:

**Submit RMA:**
```bash
curl -X POST http://localhost:4000/api/rma/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "serialNumber=SN123456" \
  -F "invoiceNumber=INV-2024-001" \
  -F "poNumber=PO-2024-001" \
  -F "reason=Defective" \
  -F "description=Device not working properly" \
  -F "attachments=@/path/to/image1.jpg" \
  -F "attachments=@/path/to/invoice.pdf"
```

**Get User's RMA Requests:**
```bash
curl -X GET http://localhost:4000/api/rma/my-requests \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Admin - Get All RMA:**
```bash
curl -X GET http://localhost:4000/api/rma/admin/all \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Admin - Update Status:**
```bash
curl -X PUT http://localhost:4000/api/rma/admin/update/RMA_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved","adminNotes":"Approved for return"}'
```

---

## Frontend Integration Notes

The frontend is already configured to use:
- `VITE_BACKEND_URL` environment variable
- Bearer token authentication from localStorage
- FormData for file uploads
- React Hot Toast for notifications

Make sure your backend CORS configuration allows requests from the frontend origin.

---

## Optional Enhancements

1. **Email Notifications:**
   - Send email when RMA is submitted
   - Notify user when admin updates status
   - Use nodemailer or similar library

2. **RMA Number Generation:**
   - Auto-generate unique RMA numbers
   - Format: RMA-YYYY-NNNNNN

3. **File Compression:**
   - Compress uploaded images
   - Use sharp or similar library

4. **Status History:**
   - Track all status changes with timestamps
   - Create audit trail

5. **Search & Filters:**
   - Add search by serial number, invoice, PO
   - Filter by status, date range
   - Pagination for large datasets

6. **Export Functionality:**
   - Export RMA list to CSV/Excel
   - Generate PDF reports
