export default function Star({ style }: { style: string }) {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 16 16"
      version="1.1"
      class={`${style} fill-yellow-800`}
    >
      <path d="M12.9 15.4l-4.9-2.6-4.9 2.6 0.9-5.4-4-3.9 5.5-0.8 2.4-5 2.4 5 5.5 0.8-3.8 3.9 0.9 5.4z"></path>
    </svg>
  );
}
