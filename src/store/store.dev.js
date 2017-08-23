import { applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'remote-redux-devtools';
import logger from 'redux-logger';
import Reactotron from './reactotron.dev';
import loadFixtures from './fixtures.dev';
import createReducer from './reducer';
import rootEpic from './epic';

// TODO: use environment variables
const composeEnhancers = composeWithDevTools({
  secure: false,
  hostname: '192.168.1.4',
  port: 8000,
  suppressConnectErrors: false,
});

export default function configureStore(api, config) {
  const preloadedState = loadFixtures(config);
  const reducer = createReducer(config);
  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: { api, config },
  });
  const middlewareEnhancer = applyMiddleware(epicMiddleware, logger);

  return Reactotron.createStore(
    reducer,
    preloadedState,
    composeEnhancers(middlewareEnhancer),
  );
}
