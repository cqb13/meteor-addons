import type { RoutableProps } from "preact-router";
import type { FunctionalComponent } from "preact";
import useMeta from "../hooks/useMeta.ts";

const NotFound: FunctionalComponent<RoutableProps> = () => {
  useMeta({
    title: "Page not found — Meteor Addons",
    description:
      "The page you were looking for could not be found. It may have moved or no longer exists.",
    noindex: true,
  });

  return (
    <main class="flex flex-col gap-4 items-center px-5 grow">
      <h2 class="font-medium text-4xl pb-2">Page Not Found</h2>
      <p class="text-slate-400 text-center">
        The page you're looking for doesn't exist or has moved.
      </p>
      <a
        href="/"
        class="bg-slate-950/50 px-3 py-2 text-center rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out"
      >
        Back to addons
      </a>
    </main>
  );
};

export default NotFound;
