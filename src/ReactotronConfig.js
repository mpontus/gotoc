import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

console.log('ReactotronConfig');

Reactotron.configure({ host: '192.168.1.4' }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(reactotronRedux())
  .connect(); // let's connect!
