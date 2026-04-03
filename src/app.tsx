import getDaysSinceUpdatedAddons from "./helpers/getDaysSinceUpdate.ts";
import Discord from "./components/icons/Discord.tsx";
import Github from "./components/icons/Github.tsx";
import { useState, useEffect } from "preact/hooks";
import NavLink from "./components/NavLink.tsx";
import KoFi from "./components/icons/KoFi.tsx";
import About from "./pages/About.tsx";
import Home from "./pages/Home.tsx";
import Router from "preact-router";

export function App() {
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    getDaysSinceUpdatedAddons().then((daysSince: any) => {
      setLastUpdate(daysSince);
    });
  }, []);

  return (
    <section>
      <nav class="flex gap-2 justify-between items-center sticky top-0 w-full p-2 bg-slate-900/80 backdrop-blur-3xl z-50 border-b border-b-purple-300/10">
        <section class="flex gap-2">
          <NavLink name="Addons" path="/" />
          <NavLink name="About" path="/about" />
        </section>
        <section class="flex gap-2">
          <a href="https://ko-fi.com/cqb13" target="_blank">
            <KoFi style="w-7 h-7" />
          </a>
          <a href="https://github.com/cqb13/meteor-addons" target="_blank">
            <Github style="w-7 h-7" />
          </a>
          <a href="https://discord.gg/XU7Y9G46KD" target="_blank">
            <Discord style="w-7 h-7" />
          </a>
        </section>
      </nav>
      <header class="p-5 font-bold">
        <h1 class="text-center text-7xl max-sm:text-5xl">Meteor Addons</h1>
        <p class="text-center text-sm text-slate-400">
          A list of free and open-source Meteor Client addons
        </p>
        {lastUpdate && (
          <p class="text-center text-xs text-slate-400">{lastUpdate}</p>
        )}
      </header>
      <Router>
        <Home path="/" />
        <About path="/about" />
      </Router>
      <footer class="text-sm p-4 w-full flex justify-between">
        <a
          href="https://github.com/cqb13/meteor-addons/blob/main/LICENSE"
          class="hover:text-purple-400 transition-all duration-300 ease-in-out"
          target="_blank"
        >
          copyright © 2026
        </a>
        <a
          href="https://github.com/cqb13"
          class="hover:text-purple-400 transition-all duration-300 ease-in-out"
          target="_blank"
        >
          Created by: cqb13
        </a>
      </footer>
    </section>
  );
}
