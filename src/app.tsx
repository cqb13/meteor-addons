import Router from "preact-router";
import Home from "./pages/Home.tsx";

export function App() {
  return (
    <Router>
      <Home path="/" />
    </Router>
  );
}
