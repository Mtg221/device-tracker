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
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET single car by ID
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create a new car (admin only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { make, model, year, pricePerDay, image, description, available, category } = req.body;
    if (!make || !model || !pricePerDay)
      return res.status(400).json({ error: "make, model and pricePerDay are required" });

    const car = await Car.create({ make, model, year, pricePerDay, image, description, available, category, adminId: req.user.id });
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ error: "Invalid car data" });
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
    
    const { make, model, year, pricePerDay, image, description, available, category } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { make, model, year, pricePerDay, image, description, available, category },
      { new: true, runValidators: true }
    );
    res.json(updatedCar);
  } catch (err) {
    res.status(400).json({ error: "Invalid car data" });
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
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET admin's fleet cars
router.get("/admin/fleet", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const cars = await Car.find({ adminId: req.user.id });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
