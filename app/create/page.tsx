"use client";
import { useState } from "react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const [audioFile, setAudioFile] = useState<File | null>(null);

  // ✅ Publish function
  const handleSubmit = async () => {
    let uploadedAudioUrl = "";

    // STEP 1 — Upload audio first (if exists)
    if (audioFile) {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const uploadRes = await fetch(
        "http://localhost:5000/api/posts/upload-audio",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();
      uploadedAudioUrl = uploadData.audioUrl;
    }

    // STEP 2 — Create post
    await fetch("http://localhost:5000/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        tags: tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),

        audioUrl: uploadedAudioUrl,
      }),
    });

    // redirect to feed
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-20">
      <div className="bg-white w-[700px] rounded-2xl shadow p-8">
        <h1 className="text-2xl font-semibold mb-6">
          Write Reflection
        </h1>

        {/* Title */}
        <input
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Content */}
        <textarea
          className="w-full border p-3 rounded-lg h-40 mb-4"
          placeholder="Write your thoughts..."
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Tags */}
        <input
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Tags (comma separated) e.g. backend, learning"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {/* Audio Upload */}
        <input
          type="file"
          accept="audio/*"
          className="mb-4"
          onChange={(e) =>
            setAudioFile(e.target.files?.[0] || null)
          }
        />

        {/* Publish Button */}
        <button
          className="bg-black text-white px-6 py-2 rounded-lg"
          onClick={handleSubmit}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
