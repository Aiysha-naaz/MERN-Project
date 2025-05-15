# MERN Stack Agent Task Distribution System

A web-based application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) to manage agents, upload task lists, and distribute tasks among agents automatically. This system includes secure admin login, agent creation, CSV upload, and even a forgot password functionality.

## Features

- Admin Login with JWT Authentication  
- Forgot Password Functionality  
  - Sends password reset link to the registered email  
  - Allows password reset via custom IP-based link  
- Agent Management  
  - Add new agents with name, email, mobile number, and password  
- CSV Upload  
  - Upload task lists in `.csv`, `.xlsx`, or `.xls` formats  
  - Validates file type and format  
- Task Distribution  
  - Automatically distributes tasks equally among 5 agents  
  - Handles extra tasks (non-divisible) in round-robin fashion  
- Agent Task View  
  - Displays the assigned tasks for each agent  

## Technologies Used

- Frontend: React.js, Bootstrap  
- Backend: Node.js, Express.js  
- Database: MongoDB  
- Authentication: JSON Web Tokens (JWT)  
- File Upload and Parsing: Multer, csv-parser / XLSX (for Excel files)  
- Email Service: Nodemailer (for password reset emails)  

## Setup and Installation 

### Prerequisites

- Node.js and npm installed on your machine  
- MongoDB installed and running, or a MongoDB Atlas account for cloud database  
- An email service (like Gmail) for sending password reset emails  

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>/backend
2. Install backend dependencies:
   ```bash
   npm install

3. Create a .env file in the backend folder:
      ```bash
       PORT=5000
       MONGODB_URI=your_mongodb_connection_string
       JWT_SECRET=your_jwt_secret_key
       EMAIL_USER=your_email_address
       EMAIL_PASS=your_email_password
       FRONTEND_URL=http://your-ip-or-domain:3000

4. Install backend dependencies:
   ```bash
    npm start
   
### Note: 
  Added an example .env file .Refer to create your own .env file

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd ../frontend

2. Install frontend dependencies:
   ```bash
   npm install

3. Navigate to the frontend directory:
    ```bash
   REACT_APP_API_URL=http://your-backend-ip-or-domain:5000/api

3. Start the frontend application:
    ```bash
   npm start




### Access the Application

- Open your browser and go to:
      http://localhost:3000 (or your IP address if accessing remotely)
- Log in using the admin credentials you inserted manually in the database.

### Note :

- Before trying to login first enter the login credentials manually in the mongoDB atlas then use those credentials for login.
  



## Usage Instructions

### Admin Login

- Navigate to the login page.
- Enter the registered admin email and password.
- On successful login, you will be redirected to the dashboard.


### Forgot Password

- On the login page, click on the “Forgot Password” link.
- Enter the registered email address.
- You will receive a password reset link via email.
- Click the link (hosted on your configured IP or domain).
- Set a new password.
- Upon successful reset, you will be redirected directly to the dashboard.

### Note :
- As this application is hosted on local browser .To get reset link via email update backend back with your device's IP address.
   Inside backend/authController.js
    -In Forgot Password function Update this line :
       const resetUrl = `http://<your-device-IP adress>:3000/reset-password/${resetToken}`;


### Agent Management

- From the dashboard, go to the "Add Agents" section.
- Add new agents by filling in their Name, Email, Mobile Number (with country code), and Password.
- View the list of existing agents and their details.

### Uploading and Distributing Task Lists

- Go to the "Upload File" section.
- Upload a CSV, XLSX, or XLS file containing the task list with the following columns:
  - FirstName (Text)
  - Phone (Number)
  - Notes (Text)
- The system validates the file format and content.
- Tasks are automatically distributed equally among 5 agents.
- If tasks cannot be evenly divided, extra tasks are assigned sequentially in round-robin order.
- After upload, you can view the distributed tasks assigned to each agent.


### Viewing Agents and Their Tasks

## View Agents Table
- From the dashboard, click on the “View Agents” section.
- This displays a table of all agents along with their basic details like name, AgentID.


## View Distributions (Agent's Assigned Tasks)
- In the agent list, click on “View Distribution” next to an agent.
- This fetches and displays all tasks assigned to that specific agent using their unique ID.


### Overall Structure
```plaintext
MERN-Agent-Task-System/
│
├── frontend/                    # React Frontend
│   ├── public/                  # Public assets
│   ├── src/
│   │   ├── components/          # Reusable React components (Login, Dashboard, AgentForm, etc.)
│   │   ├── App.js               # Main app component
│   │   └── index.js             # Entry point for React
│   └── package.json             # Frontend dependencies and scripts
│
├── server/                      # Node.js + Express Backend
│   ├── controllers/             # Route handlers (e.g., authController, agentController)
│   ├── models/                  # Mongoose schemas (User, Agent, Task)
│   ├── routes/                  # API routes (authRoutes, agentRoutes, uploadRoutes)
│   ├── middleware/              # Middleware (authentication, error handling)                 
│   ├── uploads/                 # Temporary file storage for CSV/XLSX files
│   ├── .env                     # Environment variables (Mongo URI, JWT Secret)
│   └── server.js                # Entry point for Express server
│   ├── package.json             # Root dependencies and scripts (if running client+server together)
│              
│
├── README.md                    # Project documentation
                
