import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "@/router/routes";
import RequireAuth from "@/router/RequireAuth";
import GlobalAlert from "@/components/layout/GlobalAlert";
import { AdminShell } from "@/components/layout/admin-shell";

function App() {
  return (
    <>
      <GlobalAlert />
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
                <RequireAuth>
                  <AdminShell>
                    <Component />
                  </AdminShell>
                </RequireAuth>
              }
            />
          );
        }

        return (
          <Route key={route.path} path={route.path} element={<Component />} />
        );
      })}
    </Routes>
  );
}

export default App;
