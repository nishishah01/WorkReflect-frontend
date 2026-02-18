"use client";
import { useState } from "react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Publish function
  const handleSubmit = async () => {
    setIsSubmitting(true);
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

  const parsedTags = tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);

  return (
    <div className="min-h-screen bg-void p-8 lg:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent max-w-[60px]" />
            <span className="text-[11px] font-mono text-blue-400/70 uppercase tracking-widest">New Entry</span>
          </div>
          <h1 className="font-display text-4xl text-white">Write Reflection</h1>
          <p className="mt-2 text-slate-400 text-sm">Share your thoughts, learnings, or insights with your team.</p>
        </div>

        {/* Form card */}
        <div className="bg-abyss border border-navy-800 rounded-2xl p-8 space-y-6">

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
              Title <span className="text-blue-500">*</span>
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 text-base font-sans placeholder:text-slate-600 focus:ring-0"
              placeholder="Give your reflection a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
              Content <span className="text-blue-500">*</span>
            </label>
            <textarea
              className="w-full rounded-xl px-4 py-3 text-base font-sans placeholder:text-slate-600 min-h-[200px] resize-y leading-relaxed focus:ring-0"
              placeholder="Write your thoughts, learnings, or reflections here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
              Tags
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 text-sm font-mono placeholder:text-slate-600 focus:ring-0"
              placeholder="backend, learning, teamwork"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            {parsedTags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap pt-1">
                {parsedTags.map(tag => (
                  <span key={tag} className="tag-pill">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Audio Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
              Audio Discussion (optional)
            </label>
            <label className="flex items-center gap-4 p-4 rounded-xl border border-navy-700 bg-navy-900/50 cursor-pointer hover:border-blue-500/30 hover:bg-navy-800/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/30 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-400">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                {audioFile ? (
                  <div>
                    <p className="text-sm font-medium text-blue-300 truncate">{audioFile.name}</p>
                    <p className="text-xs text-slate-500">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-slate-400">Click to upload audio</p>
                    <p className="text-xs text-slate-600">MP3, WAV, M4A supported</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="audio/*"
                className="sr-only"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-navy-700 to-transparent" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <a href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Cancel
            </a>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50"
            >
              {isSubmitting ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  Publish
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
