"use client";

import { CSSProperties, KeyboardEvent, useState } from "react";
import { projects } from "./data/projects";

export default function PortfolioExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const project = projects[activeIndex];
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

        {project.images ? (
          <section className="project-gallery experience-shell" aria-label={`${project.title} photo gallery`}>
            {project.images.map((image, index) => (
              <figure className={`gallery-item gallery-item-${index + 1}`} key={image.src}>
                <img src={image.src} alt={image.alt} loading={index === 0 ? "eager" : "lazy"} />
                <figcaption><span>P{index + 1}</span>{image.caption}</figcaption>
              </figure>
            ))}
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
