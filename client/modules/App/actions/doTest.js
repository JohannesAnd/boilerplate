function doTest({ services, output }) {
  services.firebase.task('test')
  .then(output.success)
  .catch(output.error)
}

export default doTest;
