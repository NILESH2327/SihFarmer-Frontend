import React, { useState } from "react";
import { CheckSquare, Plus } from "lucide-react";

const TodayPlanner = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Add a task (e.g. fertilize north plot)", done: false },
    { id: 2, text: "Check paddy field for pest signs", done: false },
    { id: 3, text: "Visit nearby mandi for price info", done: true },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text: newTask.trim(), done: false },
    ]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-yellow-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-yellow-500" />
          <h2 className="text-sm font-semibold text-gray-900">
            Today&apos;s Planner
          </h2>
        </div>
        <span className="text-[11px] text-gray-400">
          {tasks.filter((t) => t.done).length}/{tasks.length} done
        </span>
      </div>

      {/* Add task */}
      <form
        onSubmit={addTask}
        className="flex items-center gap-2 mb-4"
      >
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task (e.g. irrigate banana plot)"
          className="flex-1 px-3 py-2 text-xs border border-yellow-200 rounded-lg bg-yellow-50 focus:outline-none focus:ring-1 focus:ring-yellow-300"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </form>

      {/* Task list */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {tasks.length ? (
          tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => toggleTask(task.id)}
              className="w-full flex items-start gap-2 p-2 rounded-lg bg-yellow-50 border border-yellow-100 text-left hover:bg-yellow-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="mt-1 h-4 w-4 text-yellow-500 rounded border-yellow-300"
              />
              <p
                className={`text-xs ${
                  task.done ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {task.text}
              </p>
            </button>
          ))
        ) : (
          <p className="text-xs text-gray-500">
            No tasks yet. Add what you plan to do today.
          </p>
        )}
      </div>
    </div>
  );
};

export default TodayPlanner;
