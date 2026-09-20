"use client";

import { CSSProperties, KeyboardEvent, useEffect, useRef, useState } from "react";
import { projects } from "./data/projects";

function multiplyMatrix(a: Float32Array, b: Float32Array) {
  const result = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      result[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return result;
}

function rotationMatrix(pitch: number, yaw: number) {
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const rotateX = new Float32Array([1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1]);
  const rotateY = new Float32Array([cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1]);
  return multiplyMatrix(rotateY, rotateX);
}

function ProductModelPreview({ src, fallback, alt, title }: { src: string; fallback: string; alt: string; title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const controller = new AbortController();
    let dispose = () => {};

    async function loadModel() {
      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) throw new Error(`Unable to load model (${response.status})`);
        const model = await response.arrayBuffer();
        if (controller.signal.aborted) return;

        const view = new DataView(model);
        const triangleCount = view.getUint32(80, true);
        const expectedSize = 84 + triangleCount * 50;
        if (model.byteLength < expectedSize) throw new Error("Incomplete binary STL");

        const header = new Uint8Array(model, 0, 80);
        const colorMarker = [67, 79, 76, 79, 82, 61];
        let colorOffset = -1;
        for (let i = 0; i <= header.length - colorMarker.length; i += 1) {
          if (colorMarker.every((value, index) => header[i + index] === value)) {
            colorOffset = i + colorMarker.length;
            break;
          }
        }
        const defaultColor = colorOffset >= 0
          ? [header[colorOffset] / 255, header[colorOffset + 1] / 255, header[colorOffset + 2] / 255]
          : [0.52, 0.57, 0.64];

        const minimum = [Infinity, Infinity, Infinity];
        const maximum = [-Infinity, -Infinity, -Infinity];
        for (let triangle = 0; triangle < triangleCount; triangle += 1) {
          const start = 84 + triangle * 50 + 12;
          for (let vertex = 0; vertex < 3; vertex += 1) {
            for (let axis = 0; axis < 3; axis += 1) {
              const value = view.getFloat32(start + vertex * 12 + axis * 4, true);
              minimum[axis] = Math.min(minimum[axis], value);
              maximum[axis] = Math.max(maximum[axis], value);
            }
          }
        }
        const center = minimum.map((value, axis) => (value + maximum[axis]) / 2);
        const largestExtent = Math.max(...maximum.map((value, axis) => value - minimum[axis]));
        const scale = largestExtent > 0 ? 1.65 / largestExtent : 1;
        const vertices = new Float32Array(triangleCount * 3 * 9);

        for (let triangle = 0; triangle < triangleCount; triangle += 1) {
          const record = 84 + triangle * 50;
          const normal = [0, 1, 2].map((axis) => view.getFloat32(record + axis * 4, true));
          const packedColor = view.getUint16(record + 48, true);
          const color = (packedColor & 0x8000) !== 0
            ? defaultColor
            : [
                (packedColor & 0x1f) / 31,
                ((packedColor >> 5) & 0x1f) / 31,
                ((packedColor >> 10) & 0x1f) / 31,
              ];

          for (let vertex = 0; vertex < 3; vertex += 1) {
            const source = record + 12 + vertex * 12;
            const target = (triangle * 3 + vertex) * 9;
            for (let axis = 0; axis < 3; axis += 1) {
              vertices[target + axis] = (view.getFloat32(source + axis * 4, true) - center[axis]) * scale;
              vertices[target + 3 + axis] = normal[axis];
              vertices[target + 6 + axis] = color[axis];
            }
          }
        }

        const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
        if (!gl) throw new Error("WebGL is unavailable");
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        const program = gl.createProgram();
        const buffer = gl.createBuffer();
        if (!vertexShader || !fragmentShader || !program || !buffer) throw new Error("Unable to initialize WebGL");

        gl.shaderSource(vertexShader, `
          attribute vec3 aPosition;
          attribute vec3 aNormal;
          attribute vec3 aColor;
          uniform mat4 uProjection;
          uniform mat4 uView;
          uniform mat4 uModel;
          varying vec3 vNormal;
          varying vec3 vColor;
          void main() {
            gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
            vNormal = mat3(uModel) * aNormal;
            vColor = aColor;
          }
        `);
        gl.shaderSource(fragmentShader, `
          precision mediump float;
          varying vec3 vNormal;
          varying vec3 vColor;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 light = normalize(vec3(0.45, 0.72, 0.8));
            float diffuse = max(dot(normal, light), 0.0);
            float reverseLight = max(dot(normal, -light), 0.0) * 0.16;
            float brightness = 0.42 + diffuse * 0.62 + reverseLight;
            gl_FragColor = vec4(vColor * brightness, 1.0);
          }
        `);
        gl.compileShader(vertexShader);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(vertexShader) || "Vertex shader error");
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(fragmentShader) || "Fragment shader error");
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "Shader link error");
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const stride = 9 * Float32Array.BYTES_PER_ELEMENT;
        const position = gl.getAttribLocation(program, "aPosition");
        const normal = gl.getAttribLocation(program, "aNormal");
        const color = gl.getAttribLocation(program, "aColor");
        gl.enableVertexAttribArray(position);
        gl.enableVertexAttribArray(normal);
        gl.enableVertexAttribArray(color);
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribPointer(color, 3, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
        gl.enable(gl.DEPTH_TEST);

        let pitch = -0.58;
        let yaw = -0.52;
        let distance = 3.25;
        let dragging = false;
        let previousX = 0;
        let previousY = 0;

        function draw() {
          const ratio = Math.min(window.devicePixelRatio || 1, 2);
          const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
          const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }
          gl.viewport(0, 0, width, height);
          gl.clearColor(0.957, 0.953, 0.937, 1);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          const fieldOfView = Math.PI / 4;
          const near = 0.1;
          const far = 100;
          const f = 1 / Math.tan(fieldOfView / 2);
          const projection = new Float32Array([
            f / (width / height), 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) / (near - far), -1,
            0, 0, (2 * far * near) / (near - far), 0,
          ]);
          const camera = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -distance, 1]);
          gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjection"), false, projection);
          gl.uniformMatrix4fv(gl.getUniformLocation(program, "uView"), false, camera);
          gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, rotationMatrix(pitch, yaw));
          gl.drawArrays(gl.TRIANGLES, 0, triangleCount * 3);
        }

        const onPointerDown = (event: PointerEvent) => {
          dragging = true;
          previousX = event.clientX;
          previousY = event.clientY;
          canvas.setPointerCapture(event.pointerId);
        };
        const onPointerMove = (event: PointerEvent) => {
          if (!dragging) return;
          yaw += (event.clientX - previousX) * 0.009;
          pitch = Math.max(-1.45, Math.min(1.45, pitch + (event.clientY - previousY) * 0.009));
          previousX = event.clientX;
          previousY = event.clientY;
          draw();
        };
        const onPointerUp = () => { dragging = false; };
        const onWheel = (event: WheelEvent) => {
          event.preventDefault();
          distance = Math.max(2.15, Math.min(6, distance + event.deltaY * 0.003));
          draw();
        };
        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointercancel", onPointerUp);
        canvas.addEventListener("wheel", onWheel, { passive: false });
        const resizeObserver = new ResizeObserver(draw);
        resizeObserver.observe(canvas);
        draw();
        setStatus("ready");

        dispose = () => {
          resizeObserver.disconnect();
          canvas.removeEventListener("pointerdown", onPointerDown);
          canvas.removeEventListener("pointermove", onPointerMove);
          canvas.removeEventListener("pointerup", onPointerUp);
          canvas.removeEventListener("pointercancel", onPointerUp);
          canvas.removeEventListener("wheel", onWheel);
          gl.deleteBuffer(buffer);
          gl.deleteProgram(program);
          gl.deleteShader(vertexShader);
          gl.deleteShader(fragmentShader);
        };
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setStatus("error");
        }
      }
    }

    loadModel();
    return () => {
      controller.abort();
      dispose();
    };
  }, [active, src]);

  if (!active) {
    return (
      <div className="adaptiv-model-preview">
        <img src={fallback} alt={alt} loading="lazy" />
        <button type="button" onClick={() => { setStatus("loading"); setActive(true); }}>
          <span>Interactive model</span>
          View in 3D <b aria-hidden="true">↗</b>
        </button>
      </div>
    );
  }

  return (
    <div className="adaptiv-model-preview adaptiv-model-preview-active">
      <canvas ref={canvasRef} aria-label={`Interactive 3D model of the ${title}`} />
      <div className="adaptiv-model-status" aria-live="polite">
        {status === "loading" ? "Loading 3D model…" : status === "error" ? "3D preview unavailable" : "Drag to rotate · Scroll to zoom"}
      </div>
      <button className="adaptiv-model-close" type="button" onClick={() => setActive(false)} aria-label="Close 3D model">×</button>
    </div>
  );
}

const adaptivProducts = [
  {
    number: "01",
    title: "Sclobo Keychain",
    client: "Sclobo / Washington",
    category: "Client commission",
    image: "/images/adaptiv/sclobo-keychain.png",
    model: "/models/adaptiv/sclobo-keychain.stl",
    alt: "CAD rendering of the custom bird-emblem keychain developed for Sclobo",
    description: "A custom keychain developed for Sclobo, a Washington-based street-fashion and gaming company, translating its visual identity into a compact physical product.",
  },
  {
    number: "02",
    title: "Personal Commission",
    client: "Independent commission",
    category: "One-off design",
    image: "/images/adaptiv/custom-keychain.png",
    model: "/models/adaptiv/luka-keychain.stl",
    alt: "Black geometric custom keychain designed for a personal commission",
    description: "A one-off keychain created from a friend’s request—an exercise in interpreting an informal brief and turning it into a resolved, printable object.",
  },
  {
    number: "03",
    title: "Spanish Honor Society",
    client: "Sociedad Honoraria Hispánica",
    category: "Organization piece",
    image: "/images/adaptiv/spanish-honor-society-keychain.png",
    model: "/models/adaptiv/spanish-honor-society-keychain.stl",
    alt: "Round Sociedad Honoraria Hispánica keychain with a sun, book, and landscape emblem",
    description: "A detailed keychain developed for the Spanish Honor Society, adapting its seal, lettering, and layered color system for small-format fabrication.",
  },
  {
    number: "04",
    title: "NFC Identity Tag",
    client: "ADAPTIV Studio",
    category: "Connected product",
    image: "/images/adaptiv/nfc-keychain.png",
    model: "/models/adaptiv/nfc-identity-tag.stl",
    alt: "Blue and charcoal ADAPTIV identity keychain designed to contain an NFC tag",
    description: "An NFC-infused keychain for ADAPTIV Studio that connects a physical object to digital information while doubling as a dimensional brand mark.",
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
            <a href="#mechanical-slot-machine"><span>02</span> Mechanical Slot Machine</a>
            <a href="#adaptiv-archive"><span>03</span> Earlier ADAPTIV Work</a>
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

      <section className="mechanical-feature experience-shell" id="mechanical-slot-machine" aria-labelledby="mechanical-heading">
        <div className="mechanical-feature-visual">
          <img src="/images/adaptiv/mechanical-slot-machine.png" alt="Transparent CAD rendering revealing the gears and internal mechanism of a motorless slot machine" loading="lazy" />
          <span>Independent development / 2025</span>
        </div>
        <div className="mechanical-feature-copy">
          <p className="adaptiv-section-number">02 / Mechanical system</p>
          <h3 id="mechanical-heading">A slot machine with no motor.</h3>
          <p>A fully mechanical slot machine powered by its lever and internal gear train. The transparent CAD view is intentionally used here instead of an STL viewer, so the relationship between the casing, gears, reels, and linkage stays visible.</p>
          <div className="mechanical-feature-facts">
            <span>Input</span><strong>Manual lever</strong>
            <span>Motion</span><strong>Gears + linkages</strong>
            <span>Motor</span><strong>None</strong>
          </div>
        </div>
      </section>

      <section className="adaptiv-archive experience-shell" id="adaptiv-archive" aria-labelledby="adaptiv-archive-heading">
        <header className="adaptiv-section-heading adaptiv-archive-heading">
          <div>
            <span className="adaptiv-section-number">03 / Product archive</span>
            <h3 id="adaptiv-archive-heading">Earlier ADAPTIV Work</h3>
          </div>
          <p>Four client and studio projects that move from visual identity to useful, interactive objects.</p>
        </header>

        <div className="adaptiv-product-list">
          {adaptivProducts.map((product) => (
            <article className={`adaptiv-product adaptiv-product-${product.number}`} key={product.number}>
              <div className="adaptiv-product-image">
                <span className="adaptiv-product-index">A—{product.number}</span>
                {product.model ? (
                  <ProductModelPreview src={product.model} fallback={product.image} alt={product.alt} title={product.title} />
                ) : (
                  <img src={product.image} alt={product.alt} loading="lazy" />
                )}
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
