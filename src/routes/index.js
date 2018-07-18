import React from 'react';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './Home';
import CityScreen from './City';


const StackCity = StackNavigator({
  City: {
    screen: CityScreen,
  },
})

const MainStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    City: {
      screen: StackCity
    }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
    mode: 'card',
  }
);

export default MainStack;