import React, {
  Component
} from 'react';
import {
  Modal,
  NavigatorIOS,
  StyleSheet,
  Switch,
  View,
  TouchableHighlight,
  Text
} from 'react-native';

var UserDefaults = require('react-native-userdefaults-ios');

export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      debugBuilds: false
    }

    UserDefaults.boolForKey('APPHUB_DEBUG').then(bool => { 
      console.log("read status as", bool)
      this.setState({debugBuilds: bool})
    });
  }

  changeUser(userObj) {
    this.props.selectUserCallback(userObj)
    this.setState({ user: userObj })
  }

  render() {
    var memberTitle = this.state.user ? 'Member: ' + this.state.user.name : 'Pick a Member'
    return (
      <View style={styles.emptyPage}>
        <View style={styles.line}/>
        <View style={styles.group}>
          {this._renderRow(memberTitle, () => {
            this.props.navigator.push({
              id: 'userSelect',
              passProps: {
                selectUserCallback: this.changeUser.bind(this), 
                user: this.props.user
              }
            })
          })}
          {this._renderRow("Untappd", () => {
            console.log("Nobody");
          })}
          <View style={styles.row}>
            <Text style={styles.rowText}>Use Debug Builds</Text>
            <Switch
            onValueChange={(value) => { 
              console.log("Setting value to", value);
              UserDefaults.setBoolForKey(value, 'APPHUB_DEBUG');
              this.setState({debugBuilds: value}) 
            }}
            value={this.state.debugBuilds} />
          </View>
        </View>
      </View>
    )
  }

  _renderRow(title: string, onPress: Function) {
    return (
      <View>
        <TouchableHighlight onPress={onPress}>
          <View style={styles.row}>
            <Text style={styles.rowText}>
              {title}
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.separator} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyPage: {
    flex: 1,
    paddingTop: 64,
  },
  emptyPageText: {
    margin: 10,
  },
  group: {
    backgroundColor: 'white',
  },
  groupSpace: {
    height: 15,
  },
  line: {
    backgroundColor: '#bbbbbb',
    height: StyleSheet.hairlineWidth,
  },
  row: {
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#bbbbbb',
    marginLeft: 15,
  },
  rowText: {
    fontSize: 17,
    fontWeight: '500',
  },
})