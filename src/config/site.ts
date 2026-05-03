export interface SisterSite {
  domain: string;
  url: string;
  title: string;
  tagline: string;
}

export interface SiteConfig {
  domain: string;
  url: string;
  title: string;
  tagline: string;
  description: string;
  byline: string;
  language: string;
  locale: string;
  themeColor: string;
  brand: { accentHue: number };
  social: { twitter?: string; rss: string };
  email: { contact: string; abuse: string; editor: string };
  newsletter: {
    enabled: boolean;
    provider?: "beehiiv" | "mailerlite" | "convertkit" | "buttondown" | "none";
    embedUrl?: string;
  };
  affiliate: { disclosure: string };
  sister: SisterSite[];
  analytics: { plausibleDomain?: string; ga4Id?: string };
}

export const portfolio: SisterSite[] = [
  { domain: "aisec.blog", url: "https://aisec.blog", title: "AI Sec", tagline: "Offensive AI security writeups" },
  { domain: "sentryml.com", url: "https://sentryml.com", title: "SentryML", tagline: "ML observability & MLOps" },
  { domain: "guardml.io", url: "https://guardml.io", title: "GuardML", tagline: "Defensive AI & guardrails" },
  { domain: "ai-alert.org", url: "https://ai-alert.org", title: "AI Alert", tagline: "AI incident & vulnerability tracker" },
  { domain: "neuralwatch.org", url: "https://neuralwatch.org", title: "NeuralWatch", tagline: "AI policy & ethics watchdog" },
  { domain: "techsentinel.news", url: "https://techsentinel.news", title: "Tech Sentinel", tagline: "Cybersecurity news, daily" },
];

export const siteConfig: SiteConfig = {
  domain: "ai-alert.org",
  url: "https://ai-alert.org",
  title: "AI Alert",
  tagline: "AI incidents and vulnerabilities — tracked, sourced, dated.",
  description:
    "An incident and vulnerability tracker for AI/ML systems. Model leaks, training-data exposures, jailbreak disclosures, ML library CVEs, vendor breaches, and confirmed prompt-injection-in-the-wild — each entry linked to a primary source, dated, and tagged for filtering.",
  byline: "AI Alert Desk",
  language: "en",
  locale: "en_US",
  themeColor: "#0a0a0a",
  brand: { accentHue: 0 },
  social: { rss: "/rss.xml" },
  email: {
    contact: "hello@ai-alert.org",
    abuse: "abuse@ai-alert.org",
    editor: "editor@ai-alert.org",
  },
  newsletter: { enabled: false, provider: "none" },
  affiliate: {
    disclosure:
      "Some links in this post are affiliate links. We may earn a small commission at no extra cost to you. Editorial coverage is not influenced by affiliate relationships.",
  },
  sister: portfolio.filter((s) => s.domain !== "ai-alert.org"),
  analytics: {},
};
