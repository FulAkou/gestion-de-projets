# Project Management API - Backend

Backend API pour l'application de gestion de projets, construit avec Node.js, Express.js, MongoDB, et JWT.

## 🚀 Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **Bcrypt** - Hashage de passwords
- **Zod** - Validation de schémas
- **Multer** - Upload de fichiers

## 📋 Prérequis

- Node.js v18+ 
- MongoDB v6+ (local ou Atlas)
- npm ou yarn

## ⚙️ Installation

1. **Naviguer dans le dossier backend**
```bash
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Modifier `.env` avec vos configurations :
```env
MONGODB_URI=mongodb://localhost:27017/mgt_app
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
PORT=5000
```

4. **Initialiser la base de données**
```bash
npm run seed
```

## 🎯 Scripts Disponibles

```bash
# Démarrage en mode développement (avec hot reload)
npm run dev

# Démarrage en production
npm start

# Initialiser la base de données avec des données par défaut
npm run seed
```

## 🔐 Credentials par Défaut

Après avoir exécuté `npm run seed`, vous pouvez vous connecter avec :

- **Email**: admin@example.com
- **Password**: password123

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── config/          # Configuration (DB, JWT)
│   ├── controllers/     # Logique métier
│   ├── middlewares/     # Middlewares (auth, permissions, validation)
│   ├── models/          # Modèles Mongoose
│   ├── routes/          # Routes API
│   ├── utils/           # Utilitaires (seeders, response handlers)
│   ├── validations/     # Schémas de validation Zod
│   ├── app.js           # Configuration Express
│   └── server.js        # Point d'entrée
├── uploads/             # Fichiers uploadés
├── .env.example         # Template des variables d'environnement
├── package.json
└── README.md
```

## 🔌 Endpoints API

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Rafraîchir le token
- `POST /api/auth/logout` - Déconnexion (protégé)
- `GET /api/auth/me` - Utilisateur courant (protégé)

### Categories
- `GET /api/categories` - Liste des catégories (protégé)
- `GET /api/categories/:id` - Détails d'une catégorie (protégé)
- `POST /api/categories` - Créer une catégorie (permission: create_categories)
- `PUT /api/categories/:id` - Modifier une catégorie (permission: edit_categories)
- `DELETE /api/categories/:id` - Supprimer une catégorie (permission: delete_categories)

### Clients
- `GET /api/clients` - Liste des clients (permission: view_clients)
- `GET /api/clients/:id` - Détails d'un client (permission: view_clients)
- `POST /api/clients` - Créer un client (permission: create_clients)
- `PUT /api/clients/:id` - Modifier un client (permission: edit_clients)
- `DELETE /api/clients/:id` - Supprimer un client (permission: delete_clients)

### Projects
- `GET /api/projects` - Liste des projets (permission: view_projects)
- `GET /api/projects/stats` - Statistiques des projets (permission: view_projects)
- `GET /api/projects/:id` - Détails d'un projet (permission: view_projects)
- `POST /api/projects` - Créer un projet (permission: create_projects)
- `PUT /api/projects/:id` - Modifier un projet (permission: edit_projects)
- `DELETE /api/projects/:id` - Supprimer un projet (permission: delete_projects)

### Tasks
- `GET /api/tasks` - Liste des tâches (permission: view_tasks)
- `GET /api/tasks/my-tasks` - Mes tâches assignées (protégé)
- `GET /api/tasks/:id` - Détails d'une tâche (permission: view_tasks)
- `POST /api/tasks` - Créer une tâche (permission: create_tasks)
- `PUT /api/tasks/:id` - Modifier une tâche (permission: edit_tasks)
- `PATCH /api/tasks/:id/assign` - Assigner une tâche (permission: edit_tasks)
- `DELETE /api/tasks/:id` - Supprimer une tâche (permission: delete_tasks)

## 🔒 Système de Permissions

### Rôles Disponibles

1. **super_admin** - Toutes les permissions
2. **admin** - Toutes les permissions sauf gestion des utilisateurs
3. **manager** - Voir tout, créer/éditer projets et tâches
4. **user** - Voir tout, éditer ses propres tâches

### Permissions

Format : `{action}_{resource}` (ex: `create_projects`, `edit_tasks`)

Actions : `view`, `create`, `edit`, `delete`

Ressources : `categories`, `clients`, `projects`, `tasks`

## 📝 Exemples de Requêtes

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Get Projects (avec token)
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🐛 Gestion des Erreurs

L'API retourne des réponses standardisées :

**Succès**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Erreur**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 📦 Modèles de Données

### User
- name, email, password
- roles (références à Role)
- emailVerifiedAt, refreshToken

### Role
- name, guardName
- permissions (références à Permission)

### Permission
- name, guardName, resource, action

### Category
- name, type (project|task), description

### Client
- name, email, phone, address, status
- createdBy, updatedBy (User)

### Project
- name, description, startDate, endDate, status, imagePath
- clientId, categoryId, createdBy, updatedBy

### Task
- name, description, status, priority, dueDate, imagePath
- assignedUserId, projectId, categoryId, createdBy, updatedBy

## 🔧 Développement

### Ajout de nouvelles fonctionnalités

1. Créer le modèle dans `src/models/`
2. Créer la validation Zod dans `src/validations/`
3. Créer le controller dans `src/controllers/`
4. Créer les routes dans `src/routes/`
5. Importer les routes dans `src/routes/index.js`

## 📄 Licence

MIT
