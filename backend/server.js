require('dotenv').config();
const express   = require("express");
const cors      = require("cors");

const connectDB = require("./connection/connection");

const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");

const app  = express();
const PORT = process.env.PORT || 3001;

// ✅ Check JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing in .env");
}

// ─── Database ─────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173'];

app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Simple test route
app.get("/", (req, res) => {
  res.send("🚗 DriveElite API is running");
});

// ─── Start server ─────────────────────────────────────
app.listen(PORT, () => {
const host = process.env.HOST || 'http://localhost';
console.log(`🚗 DriveElite API running on ${host}:${PORT}`);
});