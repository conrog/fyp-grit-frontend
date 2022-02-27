import React from "react";
import api from "../../api/api";

class RecommendedWorkoutList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { recommendedWorkouts: [] };
    this.getRecommendations = this.getRecommendations.bind(this);
  }

  async getRecommendations() {
    try {
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      let res = await api.get(
        `/reccomendations/${this.props.currentUser.userId}`,
        {
          headers: {
            Authorization: "Basic " + token,
          },
        }
      );

      this.setState({ recommendedWorkouts: res.data });
    } catch (error) {
      console.log(error);
    }
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
