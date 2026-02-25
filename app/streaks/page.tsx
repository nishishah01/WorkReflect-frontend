"use client";

import { getToken, getUser } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import UpgradeModal from "../../components/UpgradeModal";

// ─── Types ───────────────────────────────────────────────────────────────────
interface HeatmapCell {
    date: string;
    count: number;
}

interface MemberStreak {
    userId: string;
    name: string;
    email: string;
    role: string;
    currentStreak: number;
    longestStreak: number;
    totalReflections: number;
    heatmap: HeatmapCell[];
}

interface StreaksData {
    leaderboard: MemberStreak[];
    myStats: MemberStreak | null;
}

// ─── Heatmap colours ──────────────────────────────────────────────────────────
function cellColor(count: number): string {
    if (count === 0) return "#0c1525";
    if (count === 1) return "#1e3464";
    if (count === 2) return "#1d4ed8";
    if (count === 3) return "#2563eb";
    return "#3b82f6";
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
    const [show, setShow] = useState(false);
    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-slate-300 bg-navy-900 border border-navy-700 rounded-lg px-2.5 py-1.5 shadow-xl pointer-events-none">
                    {text}
                </div>
            )}
        </div>
    );
}

// ─── Contribution Heatmap ─────────────────────────────────────────────────────
function ContributionHeatmap({ heatmap }: { heatmap: HeatmapCell[] }) {
    const weeks: HeatmapCell[][] = [];
    for (let i = 0; i < heatmap.length; i += 7) {
        weeks.push(heatmap.slice(i, i + 7));
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Mon", "", "Wed", "", "Fri", "", ""];

    const monthLabels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
        const d = new Date(week[0].date);
        const m = d.getMonth();
        if (m !== lastMonth) {
            monthLabels.push({ label: months[m], col: wi });
            lastMonth = m;
        }
    });

    return (
        <div className="overflow-x-auto">
            <div style={{ minWidth: weeks.length * 14 + 40 }}>
                {/* Month labels */}
                <div className="flex ml-10 mb-1">
                    <div className="relative h-4" style={{ width: weeks.length * 14 }}>
                        {monthLabels.map((ml) => (
                            <span
                                key={ml.col}
                                className="absolute text-[9px] font-mono text-slate-500"
                                style={{ left: ml.col * 14 }}
                            >
                                {ml.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="flex gap-0">
                    {/* Day labels */}
                    <div className="flex flex-col gap-[2px] mr-2">
                        {days.map((d, i) => (
                            <div key={i} className="text-[9px] font-mono text-slate-600 h-[10px] leading-[10px] text-right w-7">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Cells */}
                    {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-[2px] mr-[2px]">
                            {week.map((cell) => (
                                <Tooltip
                                    key={cell.date}
                                    text={`${cell.date} · ${cell.count === 0 ? "No reflections" : `${cell.count} reflection${cell.count > 1 ? "s" : ""}`}`}
                                >
                                    <div
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 2,
                                            background: cellColor(cell.count),
                                            transition: "transform 0.1s",
                                            cursor: "default",
                                        }}
                                        className="hover:scale-125"
                                    />
                                </Tooltip>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-1.5 mt-3 ml-10">
                    <span className="text-[9px] font-mono text-slate-600">Less</span>
                    {[0, 1, 2, 3, 4].map((v) => (
                        <div key={v} style={{ width: 10, height: 10, borderRadius: 2, background: cellColor(v) }} />
                    ))}
                    <span className="text-[9px] font-mono text-slate-600">More</span>
                </div>
            </div>
        </div>
    );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ value, label, icon, accent }: {
    value: number | string;
    label: string;
    icon: string;
    accent: string;
}) {
    return (
        <div
            className="flex flex-col items-center justify-center rounded-2xl px-6 py-5 relative overflow-hidden"
            style={{
                background: "rgba(8,14,30,0.8)",
                border: `1px solid ${accent}30`,
                boxShadow: `0 0 32px ${accent}12`,
            }}
        >
            <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-30"
                style={{ background: accent }}
            />
            <span className="text-2xl mb-1">{icon}</span>
            <span
                className="text-3xl font-extrabold text-white tracking-tight"
                style={{ textShadow: `0 0 24px ${accent}80` }}
            >
                {value}
            </span>
            <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">{label}</span>
        </div>
    );
}

// ─── Rank badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) return <span className="text-xl">🥇</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return (
        <span className="w-7 h-7 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-xs font-bold text-slate-400">
            {rank}
        </span>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function StreaksInner() {
    const [data, setData] = useState<StreaksData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [viewingUserId, setViewingUserId] = useState<string | null>(null);
    const [upgraded, setUpgraded] = useState(false);
    const searchParams = useSearchParams();
    const me = getUser();

    useEffect(() => {
        const token = getToken();
        if (!token) { window.location.href = "/login"; return; }

        // ── Handle Stripe return ──────────────────────────────────────────────────
        if (searchParams.get("upgraded") === "true") {
            setUpgraded(true);
            const sessionId = searchParams.get("session_id");
            if (sessionId) {
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/verify-session`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ sessionId }),
                })
                    .then((r) => r.json())
                    .then((d) => { if (d.plan === "pro") setIsPro(true); })
                    .catch(() => { });
            }
        }

        // ── Check plan ────────────────────────────────────────────────────────────
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/status`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((d) => {
                const pro = !!(d.plan && d.plan !== "free");
                setIsPro(pro);

                // Free user and NOT returning from Stripe → show upgrade wall
                if (!pro && searchParams.get("upgraded") !== "true") {
                    setLoading(false);
                    setShowUpgrade(true);
                    return;
                }

                // Fetch streaks data
                return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/streaks`, {
                    headers: { Authorization: `Bearer ${token}` },
                }).then((r) => r.json());
            })
            .then((d) => {
                if (!d) return;
                setData(d);
                setViewingUserId(d.myStats?.userId ?? null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const viewedMember =
        data?.leaderboard.find((m) => m.userId === viewingUserId) ?? data?.myStats ?? null;

    if (loading) {
        return (
            <div className="min-h-screen bg-void flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
                    <p className="text-slate-500 text-sm font-mono">Loading streaks...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {showUpgrade && (
                <UpgradeModal
                    returnPath="/streaks"
                    onClose={() => { setShowUpgrade(false); window.location.href = "/"; }}
                />
            )}

            <div className="min-h-screen bg-void p-8 lg:p-12">

                {/* ── 🎉 Success banner (returned from Stripe) ── */}
                {upgraded && (
                    <div style={{
                        background: "rgba(34,197,94,0.1)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        borderRadius: "14px",
                        padding: "16px 20px",
                        marginBottom: "28px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}>
                        <span style={{ fontSize: "22px" }}>🎉</span>
                        <div>
                            <p style={{ color: "#4ade80", fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>
                                Welcome to Pro!
                            </p>
                            <p style={{ color: "#64748b", fontSize: "12px" }}>
                                You now have full access to Streaks, Live Rooms, and all Pro features.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Header ── */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-orange-500/40 to-transparent max-w-[60px]" />
                        <span className="text-[11px] font-mono text-orange-400/70 uppercase tracking-widest">Premium</span>
                    </div>
                    <h1 className="font-display text-4xl lg:text-5xl text-white leading-tight">
                        🔥 Reflection Streaks
                    </h1>
                    <p className="mt-2 text-slate-400 text-sm max-w-lg">
                        Track your daily contribution habit, compete with teammates, and build a culture of consistent reflection.
                    </p>
                </div>

                {/* ── Personal stats pills ── */}
                {data?.myStats && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                                {me?.name?.[0]?.toUpperCase() ?? "U"}
                            </div>
                            <p className="text-sm font-semibold text-white">{me?.name ?? "You"}</p>
                            <span className="ml-1 text-[10px] font-mono text-slate-500">— Your Stats</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <StatPill
                                value={data.myStats.currentStreak === 0 ? "—" : `${data.myStats.currentStreak}d`}
                                label="Current Streak"
                                icon="🔥"
                                accent="#f97316"
                            />
                            <StatPill
                                value={data.myStats.longestStreak === 0 ? "—" : `${data.myStats.longestStreak}d`}
                                label="Best Streak"
                                icon="🏆"
                                accent="#f59e0b"
                            />
                            <StatPill
                                value={data.myStats.totalReflections}
                                label="Total Reflections"
                                icon="📝"
                                accent="#3b82f6"
                            />
                        </div>
                    </div>
                )}

                {/* ── Contribution heatmap ── */}
                {viewedMember && (
                    <div
                        className="mb-8 rounded-2xl p-6"
                        style={{
                            background: "rgba(8,14,30,0.8)",
                            border: "1px solid #142040",
                            boxShadow: "0 0 40px rgba(59,130,246,0.06)",
                        }}
                    >
                        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                            <div>
                                <h2 className="text-sm font-semibold text-white">Contribution Heatmap</h2>
                                <p className="text-xs text-slate-500 mt-0.5 font-mono">
                                    {viewedMember.name} · Last 365 days
                                </p>
                            </div>

                            {/* Member switcher */}
                            <select
                                value={viewingUserId ?? ""}
                                onChange={(e) => setViewingUserId(e.target.value)}
                                className="text-xs bg-navy-800 border border-navy-700 text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500/50"
                            >
                                {data?.leaderboard.map((m) => (
                                    <option key={m.userId} value={m.userId}>
                                        {m.name}{m.userId === data.myStats?.userId ? " (You)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <ContributionHeatmap heatmap={viewedMember.heatmap} />

                        <div className="mt-4 flex items-center gap-6 text-xs text-slate-500 font-mono">
                            <span>🔥 Current: <span className="text-orange-400 font-bold">{viewedMember.currentStreak}d</span></span>
                            <span>🏆 Best: <span className="text-amber-400 font-bold">{viewedMember.longestStreak}d</span></span>
                            <span>📝 Total: <span className="text-blue-400 font-bold">{viewedMember.totalReflections}</span></span>
                        </div>
                    </div>
                )}

                {/* ── Team Leaderboard ── */}
                <div
                    className="rounded-2xl p-6"
                    style={{ background: "rgba(8,14,30,0.8)", border: "1px solid #142040" }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-lg">🏅</span>
                        <h2 className="text-sm font-semibold text-white">Team Leaderboard</h2>
                        <span className="ml-auto text-[10px] font-mono text-slate-600">sorted by current streak</span>
                    </div>

                    <div className="space-y-2">
                        {data?.leaderboard.map((member, i) => {
                            const isMe = member.userId === data.myStats?.userId;
                            const isViewing = member.userId === viewingUserId;
                            return (
                                <button
                                    key={member.userId}
                                    onClick={() => setViewingUserId(member.userId)}
                                    className="w-full text-left"
                                >
                                    <div
                                        className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all"
                                        style={{
                                            background: isViewing
                                                ? "rgba(59,130,246,0.1)"
                                                : isMe
                                                    ? "rgba(249,115,22,0.06)"
                                                    : "rgba(20,32,64,0.3)",
                                            border: isViewing
                                                ? "1px solid rgba(59,130,246,0.3)"
                                                : isMe
                                                    ? "1px solid rgba(249,115,22,0.2)"
                                                    : "1px solid #142040",
                                        }}
                                    >
                                        {/* Rank */}
                                        <div className="flex-shrink-0 w-8 flex items-center justify-center">
                                            <RankBadge rank={i + 1} />
                                        </div>

                                        {/* Avatar */}
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                            style={{
                                                background: isMe ? "rgba(249,115,22,0.2)" : "rgba(59,130,246,0.15)",
                                                color: isMe ? "#fb923c" : "#60a5fa",
                                                border: isMe ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(59,130,246,0.2)",
                                            }}
                                        >
                                            {member.name?.[0]?.toUpperCase()}
                                        </div>

                                        {/* Name + role */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-medium truncate">
                                                {member.name}
                                                {isMe && <span className="ml-2 text-[10px] font-mono text-orange-400/70">you</span>}
                                            </p>
                                            <p className="text-[10px] font-mono text-slate-500 capitalize">{member.role}</p>
                                        </div>

                                        {/* Streak numbers */}
                                        <div className="flex items-center gap-5 text-xs flex-shrink-0">
                                            <div className="text-center">
                                                <p className="font-extrabold text-orange-400 text-base leading-none">
                                                    {member.currentStreak > 0 ? `${member.currentStreak}` : "—"}
                                                </p>
                                                <p className="text-[9px] font-mono text-slate-600 mt-0.5">streak</p>
                                            </div>
                                            <div className="text-center hidden sm:block">
                                                <p className="font-bold text-amber-400 text-sm leading-none">
                                                    {member.longestStreak > 0 ? `${member.longestStreak}` : "—"}
                                                </p>
                                                <p className="text-[9px] font-mono text-slate-600 mt-0.5">best</p>
                                            </div>
                                            <div className="text-center hidden sm:block">
                                                <p className="font-bold text-blue-400 text-sm leading-none">{member.totalReflections}</p>
                                                <p className="text-[9px] font-mono text-slate-600 mt-0.5">total</p>
                                            </div>

                                            {/* Mini bar-graph preview — last 14 days */}
                                            <div className="hidden md:flex gap-[2px] items-end">
                                                {member.heatmap.slice(-14).map((cell) => (
                                                    <div
                                                        key={cell.date}
                                                        style={{
                                                            width: 5,
                                                            height: cell.count > 0 ? Math.min(5 + cell.count * 4, 20) : 5,
                                                            borderRadius: 2,
                                                            background: cellColor(cell.count),
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                        {!data?.leaderboard.length && (
                            <div className="text-center py-12 text-slate-500 text-sm">
                                No data yet — start writing reflections to build your streak!
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Footer tip ── */}
                <p className="text-center text-[11px] font-mono text-slate-600 mt-8">
                    🔥 A streak counts consecutive days with at least 1 reflection · Updated in real-time
                </p>
            </div>
        </>
    );
}

export default function StreaksPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-void flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
                    <p className="text-slate-500 text-sm font-mono">Loading streaks...</p>
                </div>
            </div>
        }>
            <StreaksInner />
        </Suspense>
    );
}
