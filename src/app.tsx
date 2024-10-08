import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { Toaster } from "./components/ui/toast";

export default function App() {
  return (
    <Router
      base={import.meta.env.SERVER_BASE_URL}
      root={props => (
        <>
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />

      <Toaster />
    </Router>
  );
}
