import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | EnviroHealth",
  description:
    "EnviroHealth privacy policy — what data we collect, what we don't, and how we use public environmental data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-bold text-[var(--accent-gold)]">
              EnviroHealth
            </h1>
          </a>
          <a
            href="/"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition"
          >
            ← Back to Search
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Privacy Policy
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-12">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-10 text-[var(--text-secondary)]">
          <section>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">
              🔍 What We Collect
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-gold)] mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--text-primary)]">Search queries:</strong> The addresses and
                  ZIP codes you search are sent to our server to generate reports. We do not
                  permanently store these.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-gold)] mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--text-primary)]">Analytics:</strong> We use{" "}
                  <a href="https://vercel.com/analytics" className="text-[var(--accent-gold)] hover:underline" target="_blank" rel="noopener">Vercel Analytics</a>{" "}
                  and optionally{" "}
                  <a href="https://posthog.com" className="text-[var(--accent-gold)] hover:underline" target="_blank" rel="noopener">PostHog</a>{" "}
                  to understand how people use EnviroHealth (page views, feature usage). These tools
                  use anonymized data and do not track you across other websites.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-gold)] mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--text-primary)]">Performance data:</strong> Basic performance
                  metrics (page load times, web vitals) to help us improve the experience.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">
              🚫 What We Don&apos;t Collect
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-green)] mt-0.5">✓</span>
                <span>No personal information (name, email, phone number)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-green)] mt-0.5">✓</span>
                <span>No account creation or login required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-green)] mt-0.5">✓</span>
                <span>No cookies for advertising or cross-site tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-green)] mt-0.5">✓</span>
                <span>No selling or sharing of data with third parties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-green)] mt-0.5">✓</span>
                <span>No permanent storage of your search history</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">
              📊 Data Sources
            </h3>
            <p className="text-sm mb-3">
              All environmental and health data displayed in reports comes from publicly available
              US federal databases:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-gold)] mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--text-primary)]">EPA Envirofacts</strong> — Water safety
                  violations and toxic release inventory (TRI)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-gold)] mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--text-primary)]">AirNow API</strong> — Real-time air
                  quality index (AQI) and pollutant data
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-gold)] mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--text-primary)]">CDC PLACES</strong> — Community health
                  outcomes and disease prevalence
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-gold)] mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--text-primary)]">FEMA National Risk Index</strong> —
                  Natural hazard risk assessments
                </span>
              </li>
            </ul>
            <p className="text-sm mt-3 text-[var(--text-muted)]">
              This data is public domain and freely available. EnviroHealth simply aggregates it
              into a single, easy-to-read report.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">
              🔓 Open Source
            </h3>
            <p className="text-sm">
              EnviroHealth is open source. You can review the entire codebase, including all data
              handling, at{" "}
              <a
                href="https://github.com/molt-ai/env-health"
                className="text-[var(--accent-gold)] hover:underline"
                target="_blank"
                rel="noopener"
              >
                github.com/molt-ai/env-health
              </a>
              .
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">
              📬 Contact
            </h3>
            <p className="text-sm">
              Questions about privacy? Open an issue on{" "}
              <a
                href="https://github.com/molt-ai/env-health/issues"
                className="text-[var(--accent-gold)] hover:underline"
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
              .
            </p>
          </section>
        </div>
      </article>

      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-muted)]">
        <p>
          EnviroHealth — Environmental health data aggregator.{" "}
          <a
            href="https://github.com/molt-ai/env-health"
            className="text-[var(--accent-gold-dim)] hover:text-[var(--accent-gold)]"
            target="_blank"
            rel="noopener"
          >
            Open source
          </a>
        </p>
      </footer>
    </main>
  );
}
