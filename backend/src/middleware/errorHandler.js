export function notFoundHandler(req, res, _next) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}

import { writeErrorLog } from '../utils/logger.js';

export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  writeErrorLog(err);
  res.status(status).json({ success: false, message });
}


