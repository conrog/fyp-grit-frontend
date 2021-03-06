import React from "react";
import { Link } from "react-router-dom";
import WorkoutList from "./WorkoutList";
import RecommendedWorkoutList from "./RecommendedWorkoutList";
import FollowingWorkouts from "./FollowingWorkouts";

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
        <h1 className="mb-2" data-cy="page-heading">
          Workouts
        </h1>
        <div className="flex flex-col md:flex-row gap-1">
          <div className="basis-6/12 flex flex-col md:flex-row gap-1 ">
            <select
              className="flex-auto rounded light-border p-1 card"
              onChange={this.handleChange}
            >
              <option value="workouts">Your Workouts</option>
              <option value="recommendations">Recommended Workouts</option>
              <option value="following">Followed Users Workouts</option>
            </select>
            <Link
              to="/workouts/new"
              className="btn text-center"
              title="Create Workout"
              data-cy="create-workout"
            >
              Create Workout
            </Link>
          </div>
          <div className="flex-1 ">
            <input
              type="text"
              placeholder="Search..."
              className="p-1 h-full card w-full md:w-6/12 light-border float-right"
              onChange={(event) => {
                this.setState({ searchValue: event.target.value });
              }}
              data-cy="workout-search"
            />
          </div>
        </div>
        {this.state.selectValue === "workouts" ? (
          <WorkoutList
            currentUserName={this.props.currentUser.userName}
            searchValue={this.state.searchValue}
          />
        ) : this.state.selectValue === "recommendations" ? (
          <RecommendedWorkoutList
            currentUser={this.props.currentUser}
            searchValue={this.state.searchValue}
          />
        ) : (
          <FollowingWorkouts
            currentUser={this.props.currentUser}
            searchValue={this.state.searchValue}
          />
        )}
      </div>
    );
  }
}

export default Workouts;
