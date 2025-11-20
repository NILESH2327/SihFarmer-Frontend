import React, { useState } from "react";
import { Link } from "react-router-dom";
import { postJSON } from "../api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });


  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    const res = await postJSON('/auth/register', form );
    if(res.status===400){
      alert(res.message);
    }
    console.log(res.data)
    alert('Sign Up Succesful');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Create Your Account
        </h2>

        <form className="space-y-4" onChange={handleChange} onSubmit={onSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              name="name"
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Enter your password"
            />
          </div>

          <p className="text-sm text-gray-500 text-center">
            Check your email after registration.
          </p>

          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
