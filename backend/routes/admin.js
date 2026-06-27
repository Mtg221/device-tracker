const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const Car = require("../models/cars");
const Booking = require("../models/booking");
const auth = require("../middleware/auth");

const SENEGAL_REGIONS = [
  { id: 'dakar', name: 'Dakar' },
  { id: 'thies', name: 'Thiès' },
  { id: 'saint-louis', name: 'Saint-Louis' },
  { id: 'diourbel', name: 'Diourbel' },
  { id: 'louga', name: 'Louga' },
  { id: 'tambacounda', name: 'Tambacounda' },
  { id: 'kaolack', name: 'Kaolack' },
  { id: 'mbacke', name: 'Mbacké' },
  { id: 'fatick', name: 'Fatick' },
  { id: 'matam', name: 'Matam' },
  { id: 'ziguinchor', name: 'Ziguinchor' }, 
  { id: 'kolda', name: 'Kolda' },
  { id: 'sedhiou', name: 'Sédhiou' },
  { id: 'kaffrine', name: 'Kaffrine' },
  { id: 'kédougou', name: 'Kédougou' },
];

const router = express.Router(); // All admin-related routes will be defined here

// Super Admin: Get all admins
router.get("/admins", auth, async (req, res) => { // Toujours vérifier le rôle avant de faire quoi que ce soit
  try {
    if (req.user.role !== "superadmin") { // Vérification du rôle superadmin
      return res.status(403).json({ error: "Super admin access required" }); // Toujours return une réponse, jamais throw ici
    }
    const admins = await User.find({ role: "admin" }).select("-password"); // Ne jamais retourner le password même hashé
    res.json(admins); //
  } catch (err) {
    res.status(500).json({ error: "Internal server error" }); 
  }
});

// Get admins by region (public)
router.get("/regions/:regionId/admins", async (req, res) => { // Pas besoin d'auth pour ça, c'est public
  try {
    const { regionId } = req.params;
    const admins = await User.find({ role: "admin", region: regionId })
      .select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get cars by region (public)
router.get("/regions/:regionId/cars", async (req, res) => {
  try {
    const { regionId } = req.params;
    const Car = require("../models/cars");

    const admins = await User.find({ role: "admin", region: regionId });
    const adminIds = admins.map(a => a._id);
    const cars = await Car.find({ adminId: { $in: adminIds } })
      .populate("adminId", "name fleetName region");
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get region statistics
router.get("/regions/stats", async (req, res) => {
  try {
    const Car = require("../models/cars");
    const stats = [];
    
    for (const region of SENEGAL_REGIONS) {
      const adminCount = await User.countDocuments({ role: "admin", region: region.id });
      const admins = await User.find({ role: "admin", region: region.id });
      const adminIds = admins.map(a => a._id);
      const carCount = await Car.countDocuments({ adminId: { $in: adminIds } });
      
      stats.push({
        regionId: region.id,
        regionName: region.name,
        adminCount,
        carCount,
      });
    }
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Super Admin: Create new admin
router.post("/admins", auth, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Super admin access required" });
    }
    
    const { name, email, password, fleetName, region } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "Email already registered" });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
      fleetName: fleetName || `${name}'s Fleet`,
      region: region || 'dakar'
    });
    
    res.status(201).json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      fleetName: admin.fleetName,
      region: admin.region,
      role: admin.role
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Super Admin: Delete admin
router.delete("/admins/:id", auth, async (req, res) => { // Toujours vérifier le rôle avant de faire quoi que ce soit
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Super admin access required" }); // Toujours return une réponse, jamais throw ici
    }
    
    const admin = await User.findByIdAndDelete(req.params.id); // Supprimer l'admin
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" }); // Toujours vérifier si l'admin existait avant de continuer
    }
    
    // Delete all cars owned by this admin
    await Car.deleteMany({ adminId: req.params.id }); // Supprimer les voitures associées à cet admin
    
    res.json({ message: "Admin and their fleet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Super Admin: Get all cars
router.get("/cars", auth, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Super admin access required" }); // Toujours return une réponse, jamais throw ici
    }
    const cars = await Car.find().populate("adminId", "name email fleetName"); // Populer les infos de l'admin pour chaque voiture
    res.json(cars); // Retourner la liste complète des voitures avec les infos de l'admin associé
  } catch (err) { // Toujours attraper les erreurs et retourner une réponse d'erreur
    res.status(500).json({ error: "Internal server error" }); // Ne jamais laisser une requête sans réponse, même en cas d'erreur
  }
});

// Super Admin: Get all bookings
router.get("/bookings", auth, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Super admin access required" }); // Toujours return une réponse, jamais throw ici
    }
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("carId", "make model")
      .populate({
        path: "carId",
        populate: { path: "adminId", select: "name fleetName" }
      });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get stats for super admin
router.get("/stats", auth, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Super admin access required" });
    }
    
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const revenueAgg = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;
    
    res.json({ totalAdmins, totalCars, totalBookings, totalRevenue });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
