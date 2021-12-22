import React from "react";
import axios from "axios";
import { UserInput, WorkoutList, ReccomendedWorkoutsList } from "./components";

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
          <ReccomendedWorkoutsList
            reccomendedWorkouts={this.state.reccomendedWorkouts}
            getRecommendations={this.getRecommendations}
          />
          <WorkoutList
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
      <div className="mx-auto w-50">
        <h1 className="text-center my-4">GRIT Workout Reccomender System:</h1>
        <h2 className="my-4">
          Current User: {this.state.currentUser.userName === "" ? "N/A" : this.state.currentUser.userName}
        </h2>
        <UserInput updateCurrentUser={this.updateCurrentUser} getLikedWorkouts={this.getLikedWorkouts} />
        <input
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-2 rounded shadow cursor-pointer mr-1"
          value="Show Available Users"
          onClick={this.getUsers}
        ></input>
        {this.state.users.length > 0 ? <h2 className="mt-2">Available Users:</h2> : ""}
        <div className="grid grid-cols-3 mb-2 w-1/2">
          {this.state.users.map((user) => {
            return <div key={user.user_id}>{user.user_name}</div>;
          })}
        </div>
        {list}
      </div>
    );
  }
}

export default App;