import React, { useState } from "react";
import api from "../../api/api";

function Login({ setToken }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowError(false);
    setErrorMessage("");
    try {
      const { data } = await api.post("/login", {
        username,
        password,
      });
      setToken(data);
    } catch (e) {
      console.log(e.response.data);
      setErrorMessage(e.response.data);
      setShowError(true);
    }
  };

  return (
    <div className="flex items-center h-screen">
      <div className="grow max-w-md m-auto flex flex-col">
        <h1 className="text-center text-6xl pb-8 italic">GRIT</h1>
        <form
          className="m-2 p-4 border-2 rounded bg-white flex flex-col"
          onSubmit={handleSubmit}
        >
          <p className="pb-2 border-b-2 font-semibold">Login</p>
          <label>
            <p>Username:</p>
            <input
              className="w-full border p-1 shadow"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            <p>Password:</p>
            <input
              className="w-full border p-1 shadow mb-2"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {showError ? (
            <p className="text-center text-red-600">{errorMessage}</p>
          ) : (
            ""
          )}
          <div>
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold p-1 rounded shadow cursor-pointer mb-4 mt-2"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
