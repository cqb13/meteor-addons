import { useState, useEffect } from "preact/hooks";
import loadAddons from "./helpers/addonLoader";
import type Addon from "./helpers/addon";
import AddonCard from "./components/AddonCard";

enum SortMode {
  Stars,
  Downloads,
}

//TODO: get current meteor version from their website and current meteor dev build version from website, add options to filter to only those
export function App() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [visibleAddons, setVisibleAddons] = useState<Addon[]>([]);
  const [totalAddons, setTotalAddons] = useState<number>(0);

  // filters
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Sorting
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.Stars);

  useEffect(() => {
    (async () => {
      let addons = await loadAddons();
      addons.sort((a: Addon, b: Addon) => b.stars - a.stars);
      setTotalAddons(addons.length);
      setAddons(addons);
    })();
  }, []);

  useEffect(() => {
    updateVisibleAddons();
  }, [addons, verifiedOnly]);

  function updateVisibleAddons() {
    let visible: Addon[] = [];

    addons.forEach((addon: Addon) => {
      if ((verifiedOnly && addon.verified) || !verifiedOnly) {
        visible.push(addon);
      }
    });
    setVisibleAddons(visible);
  }

  function sortAddonsByStars() {
    if (sortMode == SortMode.Stars) return;
    setSortMode(SortMode.Stars);
    const sortedAddons = [...addons].sort(
      (a: Addon, b: Addon) => b.stars - a.stars,
    );
    setAddons(sortedAddons);
  }

  function sortAddonsByDownloads() {
    if (sortMode == SortMode.Downloads) return;
    setSortMode(SortMode.Downloads);
    const sortedAddons = [...addons].sort(
      (a: Addon, b: Addon) => b.downloads - a.downloads,
    );
    setAddons(sortedAddons);
  }

  function reverseAddonList() {
    const reversedAddons = [...addons].reverse();
    setAddons(reversedAddons);
  }

  return (
    <>
      <header></header>
      <main class="flex flex-col gap-2 justify-center items-center p-5">
        <section class="flex justify-between w-11/12">
          <div class="flex gap-2 w-1/2">
            <button
              onClick={sortAddonsByStars}
              class={`bg-slate-950/50 p-2 rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out w-full ${sortMode == SortMode.Stars ? "border-purple-300/80" : null}`}
            >
              Sort by Stars
            </button>
            <button
              onClick={sortAddonsByDownloads}
              class={`bg-slate-950/50 p-2 rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out w-full ${sortMode == SortMode.Downloads ? "border-purple-300/80" : null}`}
            >
              Sort by Downloads
            </button>
            <button
              onClick={reverseAddonList}
              class="flex gap-2 justify-center items-center bg-slate-950/50 p-2 rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out w-1/2"
            >
              <svg
                width="800"
                height="800"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 fill-purple-400"
              >
                <path d="M6.293 4.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L8 7.414V19a1 1 0 1 1-2 0V7.414L3.707 9.707a1 1 0 0 1-1.414-1.414zM16 16.586V5a1 1 0 1 1 2 0v11.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414z" />
              </svg>
              <p class="whitespace-nowrap">Reverse List</p>
            </button>
          </div>
        </section>
        <section class="flex justify-between w-11/12">
          <div class="flex gap-1 justify-center items-center select-none">
            <div
              class={`border rounded w-5 h-5 cursor-pointer hover:bg-purple-400 transition-all duration-300 ease-in-out active:bg-purple-400/50 ${verifiedOnly ? "bg-purple-500" : null}`}
              onClick={() => setVerifiedOnly(!verifiedOnly)}
            />
            <p>Verified Only</p>
          </div>
          <div>
            <p>
              {visibleAddons.length}/{totalAddons}
            </p>
          </div>
        </section>
        <section class="flex gap-2 flex-wrap justify-center items-center">
          {visibleAddons?.map((addon: Addon, key: number) => (
            <AddonCard addon={addon} key={key} />
          ))}
        </section>
      </main>
      <footer></footer>
    </>
  );
}
