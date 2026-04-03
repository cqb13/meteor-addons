import { filterAddons, type FilterOptions } from "../helpers/filterAddons";
import { useState, useEffect, useMemo } from "preact/hooks";
import AddonModal from "../components/AddonModal.tsx";
import type { RoutableProps } from "preact-router";
import Reverse from "../components/icons/Reverse";
import type { FunctionalComponent } from "preact";
import Dropdown from "../components/Dropdown.tsx";
import AddonCard from "../components/AddonCard";
import loadAddons from "../helpers/addonLoader";
import type Addon from "../helpers/addon";
import Button from "../components/Button";
import {
  parseVersion,
  compareParsedVersions,
  sortVersionsDescending,
} from "../helpers/sortVersions";

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

const Home: FunctionalComponent<RoutableProps> = () => {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [totalAddons, setTotalAddons] = useState<number>(0);
  const [allVersions, setAllVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [searchValue, setSearchValue] = useState<string>("");
  const [featureSearch, setFeatureSearch] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const [includeForks, setIncludeForks] = useState<boolean>(false);
  const [onlyWithReleases, setOnlyWithReleases] = useState<boolean>(true);
  const [selectedVersion, setSelectedVersion] = useState<string>("All");

  // Sorting
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.Stars);
  const [currentViewedAddon, setCurrentViewedAddon] = useState<Addon | null>(
    null,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addonParam = params.get("addon");
    if (addonParam && addons.length > 0) {
      const [owner, repo] = addonParam.split("/");
      const match = addons.find(
        (a) => a.repo.owner === owner && a.repo.name === repo,
      );
      if (match) {
        openAddonModal(match);
      }
    }
  }, [addons]);

  useEffect(() => {
    (async () => {
      let addons = await loadAddons();
      addons.sort((a: Addon, b: Addon) => b.repo.stars - a.repo.stars);

      let versions: string[] = [];

      addons.forEach((addon: Addon) => {
        if (addon.mc_version == "") {
          return;
        }

        if (versions.includes(addon.mc_version)) {
          return;
        }

        versions.push(addon.mc_version);

        if (addon.custom.supported_versions) {
          addon.custom.supported_versions.forEach((version: string) => {
            if (versions.includes(version)) {
              return;
            }

            versions.push(version);
          });
        }
      });

      let sortedVersions = sortVersionsDescending(versions);

      sortedVersions.unshift("All");

      setAllVersions(sortedVersions);

      setTotalAddons(addons.length);
      setAddons(addons);
      setIsLoading(false);
    })().catch((err) => {
      setError(err.message || "Failed to load addons");
      setIsLoading(false);
    });
  }, []);

  const filterOptions = useMemo(
    (): FilterOptions => ({
      verifiedOnly,
      includeForks,
      includeArchived,
      onlyWithReleases,
      selectedVersion,
      searchValue,
      featureSearch,
    }),
    [
      verifiedOnly,
      includeForks,
      includeArchived,
      onlyWithReleases,
      selectedVersion,
      searchValue,
      featureSearch,
    ],
  );

  const visibleAddons = useMemo(() => {
    return filterAddons(addons, filterOptions);
  }, [addons, filterOptions]);

  function searchAddons(event: Event) {
    const target = event.target as HTMLInputElement;
    setSearchValue(target.value);
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
      (a: Addon, b: Addon) =>
        b.features.feature_count - a.features.feature_count,
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
    if (sortMode === SortMode.McVersion) return;
    setSortMode(SortMode.McVersion);

    const getVersions = (addon: Addon): string[] => {
      const sv = addon.custom?.supported_versions;
      if (sv && sv.length > 0) return sv;
      return addon.mc_version ? [addon.mc_version] : [];
    };

    const getBestVersion = (addon: Addon): number[] => {
      const parsed = getVersions(addon).map(parseVersion);
      parsed.sort((a, b) => compareParsedVersions(b, a));
      return parsed[0] ?? [];
    };

    const sorted = [...addons].sort((a, b) =>
      compareParsedVersions(getBestVersion(b), getBestVersion(a)),
    );

    setAddons(sorted);
  }

  function reverseAddonList() {
    const reversedAddons = [...addons].reverse();
    setAddons(reversedAddons);
  }

  function openAddonModal(addon: Addon) {
    disableScrolling();
    setCurrentViewedAddon(addon);
    const url = new URL(window.location.href);
    url.searchParams.set("addon", `${addon.repo.owner}/${addon.repo.name}`);
    window.history.pushState({}, document.title, url);
  }

  function closeAddonModal() {
    enableScrolling();
    setCurrentViewedAddon(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("addon");
    window.history.replaceState({}, document.title, url.pathname + url.search);
  }

  function disableScrolling() {
    document.body.style.overflow = "hidden";
  }

  function enableScrolling() {
    document.body.style.overflow = "unset";
  }

  function toggleFeatureSearch() {
    setSearchValue("");
    setFeatureSearch(!featureSearch);
  }

  return (
    <>
      <main class="flex flex-col gap-2 items-center px-5 grow">
        <section class="flex gap-2 w-11/12 max-sm:w-full relative">
          <input
            type="text"
            placeholder={
              featureSearch
                ? "Search Features — Try hud:, module:, or command:"
                : "Search addons, authors, and tags"
            }
            onInput={searchAddons}
            value={searchValue}
            class="bg-slate-950/50 p-2 rounded border border-purple-300/20 hover:border-purple-300/50 focus:border-purple-300/80 transition-all duration-300 ease-in-out w-full outline-none!"
          />
          <Button
            text={` ${featureSearch ? "Addons" : "Features"}`}
            action={toggleFeatureSearch}
            active={false}
            className="w-1/4!"
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
          <Dropdown
            label={
              selectedVersion === "All"
                ? "All Versions"
                : `For ${selectedVersion}`
            }
            selected={selectedVersion}
            items={allVersions}
            onSelect={(version: string) => setSelectedVersion(version)}
            className="w-full"
          />
        </section>
        <section class="flex gap-2 w-11/12 max-sm:w-full">
          <Dropdown
            label={`Sort By ${sortModeToString(sortMode)}`}
            selected={sortMode}
            items={[
              SortMode.Stars,
              SortMode.Downloads,
              SortMode.Features,
              SortMode.Age,
              SortMode.LastUpdate,
              SortMode.McVersion,
            ]}
            renderItem={(item) => sortModeToString(item)}
            onSelect={(mode: SortMode) => sortAddons(mode)}
            className="w-1/4 max-lg:w-1/2 max-md:w-full"
          />
          <button
            onClick={reverseAddonList}
            class="flex gap-2 justify-center items-center bg-slate-950/50 p-2 rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out"
          >
            <Reverse style="w-5 h-5" />
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
        {isLoading && (
          <div class="flex justify-center items-center py-20">
            <div class="animate-spin w-8 h-8 border-4 border-purple-300 border-t-transparent rounded-full"></div>
          </div>
        )}
        {error && (
          <div class="flex flex-col items-center py-20 text-red-400 w-1/4">
            <p>Failed to load addons</p>
            <p class="text-sm text-slate-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              class="bg-slate-950/50 p-1 mt-2 text-center rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out w-1/2"
            >
              Retry
            </button>
          </div>
        )}
        {!isLoading && !error && visibleAddons.length === 0 && (
          <div class="flex flex-col items-center py-20 text-slate-400">
            <p class="text-lg">No addons found</p>
            <p class="text-sm">Try adjusting your filters or search</p>
          </div>
        )}
        {!isLoading && !error && visibleAddons.length > 0 && (
          <section class="flex gap-2 flex-wrap justify-center items-center w-full">
            {visibleAddons?.map((addon: Addon, key: number) => (
              <AddonCard
                addon={addon}
                key={`${addon.repo.owner}-${addon.repo.name}`}
                rank={key}
                openAddonModal={openAddonModal}
              />
            ))}
          </section>
        )}
      </main>
      <AddonModal
        addon={currentViewedAddon}
        featureSearch={featureSearch}
        searchValue={searchValue}
        closeAddonModal={closeAddonModal}
      />
    </>
  );
};

export default Home;
