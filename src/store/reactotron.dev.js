import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

// TODO: find a way to do console.log while evaluating JS on the device
// eslint-disable-next-line no-console
console.tron = Reactotron;

Reactotron.configure({ host: '192.168.1.4' }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(reactotronRedux())
  .connect(); // let's connect!

export default Reactotron;
