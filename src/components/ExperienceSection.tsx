import { EXPERIENCE } from "@/content/portfolio";
import styles from "./EditorialSections.module.css";

export function ExperienceSection() {
  return (
    <section className={styles.editorialSection} id="experience" aria-labelledby="experience-title">
      <div className={styles.sectionLabel}>Experience</div>
      <div>
        <h2 id="experience-title">{EXPERIENCE.company}</h2>

        <div className={styles.experienceLead}>
          <div className={styles.rowLabel}>
            {EXPERIENCE.role}<br />
            {EXPERIENCE.team}<br />
            {EXPERIENCE.location} · {EXPERIENCE.dates}
          </div>
          <p>{EXPERIENCE.overview}</p>
        </div>

        {EXPERIENCE.sections.map((section) => (
          <div className={styles.row} key={section.label}>
            <div className={styles.rowLabel}>{section.label}</div>
            <p>{section.text}</p>
          </div>
        ))}

        <div className={styles.metricGrid} aria-label="Morgan Stanley outcomes">
          {EXPERIENCE.metrics.map((metric) => (
            <div className={styles.metric} key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
