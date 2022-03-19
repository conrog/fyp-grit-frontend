import React from "react";
import { Link } from "react-router-dom";
import WorkoutList from "./WorkoutList";
import RecommendedWorkoutList from "./RecommendedWorkoutList";

class Workouts extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectValue: "workouts" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ selectValue: event.target.value });
  }

  render() {
    return (
      <div>
        <div className="flex flex-wrap mb-2">
          <h1>Workouts</h1>
          <div className="grow"></div>
          <div>
            <span className="p-1">Current Selection: </span>
            <select className="rounded border-2" onChange={this.handleChange}>
              <option value="workouts">Workouts</option>
              <option value="recommendations">Recommended Workouts</option>
            </select>
          </div>
        </div>
        <div>
          <Link to="/workouts/new" className="btn">
            Create Workout
          </Link>
        </div>
        {this.state.selectValue === "workouts" ? (
          <WorkoutList currentUser={this.props.currentUser} />
        ) : (
          <RecommendedWorkoutList currentUser={this.props.currentUser} />
        )}
      </div>
    );
  }
}

export default Workouts;
