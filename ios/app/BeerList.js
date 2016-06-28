import React, {
  Component
} from 'react';
import {
  TabBarIOS,
  NavigatorIOS,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

export class BeerList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ontap_beers: this._genRows({})
    }
  }

  componentDidMount() {
    console.log("Mounting BeerList")
    fetch('http://www.mahaffeyspub.com/beer/api.php?action=getBeers').
    then((responseText) => responseText.text() ).
    then((response) => JSON.parse(response) ).
    then((ontapList) => BeerList.transform(ontapList.beers, false)).
    then((beerList) => this.setState({ ontap_beers: this._genRows(beerList) }))
  }


 _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
     return (
      <TouchableHighlight onPress={() => {
        highlightRow(sectionID, rowID);
      }}>
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>{rowData.name}</Text>
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
    return ds.cloneWithRows(rows);
  }


  render() {
    return (
      <ListView
       style={styles.container}
        dataSource={this.state.ontap_beers}
        renderRow={this._renderRow}
        enableEmptySections={true}
      />
    );
  }
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
  if (t == "C") { return "Casks"; }
  if (t == "D") { return "Draft"; }
}

var styles = StyleSheet.create({
  container: {
    marginTop: 64,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
  },
});
