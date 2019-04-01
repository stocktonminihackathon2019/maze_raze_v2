import React, { Component } from "react";
import "./App.css";
import Maze from "./maze";
import firebase from "firebase";

var app = firebase.initializeApp({
  apiKey: "AIzaSyCcwjtuS8MpnXGBB3pJgvBoJQXhVjY5y44",
  authDomain: "mazeraze-7db23.firebaseapp.com",
  databaseURL: "https://mazeraze-7db23.firebaseio.com",
  projectId: "mazeraze-7db23",
  storageBucket: "mazeraze-7db23.appspot.com",
  messagingSenderId: "501225340917"
});

class App extends Component {
  state = {
    data: {},
    loading: true
  };

  componentDidMount() {
    var ref = app.database().ref("/");
    ref.once("value", snapshot => {
      console.log(snapshot.val());
      if (snapshot.val() === null) {
        ref.set({ 
          grid: [{ 0: 0 }], 
          created: false ,
          current: {
            x: 0,
            y: 0,
            visited: true,
            walls: {
              0: true,
              1: true,
              2: true,
              3: true
            }
          }
        }
          );
        }
        ref.on("value", snapshot => {
          this.setState({
            data: snapshot.val(),
            loading: false
          });
        });
    });
  }

  updateGridObject(grid) {
    console.log("updateGridObject");
    var ref = app.database().ref("/grid");
    console.time();
    ref.update(grid)
    .then(() => {
      console.log("Updated Grid On Firebase");
    });
    console.timeEnd();

  }

  updateCreatedFlag(isCreated) {
    console.log("updateCreatedFlag");
    var ref = app.database().ref("/");
    ref.update({created: isCreated});
  }

  updateCurrentCell(x,y,visited,walls){
    console.log("updateCurrentCell");
    var ref = app.database().ref("/current");
    ref.update({
      x: x,
      y: y,
      visited: visited,
      walls: {
        0: walls[0],
        1: walls[1],
        2: walls[2],
        3: walls[3],
      }
    });
  }

  updatePath(x,y) {
    console.log("updatePath");
    var ref = app.database().ref("/path");
    ref.push({
      x: x,
      y: y,
    })
    .then((ret) => {
      console.log("IM RETURNING A TINg: ", ret.path.pieces_[1]);
    });
  }

  render() {
    return (
      <div className="App">
      <br/>
        {this.state.loading ? (
          <p>Loading...</p>
        ) : (
          <Maze
            data={this.state.data}
            updateCurrentCell={this.updateCurrentCell}
            updateCreatedFlag={this.updateCreatedFlag}
            updateGridObject={this.updateGridObject}
            updatePath={this.updatePath}
          />
        )}
      </div>
    );
  }
}

export default App;
