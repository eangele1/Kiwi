import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import LoginScreen from './Login.js';
import HomeScreen from './Home.js';
import InfoScreen from './Information.js';
import ArchiveScreen from './Archive.js';
import ForgotScreen from './Forgot.js';
import InfoChangeScreen from './InfoChange.js';

const TabNavigation = createBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Check-In',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="feather-alt" color={tintColor} size={24} />
      )
    }
  },
  Information: {
    screen: InfoScreen,
    navigationOptions: {
      tabBarLabel: 'Information',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="info-circle" color={tintColor} size={24} />
      )
    }
  },
  Archive: {
    screen: ArchiveScreen,
    navigationOptions: {
      tabBarLabel: 'Archive',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="archive" color={tintColor} size={24} />
      )
    }
  }

}, {//router config
  initialRouteName: 'Home',
  //navigation for complete tab navigator
  navigationOptions: {
    tabBarVisible: true,
    header: null
  },
  tabBarOptions: {
    activeTintColor: 'yellow',
    inactiveTintColor: 'white',
    style: {
      backgroundColor: '#653334', // tabbar background color
      height: 55
    }
  }
});

const AppNavigator = createStackNavigator(
  //binds screens to navigation name to allow buttons to go to that screen
  {
    "Login": LoginScreen,
    "MainMenu": TabNavigation,
    "Forgot": ForgotScreen,
    "Info Change": InfoChangeScreen
  },
  {
    //first screen to enter when opening the app
    initialRouteName: "Login"
  }
);

export default createAppContainer(AppNavigator);