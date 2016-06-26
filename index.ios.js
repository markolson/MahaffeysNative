/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Text
} from 'react-native';

import {BeerList} from './BeerList'

class MahaffeysReactNative extends Component {
  render() {
    console.log(BeerList)
    return <BeerList />
  }
}

AppRegistry.registerComponent('MahaffeysReactNative', () => MahaffeysReactNative);
