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
      <header class="p-5 text-7xl font-bold">
        <h1 class="text-center">Meteor Addons</h1>
        <p class="text-center text-sm text-slate-400">
          A list of free and open-source Meteor Client addons
        </p>
        <p class="text-center text-xs text-slate-400">Updated every Sunday</p>
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
