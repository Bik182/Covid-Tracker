const { searchListing, getCategories } = this.props;
const searchCategories = getCategories.searchCategories;
console.log("SEARCJ: ,", searchCategories);

<FlatList
  contentContainerStyle={{
    flexGrow: 1,
    justifyContent: "center",
  }}
  data={searchCategories}
  renderItem={this.renderCategories}
  extraData={this.state.refresh}
  keyExtractor={(item1, index) => {
    return "key" + index;
  }}
  ItemSeparatorComponent={this.renderSeparator}
  refreshing={false}
  ListEmptyComponent={this.ListEmptyComponent()}
/>;

renderCategories = (item1) => {
  return (
    <View>
      {/* <TouchableOpacity onPress={() => console.log("clicked")}> */}
      <View style={styles.headline}>
        <View>
          <Text type="headline">{item1.item.name}</Text>
          <Text type="footnote">{item1.item.id}</Text>
        </View>
        <Icon name="arrow-right" />
      </View>
      {/* </TouchableOpacity> */}
      <View style={styles.thumbnail}></View>
    </View>
  );
};










searchCategories: [],


var finalData = [];
const data = _.sortBy(
  _.values(action.categories).map((eachObject) => ({
    datar1: eachObject,
  }))
);
data.forEach(function (arrayItem) {
  if (arrayItem.datar1.hasOwnProperty("deprecated")) {
    if (arrayItem.datar1.deprecated) {
    }
  } else {
    category = {
      id: arrayItem.datar1._id,
      name: arrayItem.datar1.name,
    };
    finalData.push(category);
  }
});

searchCategories: finalData,
