const projects = [
  { index: "01", title: "Robotic Beaver Dam Analog", field: "Robotics / Environmental Research", href: "/work/beaver-dam-robot" },
  { index: "02", title: "ADAPTIV Studio", field: "Product Design / 3D Printing", href: "/work/adaptiv-studio" },
  { index: "03", title: "Teaching 3D Printing", field: "Education / Community Technology", href: "/work/teaching-3d-printing" },
  { index: "04", title: "Bit Infinite", field: "Parametric CAD / Internship", href: "/work/bit-infinite" },
  { index: "05", title: "Service in Practice", field: "Green Club / Seattle University", href: "/work/service-in-practice" },
];

export default function Home() {
  return (
    <main id="top">
      <header className="site-header shell">
        <a className="wordmark" href="/" aria-label="Andrew Kang, home">
          AK<span className="wordmark-dot">.</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Selected work</a>
          <span className="nav-status"><i /> Available for review</span>
        </nav>
      </header>

      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-kicker mono">Portfolio / 2024—2026</div>
        <h1 id="hero-title">
          Andrew Kang
          <span>Selected Works</span>
        </h1>
        <div className="hero-footer">
          <p>Designing machines, products, and environmental systems through research and experimentation.</p>
          <a className="index-link mono" href="#work">View project index <span>↓</span></a>
        </div>
        <div className="axis axis-x" aria-hidden="true"><span>X</span></div>
        <div className="axis axis-y" aria-hidden="true"><span>Y</span></div>
      </section>

      <section className="project-index shell" id="work" aria-labelledby="work-title">
        <div className="section-label mono">
          <span id="work-title">Selected work</span>
          <span>05 projects</span>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <a className="project-row" href={project.href} key={project.href}>
              <span className="project-number mono">{project.index}</span>
              <h2>{project.title}</h2>
              <span className="project-field mono">{project.field}</span>
              <span className="project-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="site-footer shell mono">
        <span>Andrew Kang © 2026</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
