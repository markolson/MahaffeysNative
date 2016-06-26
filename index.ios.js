/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  NavigatorIOS,
  StatusBar,
  StyleSheet,
  Text
} from 'react-native';

import {BeerList} from './BeerList'

class MahaffeysReactNative extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          component: BeerList,
          title: '100 Beer Club',
          rightButtonTitle: '🍻',
          onRightButtonPress: () => {
            StatusBar.setBarStyle('default');
          }
        }}
        tintColor="#FFFFFF"
        barTintColor="#476757"
        titleTextColor="#FFFFFF"
        translucent={true}
      />
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});


AppRegistry.registerComponent('MahaffeysReactNative', () => MahaffeysReactNative);
