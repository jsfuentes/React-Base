import React from "react";
import { useForm } from "react-hook-form";

import { axios } from "utils.js";
import Navbar from "components/Navbar";
import Footer from "components/Footer";

export default function Login() {
  const { handleSubmit, register, errors } = useForm();

  function onSubmit(user) {
    console.log(user);
    axios
      .post("/user", user)
      .then((resp) => console.log("resp recieved", resp));
  }

  return (
    <>
      <Navbar />
      <div className="w-full p-8 flex flex-col justify-center items-center">
        <form
          className="inline-block border-4 border-solid rounded-sm flex flex-col justify-center items-center p-6 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-3xl font-bold">Login</div>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="username"
              type="text"
              placeholder="Username"
              ref={register({ required: true })}
            />
          </div>
          {errors.username && (
            <p className="mt-2 text-red-500 text-xs italic">
              Username is required!
            </p>
          )}
          <div className="mt-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="password"
              type="password"
              placeholder="********"
              ref={register({ required: true, minLength: 8 })}
            />
          </div>
          {errors.password && (
            <p className="mt-2 text-red-500 text-xs italic">
              Password of minimum length 8 is required!
            </p>
          )}
          <div className="mt-6 flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
            <a
              className="ml-6 inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
