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
            class={`font-medium px-2 hover:outline rounded transition-all ease-in-out duration-300 ${matches ? "text-purple-400 hover:outline-purpple-400" : "hover:outline-purple-300"}`}
          >
            {name}
          </a>
        );
      }}
    </Match>
  );
}
