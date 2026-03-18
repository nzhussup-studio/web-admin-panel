import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "@/router/routes";
import ProtectedRoute from "@/router/ProtectedRoute";
import GlobalAlert from "@/components/layout/GlobalAlert";
import FloatingEmojis from "@/components/layout/FloatingEmojis";
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
  return (
    <Routes>
      {routes.map((route) => {
        const Component = route.component;

        if (route.isProtected) {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute>
                  <Component />
                </ProtectedRoute>
              }
            />
          );
        }

        return <Route key={route.path} path={route.path} element={<Component />} />;
      })}
    </Routes>
  );
}

export default App;
