import type { Features } from "../helpers/addon";

export default function FeatureSection({
  features,
  featureSearch,
  searchValue,
}: {
  features: Features;
  featureSearch: boolean;
  searchValue: String;
}) {
  const forHud = searchValue.toLowerCase().startsWith("hud:");
  const forModule = searchValue.toLowerCase().startsWith("module:");
  const forCommand = searchValue.toLowerCase().startsWith("command:");

  let actualSearch = searchValue;

  if (forHud) {
    actualSearch = searchValue.slice(4);
  } else if (forModule) {
    actualSearch = searchValue.slice(7);
  } else if (forCommand) {
    actualSearch = searchValue.slice(8);
  }

  return (
    <section className="w-full flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-purple-300 font-bold text-xl">Features</h3>
      </div>

      <div className="overflow-y-auto max-h-[60vh] pr-2 max-sm:max-h-[50vh]">
        {features.modules && (
          <div>
            <h4 className="font-bold text-purple-300">
              Modules ({features.modules.length})
            </h4>
            <ul className="flex flex-col list-disc pl-10 gap-0 text-sm">
              {features.modules.map((feature: string, key: number) => (
                <li
                  key={key}
                  className={`${featureSearch == true && feature.toLowerCase().includes(actualSearch.toLowerCase()) && actualSearch != "" && !(forHud || forCommand) ? "bg-purple-300/10" : ""}`}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        {features.commands && (
          <div>
            <h4 className="font-bold text-purple-300">
              Commands ({features.commands.length})
            </h4>
            <ul className="flex flex-col list-disc pl-10 gap-0 text-sm">
              {features.commands.map((feature: string, key: number) => (
                <li
                  key={key}
                  className={`${featureSearch == true && feature.toLowerCase().includes(actualSearch.toLowerCase()) && actualSearch != "" && !(forHud || forModule) ? "bg-purple-300/10" : ""}`}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        {features.hud_elements && (
          <div>
            <h4 className="font-bold text-purple-300">
              HUD Elements ({features.hud_elements.length})
            </h4>
            <ul className="flex flex-col list-disc pl-10 gap-0 text-sm">
              {features.hud_elements.map((feature: string, key: number) => (
                <li
                  key={key}
                  className={`${featureSearch == true && feature.toLowerCase().includes(actualSearch.toLowerCase()) && actualSearch != "" && !(forCommand || forModule) ? "bg-purple-300/10" : ""}`}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
