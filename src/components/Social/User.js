import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import LoadingSpinner from "../Common/LoadingSpinner";

function User() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
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
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user_name]);

  return (
    <div>
      <h1>Profile</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="flex flex-col gap-1 card p-3 mt-2">
            <div className="flex gap-1">
              <label className="text-lg font-semibold sm:w-2/12 w-4/12 py-1">
                Username:
              </label>
              <input
                className="border p-1 flex-auto"
                disabled
                tpye="text"
                defaultValue={user.user_name}
              />
            </div>
            <div className="flex gap-1">
              <label className="text-lg font-semibold sm:w-2/12 w-4/12 py-1">
                First Name:{" "}
              </label>
              <input
                className="border p-1 flex-auto"
                disabled
                tpye="text"
                defaultValue={user.first_name}
              />
            </div>
            <div className="flex gap-1">
              <label className="text-lg font-semibold sm:w-2/12 w-4/12 py-1">
                Last Name:{" "}
              </label>
              <input
                className="border p-1 flex-auto"
                disabled
                tpye="text"
                defaultValue={user.last_name}
              />
            </div>
            <div className="flex gap-1">
              <label className="text-lg font-semibold sm:w-2/12 w-4/12 py-1">
                Birthday:{" "}
              </label>
              <input
                className="border p-1 flex-auto"
                disabled
                tpye="text"
                defaultValue={user.dob}
              />
            </div>
            <div className="flex gap-1">
              <label className="text-lg font-semibold sm:w-2/12 w-4/12 py-1">
                Gender:{" "}
              </label>
              <div>
                <input
                  className="border p-1 flex-auto"
                  tpye="text"
                  disabled
                  defaultValue={user.gender}
                />
              </div>
            </div>
            <div className="flex gap-1">
              <label className="text-lg font-semibold sm:w-2/12 w-4/12">
                Bio:{" "}
              </label>
              <textarea
                disabled
                className="light-border flex-auto p-1"
                tpye="text"
                defaultValue={user.biography}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
