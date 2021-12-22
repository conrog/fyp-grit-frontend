const ReccomendedWorkoutsList = (props) => {
  const { reccomendedWorkouts, getRecommendations } = props;
  let content = <p></p>;

  if (reccomendedWorkouts.length !== 0) {
    content = reccomendedWorkouts.map((workout) => {
      return (
        <div key={workout.workout_id} className="rounded overflow-hidden shadow-md p-4 mb-2 bg-white flex">
          <p>{workout.workout_name}</p>
        </div>
      );
    });
  }

  return (
    <div>
      <div className="flex">
        <h2>Recommended Workouts:</h2>
        <div className="flex-grow"></div>
        <input
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-2 rounded shadow cursor-pointer mr-1"
          value="Get Reccomendations"
          onClick={getRecommendations}
        ></input>
      </div>

      <div className="grid grid-cols-1 pt-2">{content}</div>
    </div>
  );
};

export default ReccomendedWorkoutsList;
