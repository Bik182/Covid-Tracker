import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import * as _ from "lodash";
import { PureComponent } from "react";

import { ScrollView } from "react-native-gesture-handler";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView,
  ActivityIndicator,
  Button,
  AsyncStorage,
  FlatList,
  SafeAreaView,
  ImageBackground,
  LogBox 
} from "react-native";

import {
  List,
  ListItem,
  SearchBar,
  Card,
  Divider,
} from "react-native-elements";
import { MonoText } from "../components/StyledText";
LogBox.ignoreAllLogs();

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainData: [],
      refresh: true,
      refreshing: false,
      needLoad: true,
    };
  }

  componentDidMount() {
    fetch("https://data.cdc.gov/resource/kn79-hsxy.json")
      .then((response) => response.json())
      .then((res) => {
        this.findMostDeathsByState(res);
      })

      .done();
  }

  handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync("https://data.cdc.gov");
  };

  load = () => {
    if (this.props?.fetch) {
      this.setState({ needLoad: false });

      this.fetchData();
    } else {
      this.setState({ needLoad: true });
    }
  };
  
  onRefreshMain = () => {
    this.setState({
      refreshing: true,
      mainData: [],
    });
    this.fetchData();
    this.setState({
      refreshing: false,
    });
  };

  _renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <Card
          featuredTitle={item.state}
          featuredTitleStyle={styles.featuredTitleStyle1}
        >
          <Text style={{ marginBottom: 10, textAlign: "center" }}>
            {item.state}
          </Text>

          <Divider style={{ backgroundColor: "black" }} />
          <Text style={{ marginBottom: 10 }}>Deaths: {item.death_count}</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.noteStyle}> {item.county}</Text>
          </View>
        </Card>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 10,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%",
        }}
      />
    );
  };

  fetchData = () => {
    const url = "https://data.cdc.gov/resource/kn79-hsxy.json";

    fetch(url)
      .then((response) => response.json())
      .then((res) => {
        this.findMostDeathsByState(res);
      })

      .done();
  };

  findMostDeathsByState = (res) => {
    var finalData = [];

    const data = _.sortBy(
      _.values(res).map((eachObject) => ({
        stateName: eachObject.state_name,
        countyName: eachObject.county_name,
        death: eachObject.total_death,
      })),
      (name) => {
        return name;
      }
    );

    var currMaxDeath = 0;
    var currState = "";
    var currCounty = "";
    var tempObj = {};
    var newState = true;
    var ifStarting = true;
    var finalCount = 0;
    data.forEach(function (arrayItem) {
      if (ifStarting) {
        currState = arrayItem.stateName;
        currMaxDeath = arrayItem.death;
        currCounty = arrayItem.countyName;

        ifStarting = false;
      } else {
        if (arrayItem.stateName == currState) {
          if (arrayItem.death > currMaxDeath) {
            currMaxDeath = arrayItem.death;
            currCounty = arrayItem.countyName;
          }
        } else {
          //we have gone through all objects of that state
          //save current state info into object and add to finalData

          tempObj = {
            state: currState,
            county: currCounty,
            death_count: currMaxDeath,
          };
          finalData.push(tempObj);

          ifStarting = true;
          finalCount++;
        }
      }
    });
    finalData.sort(
      (a, b) => parseFloat(b.death_count) - parseFloat(a.death_count)
    );

    this.setState({
      mainData: finalData,
    });
  };

  render(): PureComponent {

    return (
      <View style={styles.container}>
        <ImageBackground
          source={{
            uri:
              "https://images.theconversation.com/files/384925/original/file-20210218-12-1vl8xif.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop",
          }}
          style={styles.welcomeImage}
        >
          <TouchableOpacity onPress={this.handleLearnMorePress}>
            <Text style={styles.texty}> credit: data.cdc.gov </Text>
          </TouchableOpacity>
          <SafeAreaView style={styles.container}>
            <FlatList
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              data={this.state.mainData}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => "key" + index}
              ItemSeparatorComponent={this.renderSeparator}
              //refreshing={this.state.refreshing}
              //onRefresh={this.onRefreshMain}
            />
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  // welcomeImage: {
  //   width: 100,
  //   height: 80,
  //   resizeMode: "contain",
  //   marginTop: 3,
  //   marginLeft: -10,
  // },
  welcomeImage: {
    // width: 100,
    // height: 80,
    // resizeMode: "contain",
    // marginTop: 3,
    // marginLeft: -10,
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  texty: {
    fontSize: 17,
    color: "#fff",
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center",
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 50,
    color: "#2e78b7",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "transparent",
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  // welcomeImage: {
  //   width: 100,
  //   height: 80,
  //   resizeMode: "cover",
  //   marginTop: 3,
  //   marginLeft: -10,
  // },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center",
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  header: {
    backgroundColor: "#F7313E",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 10,
    borderBottomColor: "#ddd",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    padding: 26,
  },
  item: {
    padding: 5,
    borderBottomColor: "black",
  },
  titleText: {
    color: "white",
    fontSize: 18,
  },
  noteStyle: {
    margin: 5,
    fontStyle: "italic",
    color: "black",
    fontSize: 15,
  },
  featuredTitleStyle1: {
    marginHorizontal: 5,
    textShadowColor: "#00000f",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3,
  },
  buttonText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
});
