import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/bootstrap-theme.css";
import "@/styles/interactions.css";
import "@/index.css";
import App from "@/app/App";
import { AppProviders } from "@/app/AppProviders";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppProviders>
      <Router>
        <App />
      </Router>
    </AppProviders>
  </StrictMode>
);
