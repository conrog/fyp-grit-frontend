import "./WorkoutList.css";

const ReccomendedWorkoutsList = (props) => {
  const { reccomendedWorkouts } = props;
  let content = <p></p>;

  if (reccomendedWorkouts.length !== 0) {
    content = reccomendedWorkouts.map((workout) => {
      return (
        <div key={workout.workout_id} className="gridItem">
          <p>{workout.workout_name}</p>
        </div>
      );
    });
  }

  return (
    <div>
      <h1>Recommended Workouts:</h1>
      <div className="gridContainer">
        {content}
        {/* {reccomendedWorkouts.map((workout) => {
          return (
            <div key={workout.workout_id} className="gridItem">
              <p>{workout.workout_name}</p>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default ReccomendedWorkoutsList;
