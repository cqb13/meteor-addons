export default function Archived({ style }: { style: string }) {
  return (
    <svg
      width="800"
      height="800"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      class={`${style} stroke-orange-800`}
    >
      <path d="M1.75 2.75h12.5v3.5H1.75zm5 6.5h2.5m-6.5-2.5v7.5h10.5v-7.5" />
    </svg>
  );
}
