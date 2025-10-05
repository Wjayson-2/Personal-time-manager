import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Pomodoro from "./components/Pomodoro.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import { useLang } from "./context/LanguageContext.jsx";

export default function App() {
    const location = useLocation();
    const { t } = useLang();

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
                    </Routes>
                </motion.main>
            </AnimatePresence>
            <footer className="mt-16 py-8 text-center text-sm text-slate-500">
                {t.footer} By Jayson WANG
            </footer>
        </div>
    );
}
