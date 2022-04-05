import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import api from "../../api/api";

const Register = ({ setToken }) => {
  const [userExistsError, setUserExistsError] = useState(false);
  const [userExistsErrorMessage, setUserExistsErrorMessage] = useState("");

  return (
    <div className="flex items-center h-screen">
      <div className="grow max-w-md m-auto flex flex-col">
        <h1 className="text-center text-6xl pb-8 italic">GRIT</h1>
        <Formik
          initialValues={{
            username: "",
            password: "",
            confirmPassword: "",
            passwordMatch: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.username) {
              errors.username = "Required";
            }

            if (!values.password) {
              errors.password = "Required";
            }

            if (!values.confirmPassword) {
              errors.confirmPassword = "Required";
            }

            if (values.password !== values.confirmPassword) {
              errors.passwordsNotMatching = "Passwords do not match";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setUserExistsError(false);
              const { username, password } = values;
              let { data } = await api.post("/register", {
                username,
                password,
              });

              if (data.inUse) {
                setUserExistsErrorMessage(data.message);
                setUserExistsError(true);
              } else {
                setToken(data);
                window.location.replace("/help");
              }
            } catch (error) {
              console.log(error);
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="m-2 p-4 card flex flex-col">
              <p className="pb-2 border-b-2 font-semibold" data-cy="form-title">
                Register
              </p>
              <label htmlFor="username">Username:</label>
              <Field
                className={
                  errors.username && touched.username
                    ? "w-full border border-red-500 p-1"
                    : "w-full light-border p-1 "
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
                  (errors.password && touched.password) ||
                  (errors.passwordsNotMatching &&
                    touched.confirmPassword &&
                    touched.password)
                    ? "w-full border border-red-500 p-1"
                    : "w-full light-border p-1"
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
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <Field
                className={
                  (errors.confirmPassword && touched.confirmPassword) ||
                  (errors.passwordsNotMatching &&
                    touched.confirmPassword &&
                    touched.password)
                    ? "w-full border border-red-500 p-1"
                    : "w-full light-border p-1"
                }
                type="password"
                id="confirmPassword"
                name="confirmPassword"
              />
              <ErrorMessage
                data-cy="confirm-password-error"
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm"
              />
              {touched.password &&
              touched.confirmPassword &&
              errors.passwordsNotMatching ? (
                <div
                  className="text-red-500 text-sm"
                  data-cy="password-match-error"
                >
                  {errors.passwordsNotMatching}
                </div>
              ) : null}
              {userExistsError ? (
                <p
                  className="pt-2 text-center text-red-500"
                  data-cy="user-exists-error"
                >
                  {userExistsErrorMessage}
                </p>
              ) : null}
              <button
                data-cy="create-account"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold p-1 rounded shadow cursor-pointer mb-2 mt-4"
                type="submit"
                disabled={isSubmitting}
              >
                Create Account
              </button>
              <p className="text-center mt-2 ">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-500"
                  data-cy="login-link"
                >
                  Log in
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
