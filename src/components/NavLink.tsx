import Match from "preact-router/match";

export default function NavLink({
  name,
  path,
}: {
  name: string;
  path: string;
}) {
  return (
    <Match path={path}>
      {({ matches }: { matches: any }) => {
        return (
          <a
            href={path}
            class={`bg-slate-950/50 px-2 text-center rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out w-full ${matches ? "border-purple-300/80" : null}`}
          >
            {name}
          </a>
        );
      }}
    </Match>
  );
}
