import React from "react";
import "./UserInput.css";
import axios from "axios";

class UserInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userName: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSetUser = this.handleSetUser.bind(this);
    this.handleCreateUser = this.handleCreateUser.bind(this);
  }

  handleChange(event) {
    this.setState({ userName: event.target.value });
  }

  async handleCreateUser() {
    if (this.state.userName !== "") {
      await axios.post("http://localhost:3000/user", { userName: this.state.userName }).then((res) => {
        console.log(res);
        this.props.updateCurrentUser(res.data);
        this.setState({ userName: "" });
      });
      this.props.getLikedWorkouts();
    } else {
      alert("Username must not be blank!");
    }
  }

  async handleSetUser() {
    if (this.state.userName !== "") {
      await axios.get(`http://localhost:3000/user/${this.state.userName}`).then((res) => {
        const { data } = res;
        if (data) {
          this.props.updateCurrentUser(data);
          this.props.getLikedWorkouts();
        } else alert(`${this.state.userName} does not exist, please create user.`);
      });
      this.props.getLikedWorkouts();
    } else {
      alert("Username must not be blank!");
    }
  }

  render() {
    return (
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter username..."
            value={this.state.userName}
            onChange={this.handleChange}
          ></input>
          <input type="button" value="Set User" onClick={this.handleSetUser}></input>
          <input type="button" value="Create User" onClick={this.handleCreateUser}></input>
        </div>
      </div>
    );
  }
}

export default UserInput;
