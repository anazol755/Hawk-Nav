#  Hawk Nav

> **Status:** This repository is archived and is not actively maintained.

> **Note:** This repository is a continuation of an earlier repository for our Senior Design project. The original commit history was not carried over. 
>
> Claude (Claude Code) was used for this repository at these points:
>
> - **October 22, 2026:** Uploaded the code here, making two commits: the initial commit containing the original project, and the commit adding this note.
> - **November 6, 2026:** Corrected this README, including the setup steps, tech stack, and project structure, and removed claims the repository doesn't support. It also updated this note.

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

### 5. Deployment
- Backend hosted on Node.js server.  
- MongoDB cloud deployment.  
- Versioned releases with rollback plan.  

---

 This SDLC ensured the Campus Map App was **delivered on time and user-friendly** while leaving room for future enhancements.

##  Features

-  Interactive map of campus  
-  Building and facility information  
-  Event creation and display  
-  Role-based access (students vs. faculty)  
-  Media uploads (building images, event posters)  
-  Authentication using JWT  

---

##  Tech Stack

### Frontend
- React  
- React Router  
- Material UI  
- Axios  
- Google Maps  
- Google Calendar API  

### Backend
- Node.js  
- Express.js  
- MongoDB with Mongoose  
- Multer (for file uploads)  
- Nodemailer (for password reset emails)  
- JWT (JSON Web Token) for authentication  

---

##  Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/anazol755/Hawk-Nav.git
cd Hawk-Nav
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd client/Frontend
npm install
```

### 3. Set up environment variables

Create a `.env` file inside the `/Backend` directory with the following contents:

```env
PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:5050
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

Create a `.env` file inside the `/Backend/client/Frontend` directory with the following contents:

```env
REACT_APP_API_URL=http://localhost:5050
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

The Google Calendar OAuth client ID is hard-coded at the top of `Backend/client/Frontend/src/components/Calender/Calender.jsx`. Replace it with your own to use the calendar feature.

### 4. Start the development servers

Run each of these from the repo root, in its own terminal.

**Backend:**

```bash
cd Backend
npm start
```

**Frontend:**

```bash
cd Backend/client/Frontend
npm start
```

- Frontend will run on: `http://localhost:3000`  
- Backend will run on: `http://localhost:5050`  

---

##  Project Structure

```
Hawk-Nav/
│
├── Backend/                 # Express server + MongoDB
│   ├── client/Frontend/     # React frontend code
│   │   ├── public/          # Static files
│   │   ├── src/             # React components
│   │   └── package.json     # Frontend dependencies
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── uploads/
│   ├── package.json         # Backend dependencies
│   └── server.js
│
└── README.md
```

---

##  Contributors

This app was developed by our university Senior Design team.

---

## License

This project is intended for educational use. If you'd like to repurpose or expand it, please contact the original developers for permission.
