import Star from "./icons/Star";

export default function StarCount({ starCount }: { starCount: number }) {
  return (
    <div class="flex gap-1 justify-center items-center select-none">
      <Star style="w-3 h-3" />
      <p class="text-xs">{starCount}</p>
    </div>
  );
}
