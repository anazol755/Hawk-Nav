#  Campus Map App
==repository was archived==

> **Note:** This repository is a continuation of an earlier repository for our Senior Design project. The original commit history was not carried over. The code was uploaded here by Claude (Claude Code), which made only two commits: the initial commit containing the original project, and the commit adding this note. All of the application code was written by our team. 

This project was developed as part of our **Senior Design Group Project** at university. It’s a full-stack web application designed to provide students and faculty with a dynamic, interactive campus map for navigation, event tracking, and building information.

---
##  Software Development Lifecycle (SDLC)

### 1. Inception & Requirements
- Defined project goals: navigation, events, building info, role-based access, media uploads.  
- Identified stakeholders: students, faculty, IT/security staff.  
- Documented functional & non-functional requirements.  

### 2. Analysis & Planning
- User stories written for students and faculty.  
- Backlog created with MoSCoW prioritization (Must, Should, Could, Won’t).  
- Chose MERN stack (MongoDB, Express, React, Node.js).  

### 3. Design
- Created wireframes for UI flows.  
- Database schema defined (Users, Events, Buildings, Media).  
- Security design: JWT authentication, role-based permissions.  
- API endpoints documented.  

### 4. Implementation
- **Sprint 1:** Authentication & user roles.  
- **Sprint 2:** Event CRUD with media upload.  
- **Sprint 3:** Student-facing event list & filters.  
- **Sprint 4:** Interactive campus map integration.  
- **Sprint 5:** Hardening, performance tuning, deployment.  

### 5. Testing
- Unit tests for models, controllers, and utilities.  
- Integration tests for APIs.  
- End-to-End (E2E) tests for event creation & navigation flows.  
- Non-functional testing: performance, security, accessibility.  

### 6. Deployment
- CI/CD pipeline for automated builds and testing.  
- Backend hosted on Node.js server.  
- MongoDB cloud deployment.  
- Versioned releases with rollback plan.  

### 7. Maintenance
- Regular bug fixes and dependency updates.  
- Feedback loop with users to guide new features.  
- Security patches and database backups scheduled.  
- Future scope: AI chatbot for event Q&A, richer building data, push notifications.  

---

 This SDLC ensured the Campus Map App was **delivered on time, secure, and user-friendly** while leaving room for future enhancements.

##  Features

-  Interactive map of campus  
-  Building and facility information  
-  Event creation and display  
-  Role-based access (students vs. faculty)  
-  Media uploads (building images, event posters)  
-  Secure authentication using JWT  

---

##  Tech Stack

### Frontend
- React  
- React Router  
- Axios  
- Leaflet (or similar map integration library)  

### Backend
- Node.js  
- Express.js  
- MongoDB with Mongoose  
- Multer (for file uploads)  
- JWT (JSON Web Token) for authentication  

---

##  Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/Campus-Map-App-Group-Project.git
cd Campus-Map-App-Group-Project
```

### 2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd Backend
npm install
```

### 3. Set up environment variables

Create a `.env` file inside the `/Backend` directory with the following contents:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start the development servers

**Backend:**

```bash
cd Backend
npm start
```

**Frontend:**

```bash
cd ..
npm start
```

- Frontend will run on: `http://localhost:3000`  
- Backend will run on: `http://localhost:5000`  

---

##  Project Structure

```
Campus-Map-App-Group-Project/
│
├── Backend/                 # Express server + MongoDB
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
│
├── client/                  # (If used) React frontend code
├── public/                  # Static files
├── src/                     # React components
├── package.json             # Frontend dependencies
└── README.md
```

---

##  Contributors

This app was developed by our university Senior Design team:
---

## License

This project is intended for educational use. If you'd like to repurpose or expand it, please contact the original developers for permission.
