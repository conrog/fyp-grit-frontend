import React from "react";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Login, Workouts } from "./components";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: { userId: -1, userName: "" },
      users: [],
      likedItems: [],
      reccomendedWorkouts: [],
      token: "",
      loading: false,
    };

    this.setToken = this.setToken.bind(this);
  }

  setToken(data) {
    this.setState({
      token: data.token,
      currentUser: { userId: data.user_id, userName: data.user_name },
    });
  }

  //For developement
  // async devSetToken() {
  //   this.setState({ loading: true });
  //   const { data } = await axios.post("http://localhost:3000/login", {
  //     username: "Conor",
  //     password: "abc123",
  //   });
  //   this.setState({
  //     token: data.token,
  //     currentUser: { userId: data.user_id, userName: data.user_name },
  //     loading: false,
  //   });
  // }
  // componentDidMount() {
  //   this.devSetToken();
  // }

  render() {
    if (!this.state.token) {
      return <Login setToken={this.setToken} />;
    }

    // For developement
    // if (this.state.loading) {
    //   return <h1>loading</h1>;
    // }

    return (
      <div className="mx-auto max-w-4xl">
        <div className="m-2">
          <h1 className="text-center my-4">GRIT Workout Reccomender System</h1>
          <h2 className="my-2">
            Current User:{" "}
            {this.state.currentUser.userName === ""
              ? "N/A"
              : this.state.currentUser.userName}
          </h2>
          <BrowserRouter>
            <Routes>
              <Route
                path="/workouts"
                element={<Workouts currentUser={this.state.currentUser} />}
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/*" element={<h1>404 Page not found</h1>} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
