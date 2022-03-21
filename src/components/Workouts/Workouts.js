import React from "react";
import { Link } from "react-router-dom";
import WorkoutList from "./WorkoutList";
import RecommendedWorkoutList from "./RecommendedWorkoutList";

class Workouts extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectValue: "workouts", searchValue: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ selectValue: event.target.value });
  }

  render() {
    return (
      <div>
        <h1 className="mb-2">Workouts</h1>
        <div className="flex flex-col md:flex-row gap-1">
          <div className="flex-auto">
            <input
              type="text"
              placeholder="Search..."
              className="p-1 h-full card w-full  md:w-6/12"
              onChange={(event) => {
                this.setState({ searchValue: event.target.value });
              }}
            />
          </div>
          <select className="rounded p-1 card" onChange={this.handleChange}>
            <option value="workouts">Your Workouts</option>
            <option value="recommendations">Recommended Workouts</option>
          </select>
          <Link
            to="/workouts/new"
            className="btn text-center"
            title="Create Workout"
          >
            Create Workout
          </Link>
        </div>
        {this.state.selectValue === "workouts" ? (
          <WorkoutList
            currentUser={this.props.currentUser}
            searchValue={this.state.searchValue}
          />
        ) : (
          <RecommendedWorkoutList
            currentUser={this.props.currentUser}
            searchValue={this.state.searchValue}
          />
        )}
      </div>
    );
  }
}

export default Workouts;
