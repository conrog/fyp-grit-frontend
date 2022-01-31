import React from "react";
import axios from "axios";

class RecommendedWorkoutList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { recommendedWorkouts: [] };
    this.getRecommendations = this.getRecommendations.bind(this);
  }

  async getRecommendations() {
    await axios
      .get(
        `http://localhost:3000/reccomendations/${this.props.currentUser.userId}`
      )
      .then((res) => {
        const { data } = res;
        this.setState({ recommendedWorkouts: data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.getRecommendations();
  }

  render() {
    return (
      <div>
        {this.state.recommendedWorkouts.map((workout) => {
          return (
            <div
              key={workout.workout_id}
              className="rounded overflow-hidden shadow-md p-4 mb-2 bg-white flex"
            >
              <p>{workout.workout_name}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default RecommendedWorkoutList;
