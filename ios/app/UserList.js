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
      rawusers: {},
      searchText: ""
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
    if(rowData.search) {
        return <TextInput
          style={styles.search}
          placeholder="Search.."
          onChangeText={this._filter.bind(this)}
          value={this.state.searchText} />
    }
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

  _filter(searchString) {
    this.setState({ searchText: searchString }) 
    if(searchString == "") { this.setState({ users: this.state.rawusers }) }
    results = []
    this.state.rawusers.forEach(function(user) {
      search = String(user.id) + user.name
      if(search.indexOf(searchString) > -1) {
        results.push(user)
      }
      // convert id to string and append to name
      // take appended.indexOf(searchString)
      // add to results if either matches
    })
    this.setState({ users: results })
    //console.log(this.state.rawusers)
  }

  _genRows(data) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var rows = [];
    if(this.state.users.length > 0) { rows.push({search: true}) }
    Object.keys(data).forEach(function(key) {
      rows.push(data[key]);
    });
    return ds.cloneWithRows(rows);
  }

  componentDidUpdate() {
    if(this.refs.list && this.state.users.length > 0 && this.state.searchText.length == 0) {
      this.refs.list.scrollTo({y: 40})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          ref="list"
          dataSource={this._genRows(this.state.users)}
          renderRow={this._renderRow.bind(this)}
          initialListSize={5}
          pageSize={30}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          scrollTo={40}
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
    marginTop: 64
  },
  row: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  search: {
    height: 40,
  },
  text: {
    flex: 1,
  },
  number: { 
    color: 'red'
  }
});
