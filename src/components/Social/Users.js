import React, { useState, useEffect } from "react";
import api from "../../api/api";
import UserList from "./UserList";

function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const { token } = JSON.parse(sessionStorage.getItem("token"));
    api
      .get("/users", {
        headers: {
          Authorization: "Basic " + token,
        },
      })
      .then((res) => {
        setUsers([...res.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1 className="mb-2">Social</h1>
      <div className="card p-2 mb-2">
        <form className="flex flex-col gap-1">
          <label className="text-lg font-semibold">User Search</label>
          <div className="flex flex-col md:flex-row gap-1">
            <input
              type="text"
              placeholder="Username..."
              className="light-border p-1 md:w-10/12"
            />

            <input type="submit" className="btn md:w-2/12" value="Search" />
          </div>
        </form>
      </div>
      {/* Users List */}
      <div>
        <h2 className="text-lg font-semibold">Users</h2>
        <UserList users={users} />
      </div>
    </div>
  );
}

export default Users;
