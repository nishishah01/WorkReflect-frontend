"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);


  useEffect(() => {
  let url = "http://localhost:5000/api/posts";
  if (selectedTag) {
    url += `?tag=${selectedTag}`;
  }
  fetch(url)
    .then(res => res.json())
    .then(data => setPosts(data));
}, [selectedTag]);


  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-semibold mb-6">
        Internal Reflections
      </h1>
      {/* active tags */}
      {selectedTag && (
      <div className="mb-4">
        <span className="text-sm">
          Showing posts for
        </span>

        <span className="ml-2 bg-indigo-100 px-2 py-1 rounded">
          #{selectedTag}
        </span>

        <button
          onClick={() => setSelectedTag(null)}
          className="ml-3 text-sm text-red-500"
        >
          Clear
        </button>
      </div>
    )}
{/* post list */}
      <div className="space-y-6">
        {posts.map((post:any) => (
        <Link key={post._id} href={`/post/${post._id}`}>
  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border cursor-pointer">
    <h2 className="text-xl font-semibold mb-2">
      {post.title}
    </h2>
    <div className="flex gap-2 mt-2 flex-wrap">
  {post.tags?.map((tag: string) => (
    <span
  key={tag}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTag(tag);
  }}
  className="cursor-pointer text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200"
>
  #{tag}
</span>

  ))}
</div>


    <p className="text-gray-600 line-clamp-3">
      {post.content}
    </p>

    <p className="text-xs text-gray-400 mt-4">
      {new Date(post.createdAt).toLocaleDateString()}
    </p>
  </div>
</Link>
        ))}
      </div>
    </div>
  );
}

//frontend connected to backendd