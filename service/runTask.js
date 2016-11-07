const firebase = require('firebase');
const FunctionTree = require('function-tree');
const NodeDebuggerProvider = require('function-tree/providers/NodeDebugger');
const FirebaseProvider = require('./providers/Firebase');

module.exports = new FunctionTree((
  process.env.NODE_ENV === 'production' ?
    []
  :
    [NodeDebuggerProvider()]
).concat([
  FirebaseProvider(firebase)
])
);
