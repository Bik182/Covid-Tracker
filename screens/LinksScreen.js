import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import * as _ from "lodash";
import { PureComponent } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from "react-native-gesture-handler";
import {
  Image,
  Platform,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView,
  ActivityIndicator,
  Button,
  AsyncStorage,
  FlatList,
  List,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { ListItem, SearchBar, Card, Divider } from "react-native-elements";
import { MonoText } from "../components/StyledText";

export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      mainData: [],
      filteredData: [],
      fData: false,
      noData: true,
      refresh: true,
      refreshing: false,
      needLoad: true,
      order: "a",
    };
  }
  handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync(
      "https://rapidapi.com/KishCom/api/covid-19-coronavirus-statistics"
    );
  };

  // componentDidMount() {
  //   fetch(
  //     "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats?country=US",
  //     {
  //       method: "GET",
  //       headers: {
  //         "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
  //         "x-rapidapi-key":
  //           "4b6e45e0d9mshb3b946b54b5b240p1be6fajsn782f4f14411b",
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((json) => {

  //       this.filterData(json);
  //       console.log("done");

  //     })
  //     .catch((err) => {
  //       console.log("errr: ", err);
  //     });
  // }


   componentDidMount() {
    fetch(
      "https://api.nomics.com/v1/currencies/ticker?key=fc5824be967e7659a0ed5cf20fe23fc1&ids=BTC,ETH,XRP&interval=1d,30d&convert=EUR",
      {
        method: "GET",
        headers: {
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {

       this.filterData1(json);
        

      })
      .catch((err) => {
        console.log("errr: ", err);
      });
  }

  onRefreshMain = () => {
    this.setState({
      refreshing: true,
    });
    this.fetchData();
    this.setState({
      refreshing: false,
    });
  };

  doSomething = () => {
    this.setState({
      noData: false,
    });
  };

  _renderItem = ({ item }) => {
    //console.log("ITEM: ", item.onDay);
    return (
      <View style={styles.container}>
       
        <Card
          featuredTitle={item.currency}
          featuredTitleStyle={styles.featuredTitleStyle1}
        >
          <SvgUri svgXmlData={  item.image} width="500" height="500"   />
          <Text style={{ marginBottom: 10, textAlign: "center" }}>
            Name:  {item.currency}
          </Text> 

          <Divider style={{ backgroundColor: "black" }} />
          {/* <Text style={{ marginBottom: 10 }}>Deaths: {item.death_count}</Text> */}
          <Text style={{ marginBottom: 10 }}>Price: {item.price}</Text>
          <Text style={{ marginBottom: 10 }}>Market Change Cap: {item.oneDay}</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          ></View>
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
    fetch(
      "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats?country=US",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
          "x-rapidapi-key":
            "4b6e45e0d9mshb3b946b54b5b240p1be6fajsn782f4f14411b",
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        this.filterData(json);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  filterData = (json) => {
    var finalData = [];

    const data = _.sortBy(
      _.values(json.data.covid19Stats).map((eachObject) => (
        {
        cityName: eachObject.city,
        stateName: eachObject.province,
        death: eachObject.deaths,
      }
      ))
    );

    var tempObj = {};

    data.forEach(function (arrayItem) {
      if (arrayItem.cityName == null) {
        tempObj = {
          state: arrayItem.stateName,
          city: "no city",
          death_count: arrayItem.death,
        };
        finalData.push(tempObj);
      } else {
        tempObj = {
          state: arrayItem.stateName,
          city: arrayItem.cityName,
          death_count: arrayItem.death,
        };
        finalData.push(tempObj);
      }
    });

    finalData.sort(
      (a, b) => parseFloat(b.death_count) - parseFloat(a.death_count)
    );
    this.setState({
      mainData: finalData,
      viewSource: finalData,
      noData: false,
    });
  };

  filterData1 = (json) => {
    var data = {};
    var finalData = [];
    console.log("wewwwewe: ");

  


    console.log("wewwwewe: ", data);
    const data2 = _.sortBy(
      _.values(json).map((eachObject) => (
        {
        oneDay: eachObject["1d"].market_cap_change,
        image: eachObject.logo_url,
        currency: eachObject.name,
        price: eachObject.price,
      }
      ))
    );
    console.log("DATA: ", data2);
    var tempObj = {};

    

    finalData.sort(
      (a, b) => parseFloat(b.death_count) - parseFloat(a.death_count)
    );
    this.setState({
      mainData: data2,
      viewSource: data2,
      noData: false,
    });
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  onClear = () => {
    this.setState({
      fData: false,
    });
  };

  searchText = () => {
    this.setState({
      noData: true,
      fData: true,
    });
    let text = this.state.search.toLowerCase();
    let trucks = this.state.mainData;

    let filteredName = trucks.filter((item) => {
      return item.state.toLowerCase().match(text);
    });
    if (!Array.isArray(filteredName) && !filteredName.length) {
      this.setState({
        noData: true,
      });
    } else if (Array.isArray(filteredName)) {
      filteredName.sort(
        (a, b) => parseFloat(b.death_count) - parseFloat(a.death_count)
      );

      this.setState({
        noData: false,
        filteredData: filteredName,
      });
    }
  };

  changeOrder = () => {
    if (this.state.order == "d") {
      this.setState({
        filteredData: this.state.filteredData.sort(
          (a, b) => parseFloat(a.death_count) - parseFloat(b.death_count)
        ),

        mainData: this.state.mainData.sort(
          (a, b) => parseFloat(a.death_count) - parseFloat(b.death_count)
        ),

        order: "a",
      });
    }
    if (this.state.order == "a") {
      this.setState({
        filteredData: this.state.filteredData.sort(
          (a, b) => parseFloat(b.death_count) - parseFloat(a.death_count)
        ),

        mainData: this.state.mainData.sort(
          (a, b) => parseFloat(b.death_count) - parseFloat(a.death_count)
        ),

        order: "d",
      });
    }
  };

  render(): PureComponent {
    const { search } = this.state;

    return (
      <View style={styles.container}>
        <ImageBackground
          source={{
            uri:
              "https://thenypost.files.wordpress.com/2019/12/australia-bushfires-could-have-killed-up-to-30-percent-of-koalas.jpg?quality=80&strip=all",
          }}
          style={styles.welcomeImage}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer1}
          >
            <SearchBar
              platform="android"
              fontColor="#c6c6c6"
              iconColor="transparent"
              shadowColor="transparent"
              cancelIconColor="#c6c6c6"
              backgroundColor="transparent"
              placeholder="Type here..."
              onChangeText={this.updateSearch}
              onClear={this.onClear}
              value={search}
            />

            <View style={styles.welcomeContainer}>
              <MaterialIcons
                size={50}
                name="search"
                onPress={this.searchText}
                style={styles.icon1}
              />

              <MaterialIcons
                size={25}
                name="reorder"
                onPress={this.changeOrder}
                style={styles.icon}
              />

              <View style={styles.separator} />
            </View>
            <View style={styles.helpContainer}>
              <Text style={styles.texty}>(State : County / City)</Text>
              <TouchableOpacity onPress={this.handleLearnMorePress}>
                <Text style={styles.texty}>credit: KishCom</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <SafeAreaView style={styles.container}>
              {this.state.noData ? (
                <Text style={styles.texty1}>
                  {" "}
                  Possible network error or backend is down :({" "}
                </Text>
              ) : (
               
                <FlatList
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                  }}
                  data={
                    this.state.fData
                      ? this.state.filteredData
                      : this.state.mainData
                  }
                  renderItem={this._renderItem}
                  keyExtractor={(item, index) => "key" + index}
                  ItemSeparatorComponent={this.renderSeparator}
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefreshMain}
                />
              )}
            </SafeAreaView>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

LinksScreen.navigationOptions = {
  backgroundImage: (
    <Image
      style={{ width: 50, height: 50 }}
      source={{
        uri:
          "https://thenypost.files.wordpress.com/2019/12/australia-bushfires-could-have-killed-up-to-30-percent-of-koalas.jpg?quality=80&strip=all",
      }}
    />
  ),
  backgroundColor: "transparent",
  headerStyle: { height: 150, backgroundColor: "transparent", opacity: 1 },
  cardStyle: {
    shadowColor: "transparent",
    backgroundColor: "transparent",
  },
};

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    position: "absolute",
    left: 5,
    top: 0,
    color: "white",
  },
  logo:{
    width: 50,
    height: 50,
  },
  icon1: {
    position: "absolute",
    right: 5,
    top: 0,
    color: "white",
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer1: {
    paddingTop: 0,
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  searcher: {
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  welcomeImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
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
  texty: {
    fontSize: 17,
    color: "#fff",
    textShadowRadius: 100,
    textShadowColor: "black",
  },
  texty1: {
    fontSize: 50,
    color: "#fff",
    textShadowRadius: 100,
    textShadowColor: "black",
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
  textStyle: {
    fontSize: 25,
    color: "#fff",
  },
  textStyle2: {
    fontSize: 10,
    color: "#fff",
  },
  buttonStyle: {
    marginRight: 40,
    marginLeft: 40,
    marginBottom: 20,
    position: "absolute",
    top: 5,
    backgroundColor: "gray",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },

  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  formatInfo: {
    alignItems: "center",
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    paddingTop: 0,
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
