import getDaysSinceUpdatedAddons from "./helpers/getDaysSinceUpdate.ts";
import getCurrentMeteorVersion from "./helpers/getCurrentMeteorVersion";
import SortModeDropdown from "./components/SortModeDropdown.tsx";
import AddonModal from "./components/AddonModal.tsx";
import { useState, useEffect } from "preact/hooks";
import loadAddons from "./helpers/addonLoader";
import AddonCard from "./components/AddonCard";
import Button from "./components/Button";
import type Addon from "./helpers/addon";
export enum SortMode {
  Stars,
  Downloads,
  Features,
  Age,
  LastUpdate,
  McVersion,
}

export function sortModeToString(sortMode: SortMode): string {
  switch (sortMode) {
    case SortMode.Stars:
      return "Stars";
    case SortMode.Downloads:
      return "Downloads";
    case SortMode.Features:
      return "Features";
    case SortMode.Age:
      return "Age";
    case SortMode.LastUpdate:
      return "Last Update";
    case SortMode.McVersion:
      return "Minecraft Version";
  }
}

export function App() {
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [visibleAddons, setVisibleAddons] = useState<Addon[]>([]);
  const [totalAddons, setTotalAddons] = useState<number>(0);
  const [currentMeteorVersion, setCurrentMeteorVersion] = useState<
    string | null
  >(null);

  // filters
  const [searchValue, setSearchValue] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const [includeForks, setIncludeForks] = useState<boolean>(false);
  const [onlyWithReleases, setOnlyWithReleases] = useState<boolean>(true);
  const [onlyCurrentMeteorVersion, setOnlyCurrentMeteorVersion] =
    useState<boolean>(false);

  // Sorting
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.Stars);
  const [addonModal, setAddonModal] = useState<boolean>(false);
  const [currentViewedAddon, setCurrentViewedAddon] = useState<Addon | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      let addons = await loadAddons();
      const meteorVersion = await getCurrentMeteorVersion();
      if (meteorVersion == null) {
        setOnlyCurrentMeteorVersion(false);
      }
      setCurrentMeteorVersion(meteorVersion);
      addons.sort((a: Addon, b: Addon) => b.repo.stars - a.repo.stars);
      setTotalAddons(addons.length);
      setAddons(addons);

      let daysSince = await getDaysSinceUpdatedAddons();
      setLastUpdate(daysSince);
    })();
  }, []);

  useEffect(() => {
    updateVisibleAddons();
  }, [
    addons,
    verifiedOnly,
    searchValue,
    includeForks,
    includeArchived,
    onlyWithReleases,
    onlyCurrentMeteorVersion,
  ]);

  function updateVisibleAddons() {
    let visible: Addon[] = [];

    addons.forEach((addon: Addon) => {
      if (
        ((verifiedOnly && addon.verified) || !verifiedOnly) &&
        ((!includeForks && !addon.repo.fork) || includeForks) &&
        ((!includeArchived && !addon.repo.archived) || includeArchived) &&
        ((onlyWithReleases && addon.links.download != "") ||
          !onlyWithReleases) &&
        ((onlyCurrentMeteorVersion &&
          addon.mc_version == currentMeteorVersion) ||
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

  function sortAddons(mode: SortMode) {
    switch (mode) {
      case SortMode.Stars:
        sortAddonsByStars();
        break;
      case SortMode.Downloads:
        sortAddonsByDownloads();
        break;
      case SortMode.Features:
        sortAddonsByFeatures();
        break;
      case SortMode.Age:
        sortAddonsByAge();
        break;
      case SortMode.LastUpdate:
        sortAddonsByLastUpdate();
        break;
      case SortMode.McVersion:
        sortAddonsByMinecraftVersion();
        break;
    }
  }

  function sortAddonsByStars() {
    if (sortMode == SortMode.Stars) return;
    setSortMode(SortMode.Stars);
    const sortedAddons = [...addons].sort(
      (a: Addon, b: Addon) => b.repo.stars - a.repo.stars,
    );
    setAddons(sortedAddons);
  }

  function sortAddonsByDownloads() {
    if (sortMode == SortMode.Downloads) return;
    setSortMode(SortMode.Downloads);
    const sortedAddons = [...addons].sort(
      (a: Addon, b: Addon) => b.repo.downloads - a.repo.downloads,
    );
    setAddons(sortedAddons);
  }

  function sortAddonsByFeatures() {
    if (sortMode == SortMode.Features) return;
    setSortMode(SortMode.Features);
    const sortedAddons = [...addons].sort(
      (a: Addon, b: Addon) => b.feature_count - a.feature_count,
    );
    setAddons(sortedAddons);
  }

  function sortAddonsByAge() {
    if (sortMode == SortMode.Age) return;
    setSortMode(SortMode.Age);
    const sortedAddons = [...addons].sort(
      (a: Addon, b: Addon) =>
        new Date(a.repo.creation_date).getTime() -
        new Date(b.repo.creation_date).getTime(),
    );
    setAddons(sortedAddons);
  }

  function sortAddonsByLastUpdate() {
    if (sortMode == SortMode.LastUpdate) return;
    setSortMode(SortMode.LastUpdate);
    const sortedAddons = [...addons].sort(
      (a: Addon, b: Addon) =>
        new Date(a.repo.last_update).getTime() -
        new Date(b.repo.last_update).getTime(),
    );
    setAddons(sortedAddons);
  }

  function sortAddonsByMinecraftVersion() {
    if (sortMode == SortMode.McVersion) return;
    setSortMode(SortMode.McVersion);
    const sortedAddons = [...addons].sort((a: Addon, b: Addon) => {
      // Empty strings go last
      if (!a) return 1;
      if (!b) return -1;

      const aParts = a.mc_version.split(".").map(Number);
      const bParts = b.mc_version.split(".").map(Number);

      // Compare parts one by one
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aNum = aParts[i] ?? 0;
        const bNum = bParts[i] ?? 0;
        if (aNum !== bNum) return bNum - aNum;
      }

      return 0;
    });
    setAddons(sortedAddons);
  }

  function reverseAddonList() {
    const reversedAddons = [...addons].reverse();
    setAddons(reversedAddons);
  }

  function openAddonModal(addon: Addon) {
    disableScrolling();
    setCurrentViewedAddon(addon);
    setAddonModal(true);
  }

  function closeAddonModal() {
    enableScrolling();
    setAddonModal(false);
    setCurrentViewedAddon(null);
  }

  function disableScrolling() {
    document.body.style.overflow = "hidden";
  }

  function enableScrolling() {
    document.body.style.overflow = "unset";
  }

  return (
    <>
      <div class="fixed top-5 right-5">
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
      </div>
      <header class="p-5 text-7xl font-bold">
        <h1 class="text-center">Meteor Addons</h1>
        <p class="text-center text-sm text-slate-400">
          A list of free and open-source Meteor Client addons
        </p>
        {lastUpdate && (
          <p class="text-center text-xs text-slate-400">{lastUpdate}</p>
        )}
      </header>
      <main class="flex flex-col gap-2 items-center px-5 flex-grow">
        <section class="w-11/12 max-sm:w-full">
          <input
            type="text"
            placeholder="search here..."
            onInput={searchAddons}
            value={searchValue}
            class="bg-slate-950/50 p-2 rounded border border-purple-300/20 hover:border-purple-300/50 focus:border-purple-300/80 transition-all duration-300 ease-in-out w-full !outline-none"
          />
        </section>
        <section class="flex gap-2 w-11/12 max-md:flex-wrap max-sm:w-full">
          <Button
            text="Include Forks"
            action={() => setIncludeForks(!includeForks)}
            active={includeForks}
          />
          <Button
            text="Include Archived"
            action={() => setIncludeArchived(!includeArchived)}
            active={includeArchived}
          />
          <Button
            text="Only With Releases"
            action={() => setOnlyWithReleases(!onlyWithReleases)}
            active={onlyWithReleases}
          />
          {currentMeteorVersion && (
            <Button
              text={`Only For ${currentMeteorVersion}`}
              action={() =>
                setOnlyCurrentMeteorVersion(!onlyCurrentMeteorVersion)
              }
              active={onlyCurrentMeteorVersion}
            />
          )}
        </section>
        <section class="flex gap-2 w-11/12 max-sm:w-full">
          <SortModeDropdown
            selectedMode={sortMode}
            items={[
              SortMode.Stars,
              SortMode.Downloads,
              SortMode.Features,
              SortMode.Age,
              SortMode.LastUpdate,
              SortMode.McVersion,
            ]}
            updateMode={(mode: SortMode) => sortAddons(mode)}
          />
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
              class={`w-5 h-5 rounded cursor-pounter border border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out cursor-pointer ${verifiedOnly ? "bg-purple-400/80" : "bg-slate-950/50"}`}
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
        <section class="flex gap-2 flex-wrap justify-center items-center w-full">
          {visibleAddons?.map((addon: Addon, key: number) => (
            <AddonCard
              addon={addon}
              key={key}
              rank={key}
              openAddonModal={openAddonModal}
            />
          ))}
        </section>
      </main>
      <footer class="text-sm p-4 w-full flex justify-between">
        <a
          href="https://github.com/cqb13/meteor-addons/blob/main/LICENSE"
          class="hover:text-purple-400 transition-all duration-300 ease-in-out"
          target="_blank"
        >
          copyright © 2025
        </a>
        <a
          href="https://github.com/cqb13"
          class="hover:text-purple-400 transition-all duration-300 ease-in-out"
          target="_blank"
        >
          Created by: cqb13
        </a>
      </footer>
      {addonModal && (
        <AddonModal
          addon={currentViewedAddon}
          closeAddonModal={closeAddonModal}
        />
      )}
    </>
  );
}
