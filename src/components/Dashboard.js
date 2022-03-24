import React, { PureComponent } from "react";
import {
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import api from "../api/api";
import WorkoutList from "./Workouts/WorkoutList";

const COLORS = [
  "#2085ec",
  "#72b4eb",
  "#0a417a",
  "#8464a0",
  "cea9bc",
  "#323232",
];

class Dashboard extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      workouts: [],
      workoutLookUp: {},
      selectValue: "",
      searchValue: "",
      graphType: "volume",
      firstLoad: false,
      volumeGraphData: [],
      frequencyGraphData: [],
    };

    this.getWorkouts = this.getWorkouts.bind(this);
    this.createWorkoutLookup = this.createWorkoutLookup.bind(this);
    this.updateVolumeGraph = this.updateVolumeGraph.bind(this);
    this.updateFrequencyGraph = this.updateFrequencyGraph.bind(this);
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
      this.createWorkoutLookup();
      this.updateVolumeGraph();
      this.updateFrequencyGraph();
    } catch (error) {
      console.log(error);
    }
  }

  createWorkoutLookup() {
    let lookUp = this.state.workouts.reduce((lookupObject, workout, index) => {
      if (lookupObject.hasOwnProperty(workout.workout_name)) {
        lookupObject[workout.workout_name].push(index);
      } else {
        lookupObject[workout.workout_name] = [index];
      }
      return lookupObject;
    }, {});

    this.setState({ workoutLookUp: lookUp });
  }

  updateVolumeGraph(selectValue = Object.keys(this.state.workoutLookUp)[0]) {
    let data = [];
    let indexes = this.state.workoutLookUp[selectValue];

    if (indexes.length > 0) {
      for (let i = indexes.length - 1; i >= 0; i--) {
        data.push({
          date: this.state.workouts[indexes[i]].start_time.split(" ")[0],
          volume: this.state.workouts[indexes[i]].exercises.reduce(
            (totalWorkoutVolume, exercise) => {
              let setVolumne = exercise.sets.reduce((totalSetVolume, set) => {
                return (totalSetVolume += set.weight * set.reps);
              }, 0);
              return (totalWorkoutVolume += setVolumne);
            },
            0
          ),
        });
      }
    }

    this.setState({ volumeGraphData: data, selectValue });
  }

  updateFrequencyGraph() {
    let data = [];

    for (const workout in this.state.workoutLookUp) {
      data.push({
        name: workout,
        value: this.state.workoutLookUp[workout].length,
      });
    }

    this.setState({ frequencyGraphData: data });
  }

  componentDidMount() {
    this.getWorkouts();
  }

  render() {
    return (
      <div>
        <h1 className="mb-1 font-semibold">Dashboard</h1>
        <h2 className="card rounded-b-none p-2 font-semibold text-lg">
          {this.state.graphType === "volume"
            ? "Volume Per Workout"
            : "Frequency Per Workout"}
        </h2>
        <div className=" w-full h-96 card rounded rounded-t-none rounded-b-none p-2">
          {this.state.graphType === "volume" && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart width={500} height={400}>
                <XAxis dataKey="date" name="Date" />
                <YAxis dataKey="volume" name="Volume" unit="kg" />
                <Scatter
                  data={this.state.volumeGraphData}
                  name={`${this.state.selectValue} Volume`}
                  line
                  strokeDasharray="6"
                  fill="#3482F6"
                  isAnimationActive={false}
                />
                <Tooltip />
                <Legend />
              </ScatterChart>
            </ResponsiveContainer>
          )}
          {this.state.graphType === "frequency" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={500} height={500}>
                <Pie
                  dataKey="value"
                  data={this.state.frequencyGraphData}
                  innerRadius={40}
                  outerRadius={125}
                  fill="#82ca9d"
                >
                  {this.state.frequencyGraphData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="card p-2 rounded-t-none flex flex-col md:flex-row gap-1">
          <div className="flex flex-1">
            <p className="p-1 font-semibold">Graph Type:</p>
            <div className="flex-1">
              <select
                className="p-1 light-border rounded w-full"
                onChange={(event) => {
                  this.setState({ graphType: event.target.value });
                }}
              >
                <option value="volume">Volume</option>
                <option value="frequency">Frequency</option>
              </select>
            </div>
          </div>
          {this.state.graphType === "volume" && (
            <div className="flex flex-1">
              <p className="p-1 font-semibold">Graph Data:</p>
              <div className="flex-1">
                <select
                  className="p-1 light-border rounded w-full"
                  onChange={(event) => {
                    this.updateVolumeGraph(event.target.value);
                  }}
                >
                  {Object.keys(this.state.workoutLookUp).map(
                    (workout, index) => {
                      return (
                        <option key={index} value={workout}>
                          {workout}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row mt-2">
          <h2 className="font-semibold text-lg flex-auto p-1 ">
            Recent Workouts
          </h2>
          <input
            className="card p-1  w-full light-border  md:w-4/12"
            type="text"
            placeholder="Search..."
            onChange={(event) => {
              this.setState({ searchValue: event.target.value });
            }}
          />
        </div>
        <WorkoutList searchValue={this.state.searchValue} />
      </div>
    );
  }
}

export default Dashboard;
