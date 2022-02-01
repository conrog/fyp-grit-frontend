// TODO:
// Refactor axios API functions into API folder
// .env file for API url etc...
// Redirect to login on 401
//  - If 401 recieved call clearState function that removes state and sessionStorage
// Register page

import React from "react";
import jwtDecode from "jwt-decode";

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
    this.getToken = this.getToken.bind(this);
  }

  getToken() {
    //Add setState to decoded token
    const tokenString = sessionStorage.getItem("token");
    if (tokenString) {
      let decoded = jwtDecode(tokenString);
      this.setState({
        currentUser: { userId: decoded.userId, userName: decoded.userName },
        token: tokenString,
      });
    }
  }

  setToken(token) {
    //Set State here
    let decoded = jwtDecode(token.token);
    sessionStorage.setItem("token", JSON.stringify(token));
    this.setState({
      currentUser: { userId: decoded.userId, userName: decoded.userName },
      token: token.token,
    });
  }

  componentDidMount() {
    this.getToken();
  }

  render() {
    if (!this.state.token) {
      return <Login setToken={this.setToken} />;
    }

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
