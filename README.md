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
