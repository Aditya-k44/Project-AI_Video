import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const VideoGenerator = () => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (!user) {
      setContent("");
      setPrompt("");
      setError("");
    }
  }, [user]);

  const handleGenerateContent = async () => {
    if (!user) {
      alert("Please log in first!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Generate a video idea based on the following prompt: ${
                    prompt || "Video about social media trends"
                  }`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const generatedText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText) {
        throw new Error("No content returned from Gemini.");
      }

      setContent(generatedText);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError("Error generating content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Generate Video Content</h1>
      <div className="mb-4">
        <textarea
          placeholder="Enter a prompt for the video idea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white-800 placeholder-gray-400 resize-none transition"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleGenerateContent}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition focus:outline-none focus:ring-0"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Content"}
      </button>

      {content && (
        <div className="mt-8 p-6 border rounded shadow bg-white">
          <h2 className="text-xl font-bold mb-4 text-gray-800 hover:text-white transition">
            Generated Video Idea
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {content
              .split(/\n+/)
              .map((line, idx) =>
                line.trim() ? <li key={idx}>{line.trim()}</li> : null
              )}
          </ul>

          <div className="mt-6">
            <video className="w-full rounded mb-4" controls>
              <source
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            <div className="flex gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded hover:text-white transition">
                Publish
              </button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded hover:text-white transition">
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
