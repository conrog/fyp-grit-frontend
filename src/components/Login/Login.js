import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import api from "../../api/api";

const Login = ({ setToken }) => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="flex items-center h-screen">
      <div className="grow max-w-md m-auto flex flex-col">
        <h1 className="text-center text-6xl pb-8 italic">GRIT</h1>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.username) {
              errors.username = "Required";
            }

            if (!values.password) {
              errors.password = "Required";
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const { username, password } = values;
              let { data } = await api.post("/login", {
                username,
                password,
              });

              setToken(data);
              if (
                window.location.pathname === "/" ||
                window.location.pathname === "/login"
              ) {
                window.location.replace("/dashboard");
              } else {
                window.location.reload();
              }
            } catch (error) {
              setErrorMessage(error.response.data);
              setShowError(true);
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="m-2 p-4 card flex flex-col">
              <p className="pb-2 border-b-2 font-semibold" data-cy="form-title">
                Log In
              </p>
              <label htmlFor="username">Username:</label>
              <Field
                className={
                  errors.username && touched.username
                    ? "w-full border border-red-500 p-1"
                    : "w-full border p-1 light-border"
                }
                type="text"
                id="username"
                name="username"
              />
              <ErrorMessage
                data-cy="username-error"
                name="username"
                component="div"
                className="text-red-500 text-sm"
              />
              <label htmlFor="password">Password:</label>
              <Field
                className={
                  errors.password && touched.password
                    ? "w-full border border-red-500 p-1"
                    : "w-full border p-1 light-border"
                }
                type="password"
                id="password"
                name="password"
              />
              <ErrorMessage
                data-cy="password-error"
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
              {showError ? (
                <p
                  data-cy="login-error-message"
                  className="pt-2 text-center text-red-500"
                >
                  {errorMessage}
                </p>
              ) : null}
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold p-1 rounded shadow cursor-pointer mb-2 mt-4"
                type="submit"
                disabled={isSubmitting}
                data-cy="login-button"
              >
                Log In
              </button>
              <p className="text-center mt-2 ">
                Need an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-500"
                  data-cy="register-link"
                >
                  Sign Up
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
