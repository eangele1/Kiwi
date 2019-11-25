import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import LoginScreen from './Login.js';

const AppNavigator = createStackNavigator(
  //binds screens to navigation name to allow buttons to go to that screen
  {
    "Login": LoginScreen
  },
  {
    //first screen to enter when opening the app
    initialRouteName: "Login"
  }
);

export default createAppContainer(AppNavigator);