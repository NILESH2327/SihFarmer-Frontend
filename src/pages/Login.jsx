import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-green-100">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Login
        </h2>

        <form className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button className="w-full bg-green-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all">
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          New user?{" "}
          <Link to="/register" className="text-green-600 font-semibold">
            Register
          </Link>
        </p>

        <p className="text-xs text-green-700 text-center mt-2">
          ✔ Check your email for verification
        </p>

      </div>
    </div>
  );
};

export default Login;
