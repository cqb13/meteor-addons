import type { SearchSuggestion } from "../hooks/useSearchSuggestions";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  selectedIndex: number;
  onSelect: (suggestion: SearchSuggestion) => void;
}

export default function SearchSuggestions({
  suggestions,
  selectedIndex,
  onSelect,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  const groups: Record<string, SearchSuggestion[]> = {};
  suggestions.forEach((s) => {
    const key = s.type;
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });

  const typeLabels: Record<string, string> = {
    addon: "ADDONS",
    author: "AUTHORS",
    tag: "TAGS",
    hint: "HINTS",
    feature: "FEATURES",
  };

  let currentIndex = -1;

  return (
    <div className="absolute z-50 w-full mt-1 rounded backdrop-blur-2xl bg-slate-950/95 border border-purple-300/20 max-h-80 overflow-y-auto custom-scrollbar left-0">
      {Object.entries(groups).map(([type, items]) => (
        <div key={type} className="py-1">
          <p className="px-3 py-1 text-xs font-bold text-purple-300/70 uppercase tracking-wider">
            {typeLabels[type] || type}
          </p>
          {items.map((suggestion) => {
            currentIndex++;
            const isSelected = currentIndex === selectedIndex;

            const displayLabel = suggestion.prefix ? (
              <span>
                <span>{suggestion.label}</span>
              </span>
            ) : suggestion.type === "hint" ? (
              <span className="font-mono text-purple-300">
                {suggestion.label}
              </span>
            ) : (
              <span>{suggestion.label}</span>
            );

            return (
              <button
                type="button"
                key={`${suggestion.type}-${suggestion.value}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(suggestion);
                }}
                className={`block w-full px-3 py-2 text-left cursor-pointer transition-all duration-150 text-slate-300 text-sm ${
                  isSelected
                    ? "bg-purple-300/30 text-purple-200"
                    : "hover:bg-purple-300/10"
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
