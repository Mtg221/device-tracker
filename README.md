# Device Tracker

A full-stack web application for tracking devices/vehicles built with React and Node.js.

## Project Structure

```
vehicules/
├── backend/    # Node.js/Express API server
└── frontend/   # React/Vite client application
```

## Tech Stack

**Backend**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing

**Frontend**
- React 18
- Vite (build tool)
- Modern JavaScript (ES6+)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB instance
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Configuration

Create `.env` files in both backend and frontend directories with required environment variables.

### Running the Application

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Deployment

- Backend is configured for Render deployment (see `render.yaml`)
- Frontend can be deployed to Vercel (see `vercel.json`)

## License

MIT
