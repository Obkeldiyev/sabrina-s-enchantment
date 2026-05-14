import * as React from "react";

export function MagneticButton({
  children,
  className = "",
  href,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}) {
  const ref = React.useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  React.useEffect(() => {
    // Disable magnetic effect on mobile/touch devices
    if ('ontouchstart' in window) return;
    
    const el = ref.current;
    if (!el) return;
    
    let rafId: number | null = null;
    let rect: DOMRect | null = null;
    let lastRectUpdate = 0;
    
    const updateRect = () => {
      rect = el.getBoundingClientRect();
      lastRectUpdate = Date.now();
    };
    
    const move = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        // Update rect only every 100ms to reduce layout thrashing
        const now = Date.now();
        if (!rect || now - lastRectUpdate > 100) {
          updateRect();
        }
        
        if (rect) {
          const x = e.clientX - (rect.left + rect.width / 2);
          const y = e.clientY - (rect.top + rect.height / 2);
          // Reduce magnetic strength for better performance
          el.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
        }
      });
    };
    
    const leave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = "";
    };
    
    // Update rect on mount
    updateRect();
    
    el.addEventListener("mousemove", move, { passive: true });
    el.addEventListener("mouseleave", leave);
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);
  const cls = `inline-flex items-center justify-center px-8 py-4 font-semibold tracking-wider transition-all will-change-transform ${className}`;
  if (href)
    return (
      <a ref={ref as any} href={href} data-magnetic className={cls}>
        {children}
      </a>
    );
  return (
    <button ref={ref as any} data-magnetic className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
