export default function Download({ style }: { style: string }) {
  return (
    <svg
      width="800"
      height="800"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      class={style}
    >
      <g fill="none" fill-rule="evenodd">
        <path d="M0 0h32v32H0z" />
        <path
          class="fill-emerald-800"
          d="M19.12 0a6 6 0 0 1 4.69 2.259l4.88 6.118A6 6 0 0 1 30 12.118V26a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zM16 9a1 1 0 0 0-1 1v9.085l-2.56-2.56a1 1 0 1 0-1.415 1.414l4.243 4.243c.18.18.412.277.648.291h.168a1 1 0 0 0 .648-.291l4.243-4.243a1 1 0 1 0-1.414-1.414l-2.562 2.56L17 10a1 1 0 0 0-1-1"
        />
      </g>
    </svg>
  );
}
