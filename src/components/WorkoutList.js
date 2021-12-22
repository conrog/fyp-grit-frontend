import React from "react";
import axios from "axios";
import { ThumbUpIcon } from "@heroicons/react/outline";
import { ThumbUpIcon as ThumbUpIconSolid } from "@heroicons/react/solid";
// import "./WorkoutList.css";

class WorkoutList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { items: [] };
    this.getItems = this.getItems.bind(this);
  }

  getItems() {
    axios.get(this.props.itemsEndpoint).then((res) => {
      this.setState({ items: res.data });
    });
  }

  componentDidMount() {
    this.getItems();
  }

  ifLikedWorkout({ workout_id }) {
    const { likedItems } = this.props;
    let found = false;
    for (let item of likedItems) {
      if (item.workout_id === workout_id) {
        found = true;
        break;
      }
    }
    return found;
  }

  async likeWorkout(workout) {
    const workoutId = workout.workout_id;
    const { currentUser } = this.props;
    await axios
      .post(`http://localhost:3000/workouts/${workoutId}/like`, { userId: currentUser.userId })
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    await this.props.getLikedWorkouts();
  }

  async unikeWorkout(workout) {
    const workoutId = workout.workout_id;
    const { currentUser } = this.props;
    await axios
      .delete(`http://localhost:3000/workouts/${workoutId}/like`, { data: { userId: currentUser.userId } })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    await this.props.getLikedWorkouts();
  }

  render() {
    let { itemName, itemIndex } = this.props;
    return (
      <div>
        <h2>Workouts:</h2>
        <div className="grid grid-cols-1 pt-2">
          {this.state.items.map((item) => {
            return (
              <div className="rounded overflow-hidden shadow-md p-4 mb-2 bg-white flex" key={item[itemIndex]}>
                <p className="mb-2">{item[itemName]}</p>
                <div className="flex-grow"></div>
                <button
                  title={this.ifLikedWorkout(item) ? "Unlike" : "Like"}
                  className="hover:bg-blue-200 font-semibold px-2 rounded shadow cursor-pointer mr-1"
                  onClick={() => {
                    if (!this.ifLikedWorkout(item)) {
                      this.likeWorkout(item);
                    } else {
                      this.unikeWorkout(item);
                    }
                  }}
                >
                  {this.ifLikedWorkout(item) ? (
                    <ThumbUpIconSolid className="h-5 w-5 text-blue-500" />
                  ) : (
                    <ThumbUpIcon className="h-5 w-5 text-blue-500" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default WorkoutList;
