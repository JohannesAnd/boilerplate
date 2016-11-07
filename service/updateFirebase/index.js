/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const firebase = require('firebase');
const extractFilesToTree = require('./extractFilesToTree');
const config = require('../config');

firebase.initializeApp({
  serviceAccount: config.serviceAccountPath,
  databaseURL: config.firebase.databaseURL
});

function writeRulesFile(rules) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.resolve(config.firebase.rules),
      JSON.stringify({rules: rules}, null, 2),
      'utf8',
      (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
  });
}

function writeSpecsToDatabase(specs) {
  return new Promise((resolve, reject) => {
    const specsRef = firebase.database().ref('queue/specs');

    specsRef.update(specs, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

const updateRules = extractFilesToTree(
  path.resolve('service', 'rules'),
  {'.write': false, '.read': false}
)
  .then((result) => {
    console.log('Writing rules');
    return result;
  })
  .then(writeRulesFile)
  .then(() => {
    console.log('RULES: Updated');
  });

const updateSpecs = extractFilesToTree(path.resolve('service', 'specs'), {})
  .then((result) => {
    console.log('Uploading specs');
    if (process.env.NODE_ENV === 'production') {
      return result;
    }
    const developerConfig = require('../../config/developerConfig');

    return Object.keys(result).reduce((allSpecs, key) => {
      allSpecs[`${developerConfig.specPrefix}_${key}`] = result[key];
      result[key].start_state = `${developerConfig.specPrefix}_${result[key].start_state}`;
      return allSpecs;
    }, {});
  })
  .then(writeSpecsToDatabase)
  .then(() => {
    console.log('SPECS: Uploaded');
  });

Promise.all([
  updateRules,
  updateSpecs
])
  .then(() => {
    console.log('Specs deployed, rules ready and activities up and running!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('Could not deploy specs or write rules', error);
  });
