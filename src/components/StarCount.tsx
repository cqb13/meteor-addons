import starIcon from "../assets/icons/star.svg";

export default function StarCount({ starCount }: { starCount: number }) {
  return (
    <div class="flex gap-1 justify-center items-center select-none">
      <img src={starIcon} alt="star" class="w-5 h-5" />
      <p>{starCount}</p>
    </div>
  );
}
