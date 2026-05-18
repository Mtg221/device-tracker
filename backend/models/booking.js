const mongoose = require("mongoose"); // Importer Mongoose pour définir le schéma de réservation

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    carId:  { type: mongoose.Schema.Types.ObjectId, ref: "Car",  required: true },
    car: {
      make:        String,
      model:       String,
      image:       String,
      pricePerDay: Number,
    },
    startDate:   { type: String, required: true },
    endDate:     { type: String, required: true },
    days:        Number,
    extras:      [String],
    extrasTotal: Number,
    carTotal:    Number,
    totalPrice:  Number,
    status:      { type: String, default: "confirmed" },
  },
  { timestamps: true, toJSON: { virtuals: true, transform: (_, ret) => { ret.id = ret._id; delete ret.__v; return ret; } } } // Ajouter des timestamps et une transformation pour renommer _id en id et supprimer __v lors de la conversion en JSON
);

module.exports = mongoose.model("Booking", bookingSchema); //  Exporter le modèle de réservation pour l'utiliser dans les routes et autres parties de l'application