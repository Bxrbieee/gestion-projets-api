# API REST - Gestion de Projets et Tâches (DS1 - ISIDS)

## Auteurs
- Salma Bader
## Installation
```bash
npm install
cp .env.example .env   # puis adapter les valeurs
npm run dev
```

## Endpoints
| Méthode | Route | Accès |
|---|---|---|
| POST | /api/auth/register | public |
| POST | /api/auth/login | public |
| POST | /api/projects | authentifié |
| GET | /api/projects?search=&status=&sort= | user : les siens / manager : tous |
| GET / PUT / DELETE | /api/projects/:id | propriétaire ou manager |
| POST | /api/projects/:projectId/tasks | authentifié |
| GET | /api/projects/:projectId/tasks?search=&status=&sort= | propriétaire ou manager |
| GET / PUT / DELETE | /api/tasks/:id | propriétaire du projet ou manager |
| PATCH | /api/tasks/:id/assign | manager uniquement |

Tri : `sort=createdAt` ou `sort=-deadline` (le `-` = ordre décroissant).
Header : `Authorization: Bearer <token>`

## Exemples de requêtes
- Inscription : POST /api/auth/register  {"nom":"Ali","login":"ali","motDePasse":"123456"}
- Connexion : POST /api/auth/login  {"login":"ali","motDePasse":"123456"}
- Projet : POST /api/projects  {"nom":"Projet 1"}
- Tâche : POST /api/projects/:projectId/tasks  {"titre":"T1","deadline":"2026-12-01"}
- Affectation (manager) : PATCH /api/tasks/:id/assign  {"utilisateurId":"..."}
