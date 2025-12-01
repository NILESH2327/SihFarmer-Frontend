import React, { useEffect, useState } from "react";
import { Award, FileText } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../lib/actions/authActions";
import { toast } from "react-toastify";

import AddActivity from "../components/AddActivity";
import axios from "axios";

// YOUR COMPONENTS
import WeatherCard from "../components/WeatherCard";
import Grid from "../components/Dashboard/Grid";
import { postJSON } from "../api";

const Dashboard = () => {
  
  const [cropTips, setCropTips] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  // inside Dashboard component state:
  const [tasks, setTasks] = useState([
    { id: 1, text: "Check paddy field for pest signs", done: false },
    { id: 2, text: "Irrigate banana plot (2 hrs)", done: true },
    { id: 3, text: "Visit nearby mandi for price info", done: false },
  ]);
  const [newTask, setNewTask] = useState("");


  const { t } = useLanguage();
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
  });

  // Fetch Market & Schemes
  const fetchData = async () => {
    try {
      const [mres, sres] = await Promise.all([
        api.get("/market/all"),
        api.get("/scheme/all"),
      ]);

      if (mres.data.success) setMarketPrices(mres.data.data);
      if (sres.data.success) setSchemes(sres.data.data);
    } catch (err) {
      console.error("Market/Schemes error:", err);
    }
  };

  

  // AI Crop Tips
  const getTips = async () => {
    try {
      const tips = await postJSON("/advisory/generate-advisory", {});
      setCropTips(tips?.advisories || []);
    } catch (err) {
      console.error("AI Tips error:", err);
    }
  };

  // Weather Fetch
  const loadWeather = async () => {
    try {
      const key = import.meta.env.VITE_WEATHER_API_KEY;
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=Kerala&days=4&aqi=no&alerts=no`;

      const response = await fetch(url);
      const data = await response.json();

      if (data?.current) {
        data.current.temp_c = Math.ceil(data.current.temp_c);
        data.current.feelslike_c = Math.ceil(data.current.feelslike_c);
        data.current.humidity = Math.ceil(data.current.humidity);
        data.current.wind_kph = Math.ceil(data.current.wind_kph);
      }

      setWeather(data);
    } catch (error) {
      console.log("Weather error:", error);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Auth Check + Initial Data Load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
    if (!isAuthenticated()) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    getTips();
    fetchData();
    loadWeather();
  }, []);
 

  if (loadingWeather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-gray-600">Loading weather...</p>
      </div>
    );
  }


  if (!weather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-red-500">Failed to load weather data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 pb-8">
      {/* TITLE */}
      <div
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between min-h-96 gap-3 overflow-hidden shadow relative bg-cover bg-center"
        style={{ backgroundImage: "url(/bg10.jpg)" }}
      >
        {/* Optional semi-transparent overlay for readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative flex flex-col gap-8 w-full text-center  py-8 px-6">
          <div>

            <h1 className="text-3xl w-f font-bold text-white drop-shadow-lg ">
              Farmer Dashboard
            </h1>
          </div>
          <div>

            <p className="text-sm text-white drop-shadow">
              Your personalized farming insights and recommendations
            </p>
          </div>
          <div className="">

            <AddActivity />
          </div>
        </div>
      </div>

      <div className="max-w-7xl  mx-auto px-4">

        {/* ADD ACTIVITY */}
        {/* <div className="mb-8">
          <div className="bg-white/90 rounded-2xl shadow-md border border-green-100">
          </div>
        </div> */}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            <WeatherCard Weather={weather} setWeather={setWeather} />
        
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8 mb-8">
            {/* TIPS */}
            <div className="bg-white rounded-2xl shadow-md border border-yellow-100 p-6">
              <h2 className="text-lg font-bold flex items-center text-gray-900">
                <Award className="mr-2 text-yellow-500" /> Today&apos;s Planner
              </h2>

              {/* Add task */}
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newTask.trim()) return;
                  setTasks((prev) => [
                    ...prev,
                    { id: Date.now(), text: newTask.trim(), done: false },
                  ]);
                  setNewTask("");
                }}
              >
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a task (e.g. Fertilize north plot)"
                  className="flex-1 px-3 py-2 text-xs border border-yellow-200 rounded-lg bg-yellow-50 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Add
                </button>
              </form>

              {/* Task list */}
              <div className="space-y-2 mt-4 max-h-56 overflow-y-auto pr-1">
                {tasks.length ? (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-yellow-50 border border-yellow-100"
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() =>
                          setTasks((prev) =>
                            prev.map((t) =>
                              t.id === task.id ? { ...t, done: !t.done } : t
                            )
                          )
                        }
                        className="mt-1 h-4 w-4 text-yellow-500 rounded border-yellow-300"
                      />
                      <p
                        className={`text-xs text-gray-800 ${task.done ? "line-through text-gray-400" : ""
                          }`}
                      >
                        {task.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">
                    No tasks yet. Add what you plan to do today.
                  </p>
                )}
              </div>
            </div>


            {/* SCHEMES */}
            {/* <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
              <h2 className="text-lg font-bold flex items-center text-gray-900">
                <FileText className="mr-2 text-blue-600" /> Schemes
              </h2>
              <div className="space-y-4 mt-4 max-h-72 overflow-y-auto pr-1">
                {schemes.length ? (
                  schemes.map((scheme, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 p-4 rounded-lg hover:border-blue-300 hover:bg-blue-50/40 transition"
                    >
                      <h3 className="font-semibold text-sm text-gray-900">
                        {scheme.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {scheme.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Loading schemes...</p>
                )}
              </div>
            </div> */}

            {/* FARMER PROFILE */}
            {/* <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6">
              <h2 className="text-lg font-bold flex items-center text-gray-900">
                <FileText className="mr-2 text-green-600" /> Farmer Profile
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Update crop &amp; soil details
              </p>

              <Link
                to="/farmer-profile"
                className="block text-center bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Go to Profile
              </Link>
            </div> */}
          </div>
        </div>
      </div>
            <Grid />
    </div>
  );
};

export default Dashboard;
