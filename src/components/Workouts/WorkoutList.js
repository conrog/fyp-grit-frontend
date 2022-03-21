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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class WorkoutList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      workouts: [],
      likedWorkouts: [],
      showModal: false,
      workoutId: "",
      workoutName: "",
    };

    this.getWorkouts = this.getWorkouts.bind(this);
    this.getLikedWorkouts = this.getLikedWorkouts.bind(this);
    this.likeWorkout = this.likeWorkout.bind(this);
    this.unlikeWorkout = this.unlikeWorkout.bind(this);
    this.deleteWorkout = this.deleteWorkout.bind(this);
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
    return (
      <div className="pt-2 ">
        {this.state.workouts
          .filter((workout) =>
            workout.workout_name
              .toLowerCase()
              .includes(this.props.searchValue.toLowerCase())
          )
          .map((workout) => {
            let startTime = workout.start_time;
            return (
              <div
                className="rounded shadow-md p-3 mb-2 bg-white flex flex-col "
                key={workout.workout_id}
              >
                <div className="flex gap-2">
                  <Link
                    className="font-semibold text-xl flex-auto hover:text-blue-600 cursor-pointer"
                    to={`/workouts/${workout.workout_id}`}
                    state={{ workout }}
                  >
                    {workout.workout_name}
                  </Link>
                  <button className="w-6 h-6 hover:text-blue-600">
                    <PencilAltIcon />
                  </button>
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
                  >
                    <TrashIcon />
                  </button>
                </div>
                <div className="flex font-light">
                  <p className="flex-auto">{workout.user_name}</p>
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
                    title={this.ifLikedWorkout(workout) ? "Unlike" : "Like"}
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
          })}
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
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastStyle={{ backgroundColor: "#228B22", color: "white" }}
        />
      </div>
    );
  }
}

export default WorkoutList;
