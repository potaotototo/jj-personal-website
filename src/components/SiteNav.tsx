import { NAV_ITEMS } from "@/content/portfolio";
import styles from "./SiteNav.module.css";

export function SiteNav() {
  return (
    <nav className={styles.nav} aria-label="Primary navigation">
      <a className={styles.brand} href="#top">
        WJ / 26
      </a>
      <span className={styles.index}>Selected Technical Work</span>
      <div className={styles.links}>
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
