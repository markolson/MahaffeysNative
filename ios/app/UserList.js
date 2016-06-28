import React, {
  Component
} from 'react';
import {
  AsyncStorage,
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
      hidSearch: false
    }
    this.loadUsers()
  }

  loadUsers() {
    AsyncStorage.getItem('users').then(users => {
      if(users) { 
        console.log("async loaded")
        users = JSON.parse(users)
        this.setState({ rawusers: users, users: users })
      }
    });
  }

  componentDidMount() {
    console.log("UserList Mounted")
    fetch('http://www.mahaffeyspub.com/beer/api.php?action=getMembers').
    then((responseText) => responseText.text() ).
    then((response) => JSON.parse(response) ).
    then((userJSONList) => userJSONList.members, false).
    then((userList) => this.setState({ rawusers: userList, users: userList })).
    then((user) => AsyncStorage.setItem('users', JSON.stringify(this.state.users) )).
    then(() => console.log("done downloading user list"))
  }

  _pressRow(rowData) {
    this.props.selectUserCallback(rowData);
    this.props.navigator.pop();
  }

 _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    if(rowData.search) {
        return <TextInput
          style={styles.search}
          placeholder="Name or Number"
          onChangeText={this._filter.bind(this)} 
          />
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
    if(searchString == "") { this.setState({ users: this.state.rawusers} ) }
    results = []
    this.state.rawusers.forEach(function(user) {
      search = String(user.id) + user.name
      if(search.indexOf(searchString) > -1) {
        results.push(user)
      }
    })
    this.setState({ users: results })
  }

  _genRows(data) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var rows = [];
    if(this.state.rawusers.length > 0) { rows.push({search: true}) }
    Object.keys(data).forEach(function(key) {
      rows.push(data[key]);
    });
    return ds.cloneWithRows(rows);
  }

  componentDidUpdate() {
    if(this.refs.list && this.state.users.length > 0 && !this.state.hidSearch) {
      this.setState({ hidSearch: true }) 
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
    marginTop: 64,
    backgroundColor: '#F6F6F6',
  },
  row: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  search: {
    height: 40,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    paddingLeft: 5,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  text: {
    flex: 1,
  },
  number: { 
    color: 'red'
  }
});
