# Project Management Frontend - React + Vite

Interface utilisateur moderne pour l'application de gestion de projets, construite avec React, Vite, TailwindCSS, et  React Query.

## 🚀 Technologies

- **React** v18.3 - UI Library
- **Vite** - Build tool & Dev server
- **React Router** v6 - Routing
- **TailwindCSS** v3 - Styling
- **Axios** - HTTP client
- **React Query** v5 - Data fetching & caching
- **Zustand** - State management
- **Zod** - Validation
- **React Hook Form** - Form management
- **Lucide React** - Icons

## 📋 Prérequis

- Node.js v18+
- npm ou yarn
- Backend API running (voir backend/README.md)

## ⚙️ Installation

1. **Naviguer dans le dossier frontend**
```bash
cd frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Modifier `.env` :
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🎯 Scripts Disponibles

```bash
# Démarrage en mode développement
npm run dev

# Build pour production
npm run build

# Preview du build de production
npm run preview
```

## 🔐 Connexion

Credentials par défaut (après avoir lancé le seeder backend) :

- **Email**: admin@example.com
- **Password**: password123

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── layout/        # Layout components (Sidebar, Header, etc.)
│   │   └── ui/            # UI components (Button, Input, etc.)
│   ├── hooks/             # Custom hooks
│   │   └── api/          # API hooks (React Query)
│   ├── lib/              # Configurations (axios, react-query)
│   ├── pages/            # Pages de l'application
│   │   ├── auth/        # Pages d'authentification
│   │   ├── categories/  # Pages catégories
│   │   ├── clients/     # Pages clients
│   │   ├── projects/    # Pages projets
│   │   └── tasks/       # Pages tâches
│   ├── store/            # State management (Zustand)
│   ├── utils/            # Utilitaires
│   ├── validations/      # Schémas de validation Zod
│   ├── App.jsx          # Composant racine
│   ├── main.jsx         # Point d'entrée
│   └── index.css        # Styles globaux
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🎨 Features Implémentées

### ✅ Authentification
- Login avec validation
- Logout
- Auto-refresh des tokens JWT
- Protected routes
- Stockage persistant (localStorage)

### ✅ Layout & Navigation
- Sidebar responsive et collapsible
- Header avec menu utilisateur
- Navigation avec React Router
- Animations fluides

### ✅ Dashboard
- Stats cards
- Welcome section
- Quick actions
- Design moderne et attractif

### 🚧 À Implémenter
- CRUD complet pour toutes les ressources
- Formulaires avec React Hook Form + Zod
- Tables avec tri et pagination
- Upload d'images
- Filtres et recherche
- Modals pour création/édition
- Notifications toast
- Dark mode

## 🔧 Développement

### Ajout de nouvelles pages

1. Créer le composant dans `src/pages/`
2. Créer les hooks API dans `src/hooks/api/`
3. Créer les schémas de validation dans `src/validations/`
4. Ajouter la route dans `src/App.jsx`

### Appels API

Les hooks React Query sont dans `src/hooks/api/`. Exemple :

```jsx
import { useLogin } from '@/hooks/api/useAuth';

function LoginForm() {
  const { mutate: login, isLoading } = useLogin();

  const handleSubmit = (data) => {
    login(data, {
      onSuccess: () => {
        // Success handling
      },
      onError: (error) => {
        // Error handling
      },
    });
  };
}
```

### State Management

Zustand est utilisé pour le state global (principalement auth) :

```jsx
import { useAuthStore } from '@/store/authStore';

function Component() {
  const { user, isAuthenticated, logout } = useAuthStore();
}
```

## 🎨 Styling

TailwindCSS est configuré avec :
- Palette de couleurs personnalisée (primary, secondary)
- Custom scrollbar
- Animations (fade-in, slide-in)
- Utilitaires supplémentaires

### Exemples de classes

```jsx
// Card avec hover effet
<div className="card-hover bg-white rounded-xl shadow-sm">

// Animation fade-in
<div className="animate-fade-in">

// Gradient background
<div className="bg-gradient-to-r from-primary-500 to-secondary-500">
```

## 🌐 API Integration

L'instance Axios est configurée dans `src/lib/axios.js` avec :
- Auto-injection du token Bearer
- Refresh automatique du token expiré
- Gestion centralisée des erreurs
- Proxy vers le backend (via Vite config)

## 📦 Build Production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

Pour tester le build :
```bash
npm run preview
```

## 🚀 Déploiement

Le frontend peut être déployé sur :
- **Vercel** (recommandé pour React)
- **Netlify**
- **GitHub Pages**
- **Any static hosting**

Variables d'environnement à configurer en production :
```
VITE_API_URL=https://your-api-domain.com/api
```

## 📝 Notes

- Les permissions sont gérées côté store Zustand
- Les routes protégées utilisent le composant `<ProtectedRoute>`
- React Query cache les données automatiquement (5 min)
- Les tokens JWT sont stockés dans localStorage

## 🎯 Next Steps

Pour compléter le frontend :

1. Implémenter les CRUD pour chaque ressource
2. Créer les composants de formulaire avec validation
3. Ajouter les tables avec pagination
4. Implémenter l'upload d'images
5. Ajouter un système de notifications
6. Créer un dark mode
7. Optimiser les performances

## 📄 Licence

MIT
