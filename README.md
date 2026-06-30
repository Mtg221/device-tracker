# DriveElite — Plateforme de location de voitures

Application web fullstack de location de véhicules au Sénégal, avec gestion multi-rôles (client, admin de flotte, super admin) et système de régions.

**Stack :** React 18 + Vite | Node.js + Express 5 | MongoDB + Mongoose | JWT Auth

---

## Fonctionnalités

### Côté client
- Parcourir les véhicules disponibles par région
- Réserver un véhicule avec choix de dates et options (extras)
- Suivre ses réservations

### Côté admin de flotte
- Gérer sa propre flotte (ajouter, modifier, supprimer des voitures)
- Consulter les réservations liées à sa flotte
- Profil associé à une région du Sénégal

### Côté super admin
- Vue globale de tous les admins, voitures et réservations
- Créer / supprimer des comptes admin
- Accès aux statistiques générales

---

## Structure du projet

```
vehicules/
├── backend/
│   ├── connection/      ← Connexion MongoDB
│   ├── middleware/      ← Auth JWT + autorisation par rôle
│   ├── models/          ← Car, Booking, User (Mongoose)
│   ├── routes/          ← auth, cars, bookings, admin
│   └── server.js
└── frontend/
    └── src/
        ├── components/  ← Navbar, CarCard, Modals, Toast…
        ├── context/     ← AuthContext
        ├── data/        ← Régions du Sénégal
        ├── pages/       ← Home, Fleet, Regions, Admin, Bookings…
        └── api.js
```

---

## Démarrage rapide

### Prérequis

- Node.js v16+
- MongoDB (local ou Atlas)

### Installation

```bash
git clone https://github.com/Mtg221/vehicules.git

# Backend
cd vehicules/backend
npm install

# Frontend
cd ../frontend
npm install
```

### Variables d'environnement

**`backend/.env`**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/driveelite
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:3001/api
```

### Lancement

```bash
# Terminal 1 — Backend (port 3001)
cd backend
npm start

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

---

## API Reference

### Auth
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Créer un compte |
| POST | `/api/auth/login` | ❌ | Connexion |
| GET | `/api/auth/me` | ✅ | Profil courant |

### Voitures
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/cars` | ❌ | Lister les voitures disponibles |
| POST | `/api/cars` | ✅ Admin | Ajouter une voiture |
| PUT | `/api/cars/:id` | ✅ Admin | Modifier une voiture |
| DELETE | `/api/cars/:id` | ✅ Admin | Supprimer une voiture |

### Réservations
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/bookings` | ✅ | Voir ses réservations (ou toutes si admin) |
| POST | `/api/bookings` | ✅ | Créer une réservation |
| DELETE | `/api/bookings/:id` | ✅ | Annuler une réservation |

### Admin / Régions
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/admin/admins` | ✅ SuperAdmin | Lister tous les admins |
| GET | `/api/admin/regions/:regionId/admins` | ❌ | Admins d'une région |
| GET | `/api/admin/regions/:regionId/cars` | ❌ | Voitures d'une région |

---

## Rôles

| Rôle | Accès |
|------|-------|
| `user` | Réservation, historique personnel |
| `admin` | Gestion de sa flotte + réservations associées |
| `superadmin` | Accès complet à toute la plateforme |

---

## Déploiement

| Service | Config |
|---------|--------|
| Backend | [Render](https://render.com) — `render.yaml` inclus |
| Frontend | [Vercel](https://vercel.com) — `vercel.json` inclus |
| Base de données | MongoDB Atlas |

Mettre à jour `CLIENT_URL` (backend) et `VITE_API_URL` (frontend) avec les URLs de production.

---

## Régions couvertes

Dakar · Thiès · Saint-Louis · Kaolack · Ziguinchor · Tambacounda · Louga · Diourbel · Fatick · Matam · Kolda · Sédhiou · Kaffrine · Kédougou · Mbacké

---

## License

MIT
