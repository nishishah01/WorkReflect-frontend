"use client";

import { use, useEffect, useState } from "react";

type Post = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
  audioUrl?: string; 
  aiFeedback?: {
    summary: string;
  };
  reactions?: {
    agree: number;
    insightful: number;
    idea: number;
  };
};

type Comment = {
  _id: string;
  text: string;
  createdAt: string;
};

export default function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);


  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");


  // ✅ Fetch post
  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [id]);

  // ✅ Fetch comments
  useEffect(() => {
    fetch(`http://localhost:5000/api/comments/${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [id]);

  // ✅ Add comment
  const addComment = async () => {
    if (!newComment.trim()) return;

    await fetch("http://localhost:5000/api/comments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
        text: newComment,
      }),
    });

    setNewComment("");

    const updated = await fetch(
      `http://localhost:5000/api/comments/${id}`
    );
    setComments(await updated.json());
  };

  // ✅ Reaction handler
  const react = async (type: string) => {
    const res = await fetch(
      `http://localhost:5000/api/posts/react/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      }
    );

    const updatedReactions = await res.json();

    setPost((prev: any) => ({
      ...prev,
      reactions: updatedReactions,
    }));
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Title */}
      <h1 className="text-4xl font-semibold mb-6">
        {post.title}
      </h1>
      {/* Tags */}
      <div className="flex gap-2 mb-6 flex-wrap">
  {post.tags?.map((tag) => (
    <span
      key={tag}
      className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
    >#{tag}
    </span>
    
  ))}
</div>



      {/* Date */}
      <p className="text-gray-500 mb-8">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* Content */}
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
        {post.content}
      </div>
    {/* Audio Discussion */}
{post.audioUrl && (
  <div className="mt-8 p-4 border rounded-xl bg-gray-50">
    <h3 className="font-semibold mb-2">
      🎧 Audio Discussion
    </h3>

    <audio controls className="w-full">
      <source
        src={`http://localhost:5000${post.audioUrl}`}
      />
      Your browser does not support audio.
    </audio>
  </div>
)}

      {/* AI Feedback */}
      {post.aiFeedback?.summary && (
        <div className="mt-10 p-6 bg-indigo-50 border rounded-xl">
          <h2 className="font-semibold text-indigo-700 mb-2">
            ✨ AI Feedback
          </h2>

          <pre className="whitespace-pre-wrap text-gray-700 text-sm">
            {post.aiFeedback.summary}
          </pre>
        </div>
      )}

      {/* Reactions */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => react("agree")}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          👍 Agree ({post.reactions?.agree || 0})
        </button>

        <button
          onClick={() => react("insightful")}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          💡 Insightful ({post.reactions?.insightful || 0})
        </button>

        <button
          onClick={() => react("idea")}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          🚀 Good Idea ({post.reactions?.idea || 0})
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">
          Discussion
        </h2>

        <textarea
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <button
          onClick={addComment}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Comment
        </button>

        <div className="mt-6 space-y-3">
          {comments.map((c) => (
            <div
              key={c._id}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <p>{c.text}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
