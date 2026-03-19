import React from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import routes from "@/router/routes";
import RequireAuth from "@/router/RequireAuth";
import GlobalAlert from "@/components/layout/GlobalAlert";
import PageTransition from "@/motion/PageTransition";

function App() {
  return (
    <>
      <GlobalAlert />
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
                  <RequireAuth>
                    <PageTransition>
                      <Component />
                    </PageTransition>
                  </RequireAuth>
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
