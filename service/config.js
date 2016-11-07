const path = require('path');
const firebaseConfig = require('../config/firebase.js')[process.env.DUCKY_FIREBASE_APP || 'johannes-test'];
const serviceAccountPath = (
  process.env.DUCKY_FIREBASE_APP === 'ducky-prod' ?
    path.resolve('config', 'production_firebase_service.json')
  :
    path.resolve('config', 'test_firebase_service.json')
);

module.exports = {
  firebase: firebaseConfig,
  serviceAccountPath: serviceAccountPath
};
