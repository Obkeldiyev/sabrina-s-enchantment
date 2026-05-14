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
  href?: string;
  variant?: string;
  image?: { url: string };
};

type Achievement = {
  id: number;
  title: string;
  description: string;
  year?: string;
  image?: { url: string };
};

function sectionBand(section: Section) {
  return section.config?.background === "solid" || section.config?.background === "dark"
    ? "bg-black/40"
    : "";
}

function cardGrid(section: Section, className = "") {
  const items = section.items || [];

  return (
    <section id={section.key} className={`py-32 px-6 relative ${className}`}>
      <SectionHeading eyebrow={section.key.toUpperCase()} title={section.title} sub={section.subtitle} />
      {section.body && (
        <p className="max-w-3xl mx-auto -mt-8 mb-12 text-center text-white/60 leading-relaxed">
          {section.body}
        </p>
      )}
      {items.length > 0 && (
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 80}>
              <TiltCard className="h-full">
                {item.image?.url && (
                  <img
                    src={assetUrl(item.image.url)}
                    alt={item.title}
                    className="w-full h-36 object-cover rounded-lg mb-4"
                  />
                )}
                {item.icon && <div className="text-3xl mb-3 text-primary">{item.icon}</div>}
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                {(item.body || item.subtitle) && (
                  <p className="text-white/60 text-sm">{item.body || item.subtitle}</p>
                )}
                {item.href && item.label && (
                  <a href={item.href} className="inline-block mt-5 text-sm text-primary hover:text-white">
                    {item.label}
                  </a>
                )}
              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

function metricsSection(section: Section) {
  const items = section.items || [];
  if (!items.length) return null;

  return (
    <section id={section.key} className="py-24 px-6 border-y border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={index * 80}>
            <div>
              <div className="font-brand text-5xl md:text-6xl metallic-text">
                <CountUp to={Number(item.value) || 0} suffix={item.unit || ""} />
              </div>
              <div className="text-xs tracking-[0.3em] text-white/50 mt-2">
                {(item.label || item.title || "").toUpperCase()}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function showcaseSection(section: Section) {
  return (
    <section id={section.key} className="py-32 px-6 relative bg-black/40">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <Reveal>
          <div>
            <SectionHeading eyebrow={section.key.toUpperCase()} title={section.title} sub={section.subtitle} />
            {section.body && <p className="text-white/65 leading-relaxed">{section.body}</p>}
          </div>
        </Reveal>
        {section.image?.url && (
          <Reveal delay={150}>
            <img
              src={assetUrl(section.image.url)}
              alt={section.image.altText || section.title}
              className="w-full max-h-[560px] object-contain"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}

function achievementsSection(section: Section, achievements: Achievement[]) {
  return (
    <section id={section.key} className="py-32 px-6">
      <SectionHeading
        eyebrow={section.key.toUpperCase()}
        title={section.title}
        sub={section.subtitle}
      />
      {section.body && (
        <p className="max-w-3xl mx-auto -mt-8 mb-12 text-center text-white/60 leading-relaxed">
          {section.body}
        </p>
      )}
      {achievements.length > 0 && (
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <Reveal key={achievement.id} delay={index * 100}>
              <TiltCard>
                {achievement.image?.url && (
                  <img
                    src={assetUrl(achievement.image.url)}
                    alt={achievement.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                {achievement.year && (
                  <div className="text-xs tracking-[0.3em] text-primary mb-2">
                    {achievement.year}
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                <p className="text-white/60 text-sm">{achievement.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

function contactSection(section: Section) {
  return (
    <section id={section.key} className={`py-32 px-6 relative ${sectionBand(section)}`}>
      <SectionHeading eyebrow={section.key.toUpperCase()} title={section.title} sub={section.subtitle} />
      {section.body && (
        <p className="max-w-3xl mx-auto -mt-8 mb-12 text-center text-white/60 leading-relaxed">
          {section.body}
        </p>
      )}
      <ContactForm config={section.config} />
    </section>
  );
}

function renderSection(section: Section, achievements: Achievement[]) {
  switch (section.type) {
    case "HERO":
      return (
        <Hero
          id={section.key}
          eyebrow={section.config?.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          body={section.body}
          scrollLabel={section.config?.scrollLabel}
          image={
            section.image?.url
              ? { url: assetUrl(section.image.url), altText: section.image.altText }
              : undefined
          }
          actions={section.items || []}
        />
      );
    case "METRICS":
      return metricsSection(section);
    case "SHOWCASE":
      return showcaseSection(section);
    case "ACHIEVEMENTS":
      return achievementsSection(section, achievements);
    case "CONTACT":
      return contactSection(section);
    case "FOOTER":
      return null;
    case "CARD_GRID":
    case "FEATURE_GRID":
    default:
      return cardGrid(section, sectionBand(section));
  }
}

function Index() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["landing"],
    queryFn: () => api<any>("/api/landing"),
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Disabled expensive Lenis smooth scrolling library for better performance
  // Use native CSS smooth scroll behavior instead

  const sections: Section[] = data?.sections || [];
  const achievements: Achievement[] = data?.achievements || [];
  const visibleSections = sections.filter((section) => section.isVisible !== false);

  React.useEffect(() => {
    const pageTitle = data?.settings?.brand?.pageTitle;
    if (pageTitle) document.title = pageTitle;
  }, [data?.settings?.brand?.pageTitle]);

  // Fallback content when API is slow or fails
  const fallbackContent = (
    <div className="metallic-bg min-h-screen text-white">
      <CustomCursor />
      <Header />
      
      {/* Fallback Hero Section */}
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center" style={{ paddingTop: "6rem" }}>
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-30 max-w-7xl mx-auto px-6 w-full text-center">
          <div className="inline-block mb-6 px-4 py-1 rounded-full glass text-xs tracking-[0.4em] text-white/70">
            WINDFLOWER
          </div>
          <h1 className="font-brand text-[clamp(3.6rem,5.2vw,6.4rem)] metallic-text glow-text leading-[0.95]">
            Loading...
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white/80 font-light max-w-xl mx-auto">
            {isError ? "Backend connection failed. Please check your API endpoint." : "Connecting to backend..."}
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );

  // Show fallback immediately while loading or on error
  if (isLoading || isError) {
    return fallbackContent;
  }

  // Show full content when data is loaded
  return (
    <div className="metallic-bg min-h-screen text-white">
      <CustomCursor />
      <Header />

      {visibleSections.map((section) => (
        <React.Fragment key={section.id}>
          {renderSection(section, achievements)}
        </React.Fragment>
      ))}

      <Footer />
    </div>
  );
}
