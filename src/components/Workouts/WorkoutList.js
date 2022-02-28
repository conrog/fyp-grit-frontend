import React from "react";
import api from "../../api/api";
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
      let res = await api.get("/workouts", {
        headers: {
          Authorization: "Basic " + token,
        },
      });

      this.setState({ workouts: res.data });
    } catch (error) {
      console.log(error);
    }
  }

  async getLikedWorkouts() {
    try {
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      let res = await api.get(
        `/workouts/liked/${this.props.currentUser.userId}`,
        {
          headers: {
            Authorization: "Basic " + token,
          },
        }
      );

      this.setState({ likedWorkouts: res.data });
    } catch (error) {
      console.log(error);
    }
  }

  async likeWorkout(workout) {
    try {
      const { token } = await JSON.parse(sessionStorage.getItem("token"));
      const workoutId = workout.workout_id;
      const { currentUser } = this.props;

      await api.post(
        `/workouts/${workoutId}/like`,
        {
          userId: currentUser.userId,
        },
        {
          headers: {
            Authorization: "Basic " + token,
          },
        }
      );
      await this.getLikedWorkouts();
    } catch (error) {
      console.log(error);
    }
  }

  async unlikeWorkout(workout) {
    try {
      const { token } = await JSON.parse(sessionStorage.getItem("token"));
      const workoutId = workout.workout_id;
      const { currentUser } = this.props;

      await api.delete(`/workouts/${workoutId}/like`, {
        headers: {
          Authorization: "Basic " + token,
        },
        data: { userId: currentUser.userId },
      });

      await this.getLikedWorkouts();
    } catch (error) {
      console.log(error);
    }
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
