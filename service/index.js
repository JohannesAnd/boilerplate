'use strict'

const express = require('express');
const http = require('http');
const firebase = require('firebase');

const registerTasks = require('./registerTasks');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;

app.use((req, res, next) => {
  // For production, lock out other requests
  next();
});

firebase.initializeApp({
  serviceAccount: config.serviceAccountPath,
  databaseURL: config.firebase.databaseURL
});

const tasks = [
  {
    specId: 'test',
    numWorkers: 10,
    tree: require('./taskHandlers/test')
  }
];

registerTasks(tasks);

server.listen(port, () => {
  console.log('Server listening on ' + port);
});
