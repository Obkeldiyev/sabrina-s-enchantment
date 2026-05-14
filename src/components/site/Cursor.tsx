import * as React from "react";

export default function CustomCursor() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let x = 0, y = 0, tx = 0, ty = 0;
    let lastHoverCheck = 0;
    let hovering = false;
    
    const move = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      const now = Date.now();
      if (now - lastHoverCheck > 100) {
        const t = e.target as HTMLElement;
        const isHoverable = !!(t && t.closest("a, button, [data-magnetic]"));
        if (isHoverable !== hovering) {
          hovering = isHoverable;
          if (hovering) el.classList.add("hover");
          else el.classList.remove("hover");
        }
        lastHoverCheck = now;
      }
    };
    
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    
    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);
  return <div ref={ref} className="wf-cursor" />;
}
