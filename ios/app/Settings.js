import React, {
  Component
} from 'react';
import {
  Modal,
  NavigatorIOS,
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} from 'react-native';

import {UserList} from './UserList'

export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
    }
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
              title: "Members",
              component: UserList,
              passProps: { selectUserCallback: this.changeUser.bind(this), user: this.props.user }
            })
          })}
          {this._renderRow("Untappd", () => {
            console.log("Nobody")
          })}
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