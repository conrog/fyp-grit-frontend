import React, { useState } from "react";
import { Link } from "react-router-dom";

function UserList({ users, searchValue }) {
  const [searchResult] = useState(searchValue);

  return (
    <div className="mt-1">
      {users.length > 0 ? (
        users.map((user, index) => {
          return (
            <div key={index} className="flex card p-3 mb-2">
              <div className="w-8/12 md:w-10/12">
                <Link
                  className="text-xl font-semibold cursor-pointer hover:text-blue-600"
                  to={`/users/${user.user_name}`}
                >
                  {user.user_name}
                </Link>
                <p className="font-light">{user.name}</p>
                <p className="font-light">
                  {(user.biography
                    ? user.biography.substr(0, 30)
                    : "No biography") + "..."}
                </p>
              </div>
              <div className="w-4/12 md:w-2/12 flex flex-col">
                <p className="flex-auto font-light">
                  {user.workout_count} Workouts
                </p>
                <button className="btn w-full">Follow</button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="card p-3 mb-2">
          <p className="text-center">
            No Results for <span className="font-semibold">{searchResult}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default UserList;
