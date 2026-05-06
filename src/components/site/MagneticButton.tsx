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
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
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
