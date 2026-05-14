import * as React from "react";

export default function CustomCursor() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    // Disable cursor on mobile/touch devices
    if ('ontouchstart' in window) return;
    
    const el = ref.current;
    if (!el) return;
    
    let raf = 0;
    let x = 0, y = 0, tx = 0, ty = 0;
    let lastHoverCheck = 0;
    let hovering = false;
    let isMoving = false;
    
    const move = (e: MouseEvent) => {
      tx = e.clientX; 
      ty = e.clientY;
      isMoving = true;
      
      // Throttle hover detection to every 200ms instead of 100ms
      const now = Date.now();
      if (now - lastHoverCheck > 200) {
        const t = e.target as HTMLElement;
        const isHoverable = !!(t && t.closest("a, button, [data-magnetic]"));
        if (isHoverable !== hovering) {
          hovering = isHoverable;
          el.classList.toggle("hover", hovering);
        }
        lastHoverCheck = now;
      }
    };
    
    const loop = () => {
      if (!isMoving) {
        raf = requestAnimationFrame(loop);
        return;
      }
      
      const dx = tx - x;
      const dy = ty - y;
      
      // Stop animation when cursor is close enough
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        x = tx;
        y = ty;
        isMoving = false;
      } else {
        x += dx * 0.18;
        y += dy * 0.18;
      }
      
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
  
  // Don't render on mobile
  if ('ontouchstart' in window) return null;
  
  return <div ref={ref} className="wf-cursor" />;
}
