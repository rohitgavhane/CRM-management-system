<img width="1024" height="1024" alt="Gemini_Generated_Image_azcmt6azcmt6azcm" src="https://github.com/user-attachments/assets/9ce045b5-379b-4964-975b-71245d2a2ef5" />MERN Stack Role-Based Access Control System with Enterprise Management(https://role-management-system-app.vercel.app/)

This project is a full-stack Role-Based Access Control (RBAC) system built with the MERN stack (MongoDB, Express, React, Node.js). It features a secure backend with JWT authentication and a modern, responsive frontend built with React and shadcn/ui.

Setup and Installation

You must run both the server and client in separate terminals.

1. Backend (/server)

Navigate: cd server

Install: npm install

Environment: Create a .env file and add:

PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=mysecretkey12345


Seed Database (Run Once):

This creates the default Admin role and user.

npm run seed


Start Server:

npm run dev


(Server runs on http://localhost:3000)

2. Frontend (/client)

Navigate: cd client

Install: npm install

Start Client:

npm run dev


(Client runs on http://localhost:5173 or similar)

3. Login

Email: admin@example.com

Password: password123
