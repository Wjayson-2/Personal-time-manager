import Calendar from "../components/Calendar.jsx";
import { useLang } from "../context/LanguageContext.jsx";

export default function CalendarPage() {
    const { t } = useLang();
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{t.calendar.title}</h2>
            <Calendar />
        </section>
    );
}
