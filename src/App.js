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
          }}
          );

        ref.on("value", snapshot => {
          this.setState({
            data: snapshot.val(),
            loading: false
          });
        });
        } else {
          ref.on("value", snapshot => {
            this.setState({
              data: snapshot.val(),
              loading: false
            });
          });
        }
    });
  }

  componentDidUpdate(){
  }

  handleDataUpdate(isCreated, grid) {
    var ref = app.database().ref("/");
    ref.update({created: isCreated});
    ref = app.database().ref("/grid");
    ref.update(grid);

  }

  handleUpdateCell(x,y,visited,walls){
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

  updateFirebase() {}

  render() {
    return (
      <div className="App">
        {this.state.loading ? (
          <p>Loading...</p>
        ) : (
          <Maze
            data={this.state.data}
            handleDataUpdate={this.handleDataUpdate}
            handleUpdateCell={this.handleUpdateCell}
          />
        )}
      </div>
    );
  }
}

export default App;
