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
  Navigator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {BeerList} from './ios/app/BeerList'
import {Settings} from './ios/app/Settings'
import {UserList} from './ios/app/UserList'

class MahaffeysReactNative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      user: null,
      settingsIcon: '😶'
    }
    this.loadUser();
  }

  changeUser(userObj) {
    fetch(`http://www.mahaffeyspub.com/beer/api.php?action=getMembers&member_id=${userObj.id}&beer_list=true`).
    then((responseText) => responseText.text() ).
    then((response) => JSON.parse(response) ).
    then((user) => this.setState({ user: user.members[0] })).
    then((user) => AsyncStorage.setItem('user', JSON.stringify(this.state.user) ))
  }

  loadUser() {
    AsyncStorage.getItem('user').then(user => {
      if(user) { 
        this.setState({ settingsIcon: '😄'  }) 
        this.setState({ user: JSON.parse(user) })
        this.changeUser(JSON.parse(user))
      }
    });
  }

  navigatorRenderScene(route, navigator) {
    switch (route.id) {
      case 'beers':
        return <BeerList navigator={navigator} user={this.state.user} />
      case 'settings':
        return <Settings navigator={navigator} selectUserCallback={this.changeUser.bind(this)} user={this.state.user} />
      case 'userSelect':
        return <UserList navigator={navigator} {... route.passProps} />
    }
  }

  render() {
    return (
      <View style={styles.container}>
      <Navigator
        ref="nav"
        style={styles.container}
        initialRoute={
           { 
            id: 'beers', 
            title: "Mahaffey's Beer Club",
            backText: '🍺',
            right: {
              text: () => { return this.state.settingsIcon },
              action: (navigator) => { navigator.push({id: 'settings', title: 'Settings'})  }
            }
          }
        }
        renderScene={this.navigatorRenderScene.bind(this)}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
      />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    backgroundColor: '#476757',
    
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#FFFFFF',
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
});

var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {previousRoute.backText || previousRoute.title}
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    if(route.right == null) { return null; }
    return (
      <TouchableOpacity
        onPress={() => route.right.action(navigator)}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {route.right.text()}
        </Text>
      </TouchableOpacity>
    );
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },
};

AppRegistry.registerComponent('MahaffeysReactNative', () => MahaffeysReactNative);
