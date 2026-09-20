"use client";

import { CSSProperties, KeyboardEvent, useEffect, useState } from "react";
import { projects } from "./data/projects";

const adaptivProducts = [
  {
    number: "01",
    title: "Sclobo Keychain",
    client: "Sclobo / Washington",
    category: "Client commission",
    image: "/images/adaptiv/sclobo-keychain.png",
    alt: "CAD rendering of the custom bird-emblem keychain developed for Sclobo",
    description: "A custom keychain developed for Sclobo, a Washington-based street-fashion and gaming company, translating its visual identity into a compact physical product.",
  },
  {
    number: "02",
    title: "Personal Commission",
    client: "Independent commission",
    category: "One-off design",
    image: "/images/adaptiv/custom-keychain.png",
    alt: "Black geometric custom keychain designed for a personal commission",
    description: "A one-off keychain created from a friend’s request—an exercise in interpreting an informal brief and turning it into a resolved, printable object.",
  },
  {
    number: "03",
    title: "Spanish Honor Society",
    client: "Sociedad Honoraria Hispánica",
    category: "Organization piece",
    image: "/images/adaptiv/spanish-honor-society-keychain.png",
    alt: "Round Sociedad Honoraria Hispánica keychain with a sun, book, and landscape emblem",
    description: "A detailed keychain developed for the Spanish Honor Society, adapting its seal, lettering, and layered color system for small-format fabrication.",
  },
  {
    number: "04",
    title: "NFC Identity Tag",
    client: "ADAPTIV Studio",
    category: "Connected product",
    image: "/images/adaptiv/nfc-keychain.png",
    alt: "Blue and charcoal ADAPTIV identity keychain designed to contain an NFC tag",
    description: "An NFC-infused keychain for ADAPTIV Studio that connects a physical object to digital information while doubling as a dimensional brand mark.",
  },
  {
    number: "05",
    title: "Mechanical Slot Machine",
    client: "Independent development",
    category: "Mechanical system",
    image: "/images/adaptiv/mechanical-slot-machine.png",
    alt: "Transparent CAD rendering revealing the gears and internal mechanism of a motorless slot machine",
    description: "A fully mechanical slot machine powered by its lever and internal gear train—designed to operate without a single motor.",
  },
];

function AdaptivShowcase() {
  return (
    <div className="adaptiv-showcase">
      <section className="adaptiv-introduction experience-shell" aria-labelledby="adaptiv-studio-heading">
        <div className="adaptiv-logo-panel">
          <img src="/images/adaptiv/adaptiv-logo.png" alt="ADAPTIV Studio logo" />
        </div>
        <div className="adaptiv-intro-copy">
          <p className="experience-kicker">Designing from request to reality</p>
          <h3 id="adaptiv-studio-heading">A studio for objects that begin as questions.</h3>
          <p>Through ADAPTIV Studio, I turn client requests and personal experiments into manufacturable products—moving from visual identity and CAD through prototyping and final fabrication.</p>
          <div className="adaptiv-jump-links" aria-label="ADAPTIV case study sections">
            <a href="#atelier-press"><span>01</span> The Atelier Press</a>
            <a href="#adaptiv-archive"><span>02</span> Earlier ADAPTIV Work</a>
          </div>
        </div>
      </section>

      <section className="atelier-section" id="atelier-press" aria-labelledby="atelier-heading">
        <div className="experience-shell">
          <header className="adaptiv-section-heading">
            <div>
              <span className="adaptiv-section-number">01 / Featured collaboration</span>
              <h3 id="atelier-heading">The Atelier Press</h3>
            </div>
            <p>A product developed for Card Atelier. This space is reserved for the full case study, from the original need and early concepts to prototypes and the finished press.</p>
          </header>

          <div className="atelier-placeholder" aria-label="Reserved space for the Atelier Press case study">
            <div className="atelier-placeholder-title">
              <span>Card Atelier × ADAPTIV Studio</span>
              <strong>Case study<br />coming here.</strong>
            </div>
            <div className="atelier-placeholder-plan">
              <p>Reserved documentation</p>
              <ol>
                <li><span>01</span> Context + design brief</li>
                <li><span>02</span> CAD + prototype iterations</li>
                <li><span>03</span> Final press + use case</li>
              </ol>
            </div>
            <div className="atelier-placeholder-mark" aria-hidden="true">AP</div>
          </div>
        </div>
      </section>

      <section className="adaptiv-archive experience-shell" id="adaptiv-archive" aria-labelledby="adaptiv-archive-heading">
        <header className="adaptiv-section-heading adaptiv-archive-heading">
          <div>
            <span className="adaptiv-section-number">02 / Product archive</span>
            <h3 id="adaptiv-archive-heading">Earlier ADAPTIV Work</h3>
          </div>
          <p>Five projects that show the range of the studio: client identity pieces, a connected NFC object, and a complete mechanical system.</p>
        </header>

        <div className="adaptiv-product-list">
          {adaptivProducts.map((product) => (
            <article className={`adaptiv-product adaptiv-product-${product.number}`} key={product.number}>
              <div className="adaptiv-product-image">
                <span className="adaptiv-product-index">A—{product.number}</span>
                <img src={product.image} alt={product.alt} loading="lazy" />
              </div>
              <div className="adaptiv-product-copy">
                <p>{product.category}</p>
                <h4>{product.title}</h4>
                <span>{product.client}</span>
                <p>{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function PortfolioExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const project = projects[activeIndex];

  useEffect(() => {
    const slug = window.location.hash.slice(1);
    const hashIndex = projects.findIndex((item) => item.slug === slug);
    if (hashIndex >= 0) setActiveIndex(hashIndex);
  }, []);

  const theme = {
    "--experience-bg": project.background,
    "--experience-fg": project.foreground,
    "--experience-accent": project.accent,
    "--experience-soft": project.soft,
  } as CSSProperties;

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = event.key === "ArrowRight"
      ? (index + 1) % projects.length
      : (index - 1 + projects.length) % projects.length;
    selectProject(next);
    document.getElementById(`project-tab-${next}`)?.focus();
  }

  function selectProject(index: number) {
    setActiveIndex(index);
    window.history.replaceState(null, "", `#${projects[index].slug}`);
    window.requestAnimationFrame(() => {
      document.getElementById("active-project")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <main className="experience" style={theme}>
      <header className="experience-header experience-shell">
        <a className="experience-mark" href="#top" aria-label="Andrew Kang portfolio home">AK<span>.</span></a>
        <p>Andrew Kang&apos;s Portfolio</p>
        <span className="experience-year">2024—2026</span>
      </header>

      <section className="compact-intro experience-shell" id="top">
        <p className="experience-kicker">Selected extracurricular work</p>
        <h1>Andrew Kang<br /><em>Selected Works</em></h1>
        <p className="compact-deck">Designing machines, products, and environmental systems through research and experimentation.</p>
      </section>

      <nav className="project-tabs-wrap" aria-label="Projects">
        <div className="project-tabs experience-shell" role="tablist" aria-label="Select a project">
          {projects.map((item, index) => (
            <button
              id={`project-tab-${index}`}
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="active-project"
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => selectProject(index)}
              onKeyDown={(event) => moveTab(event, index)}
            >
              <span>{item.index}</span>
              {item.title}
            </button>
          ))}
        </div>
      </nav>

      <article className="project-view" id="active-project" role="tabpanel" aria-labelledby={`project-tab-${activeIndex}`} key={project.slug}>
        <section className="project-overview experience-shell">
          <div className="project-heading">
            <p className="experience-kicker">{project.eyebrow}</p>
            <h2>{project.title}</h2>
          </div>
          <div className="project-summary">
            <span className="project-index">Project {project.index} / {String(projects.length).padStart(2, "0")}</span>
            <p>{project.statement}</p>
          </div>
        </section>

        <section className="detail-facts experience-shell" aria-label={`${project.title} details`}>
          <div><span>Role</span><strong>{project.role}</strong></div>
          <div><span>Timeline</span><strong>{project.year}</strong></div>
        </section>

        {project.slug === "adaptiv-studio" ? (
          <AdaptivShowcase />
        ) : project.images ? (
          <section className={`project-gallery experience-shell project-gallery-${project.slug}`} aria-label={`${project.title} photo gallery`}>
            {project.images.map((image, index) => (
              <figure className={`gallery-item gallery-item-${index + 1}`} key={image.src}>
                <img src={image.src} alt={image.alt} loading={index === 0 ? "eager" : "lazy"} />
                <figcaption>
                  <span>P{index + 1}</span>
                  {image.caption}
                  {image.link ? (
                    <a href={image.link.href} target="_blank" rel="noreferrer">
                      {image.link.label}<span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </section>
        ) : project.interactiveTool ? (
          <section className="interactive-tool experience-shell" aria-labelledby="interactive-tool-title">
            <header>
              <div>
                <p className="experience-kicker">Interactive internship tool</p>
                <h3 id="interactive-tool-title">{project.interactiveTool.title}</h3>
              </div>
              <p>{project.interactiveTool.description}</p>
            </header>
            <iframe
              src={project.interactiveTool.src}
              title={project.interactiveTool.title}
              loading="lazy"
            />
          </section>
        ) : (
          <section className="visual-grid experience-shell" aria-label={`${project.title} media placeholders`}>
            <div className="visual-primary">
              <span>Primary project visual</span>
              <strong>{project.shortTitle}</strong>
              <i aria-hidden="true">{project.index}</i>
            </div>
            <div className="visual-process">
              <span>Process / Evidence</span>
              <div aria-hidden="true"><i /><i /><i /><i /><i /></div>
              <p>Reserved for photographs, diagrams, CAD, graphs, and excerpts.</p>
            </div>
          </section>
        )}

        {project.analysis ? (
          <section className="analysis-section experience-shell" aria-labelledby="analysis-title">
            <header className="analysis-header">
              <p className="experience-kicker">Modeling and analysis</p>
              <h3 id="analysis-title">{project.analysis.title}</h3>
            </header>
            <div className="analysis-grid">
              {project.analysis.images.map((image, index) => (
                <figure className={`analysis-card analysis-card-${index + 1}`} key={image.src}>
                  <div><img src={image.src} alt={image.alt} loading="lazy" /></div>
                  <figcaption><span>A{index + 1}</span>{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {project.showcaseVideo ? (
          <section className="project-showcase-video experience-shell" aria-labelledby="showcase-video-title">
            <div className="project-showcase-video-frame">
              <video controls playsInline preload="metadata" aria-label={project.showcaseVideo.title}>
                <source src={project.showcaseVideo.src} type="video/mp4" />
                Your browser does not support embedded video.
              </video>
            </div>
            <div className="project-showcase-video-copy">
              <p className="experience-kicker">Homepage product feature</p>
              <h3 id="showcase-video-title">{project.showcaseVideo.title}</h3>
              <p>{project.showcaseVideo.description}</p>
            </div>
          </section>
        ) : null}

        {project.video ? (
          <section className="experience-video experience-shell" aria-labelledby="video-title">
            <div>
              <span className="experience-kicker">Field note / Video</span>
              <h3 id="video-title">{project.videoTitle}</h3>
              <p>{project.videoDescription}</p>
            </div>
            <div className="experience-video-frame">
              <iframe
                src={project.video}
                title="Andrew Kang environmental volunteer video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        ) : null}

        <footer className="experience-footer experience-shell">
          <span>Andrew Kang © 2026</span>
          <button type="button" onClick={() => selectProject((activeIndex + 1) % projects.length)}>
            Next: {projects[(activeIndex + 1) % projects.length].shortTitle} →
          </button>
        </footer>
      </article>
    </main>
  );
}
