import Download from "./icons/Download";

export default function StarCount({
  downloadCount,
}: {
  downloadCount: number;
}) {
  return (
    <div class="flex gap-1 justify-center items-center select-none">
      <Download style="w-3 h-3" />
      <p class="text-xs">{downloadCount}</p>
    </div>
  );
}
