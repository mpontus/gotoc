import { createStore } from 'redux';
import devToolsEnhancer from 'remote-redux-devtools';
import reducer from './reducer';

export default function configureStore(preloadedState) {
  return createStore(
    reducer,
    preloadedState,
    // TODO: use environment varables
    devToolsEnhancer({
      secure: false,
      hostname: '192.168.1.4',
      port: 8000,
      suppressConnectErrors: false,
    }),
  );
}
