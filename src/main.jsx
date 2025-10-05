import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <LanguageProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </LanguageProvider>
    </React.StrictMode>
);
