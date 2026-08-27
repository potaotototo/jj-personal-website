import { EDUCATION } from "@/content/portfolio";
import styles from "./EditorialSections.module.css";

export function EducationSection() {
  return (
    <section className={styles.editorialSection} id="education" aria-labelledby="education-title">
      <div className={styles.sectionLabel}>Education</div>
      <div>
        <h2 id="education-title">{EDUCATION.institution}</h2>
        <div className={styles.row}>
          <div className={styles.rowLabel}>{EDUCATION.dates}</div>
          <p>{EDUCATION.degree}.</p>
        </div>
        <div className={styles.row}>
          <div className={styles.rowLabel}>Second major</div>
          <p>{EDUCATION.secondMajor.replace("Second Major in ", "")}.</p>
        </div>
        <div className={styles.row}>
          <div className={styles.rowLabel}>Specialiations</div>
          <p>{EDUCATION.specialisations}</p>
        </div>
        <div className={styles.row}>
          <div className={styles.rowLabel}>Favourite courses</div>
          <p>{EDUCATION.favouriteCourses.join(" · ")}</p>
        </div>
      </div>
    </section>
  );
}
