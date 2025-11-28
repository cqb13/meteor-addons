"use client";

import { useState, useRef, useEffect } from "react";

type TerminalDropdownProps<T> = {
  label: string;
  items: T[];
  selected: T;
  onSelect: (value: T) => void;
  renderItem?: (item: T) => String;
  className?: string;
};

export default function TerminalDropdown<T>({
  label,
  items,
  selected,
  onSelect,
  renderItem,
  className = "",
}: TerminalDropdownProps<T>) {
  const [opened, setOpened] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = () => setOpened((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      {/* Closed state button */}
      <button
        type="button"
        onClick={toggle}
        className="bg-slate-950/50 inline-flex justify-between items-center w-full px-3 py-2 cursor-pointer border-2 border-purple-300/30 hover:border-purple-300/50 active:border-purple-300/80 text-slate-300 transition-all duration-200 ease-in-out relative"
      >
        <span className="text-purple-300 font-mono">{label}</span>
        <span className="text-purple-300 ml-2 font-mono">{opened ? "▼" : "►"}</span>
      </button>

      {/* Dropdown menu */}
      {opened && (
        <div
          className="absolute mt-1 w-full bg-slate-950/95 backdrop-blur-sm border-2 border-purple-300/30 z-10 max-h-80 overflow-y-auto custom-scrollbar"
        >
          <div className="py-1">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelect(item);
                  setOpened(false);
                }}
                className={`
                  block px-3 py-2 w-full text-left cursor-pointer
                  hover:bg-purple-300/10 transition-all duration-150 ease-in-out
                  font-mono text-sm group
                  ${item === selected
                    ? "bg-purple-300/20 text-purple-300"
                    : "text-slate-400"
                  }
                `}
              >
                <span className={`mr-2 transition-opacity duration-150 ${
                  item === selected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-40"
                }`}>►</span>
                {renderItem ? renderItem(item) : String(item)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
