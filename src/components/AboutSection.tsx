import { ABOUT } from "@/content/portfolio";
import styles from "./EditorialSections.module.css";

export function AboutSection() {
  return (
    <section className={styles.about} id="about" aria-labelledby="about-title">
      <h2 id="about-title">{ABOUT.heading}</h2>
      <div className={styles.aboutCopy}>
        <p>{ABOUT.body}</p>
      </div>
    </section>
  );
}
