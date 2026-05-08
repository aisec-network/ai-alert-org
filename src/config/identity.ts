export interface IdentityFont {
  id: string;
  display: string;
  body: string;
  mono: string;
  google_fonts_url: string;
  stack_display: string;
  stack_body: string;
  stack_mono: string;
}

export interface IdentityPalette {
  id: string;
  hue: number;
  neutral_family: string;
  accent: string;
  accent_dark: string;
  surface: string;
  surface_alt: string;
  fg: string;
  fg_muted: string;
  border: string;
  surface_dark: string;
  surface_alt_dark: string;
  fg_dark: string;
  fg_muted_dark: string;
  border_dark: string;
}

export interface IdentityLayout {
  id: "magazine" | "dashboard" | "feed" | "directory" | "longform" | "kiosk";
  component: string;
  component_path: string;
  density: "loose" | "normal" | "dense";
  brief: string;
}

export interface IdentityVoice {
  id: string;
  label_latest: string;
  label_recent: string;
  label_featured: string;
  label_more: string;
  nav_posts: string;
  nav_about: string;
  cta_subscribe: string;
  cta_subscribe_desc: string;
  cta_button: string;
  site_motto: string;
}

export interface Identity {
  font: IdentityFont;
  palette: IdentityPalette;
  layout: IdentityLayout;
  voice: IdentityVoice;
}

export const identity: Identity = {
  "font": {
    "id": "f23_sans_publicsans_publicsans",
    "display": "Public Sans",
    "body": "Public Sans",
    "mono": "JetBrains Mono",
    "google_fonts_url": "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap",
    "stack_display": "\"Public Sans\", \"Helvetica Neue\", system-ui, sans-serif",
    "stack_body": "\"Public Sans\", \"Helvetica Neue\", system-ui, sans-serif",
    "stack_mono": "\"JetBrains Mono\", ui-monospace, monospace"
  },
  "palette": {
    "id": "p13_h248_ink",
    "hue": 248,
    "neutral_family": "ink",
    "accent": "60 36 219",
    "accent_dark": "100 79 238",
    "surface": "255 255 255",
    "surface_alt": "245 245 245",
    "fg": "10 10 10",
    "fg_muted": "80 80 80",
    "border": "220 220 220",
    "surface_dark": "10 10 10",
    "surface_alt_dark": "22 22 22",
    "fg_dark": "240 240 240",
    "fg_muted_dark": "160 160 160",
    "border_dark": "50 50 50"
  },
  "layout": {
    "id": "dashboard",
    "component": "HomeDashboard",
    "component_path": "@components/clusters/HomeDashboard.astro",
    "density": "normal",
    "brief": "Sidebar + main + right rail metric cards."
  },
  "voice": {
    "id": "v10_almanac",
    "label_latest": "This week",
    "label_recent": "Almanac",
    "label_featured": "This week's headliner",
    "label_more": "Read entry",
    "nav_posts": "Almanac",
    "nav_about": "Editors",
    "cta_subscribe": "Weekly almanac",
    "cta_subscribe_desc": "One email per week. Curated, ranked, dated.",
    "cta_button": "Subscribe",
    "site_motto": "The weekly almanac for AI security."
  }
} as const;
