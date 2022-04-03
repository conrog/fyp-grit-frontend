import React from "react";
import jwtDecode from "jwt-decode";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Dashboard,
  Login,
  Workouts,
  CreateWorkout,
  Register,
} from "./components";
import ViewWorkout from "./components/Workouts/ViewWorkout";
import EditWorkout from "./components/Workouts/EditWorkout";
import NavBar from "./components/NavBar";
import Users from "./components/Social/Users";
import User from "./components/Social/User";
import HelpPage from "./components/HelpPage";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: { userId: -1, userName: "" },
      token: "",
      workoutTemplate: [],
    };

    this.setToken = this.setToken.bind(this);
    this.getToken = this.getToken.bind(this);
    this.logout = this.logout.bind(this);
    this.copyWorkoutTemplate = this.copyWorkoutTemplate.bind(this);
  }

  getToken() {
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
    let decoded = jwtDecode(token.token);
    sessionStorage.setItem("token", JSON.stringify(token));
    this.setState({
      currentUser: { userId: decoded.userId, userName: decoded.userName },
      token: token.token,
    });
  }

  logout() {
    sessionStorage.removeItem("token");
    this.setState({
      currentUser: { userId: -1, userName: "" },
      token: "",
    });
  }

  copyWorkoutTemplate(exercises) {
    console.log(exercises);
    this.setState({ workoutTemplate: [...exercises] });
  }

  componentDidMount() {
    this.getToken();
  }

  render() {
    if (!this.state.token) {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Login setToken={this.setToken} />} />
            <Route
              path="/register"
              element={<Register setToken={this.setToken} />}
            />
          </Routes>
        </BrowserRouter>
      );
    }

    return (
      <div>
        <BrowserRouter>
          <NavBar
            currentUser={this.state.currentUser.userName}
            logout={this.logout}
          />
          <div className="mx-auto px-1 max-w-4xl min-h-screen mt-2">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/workouts"
                element={<Workouts currentUser={this.state.currentUser} />}
              />
              <Route
                path="/workouts/new"
                element={
                  <CreateWorkout workoutTemplate={this.state.workoutTemplate} />
                }
              />
              <Route
                path="/workouts/:id"
                element={
                  <ViewWorkout
                    currentUserName={this.state.currentUser.userName}
                    copyWorkoutTemplate={this.copyWorkoutTemplate}
                  />
                }
              />
              <Route path="/workouts/:id/edit" element={<EditWorkout />} />
              <Route path="/users" element={<Users />} />
              <Route
                path="/users/:user_name"
                element={
                  <User currentUserName={this.state.currentUser.userName} />
                }
              />
              <Route
                path="/help"
                element={
                  <HelpPage currentUser={this.state.currentUser.userName} />
                }
              />
              <Route
                path="/*"
                element={
                  <HelpPage currentUser={this.state.currentUser.userName} />
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  }
}

export default App;
