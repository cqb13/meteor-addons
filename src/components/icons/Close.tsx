interface IconProps {
  style?: string;
}

export default function Close({ style = "w-5 h-5" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      viewBox="0 0 100 100"
      class={`${style} fill-purple-300 hover:fill-purple-400 duration-300 transition-all ease-in-out`}
    >
      <path d="M88.447 38.528H11.554a2.024 2.024 0 0 0-2.024 2.024v18.896c0 1.118.907 2.024 2.024 2.024h76.892a2.024 2.024 0 0 0 2.023-2.024V40.552a2.023 2.023 0 0 0-2.022-2.024" />
    </svg>
  );
}
