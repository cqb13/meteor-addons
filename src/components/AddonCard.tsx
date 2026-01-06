import pickVersion from "../helpers/pickVersion.ts";
import formatList from "../helpers/formatList.ts";
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
        <div class="flex gap-2 items-center">
          <img
            src={
              addon.custom.icon ||
              addon.links.icon ||
              "/default-addon-icon.webp"
            }
            alt="icon"
            class="w-16 h-16 rounded select-none"
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (
                img.src !== `${window.location.origin}/default-addon-icon.webp`
              ) {
                img.src = "/default-addon-icon.webp";
              }
            }}
          />
          <div class="leading-tight flex-1 min-w-0">
            <p class="font-bold text-lg">{addon.name}</p>
            {addon.authors.length > 0 && (
              <p class="whitespace-nowrap overflow-hidden text-ellipsis">
                By {formatList(addon.authors)}
              </p>
            )}
            {(addon.mc_version != "" ||
              addon.custom.supported_versions != null) && (
              <p class="overflow-hidden text-ellipsis line-clamp-2 wrap-anywhere [word-break:break-word]">
                {pickVersion(addon.mc_version, addon.custom.supported_versions)}
              </p>
            )}
          </div>
        </div>
        {addon.custom.tags && (
          <div class="flex gap-1 flex-wrap text-xs my-1">
            {addon.custom.tags?.map((tag: string, key: number) => (
              <p
                key={key}
                class="text-center rounded bg-slate-950/50 border border-purple-300/20 block min-w-2/12 px-1"
              >
                {tag}
              </p>
            ))}
          </div>
        )}
        <p class="overflow-hidden text-ellipsis line-clamp-5 wrap-anywhere [word-break:break-word]">
          {addon.custom.description || addon.description}
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <div class="flex justify-between">
          <div class="flex gap-2">
            {addon.repo.stars > 0 && (
              <div class="flex gap-1 justify-center items-center select-none">
                <Star style="w-3 h-3" />
                <p class="text-xs">{addon.repo.stars.toLocaleString()}</p>
              </div>
            )}
            {addon.repo.downloads > 0 && (
              <div class="flex gap-1 justify-center items-center select-none">
                <Download style="w-3 h-3" />
                <p class="text-xs">{addon.repo.downloads.toLocaleString()}</p>
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
        <div class="flex gap-2 items-center justify-between">
          <Button
            text="View More"
            action={() => openAddonModal(addon)}
            active={false}
          />
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
        </div>
      </div>
    </div>
  );
}
