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

export class BeerList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      beersLoaded: false,
      ontap_beers: {},
      displayBeers: {}
    }
  }

  componentDidMount() {
    console.log("-- Mounting BeerList")
    fetch('http://www.mahaffeyspub.com/beer/api.php?action=getBeers').
    then((responseText) => responseText.text() ).
    then((response) => JSON.parse(response) ).
    then((ontapList) => BeerList.transform(ontapList.beers, false)).
    then((beerList) => this.setState({ ontap_beers: beerList, displayBeers: beerList, beersLoaded: true }))
  }

  componentWillReceiveProps(newProps) {
    if(newProps.user && this.state.beersLoaded) {
      this.setState({ displayBeers: BeerList.addUser(this.state.ontap_beers, newProps.user.beers) })
    }
  }


 _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
     return (
      <TouchableHighlight onPress={() => {
        highlightRow(sectionID, rowID);
      }}>
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>{rowData.drank ? '🍺 ' : ''}{rowData.name}</Text>
          </View>
        </View>
      </TouchableHighlight>);

  }

  _renderSectionHeader(sectionData, category) {
    return (
      <Text style={styles.header}>{category}</Text>
    )
  }

  _genRows(data) {
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    var categories = { 'Draft': [], 'Cask': [], 'Bottle': [] };

    Object.keys(data).forEach(function(key) {
      var beer = data[key];
      categories[beer.type].push(beer)
    });
    
    categories['Draft'] = categories['Draft'].sort(function(a,b) { return a.name < b.name ? -1 : 1 })
    categories['Cask'] = categories['Cask'].sort(function(a,b) { return a.name < b.name ? -1 : 1 })
    categories['Bottle'] = categories['Bottle'].sort(function(a,b) { return a.name < b.name ? -1 : 1 })
    return ds.cloneWithRowsAndSections(categories);
  }


  render() {
    console.log("// Rendering BeerList", (this.props.user && this.props.user.name))
    return (
      <View style={styles.container}>
      <ListView
        dataSource={this._genRows(this.state.displayBeers)}
        renderRow={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
        enableEmptySections={true}
      />
      </View>
    );
  }
}

BeerList.addUser = function(ontap, user_list) {
  console.log("AddingUser")
  var newBeers = JSON.parse(JSON.stringify(ontap));
  user_list.forEach(function(beer) {
    if(newBeers[beer.id]) { newBeers[beer.id].drank = true } 
  });
  console.log("AddedUser")
  return newBeers;
}

BeerList.transform = function(list, user_drank) {
  console.log("transforming ontap")
  var beers = {};
  list.forEach(function(beer) {
    beers[beer.id] = {
      id: beer.id,
      name: beer.name, 
      type: BeerList.beerType(beer.type),
      in_stock: beer.in_stock == 'yes',
      drank: user_drank
    }
  });
  return beers;
}

BeerList.beerType = function(t) {
  if (t == "B") { return "Bottle"; }
  if (t == "C") { return "Cask"; }
  if (t == "D") { return "Draft"; }
}

var styles = StyleSheet.create({
  container: {
    marginTop: 64,
    flex: 1,
  },
  header: {
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    color: '#000000',
    fontWeight: 'bold'
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
});
