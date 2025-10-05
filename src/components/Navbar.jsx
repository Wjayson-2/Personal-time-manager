import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "../context/LanguageContext.jsx";

export default function Navbar() {
    const { t, toggleLang } = useLang();
    const linkBase = "relative px-3 py-2 text-slate-700 hover:text-slate-900 transition-colors";
    const active = "font-semibold text-slate-900";

    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
                <motion.span initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-semibold tracking-tight">
                    {t.siteName}
                </motion.span>
                <div className="flex items-center gap-3">
                    <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`} end>
                        {t.nav.home}
                    </NavLink>
                    <NavLink to="/pomodoro" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        {t.nav.pomodoro}
                    </NavLink>
                    <NavLink to="/calendar" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
                        {t.nav.calendar}
                    </NavLink>
                    <button
                        onClick={toggleLang}
                        className="ml-2 px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-100 transition"
                        aria-label="Toggle language"
                    >
                        {t.nav.langToggle}
                    </button>
                </div>
            </nav>
        </header>
    );
}
