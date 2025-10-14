import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "../context/LanguageContext.jsx";

export default function Lectures() {
    const { lang, t } = useLang();

    // Fallbacks so we don't need to edit config.js
    const title = t?.lectures?.title ?? (lang === "zh" ? "讲座" : "Lectures");
    // Keeping your exact English text; Chinese fallback provided without config change
    const unavailable =
        t?.lectures?.unavailable ??
        (lang === "zh"
            ? "此功能目前正在维护与升级中，请稍后再试。"
            : "This feature is currently under maintenance and upgrade. Please check back later.");
    const backHome = t?.lectures?.backHome ?? (lang === "zh" ? "返回首页" : "Back to Home");

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <motion.h1
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-semibold mb-3"
            >
                {title}
            </motion.h1>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
                <p className="text-slate-700">{unavailable}</p>
            </motion.div>

            <div className="mt-4">
                <Link
                    to="/"
                    className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 transition"
                >
                    ← {backHome}
                </Link>
            </div>
        </section>
    );
}
