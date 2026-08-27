import type { Metadata } from "next";
import Link from "next/link";
import { MonteCarloTrace } from "@/components/monte-carlo/MonteCarloTrace";
import { TRACE_COPY } from "@/components/monte-carlo/traceData";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Monte Carlo Runtime Visualisation — Wang Jingjing",
  description:
    "Interactive visualisation of counter-based Philox randomness, parallel block scheduling, fixed Welford reduction and crash recovery in a fault-tolerant Monte Carlo runtime.",
};

export default function MonteCarloVisualisationPage() {
  return (
    <main className={styles.page}>
      <header className={styles.routeNav}>
        <Link href="/#project-monte-carlo">← Back to project</Link>
        <span>{TRACE_COPY.title}</span>
        <span>{TRACE_COPY.routeLabel}</span>
      </header>

      <MonteCarloTrace />

      <footer className={styles.footer}>
        <span>European / Asian options · GBM + Heston · Andersen QE</span>
        <div className={styles.footerLinks}>
          <a href="https://github.com/potaotototo/monte-carlo" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <Link href="/#projects">Selected projects ↑</Link>
        </div>
      </footer>
    </main>
  );
}
