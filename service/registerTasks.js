'use strict';

const uuid = require('uuid');
const firebase = require('firebase');
const Queue = require('firebase-queue');
const runTask = require('./runTask');

function createRunTask(task) {
  return (data, progress, resolve, reject) => {
    runTask(task.specId, task.tree, {
      data,
      task: {
        id: uuid.v4(),
        type: task.specId,
        resolve,
        reject
      }
    }, (error) => {
      if (error) {
        throw error;
      }
    });
  };
}

module.exports = (tasks) => {
  const queueRef = firebase.database().ref('queue');

  tasks.forEach((task) => {
    new Queue(queueRef, {
      specId: (
        process.env.NODE_ENV === 'production' ?
          task.specId
        :
          `${require('../config/developerConfig').specPrefix}_${task.specId}`
      ),
      numWorkers: task.numWorkers
    }, createRunTask(task));
  });
};
