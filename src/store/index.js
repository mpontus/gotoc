import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'remote-redux-devtools';
import Reactotron from 'reactotron-react-native';
import logger from 'redux-logger';
import reducer from './reducer';
import rootEpic from './epic';

// TODO: use environment varables
const composeEnhancers = composeWithDevTools({
  secure: false,
  hostname: '192.168.1.4',
  port: 8000,
  suppressConnectErrors: false,
});

export default function configureStore(preloadedState, api) {
  const createStoreImplementation =
    process.env.NODE_ENV === 'production'
      ? createStore
      : Reactotron.createStore;
  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: { api },
  });
  const middleware = applyMiddleware(epicMiddleware, logger);

  return createStoreImplementation(
    reducer,
    preloadedState,
    composeEnhancers(middleware),
  );
}
