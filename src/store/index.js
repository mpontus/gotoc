const configureStore =
  process.env.NODE_ENV === 'development'
    ? require('./store.dev').default
    : require('./store.prod').default;

export default configureStore;
