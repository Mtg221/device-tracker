const jwt = require("jsonwebtoken"); // ✅ Toujours require les modules nécessaires middleware is between routes and controllers, so it can be used in any route that needs auth

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = auth; // Export the auth middleware to be used in routes that require authentication
