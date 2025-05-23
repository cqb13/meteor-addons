import DownloadCount from "./DownloadCount.tsx";
import Fork from "./icons/Fork.tsx";
import Warning from "./icons/Warning.tsx";
import Verified from "./icons/Verified.tsx";
import Archived from "./icons/Archived.tsx";
import type Addon from "../helpers/addon";
import StarCount from "./StarCount";

export default function AddonCard({
  addon,
  rank,
}: {
  addon: Addon;
  rank: number;
}) {
  function formatAuthors(authors: string[]) {
    if (authors.length === 0) return "";
    else if (authors.length === 1) return `By ${authors[0]}`;
    else if (authors.length === 2) return `By ${authors[0]} and ${authors[1]}`;
    else
      return `By ${authors.slice(0, -1).join(", ")} and ${authors[authors.length - 1]}`;
  }

  return (
    <div class="w-1/4 max-xl:w-5/12 max-md:w-3/4 max-sm:w-full h-80 border border-purple-300/20 rounded p-2 bg-slate-950/50 text-slate-400 flex flex-col justify-between relative">
      <div>
        <p class="absolute top-1 right-1 text-xs text-slate-400/20 select-none">
          {rank + 1}
        </p>
        <div class="flex gap-1 items-center">
          {addon.icon ? (
            <img
              src={addon.icon}
              alt="icon"
              class="w-16 h-16 rounded select-none"
            />
          ) : (
            <img
              src="https://raw.githubusercontent.com/MeteorDevelopment/meteor-addon-template/refs/heads/master/src/main/resources/assets/template/icon.png"
              alt="icon"
              class="w-16 h-16 rounded select-none"
            />
          )}
          <div class="flex flex-col justify-center">
            <p class="font-bold text-lg">{addon.name}</p>
            {addon.authors.length > 0 && (
              <p class="whitespace-nowrap overflow-hidden text-ellipsis w-72">
                {formatAuthors(addon.authors)}
              </p>
            )}
            {addon.mcVersion && <p>For {addon.mcVersion}</p>}
          </div>
        </div>
        <p class="overflow-hidden text-ellipsis line-clamp-3">
          {addon.summary}
        </p>
      </div>
      <div class="flex flex-col">
        <div class="flex justify-between">
          <div class="flex gap-2">
            {addon.stars > 0 && <StarCount starCount={addon.stars} />}
            {addon.downloads > 0 && (
              <DownloadCount downloadCount={addon.downloads} />
            )}
          </div>
          <div class="flex gap-2">
            {addon.verified && <Verified style="h-5 w-5" />}
            {!addon.verified && false && <Warning style="h-5 w-5" />}
            {addon.repo.archived && <Archived style="w-5 h-5" />}
            {addon.repo.fork && <Fork style="w-5 h-5" />}
          </div>
        </div>
        <button></button>
      </div>
    </div>
  );
}
