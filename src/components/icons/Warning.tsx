export default function Warning({ style }: { style: string }) {
  return (
    <svg
      width="800"
      height="800"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      class={`${style} fill-red-700`}
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 16a1 1 0 1 1 1-1 1 1 0 0 1-1 1m1-5a1 1 0 0 1-2 0V7a1 1 0 0 1 2 0Z" />
    </svg>
  );
}
