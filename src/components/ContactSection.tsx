import { CONTACT } from "@/content/portfolio";
import styles from "./EditorialSections.module.css";

export function ContactSection() {
  return (
    <section className={styles.contact} id="contact" aria-labelledby="contact-title">
      <div className={styles.sectionLabel}>Contact</div>
      <div>
        <h2 id="contact-title">{CONTACT.heading}</h2>
        <p className={styles.contactNote}>{CONTACT.note}</p>
        <div className={styles.contactLinks}>
          <a href={`mailto:${CONTACT.email}`}>Email ↗</a>
          {CONTACT.links.map((link) => {
            const external = link.href.startsWith("http");
            return (
              <a
                key={link.label}
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                {link.label} ↗
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
