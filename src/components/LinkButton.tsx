export default function LinkButton({
  text,
  destination,
}: {
  text: string;
  destination: string;
}) {
  return (
    <a
      href={destination}
      class="bg-slate-950/50 p-2 text-center rounded border cursor-pointer border-purple-300/20 hover:border-purple-300/50 active:border-purple-300/80 transition-all duration-300 ease-in-out w-full"
    >
      {text}
    </a>
  );
}
