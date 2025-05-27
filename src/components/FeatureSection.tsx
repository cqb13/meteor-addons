import { useState } from "react";

export default function FeatureSection({ features }: { features: string[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = features.length > 50;

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-purple-300 font-bold text-xl">Features</h3>
        {isLong && (
          <button onClick={toggleExpanded} className="text-purple-300">
            <svg
              className={`w-5 h-5 cursor-pointer transform transition-transform duration-300 ease-in-out ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isExpanded ? (
                <line x1="5" y1="12" x2="19" y2="12" />
              ) : (
                <>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
      {features.length > 0 && (
        <ul
          className={`flex flex-col list-disc pl-10 gap-0 text-sm transition-all duration-300 overflow-hidden ${
            isLong && !isExpanded ? "max-h-64 overflow-y-hidden" : "max-h-full"
          }`}
        >
          {features.map((feature: string, key: number) => (
            <li className="flex-1" key={key}>
              {feature}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
