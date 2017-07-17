// Inject all operators available from RxJS
import 'rxjs';
import React from 'react';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './store';

const store = configureStore();

store.dispatch({ type: 'foo' });

const Root = () =>
  (<Provider store={store}>
    <App />
  </Provider>);

export default Root;
