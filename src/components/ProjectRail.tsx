"use client";

import type { CSSProperties } from "react";
import { PROJECT_RAIL_QUERY } from "@/config/introTimeline";
import { PROJECTS } from "@/content/portfolio";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { SystemDiagram } from "./SystemDiagram";
import styles from "./ProjectRail.module.css";

export function ProjectRail() {
  const [scrollRef, progress] = useScrollProgress<HTMLDivElement>();

  const desktop = useMediaQuery(PROJECT_RAIL_QUERY);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const cinematic = desktop && !reducedMotion;

  const translate = progress * (PROJECTS.length - 1) * 100;

  const trackStyle: CSSProperties | undefined = cinematic
    ? {
      transform: `translate3d(-${translate}vw, 0, 0)`,
    }
    : undefined;

  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-title">
      <header className={styles.headingRow}>
        <h2 id="projects-title">Selected projects</h2>
        <span>Scroll ↓ / projects move laterally</span>
      </header>

      <div
        id="projects-scroll"
        ref={scrollRef}
        className={styles.scroll}
        style={{ height: `${Math.max(1, PROJECTS.length) * 100}vh` }}
      >
        <div className={styles.sticky}>
          <div
            className={styles.track}
            style={{ ...(trackStyle ?? {}), width: `${PROJECTS.length * 100}vw` }}
          >
            {PROJECTS.map((project) => (
              <article
                className={styles.project}
                id={project.id}
                key={project.id}
                aria-labelledby={`${project.id}-title`}
              >
                <div className={styles.topline}>
                  <span>{project.number} / {project.category}</span>
                  <span className={styles.stack}>{project.stack}</span>
                </div>

                <div className={styles.body}>
                  <div className={styles.copy}>
                    <h3 id={`${project.id}-title`}>{project.title}</h3>
                    <p className={styles.lead}>{project.lead}</p>
                    <div className={styles.detailCopy}>
                      {project.detail.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                    <div className={styles.metrics}>
                      {project.metrics.map((metric) => (
                        <div className={styles.metric} key={metric.label}>
                          <strong>{metric.value}</strong>
                          <span>{metric.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <SystemDiagram project={project} />
                </div>

                <footer className={styles.footer}>
                  <span>{project.footer}</span>
                  <div className={styles.links}>
                    {project.links.map((link) => {
                      const external = link.href.startsWith("http");
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noreferrer" : undefined}
                        >
                          {link.label} <span aria-hidden="true">↗</span>
                        </a>
                      );
                    })}
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
