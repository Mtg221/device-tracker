const authorization = (req, res, next) => { // Middleware d'autorisation pour vérifier que l'utilisateur est un admin
  if (req.user?.role !== "admin")
    return res.status(403).json({ error: "Admin only" }); // Toujours return une réponse, jamais throw ici
  next(); // Passer au middleware suivant ou à la route si l'utilisateur est un admin
};

module.exports = authorization; // Exporter le middleware pour l'utiliser dans les routes qui nécessitent une autorisation d'admin