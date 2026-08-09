import { useEffect, useRef } from "preact/hooks";
import AddonDetails from "./AddonDetails.tsx";
import type Addon from "../helpers/addon";
import Close from "./icons/Close.tsx";

export default function AddonModal({
  addon,
  notFound,
  featureSearch,
  searchValue,
  closeAddonModal,
}: {
  addon: Addon | null;
  notFound: boolean;
  featureSearch: boolean;
  searchValue: string;
  closeAddonModal: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const show = Boolean(addon || notFound);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;
    if (show && !dialog.open) {
      dialog.showModal();
    } else if (!show && dialog.open) {
      dialog.close();
    }

    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) closeAddonModal();
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => dialog.removeEventListener("click", handleBackdropClick);
  }, [show, closeAddonModal]);

  if (!show) return null;

  return (
    <dialog
      ref={dialogRef}
      className="-translate-x-1/2 -translate-y-1/2 backdrop:backdrop-blur-lg bg-transparent left-1/2 top-1/2 w-3/4 max-sm:w-full"
      onClose={closeAddonModal}
    >
      <div class="relative">
        <button
          class="absolute top-5 right-5 cursor-pointer z-10"
          onClick={closeAddonModal}
        >
          <Close style="w-7 h-7" />
        </button>
        {addon ? (
          <AddonDetails
            addon={addon}
            featureSearch={featureSearch}
            searchValue={searchValue}
          />
        ) : (
          <div class="bg-slate-900 border border-purple-300/20 rounded p-10 flex flex-col items-center gap-3 text-slate-400">
            <p class="text-lg">Addon not found</p>
            <p class="text-sm">
              It may have been removed, renamed, or you may have followed an
              invalid link.
            </p>
            <a
              href="/"
              onClick={closeAddonModal}
              class="bg-slate-950/50 px-3 py-2 text-center rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out"
            >
              Browse all addons
            </a>
          </div>
        )}
      </div>
    </dialog>
  );
}
