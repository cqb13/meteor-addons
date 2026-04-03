import { useImageFallback, DEFAULT_ICON } from "../hooks/useImageFallback.ts";
import pickVersion from "../helpers/pickVersion.ts";
import formatList from "../helpers/formatList.ts";
import FeatureSection from "./FeatureSection.tsx";
import { useEffect, useRef } from "preact/hooks";
import Verified from "./icons/Verified.tsx";
import Download from "./icons/Download.tsx";
import Archived from "./icons/Archived.tsx";
import Homepage from "./icons/Homepage.tsx";
import type Addon from "../helpers/addon";
import Discord from "./icons/Discord.tsx";
import Warning from "./icons/Warning.tsx";
import Github from "./icons/Github.tsx";
import LinkButton from "./LinkButton";
import Close from "./icons/Close.tsx";
import Star from "./icons/Star.tsx";
import Fork from "./icons/Fork.tsx";

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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;
    if (addon && !dialog.open) {
      dialog.showModal();
    } else if (!addon && dialog.open) {
      dialog.close();
    }

    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) closeAddonModal();
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => dialog.removeEventListener("click", handleBackdropClick);
  }, [addon, closeAddonModal]);

  if (addon == null) return null;

  const iconSrc = addon.custom.icon || addon.links.icon || DEFAULT_ICON;
  const { handleError } = useImageFallback(iconSrc);

  return (
    <dialog
      ref={dialogRef}
      className="-translate-x-1/2 -translate-y-1/2 backdrop:backdrop-blur-lg bg-transparent left-1/2 top-1/2 w-3/4"
      onClose={closeAddonModal}
    >
      <section className="bg-slate-900 border border-purple-300/20 flex flex-col h-[88vh] max-h-[88vh] max-md:h-[90vh] max-md:w-11/12 max-sm:h-[90vh] max-sm:w-11/12 overflow-hidden rounded text-slate-400 ">
        <div class="flex-none p-5 pb-0 w-full relative">
          <button
            class="absolute top-5 right-5 cursor-pointer z-10"
            onClick={closeAddonModal}
          >
            <Close style="w-7 h-7" />
          </button>
          <div class="flex gap-2">
            <img
              src={iconSrc}
              alt="icon"
              class="w-20 h-20 rounded select-none"
              onError={handleError}
            />
            <div class="leading-tight flex-1 min-w-0">
              <h2
                className="text-2xl font-bold font-purple-300 focus:outline-none"
                tabindex={-1}
                autoFocus
              >
                {addon.name}
              </h2>
              {addon.authors.length != 0 && (
                <p class="whitespace-nowrap overflow-hidden text-ellipsis">
                  By {formatList(addon.authors)}
                </p>
              )}
              {(addon.mc_version != "" ||
                addon.custom.supported_versions != null) && (
                <p class="overflow-hidden text-ellipsis line-clamp-1">
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
                  <p>{addon.repo.stars.toLocaleString()}</p>
                </div>
              )}
              {addon.repo.downloads > 0 && (
                <div class="flex gap-1 justify-center items-center select-none">
                  <Download style="w-5 h-5" />
                  <p>{addon.repo.downloads.toLocaleString()}</p>
                </div>
              )}
              {addon.repo.forks > 0 && (
                <div class="flex gap-1 justify-center items-center select-none">
                  <Fork style="w-5 h-5" />
                  <p>{addon.repo.forks.toLocaleString()}</p>
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
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar px-5 py-2">
          <p class="text-wrap wrap-break-words [word-break:break-word]">
            {addon.custom.description || addon.description}
          </p>
          <div class="py-2">
            <p class="text-slate-600">
              Last Update:{" "}
              {new Date(addon.repo.last_update).toLocaleDateString()}
            </p>
          </div>
          {addon.features && (
            <FeatureSection
              features={addon.features}
              featureSearch={featureSearch}
              searchValue={searchValue}
            />
          )}
        </div>
        <div class="flex-none flex items-center justify-center gap-2 w-full p-5 pt-3 border-t border-purple-300/10">
          {addon.links.downloads.length > 0 && (
            <div className="flex flex-col w-1/2">
              <LinkButton
                destination={`https://github.com/${addon.repo.owner}/${addon.repo.name}/releases/latest`}
                target="_blank"
                text="Download on Github"
                className="w-full"
              />
              <a
                href={
                  addon.links.latest_release
                    ? addon.links.latest_release
                    : addon.links.downloads[0]
                }
                class="text-purple-300 text-xs font-medium cursor-pointer hover:text-purple-400 transition-all ease-in-out duration-300"
              >
                Download last recorded release
              </a>
            </div>
          )}
          {addon.links.github != "" && (
            <a href={addon.links.github} target="_blank">
              <Github style="w-8 h-8" />
            </a>
          )}
          {(addon.custom.discord || addon.links.discord) && (
            <a
              href={addon.custom.discord || addon.links.discord}
              target="_blank"
            >
              <Discord style="w-8 h-8" />
            </a>
          )}
          {(addon.custom.homepage || addon.links.homepage) && (
            <a
              href={addon.custom.homepage || addon.links.homepage}
              target="_blank"
            >
              <Homepage style="w-8 h-8" />
            </a>
          )}
        </div>
      </section>
    </dialog>
  );
}
