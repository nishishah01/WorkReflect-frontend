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
    <div className="min-h-screen bg-void p-8 lg:p-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent max-w-[60px]" />
          <span className="text-[11px] font-mono text-blue-400/70 uppercase tracking-widest">Internal</span>
        </div>
        <h1 className="font-display text-4xl lg:text-5xl text-white leading-tight">
          Reflections
        </h1>
        <p className="mt-2 text-slate-400 text-sm font-sans max-w-lg">
          A space for your team&apos;s thoughts, learnings, and conversations.
        </p>
      </div>

      {/* Active Tag Filter */}
      {selectedTag && (
        <div className="mb-6 flex items-center gap-3 p-3 rounded-xl bg-navy-800/50 border border-navy-700 w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs text-slate-400">Filtering by</span>
          <span className="tag-pill">#{selectedTag}</span>
          <button
            onClick={() => setSelectedTag(null)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors ml-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Clear
          </button>
        </div>
      )}

      {/* Post Count */}
      {posts.length > 0 && (
        <p className="text-xs font-mono text-slate-500 mb-5">
          {posts.length} {posts.length === 1 ? 'entry' : 'entries'} found
        </p>
      )}

      {/* Post Grid */}
      <div className="space-y-4">
        {posts.map((post: any, index: number) => (
          <Link key={post._id} href={`/post/${post._id}`}>
            <div
              className="group relative bg-abyss border border-navy-800 rounded-2xl p-6 card-hover cursor-pointer overflow-hidden"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Subtle gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-hover:from-blue-600/[0.03] group-hover:via-blue-600/[0.02] group-hover:to-transparent transition-all duration-300 pointer-events-none" />

              {/* Top row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors leading-snug flex-1">
                  {post.title}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono whitespace-nowrap mt-0.5 flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {post.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedTag(tag);
                      }}
                      className="tag-pill cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content preview */}
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                {post.content}
              </p>

              {/* Arrow */}
              <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <p className="text-slate-400 font-medium mb-1">No reflections yet</p>
          <p className="text-slate-600 text-sm">Be the first to share your thoughts.</p>
          <Link href="/create">
            <button className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors">
              Write a reflection
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
