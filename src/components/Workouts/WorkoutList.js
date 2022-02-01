import React from "react";
import axios from "axios";
import { ThumbUpIcon } from "@heroicons/react/outline";
import { ThumbUpIcon as ThumbUpIconSolid } from "@heroicons/react/solid";

class WorkoutList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { workouts: [], likedWorkouts: [] };

    this.getWorkouts = this.getWorkouts.bind(this);
    this.getLikedWorkouts = this.getLikedWorkouts.bind(this);
    this.likeWorkout = this.likeWorkout.bind(this);
    this.unlikeWorkout = this.unlikeWorkout.bind(this);
  }

  async getWorkouts() {
    try {
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      console.log(token);
      await axios
        .get("http://localhost:3000/workouts", {
          headers: {
            Authorization: "Basic " + token,
          },
        })
        .then((res) => {
          this.setState({ workouts: res.data });
        });
    } catch (error) {
      console.log(error);
    }
  }

  async getLikedWorkouts() {
    const { token } = JSON.parse(sessionStorage.getItem("token"));
    await axios
      .get(
        `http://localhost:3000/workouts/liked/${this.props.currentUser.userId}`,
        {
          headers: {
            Authorization: "Basic " + token,
          },
        }
      )
      .then((res) => {
        this.setState({ likedWorkouts: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async likeWorkout(workout) {
    const workoutId = workout.workout_id;
    const { currentUser } = this.props;
    await axios
      .post(`http://localhost:3000/workouts/${workoutId}/like`, {
        userId: currentUser.userId,
      })
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    await this.getLikedWorkouts();
  }

  async unlikeWorkout(workout) {
    const workoutId = workout.workout_id;
    const { currentUser } = this.props;
    await axios
      .delete(`http://localhost:3000/workouts/${workoutId}/like`, {
        data: { userId: currentUser.userId },
      })
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    await this.getLikedWorkouts();
  }

  ifLikedWorkout({ workout_id }) {
    const { likedWorkouts } = this.state;
    let found = false;
    for (let workout of likedWorkouts) {
      if (workout.workout_id === workout_id) {
        found = true;
        break;
      }
    }
    return found;
  }

  componentDidMount() {
    this.getWorkouts();
    this.getLikedWorkouts();
  }

  render() {
    return (
      <div className="grid grid-cols-1 pt-2 ">
        {this.state.workouts.map((workout) => {
          return (
            <div
              className="rounded overflow-hidden shadow-md p-4 mb-2 bg-white flex"
              key={workout.workout_id}
            >
              <p className="mb-2">{workout.workout_name}</p>
              <div className="flex-grow"></div>
              <button
                title={this.ifLikedWorkout(workout) ? "Unlike" : "Like"}
                className="hover:bg-blue-200 font-semibold px-2 rounded shadow cursor-pointer mr-1"
                onClick={() => {
                  if (!this.ifLikedWorkout(workout)) {
                    this.likeWorkout(workout);
                  } else {
                    this.unlikeWorkout(workout);
                  }
                }}
              >
                {this.ifLikedWorkout(workout) ? (
                  <ThumbUpIconSolid className="h-5 w-5 text-blue-500" />
                ) : (
                  <ThumbUpIcon className="h-5 w-5 text-blue-500" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}

export default WorkoutList;
