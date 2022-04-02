import React from "react";
import { Link } from "react-router-dom";
import { ThumbUpIcon } from "@heroicons/react/outline";
import { ThumbUpIcon as ThumbUpIconSolid } from "@heroicons/react/solid";
import LoadingSpinner from "../Common/LoadingSpinner";
import api from "../../api/api";

class RecommendedWorkoutList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { recommendedWorkouts: [], likedWorkouts: [], loading: false };
    this.getRecommendations = this.getRecommendations.bind(this);
    this.getLikedWorkouts = this.getLikedWorkouts.bind(this);
    this.likeWorkout = this.likeWorkout.bind(this);
    this.unlikeWorkout = this.unlikeWorkout.bind(this);
  }

  async getRecommendations() {
    try {
      this.setState({ loading: true });
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      let res = await api.get(`/reccomendations`, {
        headers: {
          Authorization: "Basic " + token,
        },
      });

      this.setState({ recommendedWorkouts: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  }

  async getLikedWorkouts() {
    try {
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      let res = await api.get(`/workouts/liked`, {
        headers: {
          Authorization: "Basic " + token,
        },
      });

      this.setState({ likedWorkouts: res.data });
    } catch (error) {
      console.log(error);
    }
  }

  async likeWorkout(workout) {
    try {
      const { token } = await JSON.parse(sessionStorage.getItem("token"));
      const workoutId = workout.workout_id;

      await api.post(
        `/workouts/${workoutId}/like`,
        {},
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

      await api.delete(`/workouts/${workoutId}/like`, {
        headers: {
          Authorization: "Basic " + token,
        },
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
    this.getRecommendations();
  }

  render() {
    const filtered = this.state.recommendedWorkouts.filter((workout) =>
      workout.workout_name
        .toLowerCase()
        .includes(
          this.props.searchValue ? this.props.searchValue.toLowerCase() : ""
        )
    );

    return (
      <div>
        {this.state.loading ? (
          <div className="card mt-2">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="pt-2 ">
            {filtered.length === 0 ? (
              <div className="card p-3">
                <p className="text-center">No Workouts Found</p>
              </div>
            ) : (
              filtered.map((workout) => {
                let startTime = workout.start_time;
                return (
                  <div
                    className="rounded shadow-md p-3 mb-2 bg-white flex flex-col"
                    key={workout.workout_id}
                  >
                    <div className="flex gap-2">
                      <Link
                        className="font-semibold text-xl mb-1 flex-auto hover:text-blue-600 cursor-pointer"
                        title={`View ${workout.workout_name}`}
                        to={`/workouts/${workout.workout_id}`}
                        state={{ workout }}
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                      >
                        {workout.workout_name}
                      </Link>
                    </div>
                    <div className="flex font-light">
                      <Link
                        className="flex-auto hover:text-blue-600 cursor-pointer"
                        to={`/users/${workout.user_name}`}
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                      >
                        {workout.user_name}
                      </Link>
                      <p>{startTime === null ? "" : startTime.split(" ")[0]}</p>
                    </div>
                    <div className="font-light">
                      {workout.description.substr(0, 30) + " ..."}
                    </div>
                    <div className="flex">
                      <p className="flex-auto align-text-bottom font-light">
                        Total Volume:{" "}
                        {workout.exercises.length > 0
                          ? workout.exercises.reduce(
                              (totalWorkoutVolume, currentExercise) => {
                                let currentExerciseVolume =
                                  currentExercise.sets.reduce(
                                    (totalExerciseVolume, currentSet) => {
                                      return (totalExerciseVolume +=
                                        currentSet.weight * currentSet.reps);
                                    },
                                    0
                                  );

                                return (totalWorkoutVolume +=
                                  currentExerciseVolume);
                              },
                              0
                            )
                          : "0"}{" "}
                        KG
                      </p>
                      <button
                        title={
                          (this.ifLikedWorkout(workout) ? "Unlike" : "Like") +
                          ` ${workout.workout_name}`
                        }
                        className="hover:text-blue-600 font-semibold p-1 cursor-pointer rounded"
                        onClick={() => {
                          if (!this.ifLikedWorkout(workout)) {
                            this.likeWorkout(workout);
                          } else {
                            this.unlikeWorkout(workout);
                          }
                        }}
                      >
                        {this.ifLikedWorkout(workout) ? (
                          <ThumbUpIconSolid className="h-6 w-6 text-blue-500 hover:text-blue-600" />
                        ) : (
                          <ThumbUpIcon className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      // <div className="pt-2">
      //   {this.state.recommendedWorkouts
      //     .filter((workout) =>
      //       workout.workout_name
      //         .toLowerCase()
      //         .includes(this.props.searchValue.toLowerCase())
      //     )
      //     .map((workout) => {
      //       return (
      //         <div
      //           key={workout.workout_id}
      //           className="rounded overflow-hidden shadow-md p-4 mb-2 bg-white flex"
      //         >
      //           <p>{workout.workout_name}</p>
      //         </div>
      //       );
      //     })}
      // </div>
    );
  }
}

export default RecommendedWorkoutList;
