import React from "react";
import api from "../../api/api";
import {
  ThumbUpIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { ThumbUpIcon as ThumbUpIconSolid } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import DeleteModal from "../Modals/DeleteModals";
import { toast } from "react-toastify";
import LoadingSpinner from "../Common/LoadingSpinner";

class WorkoutList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      workouts: [],
      likedWorkouts: [],
      showModal: false,
      workoutId: "",
      workoutName: "",
      loading: true,
    };

    this.getWorkouts = this.getWorkouts.bind(this);
    this.getLikedWorkouts = this.getLikedWorkouts.bind(this);
    this.likeWorkout = this.likeWorkout.bind(this);
    this.unlikeWorkout = this.unlikeWorkout.bind(this);
    this.deleteWorkout = this.deleteWorkout.bind(this);
  }

  async getWorkouts() {
    try {
      this.setState({ loading: true });
      let url = this.props.username
        ? `/workouts?username=${this.props.username}`
        : "/workouts";
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      let res = await api.get(url, {
        headers: {
          Authorization: "Basic " + token,
        },
      });

      this.setState({ workouts: res.data });
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

  async deleteWorkout(workoutId) {
    try {
      const { token } = await JSON.parse(sessionStorage.getItem("token"));

      await api.delete(`/workouts/${workoutId}`, {
        headers: {
          Authorization: "Basic " + token,
        },
      });

      await this.getWorkouts();
      toast.success(`${this.state.workoutName} has been deleted.`, {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      this.setState({ showModal: false });
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
    const filtered = this.state.workouts.filter((workout) =>
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
                <p className="text-center" data-cy="no-workouts-message">
                  No Workouts Found
                </p>
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
                        data-cy="workout-name"
                      >
                        {workout.workout_name}
                      </Link>
                      {this.props.currentUserName === workout.user_name ? (
                        <div className="flex">
                          <Link
                            className="w-6 h-6 hover:text-blue-600"
                            title={`Edit ${workout.workout_name}`}
                            to={`/workouts/${workout.workout_id}/edit`}
                            state={{ workout }}
                            onClick={() => {
                              window.scrollTo(0, 0);
                            }}
                          >
                            <PencilAltIcon />
                          </Link>
                          <button
                            className="w-6 h-6 hover:text-blue-600"
                            title={`Detele ${workout.workout_name}`}
                            onClick={() => {
                              this.setState({
                                showModal: true,
                                workoutId: workout.workout_id,
                                workoutName: workout.workout_name,
                              });
                            }}
                            data-cy="delete-workout"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex font-light">
                      <Link
                        className="flex-auto hover:text-blue-600 cursor-pointer"
                        to={`/users/${workout.user_name}`}
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                        data-cy="workout-username"
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
                        data-cy="like-button"
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

        <DeleteModal
          title="Delete Workout"
          className="mx-2"
          showModal={this.state.showModal}
          itemName={this.state.workoutName}
          itemId={this.state.workoutId}
          deleteHandler={this.deleteWorkout}
          cancelHandler={() => {
            this.setState({ showModal: false });
          }}
        />
      </div>
    );
  }
}

export default WorkoutList;
