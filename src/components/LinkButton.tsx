export default function LinkButton({
  text,
  destination,
  target,
  className,
}: {
  text: string;
  destination: string;
  target?: string;
  className?: string;
}) {
  return (
    <a
      href={destination}
      target={target || ""}
      class={`bg-slate-950/50 p-2 text-center rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out ${className || "w-full"}`}
    >
      {text}
    </a>
  );
}
