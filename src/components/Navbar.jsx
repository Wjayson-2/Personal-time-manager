import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "../context/LanguageContext.jsx";

export default function Navbar() {
    const { t, toggleLang, lang } = useLang();
    const linkBase =
        "relative px-3 py-2 text-slate-700 hover:text-slate-900 transition-colors";
    const active = "font-semibold text-slate-900";

    // Fallbacks so we don't need to edit config.js
    const labelHome = t?.nav?.home ?? (lang === "zh" ? "首页" : "Home");
    const labelPomodoro = t?.nav?.pomodoro ?? (lang === "zh" ? "番茄钟" : "Pomodoro");
    const labelCalendar = t?.nav?.calendar ?? (lang === "zh" ? "日历" : "Calendar");
    const labelLectures = t?.nav?.lectures ?? (lang === "zh" ? "讲座" : "Lectures");
    const labelLangToggle = t?.nav?.langToggle ?? (lang === "zh" ? "EN" : "中文");
    const siteName = t?.siteName ?? (lang === "zh" ? "心流时间" : "Mindful Hub");

    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
                <motion.span
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-semibold tracking-tight"
                >
                    {siteName}
                </motion.span>
                <div className="flex items-center gap-3">
                    <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`} end>
                        {labelHome}
                    </NavLink>
                    <NavLink to="/pomodoro" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        {labelPomodoro}
                    </NavLink>
                    <NavLink to="/calendar" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        {labelCalendar}
                    </NavLink>
                    <NavLink to="/lectures" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        {labelLectures}
                    </NavLink>
                    <button
                        onClick={toggleLang}
                        className="ml-2 px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-100 transition"
                        aria-label="Toggle language"
                    >
                        {labelLangToggle}
                    </button>
                </div>
            </nav>
        </header>
    );
}
