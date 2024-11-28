<h1 align="center">
 <img src="https://github.com/MURTAYES/Cholo_jai/blob/main/frontend/public/logo.png">
</h1>
<p align="center">
MongoDB, Expressjs, React/Redux, Nodejs
</p>



This is the `README.md` file that will guide anyone through setting up and running this MERN-based train ticket booking system and also give clear view of this project.

---

# MERN Train Ticket Booking System

## Overview
This project is a **Train Ticket Booking System** built using the **MERN** stack (MongoDB, Express.js, React.js, and Node.js). The backend manages routes for user registration, train schedules, and ticket bookings. The frontend is built using React for a user-friendly interface.

## Features
- User registration and authentication.
- Google login system.
- Train schedule management.
- Ticket booking system.
- MongoDB for data storage.
- RESTful API for backend operations.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (using Mongoose ORM)
- **Development Tools**: Nodemon for hot-reloading, dotenv for environment variable management

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (local or cloud-based like MongoDB Atlas)
- [Git](https://git-scm.com/) for version control

## Project Structure
```
train-ticket-booking/
├── frontend/           # React.js frontend
│   ├── public/         # Static files
│   ├── src/            # React components, hooks, services
│   └── package.json    # Frontend dependencies
├── backend/            # Node.js backend
│   ├── config/         # Database connection
│   ├── controllers/    # API controllers
│   ├── models/         # MongoDB models
│   ├── templates/      # Ticket template
│   ├── routes/         # API routes
│   └── package.json    # Backend dependencies
└── README.md           # Project documentation
```

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/MURTAYES/Cholo_jai.git
cd Cholo_jai
```

### 2. Setting Up the Backend

1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```

2. Install the backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` folder to store your environment variables:
   ```
   MONGO_URI=your_mongo_db_connection_string
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`.

### 3. Setting Up the Frontend

1. Navigate to the `frontend/` folder:
   ```bash
   cd ../frontend
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Start the React frontend server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:5173`.

### 4. Running Both Frontend and Backend Concurrently

For convenience, you can run both the backend and frontend concurrently:

1. In the root directory, install `concurrently`:
   ```bash
   npm install concurrently
   ```

2. Add the following to your root `package.json` (if not already there):
   ```json
   "scripts": {
     "start": "concurrently \"npm run server\" \"npm run client\"",
     "server": "cd backend && npm run dev",
     "client": "cd frontend && npm start"
   }
   ```

3. Start both the frontend and backend with:
   ```bash
   npm start
   ```

### 5. Testing the API
You can test the backend API using Postman or Thunder Client.

- **POST** `/api/trains/add` - Add new train.
- **POST** `/api/users/login` - User login.
- **POST** `api/users/google-logins` - User can login with google.
- **GET** `/api/tickets/search?from=%%&to=%%&date=%%&type=%%` - Search train.
- **GET** `/api/bogies/%trainCode%/%date%` - Seach available seat according to boggy.
- **POST** `/api/users/register` - New user can register.
- **PUT** `/api/users/update/%userId%` - User can update his info.
- **POST** `/api/payment/init` - Initialize payment.
- **POST** `/payment/success` - Get payment success of failur message.
- **GET** `/api/tickets/viewTicket/%userId%` - View purchase history.
- **GET** `/api/pdf/generateTicketPDF/` - Generate ticket pdf.
- **POST** `/api/tickets/purchase` - Buy ticket.
- **GET** `/api/trains/viewRoute?trainCode=%%` - View train route.

### 6. MongoDB Setup
Make sure MongoDB is running either locally or using MongoDB Atlas. If using MongoDB Atlas, replace `your_mongo_db_connection_string` in `.env` with your actual connection string.

## License
- This project is licensed under the MIT License.
- This is made for educational perpous only

---

