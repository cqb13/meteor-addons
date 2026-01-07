import type { Feature, Features } from "../helpers/addon";
import { useState } from "preact/hooks";

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
  const [open, setOpen] = useState<string | null>(null);

  let actualSearch = searchValue;

  if (forHud) {
    actualSearch = searchValue.slice(4);
  } else if (forModule) {
    actualSearch = searchValue.slice(7);
  } else if (forCommand) {
    actualSearch = searchValue.slice(8);
  }

  return (
    <section className="w-full flex flex-col gap-2 mt-4">
      <h3 className="text-purple-300 font-bold text-xl">Features</h3>
      <div className="w-full flex flex-col gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {features.modules && features.modules.length > 0 && (
            <>
              <FeatureColumn
                name="Modules"
                features={features.modules}
                featureSearch={featureSearch}
                actualSearch={actualSearch}
                forColumn={!(forHud || forCommand)}
                setOpen={setOpen}
                open={open}
              />
            </>
          )}

          {features.commands && features.commands.length > 0 && (
            <>
              <FeatureColumn
                name="Commands"
                features={features.commands}
                featureSearch={featureSearch}
                actualSearch={actualSearch}
                forColumn={!(forHud || forModule)}
                setOpen={setOpen}
                open={open}
              />
            </>
          )}

          {features.hud_elements && features.hud_elements.length > 0 && (
            <>
              <FeatureColumn
                name="HUD Elements"
                features={features.hud_elements}
                featureSearch={featureSearch}
                actualSearch={actualSearch}
                forColumn={!(forCommand || forModule)}
                setOpen={setOpen}
                open={open}
              />
            </>
          )}
        </div>
        <div className="flex gap-2 w-full">
          {features.tabs && features.tabs.length > 0 && (
            <>
              <StringFeatureColumn name="Tabs" features={features.tabs} />
            </>
          )}
          {features.themes && features.themes.length > 0 && (
            <>
              <StringFeatureColumn name="Themes" features={features.themes} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function StringFeatureColumn({
  name,
  features,
}: {
  name: string;
  features: string[];
}) {
  return (
    <div className="flex flex-col border border-purple-300/20 rounded bg-slate-950/30 p-3 w-full">
      <h4 className="font-bold text-purple-300 mb-2 flex-none">
        {name} ({features.length})
      </h4>
      <div className="overflow-y-auto custom-scrollbar max-h-48 lg:max-h-96">
        <ul className="flex flex-col list-disc pl-6 gap-1 text-sm pr-2">
          {features.map((feature: string, key: number) => (
            <li key={key}>
              <p className="font-medium">{feature}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FeatureColumn({
  name,
  features,
  featureSearch,
  actualSearch,
  forColumn,
  setOpen,
  open,
}: {
  name: string;
  features: Feature[];
  featureSearch: boolean;
  actualSearch: String;
  forColumn: boolean;
  setOpen: (value: string | null) => void;
  open: string | null;
}) {
  return (
    <div className="flex flex-col border border-purple-300/20 rounded bg-slate-950/30 p-3">
      <h4 className="font-bold text-purple-300 mb-2 flex-none">
        {name} ({features.length})
      </h4>
      <div className="overflow-y-auto custom-scrollbar max-h-48 lg:max-h-96">
        <ul className="flex flex-col list-disc pl-6 gap-1 text-sm pr-2">
          {features.map((feature: Feature, key: number) => (
            <li
              key={key}
              className={`${featureSearch == true && feature.name.toLowerCase().includes(actualSearch.toLowerCase()) && actualSearch != "" && forColumn ? "bg-purple-300/10 rounded px-1" : ""} cursor-pointer`}
              onClick={() =>
                setOpen(open === feature.name ? null : feature.name)
              }
            >
              <p className="font-medium">{feature.name}</p>

              {open === feature.name && feature.description && (
                <p className="mt-1 text-xs text-gray-400">
                  {feature.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
