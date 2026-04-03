interface IconProps {
  style?: string;
}

export default function Reverse({ style = "w-5 h-5" }: IconProps) {
  return (
    <svg
      width="800"
      height="800"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      class={`${style} fill-purple-400`}
    >
      <path d="M6.293 4.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L8 7.414V19a1 1 0 1 1-2 0V7.414L3.707 9.707a1 1 0 0 1-1.414-1.414zM16 16.586V5a1 1 0 1 1 2 0v11.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414z" />
    </svg>
  );
}
