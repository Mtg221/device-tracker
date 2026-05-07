const express = require("express");
const router = express.Router();
const Car = require("../models/cars");
const auth = require("../middleware/auth");

// GET all available cars (public)
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single car by ID
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new car (admin only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    console.log('Creating car - User ID:', req.user.id, 'Email:', req.user.email);
    console.log('Car data received:', req.body);
    
    // Add adminId to the car
    const carData = { ...req.body, adminId: req.user.id };
    console.log('Car data with adminId:', carData);
    
    const car = await Car.create(carData);
    console.log('Car created successfully with ID:', car._id, 'adminId:', car.adminId);
    
    res.status(201).json(car);
  } catch (err) {
    console.error('Error creating car:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT update a car (admin only - own cars)
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    
    // Check if admin owns this car or is superadmin
    if (req.user.role !== "superadmin" && car.adminId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this car" });
    }
    
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCar);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a car (admin only - own cars)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    
    // Check if admin owns this car or is superadmin
    if (req.user.role !== "superadmin" && car.adminId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this car" });
    }
    
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET admin's fleet cars
router.get("/admin/fleet", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    console.log('Fetching fleet cars for user:', req.user.id, 'Email:', req.user.email);
    
    const cars = await Car.find({ adminId: req.user.id });
    console.log('Found', cars.length, 'cars for this admin');
    
    res.json(cars);
  } catch (err) {
    console.error('Error fetching fleet cars:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
