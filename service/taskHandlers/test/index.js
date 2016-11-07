'use strict'

const resolveTask = require('./../common/actions/resolveTask');
const rejectTask = require('./../common/actions/rejectTask');

const doTest = require('./actions/doTest');

module.exports = [
    doTest, {
      success: [resolveTask],
      error: [rejectTask]
    }
];
