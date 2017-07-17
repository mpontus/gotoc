import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'remote-redux-devtools';
import reducer from './reducer';
import rootEpic from './epic';

// TODO: use environment varables
const composeEnhancers = composeWithDevTools({
  secure: false,
  hostname: '192.168.1.4',
  port: 8000,
  suppressConnectErrors: false,
});
const epicMiddleware = createEpicMiddleware(rootEpic);

export default function configureStore(preloadedState) {
  return createStore(
    reducer,
    preloadedState,
    composeEnhancers(applyMiddleware(epicMiddleware)),
  );
}
