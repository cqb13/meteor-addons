import starIcon from "../assets/icons/star.svg";

export function StarCount({ starCount }: { starCount: number }) {
  return (
    <div class="flex gap-1 justify-center items-center">
      <img src={starIcon} alt="star" class="w-5 h-5" />
      <p>{starCount}</p>
    </div>
  );
}
