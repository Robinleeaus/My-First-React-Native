import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Button, FlatList, Image } from 'react-native';
import { getOrientationAsync } from 'expo/build/ScreenOrientation/ScreenOrientation';
import userIcon from "./assets/userIcon.png";

var firebase = require("firebase");

// Web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAVQvh8d8SCDbBYfk2MmPwtHyQIHBvyR4U",
  authDomain: "dustmobile-e6d8a.firebaseapp.com",
  databaseURL: "https://dustmobile-e6d8a.firebaseio.com",
  projectId: "dustmobile-e6d8a",
  storageBucket: "dustmobile-e6d8a.appspot.com",
  messagingSenderId: "1087030994757",
  appId: "1:1087030994757:web:5fb2819d4c8bdadd27002c",
  measurementId: "G-X5YN1TQZN3"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default class Apps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      today: '',
      dateTime: ''
    };
  }

  componentDidMount() {
    this.readPostData();
  }

  // Set date and time format
  currentDateTime = () => {
    var today = new Date();
    var date = today.getDate()+' '+monthNames[today.getMonth()]+' '+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date+' at '+time;
    this.setState({dateTime});
  }

  //Handle share button
  onPressShareButton = async () => {
    alert('Your article has been posted!');
    await this.currentDateTime();
    this.writePostData(this.state.dateTime, this.state.text);
    this.readPostData();
  }

  //Handle cancel button
  onPressCancelButton = () => {
    alert('Your article has been disregarded!');
    this.setState({text:""})
  }

  //Write post data into firebase
  writePostData = (dateTime, content) => {
    var item = firebase.database().ref('PostList/').push();
    item.setWithPriority({
      dateTime,
      content
    }, 0 - Date.now())
    .then((data)=>{
        //success callback
        // console.log('data ' , data)
        this.setState({text:""})
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
  }

  //Read post data from firebase
  readPostData = () => {
    console.log("readPostData");
    var postList = [];
    firebase.database().ref('PostList/').on('child_added', snapshot => {
      postList.push(snapshot.val())
      this.setState({postList})
    });
  }

  //render post section
  renderPostItem = (dateTime, content) => {
    return (
      <View style={styles.postItem}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: "center"}}>
            <Image source={userIcon} style={{width:20, height:20}}/>
          </View>
          <View style={{flex: 9, margin: 10}}>
            <Text style={styles.poster}>Guest</Text>
            <Text style={styles.dateTime}>{dateTime}</Text>
          </View>
        </View>
        <Text style={styles.content}>{content}</Text>
      </View>
    );
  }

  render() {
    return (
        <View style={{flex: 1, marginTop: 30, marginLeft: 10, marginRight: 10, marginBottom: 10}}>
          {/* Post editing section */}
          <View style={{borderColor: 'gray', borderWidth: 1}}>
            <View style={styles.viewContainer1}>
              <TextInput style={styles.textInput}
                placeholder="What's on your mind?"
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
                multiline
              />
            </View>
            <View style={styles.viewContainer2}>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={this.onPressShareButton}
                  title="Share"
                />
                <Button
                  onPress={this.onPressCancelButton}
                  title="Cancel"
                  color="gray"
                />
              </View>
            </View>
          </View>
          {/* Post display section */}
          <FlatList
            data={this.state.postList}
            renderItem={({ item }) => this.renderPostItem(item.dateTime, item.content)}
          />
        </View>
    );
  }
}

// CSS style
const styles = StyleSheet.create({
  viewContainer1: {
    backgroundColor: 'lightgray',
    alignItems: "stretch",
    padding: 10,
  },
  viewContainer2: {
    backgroundColor: '#ffff',
    alignItems: "stretch",
    padding: 10,
  },
  textInput: {
    height: 80,
    borderColor: 'gray', 
    borderWidth: 1 , 
    width: '100%',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  postItem: {
    borderColor: 'gray', 
    borderWidth: 1 , 
    marginTop: 20,
  },
  poster: {
    fontWeight: 'bold'
  },
  dateTime: {
    color: 'lightgray',
  },
  content: {
    margin: 10,
  }
});
