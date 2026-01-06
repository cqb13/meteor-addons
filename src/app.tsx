import getDaysSinceUpdatedAddons from "./helpers/getDaysSinceUpdate.ts";
import { useState, useEffect } from "preact/hooks";
import NavLink from "./components/NavLink.tsx";
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
          <a href="https://github.com/cqb13/meteor-addons" target="_blank">
            <svg
              width="800"
              height="800"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              class="w-7 h-7 fill-purple-300 hover:fill-purple-400 duration-300 transition-all ease-in-out"
            >
              <path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65 3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247" />
            </svg>
          </a>
          <a href="https://discord.gg/XU7Y9G46KD" target="_blank">
            <svg
              width="800"
              height="800"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              class="w-7 h-7 fill-purple-300 hover:fill-purple-400 duration-300 transition-all ease-in-out"
            >
              <path d="M20.992 20.163a2.884 2.884 0 0 1-2.695-3.03v.007a2.867 2.867 0 0 1 2.687-3.023h.008a2.85 2.85 0 0 1 2.695 3.031v-.008a2.86 2.86 0 0 1-2.688 3.022h-.008zm-9.966 0a2.884 2.884 0 0 1-2.695-3.03v.007a2.867 2.867 0 0 1 2.687-3.023h.008a2.85 2.85 0 0 1 2.695 3.031v-.008q.005.074.005.161a2.867 2.867 0 0 1-2.692 2.862zM26.393 6.465c-1.763-.832-3.811-1.49-5.955-1.871l-.149-.022-.017-.002a.09.09 0 0 0-.081.047c-.234.411-.488.924-.717 1.45l-.043.111a23 23 0 0 0-6.985.016l.129-.017c-.27-.63-.528-1.142-.813-1.638l.041.077a.1.1 0 0 0-.083-.047l-.016.001h.001a24.6 24.6 0 0 0-6.256 1.957l.151-.064a.1.1 0 0 0-.04.034C2.706 10.538.998 15.566.998 20.993q0 1.36.141 2.684l-.009-.11a.1.1 0 0 0 .039.07 24.6 24.6 0 0 0 7.313 3.738l.176.048a.1.1 0 0 0 .028.004q.05-.002.077-.038a17.5 17.5 0 0 0 1.485-2.392l.047-.1a.096.096 0 0 0-.052-.132h-.001a16 16 0 0 1-2.417-1.157l.077.042a.1.1 0 0 1-.048-.083c0-.031.015-.059.038-.076.157-.118.315-.24.465-.364a.1.1 0 0 1 .097-.013h-.001c2.208 1.061 4.8 1.681 7.536 1.681s5.329-.62 7.643-1.727l-.107.046a.1.1 0 0 1 .099.012q.226.188.466.365a.1.1 0 0 1 .038.077.1.1 0 0 1-.046.082c-.661.395-1.432.769-2.235 1.078l-.105.036a.1.1 0 0 0-.062.089q0 .024.011.044v-.001c.501.96 1.009 1.775 1.571 2.548l-.04-.057a.1.1 0 0 0 .106.036h-.001c2.865-.892 5.358-2.182 7.566-3.832l-.065.047a.1.1 0 0 0 .039-.069c.087-.784.136-1.694.136-2.615 0-5.415-1.712-10.43-4.623-14.534l.052.078a.1.1 0 0 0-.038-.036z" />
            </svg>
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
