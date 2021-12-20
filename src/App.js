import React from "react";
import "./App.css";
import { UserInput, WorkoutList, ReccomendedWorkoutsList } from "./components";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { currentUser: { userId: -1, userName: "" }, users: [], likedItems: [], reccomendedWorkouts: [] };

    this.updateCurrentUser = this.updateCurrentUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getLikedWorkouts = this.getLikedWorkouts.bind(this);
    this.getRecommendations = this.getRecommendations.bind(this);
  }

  updateCurrentUser(user) {
    this.setState({ currentUser: { userId: user.user_id, userName: user.user_name }, reccomendedWorkouts: [] });
  }

  getUsers() {
    axios
      .get("http://localhost:3000/users")
      .then((res) => {
        const { data } = res;
        this.setState({ users: data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getRecommendations() {
    axios
      .get(`http://localhost:3000/reccomendations/${this.state.currentUser.userId}`)
      .then((res) => {
        console.log(res);
        const { data } = res;
        this.setState({ reccomendedWorkouts: data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getLikedWorkouts() {
    await axios
      .get(`http://localhost:3000/workouts/liked/${this.state.currentUser.userId}`)
      .then((res) => {
        this.setState({ likedItems: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let list = <div></div>;
    if (this.state.currentUser.userName !== "") {
      list = (
        <div>
          <ReccomendedWorkoutsList reccomendedWorkouts={this.state.reccomendedWorkouts} />
          <WorkoutList
            title="Workouts:"
            itemsEndpoint="http://localhost:3000/workouts"
            itemIndex="workout_id"
            itemName="workout_name"
            likedItems={this.state.likedItems}
            currentUser={this.state.currentUser}
            getLikedWorkouts={this.getLikedWorkouts}
          />
        </div>
      );
    }

    return (
      <div className="App">
        <h1>GRIT Workout Reccomender System:</h1>
        <h2>Current User: {this.state.currentUser.userName === "" ? "N/A" : this.state.currentUser.userName}</h2>
        <UserInput updateCurrentUser={this.updateCurrentUser} getLikedWorkouts={this.getLikedWorkouts} />
        <input type="button" value="Get Users" onClick={this.getUsers}></input>
        <input type="button" value="Get Reccomendations" onClick={this.getRecommendations}></input>
        <ul>
          {this.state.users.map((user) => {
            return <li key={user.user_id}>{user.user_name}</li>;
          })}
        </ul>
        {list}
      </div>
    );
  }
}

export default App;
