## Server - Quick Start

This server provides API endpoints used by the client for the Online Complaint Management System.

Prerequisites:
- Node.js (14+)
- MySQL server running and accessible

Setup
1. Copy `.env` from `.env.example` (or create) and set DB connection values:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=complaint_db
```

2. Install packages:

```bash
cd server
npm install
```

Note: We added `multer` to support file uploads; `npm install` will fetch it.

Run

```bash
npm start
```

APIs
- GET /api/categories  -> returns list of complaint categories
- POST /api/complaints -> accepts complaint submission (multipart/form-data for file upload or JSON). Required fields: `title`, `description`, `city`, `street`, `address`, `category`. Optional: `name`, `landmark`, `priority`, `contact_time`, `proof` (file)

Uploads
- Uploaded proof files are saved to `server/uploads` and can be served from `/uploads/<filename>`

Testing
- Start the server and use the client app (or Postman) to submit complaints. The route will create the `complaints` table automatically if it doesn't exist.