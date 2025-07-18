import type { Features } from "../helpers/addon";

export default function FeatureSection({ features }: { features: Features }) {
  return (
    <section className="w-full flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-purple-300 font-bold text-xl">Features</h3>
      </div>

      <div
        className={`flex-1 overflow-scroll max-h-[40rem] transition-all duration-300 ease-in-out `}
      >
        <div className="h-full overflow-y-auto pr-2">
          {features.modules && (
            <div>
              <h4 className="font-bold text-purple-300">
                Modules ({features.modules.length})
              </h4>
              <ul className="flex flex-col list-disc pl-10 gap-0 text-sm">
                {features.modules.map((feature: string, key: number) => (
                  <li key={key}>{feature}</li>
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
                  <li key={key}>{feature}</li>
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
                  <li key={key}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
