const express = require("express");
const auth = require("../middleware/auth");
const Booking = require("../models/booking");
const Car = require("../models/cars");
const router = express.Router();

// GET /api/bookings - Get user's bookings OR admin's fleet bookings OR all bookings (superadmin)
router.get("/", auth, async (req, res) => {
  try {
    let bookings;
    
    if (req.user.role === "superadmin") {
      // Super admin sees all bookings
      bookings = await Booking.find()
        .populate("userId", "name email")
        .populate({
          path: "carId",
          populate: { path: "adminId", select: "name fleetName" }
        });
    } else if (req.user.role === "admin") {
      // Admin sees bookings for their fleet's cars
      bookings = await Booking.find()
        .populate("userId", "name email")
        .populate("carId");
      
      // Filter to only show bookings for cars owned by this admin
      const adminCars = await Car.find({ adminId: req.user.id });
      const adminCarIds = adminCars.map(c => c._id.toString());
      bookings = bookings.filter(b => adminCarIds.includes(b.carId?._id?.toString()));
    } else {
      // Regular user sees only their own bookings
      bookings = await Booking.find({ userId: req.user.id })
        .populate("carId");
    }
    
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bookings - Create a new booking
router.post("/", auth, async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/bookings/:id - Cancel/delete a booking
router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Admin can delete any booking for their fleet, regular users only their own
    if (req.user.role === "admin") {
      const car = await Car.findById(booking.carId);
      if (car && car.adminId.toString() !== req.user.id) {
        return res.status(403).json({ error: "Not authorized for this booking" });
      }
    } else if (req.user.role !== "superadmin" && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/bookings/:id - Update booking status (admin)
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/admin/stats - Get booking statistics
router.get("/admin/stats", auth, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === "admin") {
      // Admin stats for their fleet only
      const adminCars = await Car.find({ adminId: req.user.id });
      const adminCarIds = adminCars.map(c => c._id);
      
      if (adminCarIds.length === 0) {
        return res.json({ totalBookings: 0, confirmed: 0, cancelled: 0, pending: 0, totalRevenue: 0 });
      }
      
      query = { carId: { $in: adminCarIds } };
    } else if (req.user.role !== "superadmin") {
      // Regular users don't get stats
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const totalBookings = await Booking.countDocuments(query);
    const confirmed = await Booking.countDocuments({ ...query, status: "confirmed" });
    const cancelled = await Booking.countDocuments({ ...query, status: "cancelled" });
    const pending = await Booking.countDocuments({ ...query, status: "pending" });

    // Calculate total revenue
    const revenueAgg = await Booking.aggregate([
      { $match: { ...query, status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      totalBookings,
      confirmed,
      cancelled,
      pending,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
