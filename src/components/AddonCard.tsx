import formatAuthors from "../helpers/formatAuthors.ts";
import Download from "./icons/Download.tsx";
import Archived from "./icons/Archived.tsx";
import Verified from "./icons/Verified.tsx";
import Warning from "./icons/Warning.tsx";
import type Addon from "../helpers/addon";
import Fork from "./icons/Fork.tsx";
import Star from "./icons/Star.tsx";
import Button from "./Button.tsx";

export default function AddonCard({
  addon,
  rank,
  openAddonModal,
}: {
  addon: Addon;
  rank: number;
  openAddonModal: (addon: Addon) => void;
}) {
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
          <div class="leading-tight">
            <p class="font-bold text-lg">{addon.name}</p>
            {addon.authors.length > 0 && (
              <p class="whitespace-nowrap overflow-hidden text-ellipsis w-72">
                {formatAuthors(addon.authors)}
              </p>
            )}
            {addon.mcVersion && <p>For {addon.mcVersion}</p>}
          </div>
        </div>

        <p class="overflow-hidden text-ellipsis line-clamp-5 [overflow-wrap:anywhere] [word-break:break-word]">
          {addon.summary}
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <div class="flex justify-between">
          <div class="flex gap-2">
            {addon.stars > 0 && (
              <div class="flex gap-1 justify-center items-center select-none">
                <Star style="w-3 h-3" />
                <p class="text-xs">{addon.stars}</p>
              </div>
            )}
            {addon.downloads > 0 && (
              <div class="flex gap-1 justify-center items-center select-none">
                <Download style="w-3 h-3" />
                <p class="text-xs">{addon.downloads}</p>
              </div>
            )}
          </div>
          <div class="flex gap-2">
            {addon.verified && <Verified style="h-5 w-5" />}
            {!addon.verified && false && <Warning style="h-5 w-5" />}
            {addon.repo.archived && <Archived style="w-5 h-5" />}
            {addon.repo.fork && <Fork style="w-5 h-5" />}
          </div>
        </div>
        <Button
          text="View More"
          action={() => openAddonModal(addon)}
          active={false}
        />
      </div>
    </div>
  );
}
