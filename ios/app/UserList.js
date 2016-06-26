import React, {
  Component
} from 'react';
import {
  TabBarIOS,
  NavigatorIOS,
  ListView,
  RecyclerViewBackedScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

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
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var rows = [];
    Object.keys(data).forEach(function(key) {
      rows.push(data[key]);
    });
    console.log('NUMBER OF MEMBERS IS ', rows.length)
    return ds.cloneWithRows(rows);
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this._genRows(this.state.users)}
          renderRow={this._renderRow.bind(this)}
          initialListSize={5}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          onEndReached={() => console.log("end is reached")}
          enableEmptySections={true}
          removeClippedSubviews={true}

        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    color: 'red'
  }
});
