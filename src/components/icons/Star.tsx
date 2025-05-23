export default function Star({ style }: { style: string }) {
  return (
    <svg
      width="800"
      height="800"
      viewBox="0 0 15 15"
      xmlns="http://www.w3.org/2000/svg"
      class={`${style} fill-yellow-800`}
    >
      <path d="M7.948.779a.5.5 0 0 0-.896 0L5.005 4.926l-4.577.665a.5.5 0 0 0-.277.853l3.312 3.228-.782 4.559a.5.5 0 0 0 .725.527L7.5 12.605l4.094 2.153a.5.5 0 0 0 .725-.527l-.782-4.56 3.312-3.227a.5.5 0 0 0-.277-.853l-4.577-.665z" />
    </svg>
  );
}
