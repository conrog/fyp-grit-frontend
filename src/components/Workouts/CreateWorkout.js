import React, { useState, useEffect } from "react";
import api from "../../api/api";
import AddExercise from "./AddExercise";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import { arrayAfterSplice, findIndexOfObjectInarray } from "../../utils";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const modalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(243, 244, 246, 0.75)",
  },
  content: {
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    position: "absolute",
    height: "80%",
    maxWidth: "80%",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    margin: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "0",
  },
};

function CreateWorkout({ workoutTemplate }) {
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [exercises, setExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [startTime] = useState(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  let navigate = useNavigate();

  useEffect(() => {
    const { token } = JSON.parse(sessionStorage.getItem("token"));
    api
      .get("/exercises", {
        headers: {
          Authorization: "Basic " + token,
        },
      })
      .then((res) => {
        setExercises([...res.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deleteExercise = (workoutExercises, searchKey) => {
    let newArray = [...workoutExercises];
    let index = findIndexOfObjectInarray(newArray, "name", searchKey);

    setWorkoutExercises([...arrayAfterSplice(newArray, index)]);
  };

  const addSet = (workoutExercises, searchKey) => {
    let newArray = [...workoutExercises];
    let index = findIndexOfObjectInarray(workoutExercises, "name", searchKey);

    let newObject = { ...newArray[index] };
    let setNumber =
      newObject.sets.length === 0
        ? 1
        : newObject.sets[newObject.sets.length - 1].number + 1;
    newObject.sets.push({
      number: setNumber,
      weight: 0,
      reps: 0,
    });
    newArray.splice(index, 1, newObject);
    setWorkoutExercises([...newArray]);
  };

  const deleteSet = (workoutExercises, searchKey, setNumber) => {
    let newArray = [...workoutExercises];
    let exerciseIndex = findIndexOfObjectInarray(newArray, "name", searchKey);

    let newObject = { ...newArray[exerciseIndex] };
    let sets = [...newObject.sets];
    let setIndex = findIndexOfObjectInarray(sets, "number", setNumber);
    sets.splice(setIndex, 1);
    newObject.sets = [...sets];
    newArray.splice(exerciseIndex, 1, newObject);
    setWorkoutExercises([...newArray]);
  };

  const updateSetField = (
    workoutExercises,
    exerciseName,
    setNumber,
    newValue,
    key
  ) => {
    let newArray = [...workoutExercises];
    let exerciseIndex = findIndexOfObjectInarray(
      newArray,
      "name",
      exerciseName
    );
    let newObject = { ...newArray[exerciseIndex] };
    let setIndex = findIndexOfObjectInarray(
      newObject.sets,
      "number",
      setNumber
    );
    newObject.sets[setIndex][key] = Number(newValue);
    newArray.splice(exerciseIndex, 1, newObject);
    setWorkoutExercises([...newArray]);
  };

  return (
    <div>
      <div className="flex flex-col border text-xl p-2 card">
        <label className="flex-auto flex">
          <p className="py-1">Name: </p>
          <input
            className="flex-auto light-border ml-2 p-1"
            type="text"
            placeholder="New Workout"
            onChange={(event) => {
              setWorkoutName(event.target.value);
            }}
            data-cy="name-input"
          />
        </label>
        <label className="flex flex-col mt-2">
          <p>Description:</p>
          <textarea
            placeholder="Workout Description/Notes..."
            className="mt-2 p-1 light-border"
            onChange={(event) => {
              setWorkoutDescription(event.target.value);
            }}
            data-cy="description-input"
          />
        </label>
        <button
          className="btn mt-2"
          onClick={async () => {
            let body = {
              name: workoutName,
              description: workoutDescription,
              exercises: workoutExercises,
              startTime: startTime,
            };

            try {
              const { token } = JSON.parse(sessionStorage.getItem("token"));
              await api.post("/workouts/new", body, {
                headers: {
                  Authorization: "Basic " + token,
                },
              });
              toast.success(`${workoutName} has been created.`, {
                position: "bottom-right",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              navigate("/workouts");
            } catch (error) {
              console.log(error);
            }
          }}
          data-cy="save-button"
        >
          Save
        </button>
      </div>

      <div className="mt-2 p-2 card rounded-b-none">
        <div className="flex gap-2">
          <p className=" flex-auto text-xl">Exercises</p>
          {workoutTemplate.length !== 0 && (
            <button
              className="btn"
              onClick={() => {
                setWorkoutExercises([...workoutTemplate]);
              }}
            >
              Paste Exercises
            </button>
          )}

          <button
            className="btn"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Add Exercise
          </button>
        </div>
      </div>
      <div>
        {workoutExercises.map((exercise, index) => {
          return (
            <div
              key={exercise + index}
              className={
                index === 0 ? "card rounded-t-none mb-2 p-2 " : "card mb-2 p-2"
              }
            >
              <div className="flex">
                <p className="capitalize text-xl flex-auto">{exercise.name}</p>
                <button
                  title={`Add set of ${exercise.name}`}
                  onClick={() => {
                    addSet(workoutExercises, exercise.name);
                  }}
                >
                  <PlusIcon className="hover:text-blue-500 h-6 w-6" />
                </button>
                <button
                  title={`Delete ${exercise.name}`}
                  onClick={() => {
                    deleteExercise(workoutExercises, exercise.name);
                  }}
                >
                  <TrashIcon className="hover:text-blue-500 h-6 w-6" />
                </button>
              </div>
              <div className="flex gap-1">
                <p className="flex-1">Set</p>
                <p className="flex-1">Weight (KG)</p>
                <p className="flex-1">Reps</p>
                <span className="h6 w-6" />
              </div>
              {exercise.sets.map((set, index) => {
                return (
                  <div className="flex gap-1 mb-1" key={index}>
                    <div className="flex-1">
                      <input
                        className="w-full light-border px-1 py-0"
                        type="number"
                        min="1"
                        placeholder={set.number}
                        onBlur={(event) => {
                          updateSetField(
                            workoutExercises,
                            exercise.name,
                            set.number,
                            event.target.value,
                            "number"
                          );
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        className="w-full light-border px-1 py-0"
                        type="number"
                        placeholder={set.weight}
                        onBlur={(event) => {
                          updateSetField(
                            workoutExercises,
                            exercise.name,
                            set.number,
                            event.target.value,
                            "weight"
                          );
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        className="w-full light-border px-1 py-0"
                        type="number"
                        min="0"
                        placeholder={set.reps}
                        onBlur={(event) => {
                          updateSetField(
                            workoutExercises,
                            exercise.name,
                            set.number,
                            event.target.value,
                            "reps"
                          );
                        }}
                      />
                    </div>
                    <button
                      title={`Delete set ${set.number}`}
                      onClick={() => {
                        deleteSet(workoutExercises, exercise.name, set.number);
                      }}
                    >
                      <TrashIcon className="hover:text-blue-500 h-6 w-6" />
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <ReactModal isOpen={showModal} ariaHideApp={false} style={modalStyle}>
        <div>
          <AddExercise
            setShowModal={setShowModal}
            exercises={exercises}
            workoutExercises={workoutExercises}
            setWorkoutExercises={setWorkoutExercises}
          />
        </div>
      </ReactModal>
    </div>
  );
}

export default CreateWorkout;
