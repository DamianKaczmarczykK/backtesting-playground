import { onCleanup, onMount } from "solid-js";

export default function Chart() {
  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext("2d")!;

    ctx.moveTo(0, 0);
    ctx.lineTo(200, 100);
    ctx.stroke();
  });

  return (
    <canvas ref={canvas} width="800" height="600">
    </canvas>
  );
}

