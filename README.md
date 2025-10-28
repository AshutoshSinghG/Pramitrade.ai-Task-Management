Pramitrade MERN Assignment

Overview
This is a full-stack MERN application featuring a scalable REST API with JWT authentication, RBAC, Tasks CRUD, and a minimal React frontend to exercise the APIs. Includes Swagger docs, validation, and clean modular structure.

Tech Stack
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT (1h expiry), bcrypt password hashing
- Validation: express-validator
- Docs: Swagger UI at /api-docs
- Frontend: React (Vite), Axios, React Router

Monorepo Structure

backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
  server.js
frontend/
  src/
    components/
    context/
    pages/
    App.jsx
    main.jsx

Getting Started
Prerequisites: Node 18+, MongoDB running locally (or Atlas), npm or yarn.

1) Clone and install

```bash
git clone <your-repo-url>
cd backend && npm install
cd ../frontend && npm install
```

2) Environment
Create backend .env (in backend/):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pramitrade_db
JWT_SECRET=supersecretchangeme
```

Optional: frontend .env for API base (defaults shown):

```env
VITE_API_URL=http://localhost:5000/api/v1
```

3) Run
Open two terminals:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Backend: http://localhost:5000
Swagger: http://localhost:5000/api-docs
Frontend: http://localhost:5173

API Summary (/api/v1)
- POST /auth/register: { name, email, password, role? }
- POST /auth/login: { email, password }
- POST /tasks: create task (auth)
- GET /tasks: list tasks (admin: all, user: own)
- GET /tasks/:id
- PUT /tasks/:id
- DELETE /tasks/:id

Standard error shape:

```json
{ "success": false, "message": "Error message" }
```

Test Data
1) Register user (role user)
2) Register admin (role admin)
3) Use dashboard to create tasks or curl:

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/api/v1/tasks
```

Security & Validation
- JWT in Authorization: Bearer <token>
- Passwords hashed using bcrypt
- Input validated with express-validator and sanitized
- Helmet, CORS, xss-clean enabled

Scalability Notes
- Microservices: split auth, tasks, and gateway services
- Dockerize: containerize backend and frontend; compose with MongoDB
- Redis: cache frequently read queries and rate limiting
- Load balancing: NGINX or cloud LB in front of Node instances
- CDN/Vercel: host static frontend on CDN or a platform like Vercel

Scripts
- Backend: npm run dev (nodemon), npm start
- Frontend: npm run dev, npm run build, npm run preview

Optional Docker (sketch)
- Create Dockerfile for backend, use Mongo as service
- Use environment variables and secrets for prod

License
MIT


