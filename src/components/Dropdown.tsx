"use client";

import { useState, useRef, useEffect } from "react";

type DropdownProps<T> = {
  label: string;
  items: T[];
  selected: T;
  onSelect: (value: T) => void;
  renderItem?: (item: T) => String;
  className?: string;
};

export default function Dropdown<T>({
  label,
  items,
  selected,
  onSelect,
  renderItem,
  className = "",
}: DropdownProps<T>) {
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
      className={`relative inline-block text-left text-gray-300 ${className}`}
    >
      <button
        type="button"
        onClick={toggle}
        className="bg-slate-950/50 inline-flex justify-center items-center w-full p-2 cursor-pointer rounded border border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 text-purple-300 transition-all duration-300 ease-in-out"
      >
        <span>{label}</span>
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
        </svg>
      </button>

      <div
        className={`${
          opened ? "absolute" : "hidden"
        } mt-2 w-full rounded backdrop-blur-2xl bg-slate-950/50 border border-purple-300/20 z-10 max-h-96 overflow-y-auto custom-scrollbar`}
      >
        <div className="py-2 flex flex-col items-center">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                onSelect(item);
                setOpened(false);
              }}
              className={`block p-2 w-11/12 cursor-pointer hover:bg-purple-300/10 rounded transition-all duration-300 ease-in-out ${
                item === selected ? "bg-purple-300/10" : ""
              }`}
            >
              {renderItem ? renderItem(item) : String(item)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
