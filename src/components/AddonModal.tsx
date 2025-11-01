import pickVersion from "../helpers/pickVersion.ts";
import formatList from "../helpers/formatList.ts";
import FeatureSection from "./FeatureSection.tsx";
import Verified from "./icons/Verified.tsx";
import Archived from "./icons/Archived.tsx";
import Download from "./icons/Download.tsx";
import type Addon from "../helpers/addon";
import Warning from "./icons/Warning.tsx";
import LinkButton from "./LinkButton";
import Fork from "./icons/Fork.tsx";
import Star from "./icons/Star.tsx";
import { useEffect } from "react";

export default function AddonModal({
  addon,
  featureSearch,
  searchValue,
  closeAddonModal,
}: {
  addon: Addon | null;
  featureSearch: boolean;
  searchValue: String;
  closeAddonModal: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAddonModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeAddonModal]);

  if (addon == null) {
    return null;
  }

  return (
    <section
      className="bg-slate-950/20 backdrop-blur-lg w-screen h-screen fixed top-0 left-0 flex items-center justify-center z-50"
      onClick={closeAddonModal}
    >
      <div
        className="z-20 bg-slate-900 border border-purple-300/20 rounded w-3/4 h-11/12 flex flex-col justify-between items-center p-5 text-slate-400 max-sm:w-11/12"
        onClick={(e) => e.stopPropagation()}
      >
        <div class="w-full relative">
          <button
            class="absolute top-0.5 right-2 cursor-pointer"
            onClick={closeAddonModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="800"
              height="800"
              viewBox="0 0 100 100"
              class="w-7 h-7 fill-purple-300 hover:fill-purple-400 duration-300 transition-all ease-in-out"
            >
              <path d="M88.447 38.528H11.554a2.024 2.024 0 0 0-2.024 2.024v18.896c0 1.118.907 2.024 2.024 2.024h76.892a2.024 2.024 0 0 0 2.023-2.024V40.552a2.023 2.023 0 0 0-2.022-2.024" />
            </svg>
          </button>
          <section>
            <div class="flex gap-2">
              {addon.custom.icon || addon.links.icon ? (
                <img
                  src={addon.custom.icon || addon.links.icon}
                  alt="icon"
                  class="w-20 h-2k rounded select-none"
                />
              ) : (
                <img
                  src="https://raw.githubusercontent.com/MeteorDevelopment/meteor-addon-template/refs/heads/master/src/main/resources/assets/template/icon.png"
                  alt="icon"
                  class="w-16 h-16 rounded select-none"
                />
              )}
              <div class="leading-tight">
                <h2 className="text-2xl font-bold font-purple-300">
                  {addon.name}
                </h2>
                {addon.authors.length != 0 && (
                  <p class="whitespace-nowrap overflow-hidden text-ellipsis w-72">
                    By {formatList(addon.authors)}
                  </p>
                )}
                {(addon.mc_version != "" ||
                  addon.custom.supported_versions != null) && (
                  <p>
                    {pickVersion(
                      addon.mc_version,
                      addon.custom.supported_versions,
                    )}
                  </p>
                )}
              </div>
            </div>
            <div class="flex justify-between items-center py-2">
              <div class="flex gap-2">
                {addon.repo.stars > 0 && (
                  <div class="flex gap-1 justify-center items-center select-none">
                    <Star style="w-5 h-5" />
                    <p>{addon.repo.stars}</p>
                  </div>
                )}
                {addon.repo.downloads > 0 && (
                  <div class="flex gap-1 justify-center items-center select-none">
                    <Download style="w-5 h-5" />
                    <p>{addon.repo.downloads}</p>
                  </div>
                )}
              </div>
              <div class="flex gap-2">
                {addon.verified && <Verified style="h-7 w-7" />}
                {!addon.verified && false && <Warning style="h-7 w-7" />}
                {addon.repo.archived && <Archived style="w-7 h-7" />}
                {addon.repo.fork && <Fork style="w-7 h-7" />}
              </div>
            </div>
            <p class="text-wrap break-words [word-break:break-word]">
              {addon.custom.description || addon.description}
            </p>
          </section>
          {addon.features && (
            <FeatureSection
              features={addon.features}
              featureSearch={featureSearch}
              searchValue={searchValue}
            />
          )}
        </div>
        <section class="flex items-center justify-center gap-2 w-1/2 max-md:w-3/4 max-sm:w-full pt-2">
          {addon.links.download != "" && (
            <LinkButton destination={addon.links.download} text="Download" />
          )}
          {addon.links.github != "" && (
            <a href={addon.links.github} target="_blank">
              <svg
                width="800"
                height="800"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 fill-purple-300 hover:fill-purple-400 duration-300 transition-all ease-in-out"
              >
                <path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65 3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247" />
              </svg>
            </a>
          )}
          {(addon.custom.discord || addon.links.discord) && (
            <a
              href={addon.custom.discord || addon.links.discord}
              target="_blank"
            >
              <svg
                width="800"
                height="800"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 fill-purple-300 hover:fill-purple-400 duration-300 transition-all ease-in-out"
              >
                <path d="M20.992 20.163a2.884 2.884 0 0 1-2.695-3.03v.007a2.867 2.867 0 0 1 2.687-3.023h.008a2.85 2.85 0 0 1 2.695 3.031v-.008a2.86 2.86 0 0 1-2.688 3.022h-.008zm-9.966 0a2.884 2.884 0 0 1-2.695-3.03v.007a2.867 2.867 0 0 1 2.687-3.023h.008a2.85 2.85 0 0 1 2.695 3.031v-.008q.005.074.005.161a2.867 2.867 0 0 1-2.692 2.862zM26.393 6.465c-1.763-.832-3.811-1.49-5.955-1.871l-.149-.022-.017-.002a.09.09 0 0 0-.081.047c-.234.411-.488.924-.717 1.45l-.043.111a23 23 0 0 0-6.985.016l.129-.017c-.27-.63-.528-1.142-.813-1.638l.041.077a.1.1 0 0 0-.083-.047l-.016.001h.001a24.6 24.6 0 0 0-6.256 1.957l.151-.064a.1.1 0 0 0-.04.034C2.706 10.538.998 15.566.998 20.993q0 1.36.141 2.684l-.009-.11a.1.1 0 0 0 .039.07 24.6 24.6 0 0 0 7.313 3.738l.176.048a.1.1 0 0 0 .028.004q.05-.002.077-.038a17.5 17.5 0 0 0 1.485-2.392l.047-.1a.096.096 0 0 0-.052-.132h-.001a16 16 0 0 1-2.417-1.157l.077.042a.1.1 0 0 1-.048-.083c0-.031.015-.059.038-.076.157-.118.315-.24.465-.364a.1.1 0 0 1 .097-.013h-.001c2.208 1.061 4.8 1.681 7.536 1.681s5.329-.62 7.643-1.727l-.107.046a.1.1 0 0 1 .099.012q.226.188.466.365a.1.1 0 0 1 .038.077.1.1 0 0 1-.046.082c-.661.395-1.432.769-2.235 1.078l-.105.036a.1.1 0 0 0-.062.089q0 .024.011.044v-.001c.501.96 1.009 1.775 1.571 2.548l-.04-.057a.1.1 0 0 0 .106.036h-.001c2.865-.892 5.358-2.182 7.566-3.832l-.065.047a.1.1 0 0 0 .039-.069c.087-.784.136-1.694.136-2.615 0-5.415-1.712-10.43-4.623-14.534l.052.078a.1.1 0 0 0-.038-.036z" />
              </svg>
            </a>
          )}
          {(addon.custom.homepage || addon.links.homepage) && (
            <a
              href={addon.custom.homepage || addon.links.homepage}
              target="_blank"
            >
              <svg
                width="800"
                height="800"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 fill-purple-300 hover:fill-purple-400 duration-300 transition-all ease-in-out"
              >
                <path d="m10 17.55-1.77 1.72a2.47 2.47 0 0 1-3.5-3.5l4.54-4.55a2.46 2.46 0 0 1 3.39-.09l.12.1a1 1 0 0 0 1.4-1.43 3 3 0 0 0-.18-.21 4.46 4.46 0 0 0-6.09.22l-4.6 4.55a4.48 4.48 0 0 0 6.33 6.33L11.37 19A1 1 0 0 0 10 17.55M20.69 3.31a4.49 4.49 0 0 0-6.33 0L12.63 5A1 1 0 0 0 14 6.45l1.73-1.72a2.47 2.47 0 0 1 3.5 3.5l-4.54 4.55a2.46 2.46 0 0 1-3.39.09l-.12-.1a1 1 0 0 0-1.4 1.43 3 3 0 0 0 .23.21 4.47 4.47 0 0 0 6.09-.22l4.55-4.55a4.49 4.49 0 0 0 .04-6.33" />
              </svg>
            </a>
          )}
        </section>
      </div>
    </section>
  );
}
