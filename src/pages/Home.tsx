import { useState, useEffect, useMemo, useRef } from "preact/hooks";
import { route, type RoutableProps } from "preact-router";
import AddonModal from "../components/AddonModal.tsx";
import Dropdown from "../components/Dropdown.tsx";
import Reverse from "../components/icons/Reverse";
import type { FunctionalComponent } from "preact";
import AddonCard from "../components/AddonCard";
import loadAddons from "../helpers/addonLoader";
import type Addon from "../helpers/addon";
import {
  useSearchSuggestions,
  type SearchSuggestion,
} from "../hooks/useSearchSuggestions";
import SearchSuggestions from "../components/SearchSuggestions";
import { setJsonLd, removeJsonLd } from "../helpers/jsonLd.ts";
import useMeta from "../hooks/useMeta.ts";
import Button from "../components/Button";
import { sortVersionsDescending } from "../helpers/sortVersions";
import {
  filterAddons,
  getActivePrefix,
  getFilteredAddons,
  type FilterOptions,
  type FilterState,
} from "../helpers/filterAddons";
import {
  SortMode,
  sortModeToString,
  sortAddons,
} from "../helpers/sortAddons.ts";

type HomeProps = RoutableProps & { owner?: string; name?: string };

const Home: FunctionalComponent<HomeProps> = (props) => {
  const routeOwner = props.owner;
  const routeName = props.name;
  const [addons, setAddons] = useState<Addon[]>([]);
  const [totalAddons, setTotalAddons] = useState<number>(0);
  const [allVersions, setAllVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentViewedAddon, setCurrentViewedAddon] = useState<Addon | null>(
    null,
  );
  const [notFound, setNotFound] = useState<boolean>(false);

  // filters
  const initialSearch =
    new URLSearchParams(window.location.search).get("q") ?? "";
  const [searchValue, setSearchValue] = useState<string>(initialSearch);
  const [featureSearch, setFeatureSearch] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const [includeForks, setIncludeForks] = useState<boolean>(false);
  const [onlyWithReleases, setOnlyWithReleases] = useState<boolean>(true);
  const [selectedVersion, setSelectedVersion] = useState<string>("All");

  // Sorting
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.Stars);

  useEffect(() => {
    if (routeOwner && routeName) {
      const match = addons.find(
        (a) => a.repo.owner === routeOwner && a.repo.name === routeName,
      );
      if (match) {
        setCurrentViewedAddon(match);
        setNotFound(false);
      } else if (addons.length > 0) {
        setCurrentViewedAddon(null);
        setNotFound(true);
      }
    } else {
      setCurrentViewedAddon(null);
      setNotFound(false);
    }
  }, [routeOwner, routeName, addons]);

  useEffect(() => {
    if (currentViewedAddon || notFound) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [currentViewedAddon, notFound]);

  const currentAddonUrl = currentViewedAddon
    ? `https://meteoraddons.com/addon/${currentViewedAddon.repo.owner}/${currentViewedAddon.repo.name}`
    : undefined;

  useMeta({
    title: currentViewedAddon
      ? `${currentViewedAddon.name} — Meteor Addon List`
      : "Meteor Addons",
    description: currentViewedAddon
      ? currentViewedAddon.custom.description || currentViewedAddon.description
      : undefined,
    url: currentAddonUrl,
    ogTitle: currentViewedAddon?.name,
  });

  useEffect(() => {
    if (currentViewedAddon) {
      setJsonLd("addon-schema", {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: currentViewedAddon.name,
        url: currentAddonUrl,
        description:
          currentViewedAddon.custom.description ||
          currentViewedAddon.description,
        author: {
          "@type": "Organization",
          name: currentViewedAddon.repo.owner,
          url: `https://github.com/${currentViewedAddon.repo.owner}`,
        },
        codeRepository: `https://github.com/${currentViewedAddon.repo.owner}/${currentViewedAddon.repo.name}`,
        applicationCategory: "GameApplication",
        operatingSystem: "Minecraft (Java Edition)",
        dateModified: currentViewedAddon.repo.last_update,
      });
    } else {
      removeJsonLd("addon-schema");
    }
  }, [currentViewedAddon]);

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

      const params = new URLSearchParams(window.location.search);
      const addonParam = params.get("addon");
      if (addonParam) {
        const [owner, repo] = addonParam.split("/");
        if (owner && repo) {
          route(`/addon/${owner}/${repo}`, true);
        }
      }

      setJsonLd("home-addons", {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Meteor Client Addons",
        itemListElement: addons.slice(0, 30).map((a: Addon, i: number) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareApplication",
            name: a.name,
            url: `https://meteoraddons.com/addon/${a.repo.owner}/${a.repo.name}`,
            description: a.custom.description || a.description,
            author: { "@type": "Organization", name: a.repo.owner },
          },
        })),
      });
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

  const baseFilterState = useMemo(
    (): FilterState => ({
      verifiedOnly,
      includeForks,
      includeArchived,
      onlyWithReleases,
      selectedVersion,
    }),
    [
      verifiedOnly,
      includeForks,
      includeArchived,
      onlyWithReleases,
      selectedVersion,
    ],
  );

  const filteredAddons = useMemo(
    () => getFilteredAddons(addons, baseFilterState),
    [addons, baseFilterState],
  );

  const suggestions = useSearchSuggestions(
    filteredAddons,
    searchValue,
    featureSearch,
  );

  useEffect(() => {
    const prefix = getActivePrefix(searchValue);
    setFeatureSearch(prefix !== null);
  }, [searchValue]);

  useEffect(() => {
    const handleScroll = () => {
      if (showSuggestions) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSuggestions]);

  const visibleAddons = useMemo(() => {
    return filterAddons(addons, filterOptions);
  }, [addons, filterOptions]);

  function searchAddons(event: Event) {
    const target = event.target as HTMLInputElement;
    setSearchValue(target.value);
    setShowSuggestions(true);
    setSelectedSuggestionIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (selectedSuggestionIndex >= 0) {
        handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      searchInputRef.current?.blur();
    }
  }

  function handleSuggestionSelect(suggestion: SearchSuggestion) {
    setSelectedSuggestionIndex(-1);
    if (suggestion.type === "hint") {
      setSearchValue(suggestion.value);
      setFeatureSearch(true);
    } else if (suggestion.type === "feature") {
      setSearchValue(suggestion.value);
      setFeatureSearch(true);
    } else {
      setSearchValue(suggestion.value);
      setFeatureSearch(false);
    }
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  }

  function handleSearchFocus() {
    setShowSuggestions(true);
  }

  function handleSearchBlur() {
    setTimeout(() => setShowSuggestions(false), 150);
  }

  function handleSortChange(mode: SortMode) {
    if (sortMode === mode) return;
    setSortMode(mode);
    setAddons(sortAddons(addons, mode));
  }

  function reverseAddonList() {
    const reversedAddons = [...addons].reverse();
    setAddons(reversedAddons);
  }

  function closeAddonModal() {
    route("/", true);
  }

  return (
    <>
      <main class="flex flex-col gap-2 items-center px-5 grow">
        <section class="flex gap-2 w-11/12 max-sm:w-full">
          <div class="relative flex-1">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search addons, authors, tags — or: hud: module: command: feature:"
              onInput={searchAddons}
              onKeyDown={handleKeyDown}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              value={searchValue}
              class="bg-slate-950/50 p-2 rounded border border-purple-300/20 hover:border-purple-300/50 focus:border-purple-300/80 transition-all duration-300 ease-in-out w-full outline-none!"
            />
            {showSuggestions && suggestions.length > 0 && (
              <SearchSuggestions
                suggestions={suggestions}
                selectedIndex={selectedSuggestionIndex}
                onSelect={handleSuggestionSelect}
              />
            )}
          </div>
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
            onSelect={handleSortChange}
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
              class={`w-5 h-5 rounded cursor-pointer border border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out ${verifiedOnly ? "bg-purple-400/80" : "bg-slate-950/50"}`}
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
              />
            ))}
          </section>
        )}
      </main>
      <AddonModal
        addon={currentViewedAddon}
        notFound={notFound}
        featureSearch={featureSearch}
        searchValue={searchValue}
        closeAddonModal={closeAddonModal}
      />
    </>
  );
};

export default Home;
