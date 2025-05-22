import getCurrentMeteorVersion from "./helpers/getCurrentMeteorVersion";
import { useState, useEffect } from "preact/hooks";
import loadAddons from "./helpers/addonLoader";
import AddonCard from "./components/AddonCard";
import type Addon from "./helpers/addon";

enum SortMode {
  Stars,
  Downloads,
}

//TODO: get current meteor version from their website and current meteor dev build version from website, add options to filter to only those
export function App() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [visibleAddons, setVisibleAddons] = useState<Addon[]>([]);
  const [totalAddons, setTotalAddons] = useState<number>(0);
  const [currentMeteorVersion, setCurrentMeteorVersion] = useState<
    string | null
  >(null);

  // filters
  const [searchValue, setSearchValue] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const [includeForks, setIncludeForks] = useState<boolean>(false);
  const [onlyCurrentMeteorVersion, setOnlyCurrentMeteorVersion] =
    useState<boolean>(true);

  // Sorting
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.Stars);

  useEffect(() => {
    (async () => {
      let addons = await loadAddons();
      const meteorVersion = await getCurrentMeteorVersion();
      if (meteorVersion == null) {
        setOnlyCurrentMeteorVersion(false);
      }
      setCurrentMeteorVersion(meteorVersion);
      addons.sort((a: Addon, b: Addon) => b.stars - a.stars);
      setTotalAddons(addons.length);
      setAddons(addons);
    })();
  }, []);

  useEffect(() => {
    updateVisibleAddons();
  }, [addons, verifiedOnly, searchValue, onlyCurrentMeteorVersion]);

  function updateVisibleAddons() {
    let visible: Addon[] = [];

    addons.forEach((addon: Addon) => {
      if (
        ((verifiedOnly && addon.verified) || !verifiedOnly) &&
        ((onlyCurrentMeteorVersion &&
          addon.mcVersion == currentMeteorVersion) ||
          !onlyCurrentMeteorVersion) &&
        (addon.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          addon.authors.some((author) =>
            author.toLowerCase().includes(searchValue.toLowerCase()),
          ) ||
          addon.repo.owner.toLowerCase().includes(searchValue.toLowerCase()))
      ) {
        visible.push(addon);
      }
    });
    setVisibleAddons(visible);
  }

  function searchAddons(event: any) {
    setSearchValue(event.target.value);
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
        <section class="w-11/12 max-sm:w-full">
          <input
            type="text"
            placeholder="search here..."
            onInput={searchAddons}
            value={searchValue}
            class="bg-slate-950/50 p-2 rounded border border-purple-300/20 hover:border-purple-300/50 focus:border-purple-300/80 transition-all duration-300 ease-in-out w-full !outline-none"
          />
        </section>
        <section class="flex gap-2 w-11/12">
          {currentMeteorVersion && (
            <button
              onClick={() =>
                setOnlyCurrentMeteorVersion(!onlyCurrentMeteorVersion)
              }
              class={`bg-slate-950/50 p-2 rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out w-full ${onlyCurrentMeteorVersion ? "border-purple-300/80" : null}`}
            >
              Only Current Meteor Version
            </button>
          )}
        </section>
        <section class="flex gap-2 w-11/12 max-sm:w-full max-[32rem]:flex-col max-[32rem]:text-sm">
          <div class="flex gap-2 w-1/2 max-md:w-3/4 max-[32rem]:w-full">
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
          </div>
          <button
            onClick={reverseAddonList}
            class="flex gap-2 justify-center items-center bg-slate-950/50 p-2 rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out"
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
        </section>
        <section class="flex justify-between w-11/12 max-sm:w-full">
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
