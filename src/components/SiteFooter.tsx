import { SITE } from "@/content/portfolio";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span>{SITE.name} / Selected Technical Work</span>
      <span>{SITE.location} / {SITE.year}</span>
    </footer>
  );
}
