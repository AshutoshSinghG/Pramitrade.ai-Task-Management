import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import xss from 'xss-clean';
import { connectDB } from './src/config/db.js';
import { notFoundHandler, errorHandler } from './src/middleware/errorHandler.js';
import authRoutes from './src/routes/auth.routes.js';
import taskRoutes from './src/routes/task.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const app = express();

// Security & utils
app.use(helmet());

app.use(cors());

app.use(express.json());
app.use(xss());
app.use(morgan('dev'));

// API version base
const API_BASE = '/api/v1';

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pramitrade API',
      version: '1.0.0',
      description: 'MERN REST API with Auth, RBAC, and Tasks CRUD'
    },
    servers: [
      { url: 'http://localhost:' + (process.env.PORT || 5000) + API_BASE }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use(`${API_BASE}/auth`, authRoutes);
app.use(`${API_BASE}/tasks`, taskRoutes);

// Health
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'OK' });
});

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to connect DB', err);
    process.exit(1);
  });


