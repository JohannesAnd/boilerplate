function doTest(context) {
  return context.firebase.push('stuff', {"name": "Test", "score": 4})
  .then(context.path.success)
  .catch(context.path.error);
}

module.exports = doTest;
