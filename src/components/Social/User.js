import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import dayjs from "dayjs";
import LoadingSpinner from "../Common/LoadingSpinner";
import WorkoutList from "../Workouts/WorkoutList";
import UserList from "./UserList";

function User({ currentUserName }) {
  const [user, setUser] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [biography, setBiography] = useState("");
  const [users, setUsers] = useState("");
  const { user_name } = useParams();

  useEffect(() => {
    const { token } = JSON.parse(sessionStorage.getItem("token"));
    setLoading(true);
    api
      .get(`/users/${user_name}`, {
        headers: {
          Authorization: "Basic " + token,
        },
      })
      .then((res) => {
        setUser(res.data);
        setFirstName(res.data.first_name);
        setLastName(res.data.last_name);
        setDob(res.data.dob);
        setGender(res.data.gender);
        setBiography(res.data.biography);
        if (res.data.user_name === currentUserName) setCanEdit(true);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user_name, currentUserName]);

  useEffect(() => {
    setFollowersLoading(true);
    const { token } = JSON.parse(sessionStorage.getItem("token"));
    api
      .get(`/users/${user_name}/followers`, {
        headers: {
          Authorization: "Basic " + token,
        },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setFollowersLoading(false);
      });
  }, [user_name]);

  const handleUpdate = async () => {
    try {
      let body = { firstName, lastName, dob, gender, biography };
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      await api.post(`/users/${user_name}`, body, {
        headers: {
          Authorization: "Basic " + token,
        },
      });
      setUser({
        user_name,
        first_name: firstName,
        last_name: lastName,
        dob,
        gender,
        biography,
      });
      toast.success(`Profile updated!`, {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setDob(user.dob);
    setGender(user.gender);
    setBiography(user.biography);
    setIsEdit(false);
  };

  return (
    <div>
      <h1>Profile</h1>
      {loading ? (
        <div className="card">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-1 card p-3 mt-2">
          <div className="flex gap-1">
            <label className="text-lg font-semibold sm:w-2/12 w-4/12 py-1">
              Username:
            </label>
            <p className="invisible-border p-1 flex-auto">{user.user_name}</p>
          </div>
          <div className="flex gap-1">
            <label className="text-lg font-semibold sm:w-2/12 w-4/12 py-1">
              First Name:{" "}
            </label>
            {isEdit ? (
              <input
                className="light-border p-1 flex-auto"
                disabled={isEdit ? false : true}
                type="text"
                defaultValue={user.first_name}
                onChange={(event) => setFirstName(event.target.value)}
              />
            ) : (
              <p className="invisible-border p-1 flex-auto">
                {user.first_name || "Not Provided"}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <label className="text-lg font-semibold sm:w-2/12 w-4/12 py-1">
              Last Name:{" "}
            </label>
            {isEdit ? (
              <input
                className="light-border p-1 flex-auto"
                disabled={isEdit ? false : true}
                type="text"
                defaultValue={user.last_name}
                onChange={(event) => setLastName(event.target.value)}
              />
            ) : (
              <p className="invisible-border p-1 flex-auto">
                {user.last_name || "Not Provided"}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <label className="text-lg font-semibold sm:w-2/12 w-4/12 py-1">
              Birthday:{" "}
            </label>
            {isEdit ? (
              <input
                className="light-border p-1 flex-auto"
                disabled={isEdit ? false : true}
                type="date"
                defaultValue={user.dob}
                onChange={(event) => setDob(event.target.value)}
              />
            ) : (
              <p className="invisible-border p-1 flex-auto">
                {user.dob
                  ? dayjs(user.dob).format("DD/MM/YYYY")
                  : "Not Provided"}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <label className="text-lg font-semibold sm:w-2/12 w-4/12 py-1">
              Gender:{" "}
            </label>
            {isEdit ? (
              <select
                className="light-border p-1 flex-auto"
                type="text"
                disabled={isEdit ? false : true}
                defaultValue={user.gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="">Not Provided</option>
              </select>
            ) : (
              <p className="invisible-border p-1 flex-auto">
                {user.gender || "Not Provided"}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <label className="text-lg font-semibold sm:w-2/12 w-4/12">
              Bio:{" "}
            </label>
            {isEdit ? (
              <textarea
                disabled={isEdit ? false : true}
                className="light-border flex-auto p-1"
                tpye="text"
                defaultValue={user.biography}
                onChange={(event) => setBiography(event.target.value)}
              />
            ) : (
              <div>
                <p className="p-1 flex-auto">
                  {user.biography || "Not Provided"}
                </p>
              </div>
            )}
          </div>
          {canEdit && !isEdit && (
            <div className="flex-1 mt-2">
              <button
                className="btn"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                Edit Profile
              </button>
            </div>
          )}
          {isEdit && (
            <div className="mt-2 gap-1">
              <button className="btn-secondary" onClick={() => handleCancel()}>
                Cancel
              </button>{" "}
              <button
                className="btn"
                onClick={() => {
                  handleUpdate();
                }}
              >
                Update
              </button>
            </div>
          )}
        </div>
      )}
      {currentUserName !== user_name && (
        <div className="mt-2">
          <h2>{user_name}'s Workouts</h2>
          <WorkoutList username={user_name} currentUserName={currentUserName} />
        </div>
      )}
      {currentUserName === user_name && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold">Users That You Follow:</h2>
          {followersLoading ? (
            <div className="card">
              <LoadingSpinner />
            </div>
          ) : (
            <UserList
              users={users}
              setUsers={setUsers}
              noFollowersMessage="You don't follow any users..."
            />
          )}
        </div>
      )}
    </div>
  );
}

export default User;
