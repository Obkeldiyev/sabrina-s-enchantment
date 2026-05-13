import * as React from "react";
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";

type HeroAction = {
  id?: number;
  title?: string;
  href?: string;
  variant?: string;
};

export function Hero({
  id = "hero",
  eyebrow,
  title,
  subtitle,
  body,
  image,
  scrollLabel,
  actions = [],
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  image?: { url?: string; altText?: string };
  scrollLabel?: string;
  actions?: HeroAction[];
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      ref.current?.style.setProperty("--py", `${y * 0.3}px`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ paddingTop: "6rem" }}
    >
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div
        className="pointer-events-none absolute right-0 top-[5.5rem] bottom-0 z-10 hidden w-[46vw] max-w-[760px] md:block lg:right-[1vw]"
        style={{ transform: "translateY(calc(var(--py, 0px) * -0.3))" }}
      >
        {image?.url && (
          <img
            src={image.url}
            alt={image.altText || title || ""}
            className="h-full w-full object-contain"
          />
        )}
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-6 w-full grid md:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)] gap-8 items-center">
        <div className="relative z-30 text-center md:text-left">
          <Reveal>
            <div className="inline-block mb-6 px-4 py-1 rounded-full glass text-xs tracking-[0.4em] text-white/70">
              {eyebrow || subtitle || title}
            </div>
          </Reveal>
          {title && (
            <Reveal delay={120}>
              <h1 className="font-brand text-[clamp(3.6rem,5.2vw,6.4rem)] metallic-text glow-text leading-[0.95] whitespace-nowrap">
                {title}
              </h1>
            </Reveal>
          )}
          {subtitle && (
            <Reveal delay={250}>
              <p className="mt-6 text-xl md:text-2xl text-white/80 font-light max-w-xl">
                {subtitle}
              </p>
            </Reveal>
          )}
          {body && (
            <Reveal delay={400}>
              <p className="mt-4 text-white/50 max-w-xl">
                {body}
              </p>
            </Reveal>
          )}
          {actions.some((action) => action.title && action.href) && (
            <Reveal delay={550}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                {actions.filter((action) => action.title && action.href).map((action) => (
                  <MagneticButton
                    key={action.id || `${action.title}-${action.href}`}
                    href={action.href}
                    className={
                      action.variant === "secondary"
                        ? "glass border border-white/20 text-white hover:bg-white/10"
                        : "bg-white text-black hover:bg-primary glow-blue"
                    }
                  >
                    {action.title}
                  </MagneticButton>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {scrollLabel && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.4em] flex flex-col items-center gap-2">
          <span>{scrollLabel}</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      )}
    </section>
  );
}

export function SectionHeading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-16">
      {eyebrow && (
        <Reveal>
          <div className="text-xs tracking-[0.4em] text-primary/80 mb-3">{eyebrow}</div>
        </Reveal>
      )}
      <Reveal delay={100}>
        <h2 className="text-4xl md:text-6xl font-bold metallic-text font-brand">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal delay={200}>
          <p className="mt-6 text-lg text-white/60">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 14}deg) translateZ(0)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className={`tilt-card glass rounded-2xl p-8 ${className}`}>
      {children}
    </div>
  );
}

export function CountUp({ to, suffix = "", duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const decimals = String(to).includes(".") ? String(to).split(".")[1]?.length || 0 : 0;
  const [val, setVal] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / duration);
              setVal(to * (1 - Math.pow(1 - p, 3)));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {decimals ? val.toFixed(decimals) : Math.floor(val)}
      {suffix}
    </span>
  );
}
