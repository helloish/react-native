import React, { Component } from "react";
import {
FlatList,
StyleSheet,
Text,
View,
TouchableOpacity,
TextInput,
ActivityIndicator,
} from "react-native";
export default class App extends Component {
state = {
  nameInfo: "",
  data: [],
  text: "",
  isLoading: false,
  dataFetched: false,
};
//saves user text input
handleText = (text) => {
  this.setState({ nameInfo: text });
};
//makes http call and updates boolean values
fetchData = async (n) => {
  this.setState({ isLoading: true });
  var name = n;
  var place = n.indexOf(" ");
  var r = "";
  if (place >= 0) {
    var fName = name.substring(0, place);
    var lName = name.substring(place + 1);
    r =
      "https://npiregistry.cms.hhs.gov/api/?first_name=" +
      fName +
      "&last_name=" +
      lName +
      "&city=&limit=20&version=2.1";
  } else {
    r =
      "https://npiregistry.cms.hhs.gov/api/?first_name=" +
      name +
      "&city=&limit=20&version=2.1";
  }
  try{
    const response = await fetch(r);
    const json = await response.json();
    this.setState({ data: json.results });
  } catch(error){
    console.error("There was a problem:", error);
  }
  this.setState({ isLoading: false, dataFetched: true });
};

//displays data, specifically first and last name, flatlisted
display() {
  if (this.state.data && this.state.data.length > 0) {
    return (
      <FlatList
        data={this.state.data}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 15 }}>
            {`
        ${item.basic.first_name} ${item.basic.last_name}
        ${item.addresses[0].city} ${item.addresses[0].state}`}
            {"\n        "}
            <Text>NPI: </Text> {`${item.number}`}
            {"\n        "}
            <Text>Credential: </Text>
            {`${item.basic.credential}
        `}
          </Text>
        )}
      />
    );
  } else {
    return <Text>No Results Found</Text>;
  }
}
render() {
  console.log()
  return (
    <View style={styles.container}>
      <TextInput
        style={{
          height: 40,
          width: "95%",
          borderColor: "gray",
          borderWidth: 2,
          borderRadius: 20,
          marginBottom: 15,
          fontSize: 20,
          textAlign: "center",
          backgroundColor: "white",
        }}
        onChangeText={(text) => this.handleText(text)}
        placeholder={"Enter Search Text"}
        underlineColorAndroid="transparent"
        value={this.text}
      />
      <TouchableOpacity
        style={{ marginTop: 5, marginBottom: 5 }}
        onPress={() => this.fetchData(this.state.nameInfo)}
        nameInfo={this.state.nameInfo}
        style={styles.roundButton1}
      >
        <Text style={{ fontSize: 20, color: "white" }}>Search</Text>
      </TouchableOpacity>
      {this.state.isLoading && <ActivityIndicator size="large" />}
      {this.state.dataFetched && !this.state.isLoading && this.display()}
    </View>
  );
}
}
const styles = StyleSheet.create({
container: {
  paddingTop: 70,
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "lightgray",
},
roundButton1: {
  fontSize: 20,
  width: "95%",
  height: 40,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 20,
  backgroundColor: "green",
},
});
 
