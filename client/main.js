import React from 'react';
import { render } from 'react-dom';
import { Controller } from 'cerebral';
import Model from 'cerebral-model-immutable';
import { Container } from 'cerebral-view-react';

import DevToolsModule from 'cerebral-module-devtools';
import FirebaseModule from 'cerebral-module-firebase';
import RouterModule from 'cerebral-module-router';

import config from 'config';
import firebaseConfigs from '../config/firebaseConfig';

import App from './components/App';

import AppModule from './modules/App';


const firebaseConfig = firebaseConfigs[process.env.DUCKY_FIREBASE_APP || 'johannes-test'];

const controller = Controller(Model({
  error: null
}));

controller.addModules({
  app: AppModule(),

  devtools: process.env.NODE_ENV === 'production' ? function () {} : DevToolsModule(),
  firebase: FirebaseModule({
        specPrefix: config.specPrefix,
        config: {
          apiKey: firebaseConfig.apiKey,
          authDomain: firebaseConfig.authDomain,
          databaseURL: firebaseConfig.databaseURL,
          storageBucket: firebaseConfig.storageBucket
        }
    }),
    router: RouterModule({
        '/*': 'app.notFoundRouted'
    }, {
        onlyHash: true,
        query: true
    })
});

render((
  <Container controller={controller} strict>
    <App />
  </Container>
), document.querySelector('#app'))
