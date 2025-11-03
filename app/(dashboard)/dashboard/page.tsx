"use client";
import React, { useState } from "react";
import RoadMapViewer from "@/components/dashboard/road-map-viewer";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">SkillzBloom Dashboard</h1>

      {/* TAB BUTTONS */}
      <div className="flex gap-3 mb-6">
        <button 
          onClick={() => setActiveTab("dashboard")} 
          className={`px-4 py-2 rounded ${activeTab === "dashboard" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Dashboard
        </button>

        <button 
          onClick={() => setActiveTab("reflections")} 
          className={`px-4 py-2 rounded ${activeTab === "reflections" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Reflections
        </button>

        <button 
          onClick={() => setActiveTab("coach")} 
          className={`px-4 py-2 rounded ${activeTab === "coach" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          AI Coach
        </button>
      </div>

      {/* MAIN CONTENT */}
      {activeTab === "dashboard" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Welcome Back 👋</h2>
          <RoadMapViewer />
        </div>
      )}

      {activeTab === "reflections" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Reflections & Notes</h2>
          <p className="text-gray-600 mb-3">
            Write your reflection here. (Firestore will be added next ✅)
          </p>
          <textarea
            className="w-full h-32 border rounded p-2"
            placeholder="Write your thoughts..."
          ></textarea>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
            Save Reflection (coming soon)
          </button>
        </div>
      )}

      {activeTab === "coach" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">AI Learning Coach</h2>
          <p className="text-gray-600 mb-3">
            AI suggestions will appear here. (Next step ✅)
          </p>
          <button className="px-4 py-2 bg-purple-600 text-white rounded">
            Ask AI (coming soon)
          </button>
        </div>
      )}
    </div>
  );
}
