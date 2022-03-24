import React, { useState } from "react";
import ReactModal from "react-modal";
import { capitalize, arrayAfterPush, arrayAfterPop } from "../../utils";
import { XIcon, QuestionMarkCircleIcon } from "@heroicons/react/outline";

const gifModalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(243, 244, 246, 0.75)",
  },
  content: {
    position: "absolute",
    height: "fit-content",
    width: "fit-content",
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

function AddExercise({
  setShowModal,
  exercises,
  workoutExercises,
  setWorkoutExercises,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [targetMuscleValue, setTargetMuscleValue] = useState("");
  const [equipmentValue, setEquipmentValue] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [gifModalTitle, setGifModalTitle] = useState("false");
  const [showGifModal, setShowGifModal] = useState(false);
  const [modalGifSource, setModalGifSource] = useState("");

  const equipment = [
    "assisted",
    "band",
    "barbell",
    "body weight",
    "bosu ball",
    "cable",
    "dumbbell",
    "elliptical machine",
    "ez barbell",
    "hammer",
    "kettlebell",
    "leverage machine",
    "medicine ball",
    "olympic barbell",
    "resistance band",
    "roller",
    "rope",
    "skierg machine",
    "sled machine",
    "smith machine",
    "stability ball",
    "stationary bike",
    "stepmill machine",
    "tire",
    "trap bar",
    "upper body ergometer",
    "weighted",
    "wheel roller",
  ];

  const targetMuscles = [
    "abductors",
    "abs",
    "adductors",
    "biceps",
    "calves",
    "cardiovascular system",
    "delts",
    "forearms",
    "glutes",
    "hamstrings",
    "lats",
    "levator scapulae",
    "pectorals",
    "quads",
    "serratus anterior",
    "spine",
    "traps",
    "triceps",
    "upper back",
  ];

  return (
    <div>
      <div className="sticky top-0 bg-white p-4 pb-0">
        <div className="flex">
          <h3 className="text-xl font-semibold  flex-auto">Add Exercise</h3>

          <div className="flex-none">
            <button
              onClick={() => {
                setShowModal(false);
              }}
            >
              <XIcon className="hover:text-blue-500 h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap mt-2">
          <input
            className="light-border flex-auto"
            type="text"
            placeholder="Exercise Name..."
            onChange={(event) => {
              setSearchValue(event.target.value);
            }}
          ></input>
        </div>
        <div className="flex flex-wrap mt-2">
          <select
            className="light-border flex-auto sm:mr-1 mr-0 "
            onChange={(event) => {
              setEquipmentValue(event.target.value);
            }}
          >
            <option value="">Any Equipment</option>
            {equipment.map((equipment) => {
              return (
                <option
                  className="capitalize"
                  key={equipment}
                  value={equipment}
                >
                  {capitalize(equipment)}
                </option>
              );
            })}
          </select>
          <select
            className="light-border flex-auto sm:ml-1 ml-0 sm:mt-0 mt-2"
            onChange={(event) => {
              setTargetMuscleValue(event.target.value);
            }}
          >
            <option value="">Any Muscle</option>
            {targetMuscles.map((muscle) => {
              return (
                <option className="capitalize" key={muscle} value={muscle}>
                  {capitalize(muscle)}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex mt-2">
          <h3 className="flex-auto text-xl font-semibold">List of Exercises</h3>
          <button
            className="btn"
            onClick={() => {
              setWorkoutExercises([
                ...workoutExercises,
                ...selectedExercises.map((exercise) => {
                  return {
                    name: exercise,
                    sets: [
                      {
                        number: 1,
                        weight: 0,
                        reps: 0,
                      },
                    ],
                  };
                }),
              ]);
              setShowModal(false);
            }}
          >
            Add Exercise
          </button>
        </div>
      </div>
      <div className="p-4">
        {exercises
          .filter((exercise) => {
            return exercise.name.includes(searchValue.toLowerCase()) && //Filter using search value
              equipmentValue === "" &&
              targetMuscleValue === ""
              ? true
              : exercise.name.includes(searchValue.toLowerCase()) && //Filter using search value and equipment
                equipmentValue === exercise.equipment &&
                targetMuscleValue === ""
              ? true
              : exercise.name.includes(searchValue.toLowerCase()) && //Filter using search value and target
                equipmentValue === "" &&
                targetMuscleValue === exercise.target
              ? true
              : exercise.name.includes(searchValue.toLowerCase()) && //Filter using all inputs
                equipmentValue === exercise.equipment &&
                targetMuscleValue === exercise.target
              ? true
              : false;
          })
          .map((exercise) => {
            return (
              <div key={exercise.id} className="flex border mb-1 p-1">
                <div className="flex-auto">
                  <div className="capitalize font-semibold">
                    {exercise.name}
                  </div>
                  <div className="capitalize">{exercise.target}</div>
                  <div className="capitalize">{exercise.equipment}</div>
                </div>
                <button
                  title={`Show Example of ${exercise.name}`}
                  className="self-center w-6 h-6 m-2"
                  onClick={(e) => {
                    setModalGifSource(exercise.gifUrl);
                    setGifModalTitle(exercise.name);
                    setShowGifModal(true);
                  }}
                >
                  <QuestionMarkCircleIcon className="hover:text-blue-500 font-thin" />
                </button>
                <div className="self-center flex">
                  <input
                    type="checkbox"
                    className="checked:bg-blue-500 hover:bg-blue-500  w-5 h-5"
                    value={exercise.name}
                    onClick={(e) => {
                      if (e.target.checked) {
                        setSelectedExercises(
                          arrayAfterPush(selectedExercises, e.target.value)
                        );
                      } else {
                        setSelectedExercises(arrayAfterPop(selectedExercises));
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
      <ReactModal
        isOpen={showGifModal}
        ariaHideApp={false}
        style={gifModalStyle}
      >
        <div>
          <div className="flex p-2">
            <p className="capitalize font-bold flex-auto">
              {gifModalTitle} Example:
            </p>
            <button
              onClick={() => {
                setShowGifModal(false);
              }}
            >
              <XIcon className="hover:text-blue-500 h-5 w-5" />
            </button>
          </div>
          <img
            src={modalGifSource}
            alt="gif"
            onClick={() => {
              setShowGifModal(false);
            }}
          />
        </div>
      </ReactModal>
    </div>
  );
}

export default AddExercise;
