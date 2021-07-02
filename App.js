import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
export default class App extends Component {
state = {
  nameInfo: "",
  data: [],
  text: '',
  myBoolean1: false,
  isLoading: false
}
//saves user text input
handleText = (text) => {
  this.setState({nameInfo: text});
}
//makes http call and updates boolean values
fetchData = async (n) => {
  this.setState({myBoolean1: true});
  this.setState({isLoading: true});
  var name = n;
  const response = await fetch('https://npiregistry.cms.hhs.gov/api/?first_name='+name+'&city=&limit=20&version=2.1');
  const json = await response.json();
  this.setState({ data: json.results });
  this.setState({isLoading: false});
 }
//displays data, specifically first and last name, flatlisted 
display(){
  if(this.state.data && this.state.data.length>0){
    if(this.state.myBoolean1 == true){
      return(
        <FlatList
      data={this.state.data}
      keyExtractor={(x, i) => i}
      renderItem={({ item }) =>
        <Text>
          {`${item.basic.first_name} ${item.basic.last_name}`}
        </Text>}
    />
      ) 
    }
  }
  else{
    return(
      <Text>No Results Found</Text>
    )
  }
  
};
 
render() {
   return (
      
    <View style={styles.container}>
      
      <TextInput
        onChangeText = {(text) => this.handleText(text)}
        placeholder= {'Enter here'}
        value = {this.text}
       />
     
      <TouchableOpacity
      style={{ marginTop:20, marginBottom: 20}}
        onPress = {()=>this.fetchData(this.state.nameInfo)}
        nameInfo = {this.state.nameInfo}
      
      ><Text>Search</Text>
      </TouchableOpacity>
     
     {this.state.isLoading && <ActivityIndicator size = "large"/>}
     {this.display()}
    </View>
  );
 }
}
const styles = StyleSheet.create({
  container: {
    marginTop: 150,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
});
 
