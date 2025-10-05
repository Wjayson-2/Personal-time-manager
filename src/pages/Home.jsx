import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "../context/LanguageContext.jsx";

export default function Home() {
    const { t } = useLang();

    return (
        <section className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
                <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                           className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                    {t.home.title}
                </motion.h1>
                <p className="text-slate-600 leading-relaxed">{t.home.desc}</p>
                <div className="flex gap-3">
                    <Link to="/pomodoro" className="inline-flex items-center rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800 transition shadow">
                        {t.home.btnPomodoro}
                    </Link>
                    <Link to="/calendar" className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 hover:bg-slate-100 transition">
                        {t.home.btnCalendar}
                    </Link>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                        className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl p-5 border border-slate-200 bg-white">
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{t.nav.pomodoro}</p>
                        <p className="text-4xl font-mono text-slate-900">25:00</p>
                        <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
                            <div className="h-2 w-1/4 rounded-full bg-slate-900" />
                        </div>
                    </div>
                    <div className="rounded-2xl p-5 border border-slate-200 bg-white">
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{t.nav.calendar}</p>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-600">
                            {t.calendar.weekdays.map((d) => (
                                <div key={d} className="py-1 font-semibold">{d}</div>
                            ))}
                            {Array.from({ length: 28 }).map((_, i) => (
                                <div key={i} className="py-2 rounded-md hover:bg-slate-100">{i + 1}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
