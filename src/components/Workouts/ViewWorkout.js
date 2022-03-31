import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CommentsModal from "../Modals/CommentsModal";
import api from "../../api/api";
import SmallLoadingSpinner from "../Common/SmallLoadingSpinner";
import { toast } from "react-toastify";

function ViewWorkout({ currentUserName, copyWorkoutTemplate }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { workout } = location.state;

  useEffect(() => {
    setLoading(true);
    const { token } = JSON.parse(sessionStorage.getItem("token"));
    api
      .get(`/comments/${workout.workout_id}`, {
        headers: {
          Authorization: "Basic " + token,
        },
      })
      .then((res) => {
        setComments([...res.data]);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [workout.workout_id]);

  return (
    <div>
      <div className="flex flex-col border text-xl p-2 card">
        <label className="flex-auto flex">
          <p className="p-1 font-semibold">Name: </p>
          <p className="flex-auto p-1 font-light">{workout.workout_name}</p>
        </label>
        <label className="flex-auto flex">
          <p className="p-1 font-semibold">Date: </p>
          <p className="flex-auto p-1 font-light">
            {workout.start_time || "N/A"}
          </p>
        </label>
        <label className="flex flex-col">
          <p className="p-1 font-semibold">Description:</p>
          <p className="p-1 font-light">{workout.description}</p>
        </label>
      </div>

      <div className="mt-2 p-2 card rounded-b-none">
        <div className="flex gap-2">
          <p className=" flex-auto text-xl font-semibold">Exercises</p>
          <button
            className="btn flex"
            disabled={loading}
            onClick={() => {
              setShowComments(true);
            }}
          >
            {loading ? <SmallLoadingSpinner /> : comments.length} Comments
          </button>
          <button
            className="btn"
            onClick={() => {
              copyWorkoutTemplate(workout.exercises);
              toast.success(`${workout.workout_name} has been copied!`);
            }}
          >
            Copy Exercises
          </button>
        </div>
      </div>
      <div>
        {workout.exercises.map((exercise, index) => {
          return (
            <div
              key={exercise + index}
              className={
                index === 0 ? "card rounded-t-none mb-2 p-2 " : "card mb-2 p-2"
              }
            >
              <div className="flex">
                <p className="capitalize text-xl font-semibold flex-auto">
                  {exercise.name}
                </p>
              </div>
              <div className="flex gap-1">
                <p className="flex-1">Set</p>
                <p className="flex-1">Weight (KG)</p>
                <p className="flex-1">Reps</p>
              </div>
              {exercise.sets.map((set, index) => {
                return (
                  <div className="flex gap-1 mb-1" key={index}>
                    <div className="flex-1">
                      <p className="w-full border px-1">{set.number}</p>
                    </div>
                    <div className="flex-1">
                      <p className="w-full border px-1">{set.weight}</p>
                    </div>
                    <div className="flex-1">
                      <p className="w-full border px-1">{set.reps}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <CommentsModal
        showModal={showComments}
        cancelHandler={() => setShowComments(false)}
        currentUserName={currentUserName}
        workoutId={workout.workout_id}
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
}

export default ViewWorkout;
