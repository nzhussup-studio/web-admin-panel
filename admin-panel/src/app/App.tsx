import React from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import routes from "@/router/routes";
import ProtectedRoute from "@/router/ProtectedRoute";
import GlobalAlert from "@/components/layout/GlobalAlert";
import FloatingEmojis from "@/components/layout/FloatingEmojis";
import PageTransition from "@/motion/PageTransition";
import "@/app/App.css";

function App() {
  return (
    <>
      <GlobalAlert />
      <FloatingEmojis />
      <MainApp />
    </>
  );
}

function MainApp() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        {routes.map((route) => {
          const Component = route.component;

          if (route.isProtected) {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Component />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
            );
          }

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PageTransition>
                  <Component />
                </PageTransition>
              }
            />
          );
        })}
      </Routes>
    </AnimatePresence>
  );
}

export default App;
