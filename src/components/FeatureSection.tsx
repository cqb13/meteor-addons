import type { Feature, Features } from "../helpers/addon";

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
    <section className="w-full flex flex-col gap-3 mt-4">
      <h3 className="text-purple-300 font-bold text-xl">Features</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Modules Column */}
        {features.modules && features.modules.length > 0 && (
          <div className="flex flex-col border border-purple-300/20 rounded bg-slate-950/30 p-3">
            <h4 className="font-bold text-purple-300 mb-2 flex-none">
              Modules ({features.modules.length})
            </h4>
            <div className="overflow-y-auto custom-scrollbar max-h-48 lg:max-h-96">
              <ul className="flex flex-col list-disc pl-6 gap-1 text-sm pr-2">
                {features.modules.map((feature: Feature, key: number) => (
                  <li
                    key={key}
                    className={`${featureSearch == true && feature.name.toLowerCase().includes(actualSearch.toLowerCase()) && actualSearch != "" && !(forHud || forCommand) ? "bg-purple-300/10 rounded px-1" : ""}`}
                  >
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Commands Column */}
        {features.commands && features.commands.length > 0 && (
          <div className="flex flex-col border border-purple-300/20 rounded bg-slate-950/30 p-3">
            <h4 className="font-bold text-purple-300 mb-2 flex-none">
              Commands ({features.commands.length})
            </h4>
            <div className="overflow-y-auto custom-scrollbar max-h-48 lg:max-h-96">
              <ul className="flex flex-col list-disc pl-6 gap-1 text-sm pr-2">
                {features.commands.map((feature: Feature, key: number) => (
                  <li
                    key={key}
                    className={`${featureSearch == true && feature.name.toLowerCase().includes(actualSearch.toLowerCase()) && actualSearch != "" && !(forHud || forModule) ? "bg-purple-300/10 rounded px-1" : ""}`}
                  >
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* HUD Elements Column */}
        {features.hud_elements && features.hud_elements.length > 0 && (
          <div className="flex flex-col border border-purple-300/20 rounded bg-slate-950/30 p-3">
            <h4 className="font-bold text-purple-300 mb-2 flex-none">
              HUD Elements ({features.hud_elements.length})
            </h4>
            <div className="overflow-y-auto custom-scrollbar max-h-48 lg:max-h-96">
              <ul className="flex flex-col list-disc pl-6 gap-1 text-sm pr-2">
                {features.hud_elements.map((feature: Feature, key: number) => (
                  <li
                    key={key}
                    className={`${featureSearch == true && feature.name.toLowerCase().includes(actualSearch.toLowerCase()) && actualSearch != "" && !(forCommand || forModule) ? "bg-purple-300/10 rounded px-1" : ""}`}
                  >
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
