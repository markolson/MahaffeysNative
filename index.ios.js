/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Modal,
  NavigatorIOS,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {BeerList} from './ios/app/BeerList'
import {Settings} from './ios/app/Settings'

class MahaffeysReactNative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      user: null
    }
  }

  changeUser(userObj) {
    console.log("Changing User")
    this.setState({ user: userObj })
  }

  render() {
    return (
      <View style={styles.container}>
      <NavigatorIOS
        ref="nav"
        style={styles.container}
        initialRoute={{
          component: BeerList,
          title: '100 Beer Club',
          rightButtonTitle: '😶',
          onRightButtonPress: () => {
            this.refs.nav.push({
              title: "Settings",
              component: Settings,
              backButtonTitle: 'Back',
              leftButtonIcon: '🍻',
              passProps: { selectUserCallback: this.changeUser.bind(this), user: this.state.user }
            })
          }
        }}
        tintColor="#FFFFFF"
        barTintColor="#476757"e
        titleTextColor="#FFFFFF"
        translucent={true}
      />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});


AppRegistry.registerComponent('MahaffeysReactNative', () => MahaffeysReactNative);
