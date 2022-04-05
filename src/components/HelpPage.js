import {
  ThumbUpIcon,
  PencilAltIcon,
  TrashIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/outline";

function HelpPage({ currentUser }) {
  return (
    <div className="mb-4">
      <h1 data-cy="page-heading">Help</h1>
      <div className="card mt-2 p-3 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2>What is GRIT ?</h2>
          <p>
            GRIT is a responsive web application which enables users to log
            their weight training data. It was created in order to keep users
            engaged with their training long enough for them to begin to see the
            physical and mental health benefits it provides.
          </p>
        </div>
        <div className="flex flex-col gap-1 border-t-2">
          <h2>Features</h2>
          <ul className="list-inside list-disc pl-4 font-semibold italic">
            <li>Workout Logger</li>
            <li>Visualisation of Training Data</li>
            <li>Social Network</li>
            <li>Workout Recommender System</li>
          </ul>
          <p>
            These features can be accessed through the various pages which are
            navigable using the navigation bar at the top of the page.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-t-2">
          <h2>Pages</h2>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">Dashboard</h3>
            <p>
              On this page your training data is presented in the form of two
              graphs:
            </p>
            <ul className="list-inside list-decimal pl-4 ">
              <li>
                <span className="font-semibold italic">Workout Volume:</span>{" "}
                the amount of weight you lift in each workout session.
              </li>
              <li>
                <span className="font-semibold italic">
                  Workout Proportion:
                </span>{" "}
                the proportion of each workout which has been complete.
              </li>
            </ul>
            <p>You can also view your recent workouts on this page.</p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">Workouts</h3>
            <p>On this page you can view:</p>
            <ul className="list-inside list-decimal pl-4 font-semibold italic">
              <li> Your Workouts</li>
              <li>Recommended Workouts</li>
              <li>Following Users Workouts</li>
            </ul>
            <p>
              Each option will return a list of workouts where applicable (You
              have created workouts, followed users, etc...)
            </p>
            <p>
              The returned lists contain a number of icons. Each icon represents
              the following functionality:
            </p>
            <ul className="flex flex-col gap-1 pl-3">
              <li>
                <p className="flex gap-1">
                  <PencilAltIcon className="w-6 h-6 hover:text-blue-600 cursor-pointer" />{" "}
                  Edit Workout
                </p>
              </li>
              <li>
                <p className="flex gap-1">
                  <TrashIcon className="w-6 h-6 hover:text-blue-600 cursor-pointer" />{" "}
                  Delete Workout
                </p>
              </li>
              <li>
                <p className="flex gap-1">
                  <ThumbUpIcon className="w-6 h-6 hover:text-blue-600 cursor-pointer" />{" "}
                  Like Workout
                </p>
              </li>
            </ul>
            <p>
              You can view a workout from the list by clicking the{" "}
              <span className="font-semibold text-xl hover:text-blue-600 cursor-pointer">
                Workout Name
              </span>
              .
            </p>
            <p>
              When viewing a workout, you can copy the exercises of the workout
              by clicking{" "}
              <span>
                <button className="btn">Copy Exercises</button>
              </span>
              .
            </p>

            <p>
              You can also view a user's profile from the list by clicking{" "}
              <span className="font-light hover:text-blue-600 cursor-pointer">
                Username
              </span>
              .
            </p>
            <p>
              You have the option to create your own new workout by clicking the
              button{" "}
              <span>
                <button className="btn">Create Workout</button>
              </span>{" "}
              found on the <span className="italic">Workouts</span> page.
            </p>
            <p>
              If you have copied exercises they can be inserted into to the new
              workout that you are creating by clicking{" "}
              <span>
                <button className="btn">Paste Exercises</button>
              </span>
              .
            </p>
            <p>
              You can add exercises to your new workout by clicking{" "}
              <span>
                <button className="btn">Add Exercises</button>
              </span>
              . This will then bring you to a pop up which will allow you to
              select from a list of exercises.
            </p>
            <p>
              You can select the exercises you wish to add to your workout by
              clicking <input type="checkbox" />
              beside the exercise you wish to add.
            </p>
            <p>
              If you are unsure of what the exact exercises involves, you can
              click{" "}
              <QuestionMarkCircleIcon className="h-6 w-6 inline hover:text-blue-600 cursor-pointer" />{" "}
              beside the exercise to view an example of the exercise being
              carried out.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">Social</h3>
            <p>This page allows you to search for users.</p>
            <p>
              You can view a user's profile by clicking{" "}
              <span className="font-semibold text-xl hover:text-blue-600 cursor-pointer">
                Username
              </span>
              .
            </p>
            <p>
              You can follow or unfollow a user by clicking{" "}
              <span>
                <button className="btn">Follow</button>
              </span>
              .
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">Profile</h3>
            <div className="flex gap-1">
              <div className="flex">
                <p className="place-self-center">
                  You can view your profile by clicking <i>Profile</i> in the
                  dropdown provided by clicking{" "}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl cursor-pointer  bg-blue-500 flex hover:bg-blue-700">
                <div className="place-self-center flex-1 font-semibold text-white text-center">
                  {currentUser[0]}
                </div>
              </div>
            </div>
            <p>
              When viewing your profile, you can provide additional information.
              At the moment the only additional information that the recommender
              system requires is your{" "}
              <span className="italic font-semibold">gender</span>. This will
              help the system to make more accurate recommendations.
            </p>
            <p>
              If you do not wish to allow users to see any of your data
              (personal information, or training data) you can change your
              profile type from{" "}
              <span className="italic font-semibold">public</span> public to{" "}
              <span className="italic font-semibold">private</span>.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t-2 mb-2">
          <h2>Workout Recommender System</h2>
          <p>
            The system generates recommendations based of the workouts that you
            like. This enables to system to calculate the similarity between
            other users of the system and yourself. Your recommendations are
            then based of workouts that the most similar users to you liked
            which you have yet to like.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
