import type { Project } from "@/content/portfolio";
import styles from "./ProjectRail.module.css";

export function SystemDiagram({ project }: { project: Project }) {
  return (
    <div
      className={`${styles.systemFrame} ${styles[`tone_${project.tone}`]}`}
      aria-label={`${project.title} architecture diagram`}
    >
      <span className={styles.systemCaption}>{project.diagram.caption}</span>
      <div className={styles.flow}>
        <div className={styles.flowRow}>
          {project.diagram.nodes.map((node, index) => (
            <div className={styles.flowFragment} key={node.title}>
              <div className={styles.diagramNode}>
                <b>{node.title}</b>
                <small>{node.meta}</small>
              </div>
              {index < project.diagram.nodes.length - 1 ? (
                <span className={styles.arrow} aria-hidden="true">→</span>
              ) : null}
            </div>
          ))}
        </div>
        <p className={styles.flowNote}>{project.diagram.note}</p>
      </div>
    </div>
  );
}
