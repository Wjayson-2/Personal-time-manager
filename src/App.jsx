import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Pomodoro from "./components/Pomodoro.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import Lectures from "./pages/Lectures.jsx";
import { useLang } from "./context/LanguageContext.jsx";

export default function App() {
    const location = useLocation();
    const { t, lang } = useLang();
    const footerText = t?.footer ?? (lang === "zh" ? "为平静与专注而生 · 轻盈与简约" : "Built for calm focus · Light & minimal");

    return (
        <div className="min-h-screen bg-white text-slate-800 transition-colors duration-300">
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mx-auto max-w-6xl px-4 sm:px-6 py-8"
                >
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/pomodoro" element={<Pomodoro />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/lectures" element={<Lectures />} />
                    </Routes>
                </motion.main>
            </AnimatePresence>
            <footer className="mt-16 py-8 text-center text-sm text-slate-500">
                {footerText} © 2023
            </footer>
        </div>
    );
}
