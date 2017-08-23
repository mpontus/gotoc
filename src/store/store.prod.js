import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import createReducer from './reducer';
import rootEpic from './epic';

export default function configureStore(api, config) {
  const reducer = createReducer(config);
  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: { api, config },
  });

  return createStore(reducer, applyMiddleware(epicMiddleware));
}
