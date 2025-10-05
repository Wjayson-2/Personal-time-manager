import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../languages/config.js";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // ✅ Default to Chinese unless saved language exists
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem("lang:v1");
        if (saved) return saved; // if user selected before
        const browserLang = navigator.language?.toLowerCase() || "en";
        // default Chinese if browser is zh or first visit
        return browserLang.startsWith("zh") ? "zh" : "zh";
    });

    // store and update <html lang="">
    useEffect(() => {
        localStorage.setItem("lang:v1", lang);
        document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    }, [lang]);

    const t = useMemo(() => translations[lang], [lang]);
    const toggleLang = () => setLang((prev) => (prev === "en" ? "zh" : "en"));

    return (
        <LanguageContext.Provider value={{ lang, t, setLang, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    return useContext(LanguageContext);
}
