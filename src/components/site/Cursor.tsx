import * as React from "react";

export default function CustomCursor() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let x = 0, y = 0, tx = 0, ty = 0;
    const move = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-magnetic]")) el.classList.add("hover");
      else el.classList.remove("hover");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);
  return <div ref={ref} className="wf-cursor" />;
}
