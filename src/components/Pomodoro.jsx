import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "../context/LanguageContext.jsx";
import { parseISO, isSameDay, format } from "date-fns";

// durations
const DEFAULTS = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
const COLORS = { work: "#0f172a", short: "#16a34a", long: "#6366f1" };

// read/write events
function useLocalEvents() {
    const [events, setEvents] = useState(() => {
        const raw = localStorage.getItem("events:v1");
        return raw ? JSON.parse(raw) : [];
    });
    useEffect(() => {
        localStorage.setItem("events:v1", JSON.stringify(events));
    }, [events]);
    return [events, setEvents];
}

export default function Pomodoro() {
    const { lang, t } = useLang();
    const [mode, setMode] = useState("work");
    const [seconds, setSeconds] = useState(DEFAULTS.work);
    const [running, setRunning] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    const [events, setEvents] = useLocalEvents();

    const duration = useMemo(() => DEFAULTS[mode], [mode]);

    // reset when mode changes
    useEffect(() => { setSeconds(DEFAULTS[mode]); setRunning(false); }, [mode]);

    // countdown
    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [running]);

    // auto switch
    useEffect(() => {
        if (seconds === 0) {
            setRunning(false);
            if (mode === "work") {
                const next = cycleCount + 1;
                setCycleCount(next);
                setMode(next % 4 === 0 ? "long" : "short");
                setTimeout(() => setRunning(true), 1000);
            } else {
                setMode("work");
                setTimeout(() => setRunning(true), 1000);
            }
        }
    }, [seconds, mode, cycleCount]);

    const pct = Math.max(0, Math.min(1, seconds / duration));
    const dash = 2 * Math.PI * 45;
    const formatTime = (t) => {
        const m = Math.floor(t / 60);
        const s = t % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    const todayEvents = events.filter((e) => isSameDay(parseISO(e.date), today));

    // toggle done
    const toggleDone = (id) => {
        setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, done: !e.done } : e)));
    };

    // add today's task
    const [newTask, setNewTask] = useState("");
    const addTodayTask = () => {
        if (!newTask.trim()) return;
        setEvents((prev) => [
            ...prev,
            { id: crypto.randomUUID(), title: newTask.trim(), date: todayStr, done: false },
        ]);
        setNewTask("");
    };

    return (
        <section className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
            {/* left timer */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-500">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold">{t.pomodoro.title}</h2>

                    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        {["work", "short", "long"].map((m) => (
                            <motion.button
                                key={m}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setMode(m)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                                    mode === m
                                        ? "bg-white shadow text-slate-900"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                {m === "work"
                                    ? t.pomodoro.focus
                                    : m === "short"
                                        ? t.pomodoro.shortBreak
                                        : t.pomodoro.longBreak}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* timer */}
                <div className="mt-8 grid place-items-center">
                    <div className="relative">
                        <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="45"
                                strokeWidth="8"
                                strokeLinecap="round"
                                fill="none"
                                strokeDasharray={dash}
                                animate={{
                                    strokeDashoffset: (1 - pct) * dash,
                                    stroke: COLORS[mode],
                                }}
                                transition={{
                                    strokeDashoffset: { duration: 0.5, ease: "easeInOut" },
                                    stroke: { duration: 0.8, ease: "easeInOut" },
                                }}
                            />
                        </svg>
                        <div className="absolute inset-0 grid place-items-center">
                            <p className="text-6xl font-mono text-slate-900 select-none">
                                {formatTime(seconds)}
                            </p>
                        </div>
                    </div>

                    {/* controls */}
                    <div className="mt-6 flex items-center gap-2">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setRunning((r) => !r)}
                            className="rounded-xl bg-slate-900 text-white px-5 py-2 hover:bg-slate-800 transition"
                        >
                            {running ? t.pomodoro.pause : t.pomodoro.start}
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setRunning(false); setSeconds(duration); }}
                            className="rounded-xl border border-slate-300 px-5 py-2 hover:bg-slate-100 transition"
                        >
                            {t.pomodoro.reset}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* right side */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                {/* tips */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">{t.pomodoro.tipsTitle}</h3>
                    <ul className="space-y-2 text-slate-600">
                        {t.pomodoro.tips.map((tip, i) => (
                            <li key={i}>• {tip}</li>
                        ))}
                    </ul>
                    <p className="mt-4 text-sm text-slate-500">
                        {t.pomodoro.cycles} <strong>{cycleCount}</strong>
                    </p>
                </div>

                {/* mini calendar */}
                <div className="border-t pt-4">
                    <h4 className="font-medium text-slate-700 mb-2">
                        📅 {t.calendar.title} —{" "}
                        <span className="text-slate-500 text-sm">
              {today.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
                  month: "long",
                  day: "numeric",
              })}
            </span>
                    </h4>

                    {/* Add today's task */}
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder={
                                lang === "zh"
                                    ? "添加今日日程"
                                    : "Add tasks for today"
                            }
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                        />
                        <button
                            onClick={addTodayTask}
                            className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800 transition"
                        >
                            {lang === "zh" ? "添加" : "Add"}
                        </button>
                    </div>

                    {/* fixed height + conditional overflow at >= 4 */}
                    <div
                        className={`h-28 pr-1 scrollbar-smooth ${
                            todayEvents.length >= 4 ? "overflow-y-auto" : "overflow-y-hidden"
                        }`}
                    >
                        {todayEvents.length === 0 ? (
                            <p className="text-slate-400 text-sm">{t.calendar.noEvents}</p>
                        ) : (
                            <ul className="space-y-1 text-sm text-slate-700">
                                {todayEvents.map((e) => (
                                    <li
                                        key={e.id}
                                        onClick={() => toggleDone(e.id)}
                                        className={`rounded-lg px-3 py-1 cursor-pointer select-none transition ${
                                            e.done
                                                ? "bg-slate-100 text-slate-400 line-through"
                                                : "bg-slate-100 hover:bg-slate-200"
                                        }`}
                                        title={e.title}
                                    >
                                        • {e.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
