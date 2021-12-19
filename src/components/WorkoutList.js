import React from "react";
import axios from "axios";
import "./WorkoutList.css";

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
      .post(`http://localhost:3000/workout/${workoutId}/like`, { userId: currentUser.userId })
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
      .delete(`http://localhost:3000/workout/${workoutId}/like`, { data: { userId: currentUser.userId } })
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
        <h1>{this.props.title}</h1>
        <div className="gridContainer">
          {this.state.items.map((item) => {
            return (
              <div className="gridItem" key={item[itemIndex]}>
                <p>{item[itemName]}</p>
                <input
                  type="button"
                  value={this.ifLikedWorkout(item) ? "Unlike" : "Like"}
                  onClick={async () => {
                    if (!this.ifLikedWorkout(item)) {
                      this.likeWorkout(item);
                    } else {
                      this.unikeWorkout(item);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default WorkoutList;
