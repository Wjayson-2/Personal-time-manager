import { useEffect, useMemo, useState } from "react";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    parseISO,
    startOfMonth,
    startOfWeek,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "../context/LanguageContext.jsx";

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

export default function Calendar() {
    const { lang, t } = useLang();
    const today = new Date();

        const [month, setMonth] = useState(startOfMonth(today));
    const [events, setEvents] = useLocalEvents();
    const [quickTitle, setQuickTitle] = useState("");
    const [quickDate, setQuickDate] = useState(format(today, "yyyy-MM-dd"));

    const gridDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
        const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
        return eachDayOfInterval({ start, end });
    }, [month]);

    const monthLabel =
        lang === "zh"
            ? `${format(month, "yyyy")}年${format(month, "M")}月`
            : format(month, "MMMM yyyy");

    // Add new event
    const addQuickEvent = () => {
        if (!quickTitle.trim()) return;
        setEvents((prev) => [
            ...prev,
            { id: crypto.randomUUID(), title: quickTitle.trim(), date: quickDate, done: false },
        ]);
        setQuickTitle("");
    };

    const eventsForDay = (d) => events.filter((e) => isSameDay(parseISO(e.date), d));

    // Toggle strike-through
    const toggleDone = (id) => {
        setEvents((prev) =>
            prev.map((e) => (e.id === id ? { ...e, done: !e.done } : e))
        );
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMonth((m) => addMonths(m, -1))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100"
                    >
                        {t.calendar.prev}
                    </button>
                    <button
                        onClick={() => setMonth((m) => addMonths(m, 1))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100"
                    >
                        {t.calendar.next}
                    </button>
                    <h2 className="text-xl font-semibold ml-1">{monthLabel}</h2>
                    <button
                        onClick={() => setMonth(startOfMonth(new Date()))}
                        className="ml-2 text-sm rounded-lg border border-slate-300 px-2 py-1 hover:bg-slate-100"
                    >
                        {t.calendar.today}
                    </button>
                </div>

                {/* Quick add */}
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        type="date"
                        value={quickDate}
                        onChange={(e) => setQuickDate(e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                    <input
                        type="text"
                        value={quickTitle}
                        onChange={(e) => setQuickTitle(e.target.value)}
                        placeholder={t.calendar.addPlaceholder}
                        className="w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                    <button
                        onClick={addQuickEvent}
                        className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800 transition"
                    >
                        {t.calendar.add}
                    </button>
                </div>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500">
                {t.calendar.weekdays.map((d) => (
                    <div key={d} className="py-2">
                        {d}
                    </div>
                ))}
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-7 gap-1">
                {gridDays.map((d) => {
                    const isCurrentMonth = isSameMonth(d, month);
                    const dayEvents = eventsForDay(d);
                    return (
                        <div
                            key={d.toISOString()}
                            className={`min-h-[96px] rounded-xl border p-2 text-sm transition ${
                                isCurrentMonth
                                    ? "bg-white border-slate-200"
                                    : "bg-slate-50 border-slate-200 text-slate-400"
                            } hover:bg-slate-50`}
                        >
                            <div className="flex items-center justify-between">
                <span
                    className={`text-xs ${
                        isSameDay(d, new Date())
                            ? "px-2 py-0.5 bg-slate-900 text-white rounded-full"
                            : "text-slate-500"
                    }`}
                >
                  {format(d, "d")}
                </span>
                            </div>

                            {/* Fixed height + conditional overflow at >= 4 */}
                            <div
                                className={`mt-2 h-24 pr-1 scrollbar-smooth ${
                                    dayEvents.length >= 4 ? "overflow-y-auto" : "overflow-y-hidden"
                                }`}
                            >
                                <ul className="space-y-1">
                                    <AnimatePresence initial={false}>
                                        {dayEvents.length === 0 && (
                                            <span className="text-slate-300 text-xs">
                        {t.calendar.noEvents}
                      </span>
                                        )}
                                        {dayEvents.map((e) => (
                                            <motion.li
                                                key={e.id}
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 4 }}
                                                onClick={() => toggleDone(e.id)}
                                                className={`truncate rounded-md px-2 py-1 cursor-pointer select-none transition ${
                                                    e.done
                                                        ? "bg-slate-100 text-slate-400 line-through"
                                                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                                }`}
                                                title={e.title}
                                            >
                                                • {e.title}
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
