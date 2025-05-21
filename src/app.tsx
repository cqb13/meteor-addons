import { useState, useEffect } from "preact/hooks";
import loadAddons from "./helpers/addonLoader";
import type Addon from "./helpers/addon";
import AddonCard from "./components/AddonCard";

//TODO: get current meteor version from their website and current meteor dev build version from website, add options to filter to only those
export function App() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [visibleAddons, setVisibleAddons] = useState<Addon[]>([]);
  const [totalAddons, setTotalAddons] = useState<number>(0);

  // filters
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const addons = await loadAddons();
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

  return (
    <>
      <header></header>
      <main class="flex flex-col gap-2 justify-center items-center p-5">
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
