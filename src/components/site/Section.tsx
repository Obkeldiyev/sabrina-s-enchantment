import * as React from "react";
import WindFlower3D from "./WindFlower3D";
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";

export function Hero({ title, subtitle, body }: { title?: string; subtitle?: string; body?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (ref.current)
        ref.current.style.setProperty("--py", `${y * 0.3}px`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ paddingTop: "6rem" }}
    >
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="shape-3d w-[600px] h-[600px] -top-20 -left-20 animate-[floatY_8s_ease-in-out_infinite]" />
      <div className="shape-3d w-[400px] h-[400px] bottom-10 -right-10 animate-[floatY_10s_ease-in-out_infinite]" style={{ animationDelay: "1s" }} />
      <div className="shape-3d w-[260px] h-[260px] top-1/3 left-1/2 animate-[floatY_7s_ease-in-out_infinite]" style={{ animationDelay: "2s" }} />

      <div
        className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 z-10"
        style={{ transform: "translateY(calc(var(--py, 0px) * -0.4))" }}
      >
        <WindFlower3D className="w-full h-full" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <Reveal>
            <div className="inline-block mb-6 px-4 py-1 rounded-full glass text-xs tracking-[0.4em] text-white/70">
              NEXT-GEN WIND ENERGY
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="font-brand text-6xl md:text-7xl lg:text-8xl metallic-text glow-text leading-[0.95]">
              {title || "WINDFLOWER"}
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="mt-6 text-xl md:text-2xl text-white/80 font-light max-w-xl">
              {subtitle || "Biomimicry-engineered wind energy systems that turn cities into living power grids."}
            </p>
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-4 text-white/50 max-w-xl">
              {body || "Silent. Beautiful. Built for the air you already breathe."}
            </p>
          </Reveal>
          <Reveal delay={550}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <MagneticButton href="#technology" className="bg-white text-black hover:bg-primary glow-blue">
                EXPLORE TECHNOLOGY →
              </MagneticButton>
              <MagneticButton href="#contact" className="glass border border-white/20 text-white hover:bg-white/10">
                REQUEST DEMO
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.4em] flex flex-col items-center gap-2">
        <span>SCROLL</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
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
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
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
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / duration);
              setVal(Math.floor(to * (1 - Math.pow(1 - p, 3))));
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
      {val}
      {suffix}
    </span>
  );
}
