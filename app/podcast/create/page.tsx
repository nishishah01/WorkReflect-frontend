"use client";
import { useState } from "react";

export default function CreatePodcast() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    let uploadedAudioUrl = "";

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

    await fetch("http://localhost:5000/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content: description,
        tags: ["podcast"],
        audioUrl: uploadedAudioUrl,
      }),
    });

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-20">
      <div className="bg-white w-[700px] rounded-2xl shadow p-8">
        <h1 className="text-2xl font-semibold mb-6">
          Host Internal Podcast
        </h1>

        <input
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Podcast Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded-lg h-32 mb-4"
          placeholder="Podcast description or discussion topic..."
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="audio/*"
          className="mb-4"
          onChange={(e) =>
            setAudioFile(e.target.files?.[0] || null)
          }
        />

        <button
          className="bg-black text-white px-6 py-2 rounded-lg"
          onClick={handleSubmit}
        >
          Publish Podcast
        </button>
      </div>
    </div>
  );
}
