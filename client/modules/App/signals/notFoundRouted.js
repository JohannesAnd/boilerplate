import { set } from 'cerebral/operators';
import doTest from './../actions/doTest';

export default [
  set('state:app.currentPage', null),
  doTest
];
