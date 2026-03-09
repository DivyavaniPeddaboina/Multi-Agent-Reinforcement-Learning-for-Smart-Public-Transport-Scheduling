"use client";

import React from "react";
import { Play, Pause, RotateCcw, Brain, Zap, Activity } from "lucide-react";
import { Statistics } from "../../types";
import clsx from "clsx";

interface ControlPanelProps {
  isRunning: boolean;
  onStart: (useTrained: boolean) => void;
  onStop: () => void;
  onReset: () => void;
  onTrain: () => void;
  isTraining: boolean;
  stats: Statistics | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  onStart,
  onStop,
  onReset,
  onTrain,
  isTraining,
  stats,
}) => {
  const [useTrained, setUseTrained] = React.useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6 flex flex-col gap-6 transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Simulation Control
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage real-time transport system
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isRunning ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
          ></span>
          {isRunning ? "Live" : "Stopped"}
        </div>
      </div>

      <div className="h-px bg-gray-200 w-full" />

      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onStart(useTrained)}
          disabled={isRunning}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${isRunning
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg active:transform active:scale-95"
            }`}
        >
          <Play className="w-4 h-4" fill="currentColor" />
          Start
        </button>

        <button
          onClick={onStop}
          disabled={!isRunning}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${!isRunning
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg active:transform active:scale-95"
            }`}
        >
          <Pause className="w-4 h-4" fill="currentColor" />
          Stop
        </button>
      </div>

      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors pointer-cursor"
      >
        <RotateCcw className="w-4 h-4" />
        Reset System
      </button>

      {/* AI Mode Toggle */}
      <div className={clsx(
        "rounded-lg p-4 border transition-all duration-300",
        useTrained
          ? "bg-purple-50 border-purple-200 shadow-sm"
          : "bg-gray-50 border-gray-100"
      )}>
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              useTrained ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
            )}>
              {useTrained ? <Zap className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-sm font-bold text-gray-800 block">
                {useTrained ? "AI Optimization" : "Baseline Schedule"}
              </span>
              <span className="text-[10px] text-gray-500">
                {useTrained ? "PPO MARL Active" : "Fixed Interval Rules"}
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={useTrained}
              onChange={(e) => setUseTrained(e.target.checked)}
              disabled={isRunning}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </div>
        </label>
      </div>

      {/* Training Section */}
      <div className="border-t border-gray-200 pt-4 mt-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Model Training
        </p>
        <button
          onClick={onTrain}
          disabled={isRunning || isTraining}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${isRunning || isTraining
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
            }`}
        >
          <Brain className={`w-4 h-4 ${isTraining ? "animate-pulse" : ""}`} />
          {isTraining ? "Training in Progress..." : "Train Agents (100 Eps)"}
        </button>
      </div>

      {/* Mini Stats for quick view */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-gray-200">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 uppercase">Wait Time</div>
            <div className="text-lg font-bold text-gray-800">
              {(stats.average_wait_time || 0).toFixed(1)}s
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 uppercase">Served</div>
            <div className="text-lg font-bold text-green-600">
              {stats.total_passengers_served || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
