"use client";

import type { CSSProperties, MouseEvent } from "react";
import {
  CAMERA,
  INTRO_CINEMATIC_QUERY,
  INTRO_SCROLL_VH,
  INTRO_TIMELINE,
  NODE_MOTION,
  ORBIT_RINGS,
  STAR_FIELD,
  type IntroAnchor,
} from "@/config/introTimeline";
import { INTRO_NODES, PROJECTS, SITE } from "@/content/portfolio";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { generateStarField, resolveOrbitPoint } from "@/lib/cinematicField";
import { introNodeMotion, lerp, progressBetween, smoothstep } from "@/lib/timeline";
import styles from "./CinematicIntro.module.css";

const contentById = new Map(INTRO_NODES.map((item) => [item.id, item]));
const stars = generateStarField(STAR_FIELD.count, STAR_FIELD.seed);

function projectScrollTop(index: number) {
  const rail = document.getElementById("projects-scroll");
  if (!rail || PROJECTS.length <= 1) return null;

  const max = Math.max(0, rail.offsetHeight - window.innerHeight);
  const sectionTop = window.scrollY + rail.getBoundingClientRect().top;
  return sectionTop + max * (index / (PROJECTS.length - 1));
}

function anchorTranslate(anchor: IntroAnchor | undefined) {
  if (anchor === "center") return -50;
  if (anchor === "end") return -100;
  return 0;
}

function anchorOrigin(anchor: IntroAnchor | undefined) {
  if (anchor === "center") return "50% 50%";
  if (anchor === "end") return "100% 50%";
  return "0 50%";
}

export function CinematicIntro() {
  const [sectionRef, progress] = useScrollProgress<HTMLElement>();
  const introViewport = useMediaQuery(INTRO_CINEMATIC_QUERY);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const cinematic = introViewport && !reducedMotion;

  const orbitZoomAmount = smoothstep(Math.min(1, progress / CAMERA.orbitZoomEnd));
  const orbitScale = lerp(CAMERA.orbitStartScale, CAMERA.orbitEndScale, orbitZoomAmount);
  const nameZoomAmount = smoothstep(Math.min(1, progress / CAMERA.nameZoomEnd));
  const nameScale = lerp(CAMERA.nameStartScale, CAMERA.nameEndScale, nameZoomAmount);

  const cameraStyle: CSSProperties | undefined = cinematic
    ? { transform: `scale(${orbitScale})` }
    : undefined;

  const nameStyle: CSSProperties | undefined = cinematic
    ? { transform: `translate3d(-50%, -50%, 0) scale(${nameScale})` }
    : undefined;

  const handleNodeClick = (event: MouseEvent<HTMLAnchorElement>, projectIndex?: number) => {
    if (!cinematic || projectIndex === undefined) return;
    const top = projectScrollTop(projectIndex);
    if (top === null) return;

    event.preventDefault();
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `#${PROJECTS[projectIndex].id}`);
  };

  return (
    <section
      ref={sectionRef}
      id="intro"
      className={styles.scrollSection}
      aria-label="Introduction"
      style={{ height: `${INTRO_SCROLL_VH}vh` }}
    >
      <div className={styles.sticky}>
        <div className={styles.frame}>
          <div className={styles.starField} aria-hidden="true">
            {stars.map((star) => (
              <span
                key={star.id}
                className={styles.star}
                style={{
                  left: `${star.x * 100}%`,
                  top: `${star.y * 100}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                }}
              />
            ))}
          </div>

          <div className={styles.cameraLayer} style={cameraStyle} aria-hidden="true">
            {ORBIT_RINGS.map((ring) => {
              const reveal = progressBetween(progress, ring.revealStart, ring.revealEnd);
              return (
                <div
                  key={ring.id}
                  className={styles.orbit}
                  style={{
                    left: `${ring.left}%`,
                    top: `${ring.top}%`,
                    width: `${ring.width}%`,
                    height: `${ring.height}%`,
                    transform: `rotate(${ring.rotationDeg}deg)`,
                    borderColor: ring.color,
                    opacity: cinematic ? reveal * ring.opacity : 0,
                  }}
                />
              );
            })}
          </div>

          <div className={styles.contentLayer}>
            <div className={styles.nameBlock} style={nameStyle}>
              <h1>{SITE.name.toUpperCase()}</h1>
            </div>

            {INTRO_TIMELINE.map((timing, index) => {
              const item = contentById.get(timing.id);
              if (!item) return null;

              const point = resolveOrbitPoint(timing.orbit);
              const settleAt = INTRO_TIMELINE[index + 1]?.at ?? CAMERA.finalSettleAt;
              const motion = introNodeMotion(
                progress,
                timing.at,
                settleAt,
                timing.duration,
                {
                  fromY: timing.fromY,
                  fromScale: timing.fromScale,
                  settledOpacity: NODE_MOTION.settledOpacity,
                  settledDetailOpacity: NODE_MOTION.settledDetailOpacity,
                  settleDuration: NODE_MOTION.settleDuration,
                },
              );
              const anchorX = anchorTranslate(timing.orbit.anchor);

              const motionStyle: CSSProperties | undefined = cinematic
                ? {
                    left: `${point.x * 100}%`,
                    top: `${point.y * 100}%`,
                    width: timing.orbit.width,
                    opacity: motion.opacity,
                    transform: `translate3d(${anchorX}%, ${motion.translateY}px, 0) scale(${motion.scale})`,
                    transformOrigin: anchorOrigin(timing.orbit.anchor),
                    pointerEvents: motion.revealed ? "auto" : "none",
                  }
                : undefined;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`${styles.node} ${
                    timing.variant === "education"
                      ? styles.educationNode
                      : timing.variant === "experience"
                        ? styles.experienceNode
                        : styles.projectNode
                  }`}
                  style={motionStyle}
                  onClick={(event) => handleNodeClick(event, item.projectIndex)}
                >
                  <span
                    className={styles.nodeLabel}
                    style={cinematic ? { opacity: motion.detailOpacity } : undefined}
                  >
                    <span>{item.label}</span>
                    <span className={styles.nodeArrow} aria-hidden="true">↘</span>
                  </span>
                  <strong>{item.title}</strong>
                  {item.body ? (
                    <span
                      className={styles.nodeBody}
                      style={cinematic ? { opacity: motion.detailOpacity } : undefined}
                    >
                      {item.body}
                    </span>
                  ) : null}
                </a>
              );
            })}
          </div>

          <div className={styles.status} aria-hidden="true">
            <span>Scroll to widen the frame</span>
            <span className={styles.progressTrack}>
              <span style={cinematic ? { transform: `scaleX(${progress})` } : undefined} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
