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

// Check JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing in .env");
}

// ─── Database ─────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    const allowed = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map(s => s.trim()); // Support multiple origins
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      // ❌ Ne jamais throw ici — ça génère un 500
      callback(null, false);
    }
  },
  credentials: true,
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
  console.log(`🚗 DriveElite API running on http://localhost:${PORT}`);
});
