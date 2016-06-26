import React, {
  Component
} from 'react';
import {
  TabBarIOS,
  NavigatorIOS,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

var hashCode = function(str) {
  var hash = 15;
  for (var ii = str.length - 1; ii >= 0; ii--) {
    hash = ((hash << 5) - hash) + str.charCodeAt(ii);
  }
  return hash;
};

export class UserList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      users: {},
      rawusers: {}
    }
  }

  componentDidMount() {
    console.log("UserList Mounted")
    fetch('http://www.mahaffeyspub.com/beer/api.php?action=getMembers').
    then((responseText) => responseText.text() ).
    then((response) => JSON.parse(response) ).
    then((userJSONList) => userJSONList.members, false).
    then((userList) => this.setState({ rawusers: userList, users: userList }))
  }

  _pressRow(rowData) {
    this.props.selectUserCallback(rowData);
    this.props.navigator.pop();
  }

 _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    var rowHash = Math.abs(hashCode(rowData));
     return (
      <TouchableHighlight onPress={() => {
        highlightRow(sectionID, rowID);
        this._pressRow(rowData);
      }}>
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>{rowData.name}</Text>
            <Text style={styles.number}>{rowData.id}</Text>
          </View>
        </View>
      </TouchableHighlight>);

  }

  _genRows(data) {
    var rows = [];
    Object.keys(data).forEach(function(key) {
      rows.push(data[key]);
    });
    return this.state.ds.cloneWithRows(rows);
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this._genRows(this.state.users)}
          renderRow={this._renderRow.bind(this)}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  text: {
    flex: 1,
  },
  number: { 
    color: '#AAAAAA'
  }
});