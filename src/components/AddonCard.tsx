import type Addon from "../helpers/addon";
import StarCount from "./StarCount";

export default function AddonCard({
  addon,
  key,
}: {
  addon: Addon;
  key: number;
}) {
  function formatAuthors(authors: string[]) {
    if (authors.length === 0) return "";
    else if (authors.length === 1) return `By ${authors[0]}`;
    else if (authors.length === 2) return `By ${authors[0]} and ${authors[1]}`;
    else
      return `By ${authors.slice(0, -1).join(", ")} and ${authors[authors.length - 1]}`;
  }

  return (
    <div
      key={key}
      class="w-96 h-52 block border border-purple-300/20 rounded p-2 bg-slate-950/50 text-slate-400"
    >
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
      <p class="overflow-hidden text-ellipsis line-clamp-3">{addon.summary}</p>
      <div>
        <StarCount starCount={addon.stars} />
      </div>
    </div>
  );
}
