import React, { useState, useEffect } from "react";
import api from "../../api/api";
import UserList from "./UserList";
import LoadingSpinner from "../Common/LoadingSpinner";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { token } = JSON.parse(sessionStorage.getItem("token"));
    setLoading(true);
    api
      .get("/users", {
        headers: {
          Authorization: "Basic " + token,
        },
      })
      .then((res) => {
        setUsers([...res.data]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const userSearch = async (searchValue) => {
    setLoading(true);
    try {
      const { token } = JSON.parse(sessionStorage.getItem("token"));

      let { data } = await api.get(`/users?text=${searchValue.toLowerCase()}`, {
        headers: {
          Authorization: "Basic " + token,
        },
      });
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="mb-2" data-cy="page-heading">
        Social
      </h1>
      <div className="card p-2 mb-2">
        <form className="flex flex-col gap-1">
          <label className="text-lg font-semibold">User Search</label>
          <div className="flex flex-col md:flex-row gap-1">
            <input
              type="text"
              placeholder="Username..."
              className="light-border p-1 md:w-10/12"
              onChange={(event) => {
                setSearchValue(event.target.value);
              }}
              data-cy="user-search-input"
            />
            <input
              type="submit"
              className="btn md:w-2/12"
              value="Search"
              onClick={(event) => {
                event.preventDefault();
                userSearch(searchValue);
              }}
              data-cy="search-button"
            />
          </div>
        </form>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Users</h2>
        {loading ? (
          <div className="card">
            <LoadingSpinner />
          </div>
        ) : (
          <UserList
            users={users}
            setUsers={setUsers}
            searchValue={searchValue}
          />
        )}
      </div>
    </div>
  );
}

export default Users;
