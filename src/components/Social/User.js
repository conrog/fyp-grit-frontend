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
  const [username, setUsername] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followersLoading, setFollowersLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [biography, setBiography] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [selectValue, setSelectValue] = useState("following");
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
        if (
          res.data.is_private === false ||
          (res.data.is_private === true &&
            currentUserName === res.data.user_name)
        ) {
          setUser(res.data);
          setUsername(res.data.user_name);
          setFirstName(res.data.first_name);
          setLastName(res.data.last_name);
          setDob(res.data.dob);
          setGender(res.data.gender);
          setBiography(res.data.biography);
          setIsPrivate(res.data.is_private);
          if (res.data.user_name === currentUserName) setCanEdit(true);
        } else {
          setUsername(res.data.user_name);
          setIsPrivate(res.data.is_private);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user_name, currentUserName]);

  useEffect(() => {
    if (user_name === currentUserName) {
      setFollowersLoading(true);
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      api
        .get(`/users/${user_name}/followers`, {
          headers: {
            Authorization: "Basic " + token,
          },
        })
        .then((res) => {
          setFollowers(res.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setFollowersLoading(false);
        });
    }
  }, [currentUserName, user_name]);

  useEffect(() => {
    if (user_name === currentUserName) {
      setFollowersLoading(true);
      const { token } = JSON.parse(sessionStorage.getItem("token"));
      api
        .get(`/users/${user_name}/following`, {
          headers: {
            Authorization: "Basic " + token,
          },
        })
        .then((res) => {
          setFollowing(res.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setFollowersLoading(false);
        });
    }
  }, [currentUserName, user_name]);

  const handleUpdate = async () => {
    try {
      let body = { firstName, lastName, dob, gender, biography, isPrivate };
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
        is_private: isPrivate,
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
    setIsPrivate(user.is_private);
    setIsEdit(false);
  };

  return (
    <div>
      <h1 data-cy="page-heading">Profile</h1>
      {loading ? (
        <div className="card">
          <LoadingSpinner />
        </div>
      ) : currentUserName !== username && isPrivate === true ? (
        <div className="card p-3 mt-2">
          <p className="text-center" data-cy="private-message">
            <span className="font-semibold">{username}'s</span> account is
            private!
          </p>
        </div>
      ) : Object.keys(user).length === 0 ? (
        <div className="card p-3 mt-2">
          <p className="text-center">
            User <span className="font-semibold">{user_name}</span> does not
            exist
          </p>
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
                data-cy="first-name-input"
              />
            ) : (
              <p
                className="invisible-border p-1 flex-auto"
                data-cy="first-name"
              >
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
                data-cy="last-name-input"
              />
            ) : (
              <p className="invisible-border p-1 flex-auto" data-cy="last-name">
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
                data-cy="dob-input"
              />
            ) : (
              <p className="invisible-border p-1 flex-auto" data-cy="dob">
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
                defaultValue={user.gender || ""}
                onChange={(event) => setGender(event.target.value)}
                data-cy="gender-select"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="">Not Provided</option>
              </select>
            ) : (
              <p className="invisible-border p-1 flex-auto" data-cy="gender">
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
                data-cy="bio-input"
              />
            ) : (
              <div>
                <p className="p-1 flex-auto" data-cy="bio">
                  {user.biography || "Not Provided"}
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <label className="text-lg font-semibold sm:w-2/12 w-4/12 py-1">
              Profile Type:{" "}
            </label>
            {isEdit ? (
              <select
                className="light-border p-1 flex-auto"
                type="text"
                disabled={isEdit ? false : true}
                defaultValue={user.is_private ? "private" : "public"}
                onChange={(event) => {
                  setIsPrivate(event.target.value === "private" ? true : false);
                }}
                data-cy="profile-type-select"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            ) : (
              <p
                className="invisible-border p-1 flex-auto"
                data-cy="profile-type"
              >
                {isPrivate === true ? "Private" : "Public"}
              </p>
            )}
          </div>
          {canEdit && !isEdit && (
            <div className="flex-1 mt-2">
              <button
                className="btn"
                onClick={() => {
                  setIsEdit(true);
                }}
                data-cy="edit-profile-button"
              >
                Edit Profile
              </button>
            </div>
          )}
          {isEdit && (
            <div className="mt-2 gap-1">
              <button
                className="btn-secondary"
                onClick={() => handleCancel()}
                data-cy="cancel-button"
              >
                Cancel
              </button>{" "}
              <button
                className="btn"
                onClick={() => {
                  handleUpdate();
                }}
                data-cy="update-button"
              >
                Update
              </button>
            </div>
          )}
        </div>
      )}
      {currentUserName !== user_name &&
        isPrivate !== true &&
        Object.keys(user).length !== 0 && (
          <div className="mt-2">
            <h2>{user_name}'s Workouts</h2>
            <WorkoutList
              username={user_name}
              currentUserName={currentUserName}
            />
          </div>
        )}
      {currentUserName === user_name && (
        <div className="mt-2">
          <div className="flex  mb-2">
            <div className="flex-auto">
              <h2 className="text-lg font-semibold" data-cy="list-title">
                Users{" "}
                {selectValue === "following"
                  ? "That You Follow"
                  : "That Follow You"}
              </h2>
            </div>
            <select
              className="py-0 light-border card"
              onChange={(event) => {
                setSelectValue(event.target.value);
              }}
              data-cy="list-select"
            >
              <option value="following">Following</option>
              <option value="followers">Followers</option>
            </select>
          </div>

          {followersLoading ? (
            <div className="card">
              <LoadingSpinner />
            </div>
          ) : selectValue === "following" ? (
            <UserList
              users={following}
              setUsers={setFollowing}
              noFollowersMessage="You don't follow any users..."
            />
          ) : (
            <UserList
              users={followers}
              setUsers={setFollowers}
              noFollowersMessage="No users are following you..."
            />
          )}
        </div>
      )}
    </div>
  );
}

export default User;
