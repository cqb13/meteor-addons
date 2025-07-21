"use client";

import { useState } from "react";

export default function VersionFilterDropdown({
  items: versions,
  selectedVersion,
  updateVersion: updateVersion,
}: {
  items: string[];
  selectedVersion: string;
  updateVersion: (version: string) => void;
}) {
  const [opened, setOpened] = useState(false);

  const toggle = () => setOpened(!opened);

  return (
    <div className="relative inline-block w-full text-left text-gray-300">
      <div>
        <button
          type="button"
          className="bg-slate-950/50 inline-flex justify-center items-center w-full p-2 cursor-pointer rounded border border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 text-purple-300 transition-all duration-300 ease-in-out"
          onClick={toggle}
        >
          {`For ${selectedVersion}`}
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
      </div>
      <div
        className={`${
          opened ? " absolute" : "hidden"
        } mt-2 w-full rounded max-h-96 overflow-y-scroll backdrop-blur-2xl bg-slate-950/50 border border-purple-300/20 z-10`}
      >
        <div className="py-2 flex flex-col items-center">
          {versions.map((version: string, key: number) => (
            <button
              key={key}
              onClick={() => {
                setOpened(false);
                updateVersion(version);
              }}
              className="block p-2 w-11/12 cursor-pointer hover:bg-purple-300/10 rounded transition-all duration-300 ease-in-out"
            >
              {version}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
