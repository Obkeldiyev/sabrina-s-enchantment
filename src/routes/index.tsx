import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { Hero, SectionHeading, TiltCard, CountUp } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import ContactForm from "@/components/site/ContactForm";
import CustomCursor from "@/components/site/Cursor";
import { api, assetUrl } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Index,
});

type Section = {
  id: number;
  key: string;
  type: string;
  title: string;
  subtitle?: string;
  body?: string;
  image?: { url: string; altText?: string };
  config?: any;
  isVisible: boolean;
  items?: Item[];
};
type Item = {
  id: number;
  title: string;
  subtitle?: string;
  body?: string;
  label?: string;
  value?: string;
  unit?: string;
  icon?: string;
  image?: { url: string };
};
type Achievement = {
  id: number;
  title: string;
  description: string;
  year?: string;
  image?: { url: string };
};

function pickSection(sections: Section[], type: string, key?: string): Section | undefined {
  return (
    sections?.find((s) => s.key === key) ||
    sections?.find((s) => s.type?.toUpperCase() === type)
  );
}

function Index() {
  const { data, isError } = useQuery({
    queryKey: ["landing"],
    queryFn: () => api<any>("/api/landing"),
    retry: 1,
  });

  React.useEffect(() => {
    let lenis: any;
    (async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const raf = (t: number) => {
        lenis.raf(t);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    })();
    return () => lenis?.destroy?.();
  }, []);

  const sections: Section[] = data?.sections || [];
  const achievements: Achievement[] = data?.achievements || [];

  const hero = pickSection(sections, "HERO", "hero");
  const about = pickSection(sections, "SHOWCASE", "about") || sections.find((s) => s.key === "about");
  const tech = pickSection(sections, "FEATURE_GRID", "technology") || sections.find((s) => s.key === "technology");
  const why = pickSection(sections, "CARD_GRID", "why") || sections.find((s) => s.key === "why");
  const apps = pickSection(sections, "CARD_GRID", "applications") || sections.find((s) => s.key === "applications");
  const metrics = pickSection(sections, "METRICS", "metrics");

  return (
    <div className="metallic-bg min-h-screen text-white">
      <CustomCursor />
      <Header />

      <Hero
        title={hero?.title}
        subtitle={hero?.subtitle}
        body={hero?.body}
      />

      {isError && (
        <div className="text-center py-4 text-amber-400/80 text-sm">
          Backend offline — showing demo content. Start the WindFlower backend on http://localhost:4000.
        </div>
      )}

      {/* ABOUT */}
      <section id="about" className="py-32 px-6 relative">
        <SectionHeading
          eyebrow="ABOUT"
          title={about?.title || "About WindFlower"}
          sub={about?.subtitle || "Pioneering the future of urban renewable energy."}
        />
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { t: "Our Company", b: about?.body || "WindFlower combines advanced engineering with biomimicry-inspired design." },
            { t: "Our Mission", b: "Make sustainable power accessible, aesthetic, and part of everyday urban life." },
            { t: "Our Vision", b: "A world where renewable infrastructure is not just functional, but beautiful." },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 120}>
              <TiltCard>
                <h3 className="text-xl font-bold text-primary mb-3">{c.t}</h3>
                <p className="text-white/70 leading-relaxed">{c.b}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section id="technology" className="py-32 px-6 relative bg-black/40">
        <SectionHeading
          eyebrow="TECHNOLOGY"
          title={tech?.title || "Revolutionary Technology"}
          sub={tech?.subtitle || "Designed for urban environments — capturing low-speed wind with biomimicry-inspired engineering."}
        />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {(tech?.items?.length
            ? tech.items
            : [
                { id: 1, title: "Maximum Efficiency", body: "Optimized blades capture energy even at low wind speeds." },
                { id: 2, title: "Compact Design", body: "Elegant 1.5–2m modular units integrate into any space." },
                { id: 3, title: "Low Noise", body: "Virtually silent — perfect for residential & public areas." },
                { id: 4, title: "Scalable Deployment", body: "Modular architecture from single units to city-wide grids." },
              ]
          ).map((it: any, i: number) => (
            <Reveal key={it.id} delay={i * 100}>
              <TiltCard className="group">
                <div className="text-5xl mb-4 opacity-60 group-hover:opacity-100 transition">
                  {it.icon || "✦"}
                </div>
                <h3 className="text-2xl font-bold mb-2">{it.title}</h3>
                <p className="text-white/60">{it.body || it.subtitle}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* METRICS */}
      <section className="py-24 px-6 border-y border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {(metrics?.items?.length
            ? metrics.items
            : [
                { id: 1, label: "kW per unit", value: "5", unit: "" },
                { id: 2, label: "Decibels", value: "20", unit: "" },
                { id: 3, label: "Cities", value: "12", unit: "+" },
                { id: 4, label: "CO₂ saved (t)", value: "240", unit: "k" },
              ]
          ).map((it: any, i: number) => (
            <Reveal key={it.id} delay={i * 80}>
              <div>
                <div className="font-brand text-5xl md:text-6xl metallic-text">
                  <CountUp to={Number(it.value) || 0} suffix={it.unit || ""} />
                </div>
                <div className="text-xs tracking-[0.3em] text-white/50 mt-2">
                  {(it.label || it.title || "").toUpperCase()}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="py-32 px-6">
        <SectionHeading
          eyebrow="ADVANTAGES"
          title={why?.title || "Why WindFlower"}
          sub={why?.subtitle}
        />
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(why?.items?.length
            ? why.items
            : [
                { id: 1, title: "Silent Operation", body: "Noise-free generation" },
                { id: 2, title: "Urban-Friendly", body: "Built for cities" },
                { id: 3, title: "Low Maintenance", body: "Minimal upkeep" },
                { id: 4, title: "High Adaptability", body: "Works in any wind" },
              ]
          ).map((it: any, i: number) => (
            <Reveal key={it.id} delay={i * 80}>
              <div className="glass rounded-xl p-6 text-center hover:bg-white/10 transition">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 grid place-items-center text-primary text-2xl">
                  {it.icon || "✓"}
                </div>
                <h3 className="font-bold mb-1">{it.title}</h3>
                <p className="text-sm text-white/50">{it.body || it.subtitle}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* APPLICATIONS */}
      <section id="applications" className="py-32 px-6 bg-black/40">
        <SectionHeading
          eyebrow="APPLICATIONS"
          title={apps?.title || "Where WindFlower Lives"}
          sub={apps?.subtitle || "Seamlessly integrating across diverse environments."}
        />
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(apps?.items?.length
            ? apps.items
            : [
                { id: 1, title: "Smart Cities", body: "Power streetlights, sensors and infrastructure." },
                { id: 2, title: "Private Homes", body: "Garden-integrated household power." },
                { id: 3, title: "Industrial Zones", body: "Scalable arrays for green operations." },
                { id: 4, title: "Remote Areas", body: "Reliable off-grid power." },
              ]
          ).map((it: any, i: number) => (
            <Reveal key={it.id} delay={i * 80}>
              <TiltCard className="text-center">
                <div className="text-3xl mb-3 text-primary">{it.icon || "◆"}</div>
                <h3 className="text-lg font-bold mb-2">{it.title}</h3>
                <p className="text-sm text-white/60">{it.body || it.subtitle}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements" className="py-32 px-6">
        <SectionHeading eyebrow="MILESTONES" title="Achievements" />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(achievements.length
            ? achievements
            : [
                { id: 1, title: "Pilot in Tashkent", description: "First WindFlower array installed in a public park.", year: "2024" } as any,
                { id: 2, title: "Green Innovation Award", description: "Recognized for biomimicry-driven design.", year: "2024" } as any,
                { id: 3, title: "5 Cities Onboarded", description: "Multi-city smart grid integration.", year: "2025" } as any,
              ]
          ).map((a: any, i: number) => (
            <Reveal key={a.id} delay={i * 100}>
              <TiltCard>
                {a.image?.url && (
                  <img src={assetUrl(a.image.url)} alt={a.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                {a.year && <div className="text-xs tracking-[0.3em] text-primary mb-2">{a.year}</div>}
                <h3 className="text-xl font-bold mb-2">{a.title}</h3>
                <p className="text-white/60 text-sm">{a.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-32 px-6 relative">
        <div className="shape-3d w-[500px] h-[500px] -bottom-40 -right-20 animate-[floatY_9s_ease-in-out_infinite]" />
        <SectionHeading
          eyebrow="GET IN TOUCH"
          title="Let's build the future of wind."
          sub="Tell us about your project — pilots, partnerships, or just a question."
        />
        <ContactForm />
      </section>

      <Footer />
    </div>
  );
}
