import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="pt-24 p-6 text-gray-800 max-w-2xl mx-auto text-center">
      {user ? (
        <>
          <h1 className="text-3xl pb-8 font-bold mb-4">
            Welcome, <span className="text-blue-600">{user.phoneNumber}</span>
          </h1>

          <Link
            to="/video-generator"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow-md transition hover:text-white transition"
          >
            Generate Video Idea
          </Link>
        </>
      ) : (
        <p className="text-gray-600">Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
