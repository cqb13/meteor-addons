export default function Button({
  text,
  action,
  active,
}: {
  text: string;
  action: (event: any) => void;
  active: boolean;
}) {
  return (
    <button
      onClick={action}
      class={`bg-slate-950/50 p-2 rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out w-full ${active ? "border-purple-300/80" : null}`}
    >
      {text}
    </button>
  );
}
