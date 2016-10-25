// src/backend/routes.js
import express from 'express';

export default (server, app) => {
  app.use('/', express.static('./'));
};
