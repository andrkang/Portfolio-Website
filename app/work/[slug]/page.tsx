import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getProject, projects } from "../../data/projects";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found — Andrew Kang" };

  return {
    title: `${project.title} — Andrew Kang`,
    description: project.statement,
    openGraph: { title: `${project.title} — Andrew Kang`, description: project.statement, images: [] },
    twitter: { title: `${project.title} — Andrew Kang`, description: project.statement, images: [] },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return (
      <main className="missing-page">
        <p className="mono">404 / Project unavailable</p>
        <a href="/">Return to selected work</a>
      </main>
    );
  }

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const theme = {
    "--project-bg": project.background,
    "--project-fg": project.foreground,
    "--project-accent": project.accent,
    "--project-soft": project.soft,
  } as CSSProperties;

  return (
    <main className="project-page" style={theme}>
      <header className="project-header project-shell">
        <a className="project-wordmark" href="/" aria-label="Andrew Kang, selected works">
          AK<span>.</span>
        </a>
        <a className="back-link mono" href="/#work">← Project index</a>
        <span className="project-counter mono">{project.index} / 05</span>
      </header>

      <section className="project-hero project-shell" aria-labelledby="project-title">
        <div className="project-eyebrow mono">{project.eyebrow}</div>
        <h1 id="project-title">{project.title}</h1>
        <p className="project-statement">{project.statement}</p>
        <div className="project-orbit" aria-hidden="true"><span>{project.index}</span></div>
      </section>

      <section className="project-facts project-shell" aria-label="Project facts">
        <div><span className="mono">Role</span><strong>{project.role}</strong></div>
        <div><span className="mono">Focus</span><strong>{project.field}</strong></div>
        <div><span className="mono">Tools</span><strong>{project.tools}</strong></div>
        <div><span className="mono">Timeline</span><strong>{project.year}</strong></div>
        <div><span className="mono">Status</span><strong>{project.status}</strong></div>
      </section>

      <section className="media-stage project-shell" aria-label="Featured project media">
        <div className="media-primary">
          <span className="mono">Primary project visual</span>
          <b aria-hidden="true">{project.shortTitle}</b>
        </div>
        <div className="media-secondary">
          <span className="mono">Process detail</span>
          <div className="measurement" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        </div>
      </section>

      <section className="project-chapters project-shell" aria-label="Case study structure">
        <div className="chapter-intro">
          <span className="mono">Case study architecture</span>
          <p>Each chapter is ready for photographs, diagrams, short explanations, and project evidence.</p>
        </div>
        <div className="chapter-list">
          {project.chapters.map((chapter) => (
            <article className="chapter" key={chapter.number}>
              <span className="mono">{chapter.number}</span>
              <h2>{chapter.title}</h2>
              <p>{chapter.prompt}</p>
              <div className="chapter-media mono">Media module</div>
            </article>
          ))}
        </div>
      </section>

      {project.video ? (
        <section className="video-module project-shell" aria-labelledby="video-title">
          <div>
            <span className="mono">Field note / Video</span>
            <h2 id="video-title">Environmental service in action</h2>
          </div>
          <div className="video-frame">
            <iframe
              src={project.video}
              title="Andrew Kang environmental volunteer video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      ) : null}

      <a className="next-project" href={`/work/${nextProject.slug}`}>
        <span className="mono">Next project / {nextProject.index}</span>
        <strong>{nextProject.title}</strong>
        <i aria-hidden="true">→</i>
      </a>
    </main>
  );
}
