---
title: "How to Track AI Security Alerts: CISA, NIST, Vendor Advisories, and Research Feeds"
description: "A practical guide to the official and community sources for AI security alerts — what each publishes, how frequently, and how to integrate them into a monitoring workflow without alert fatigue."
pubDate: 2026-05-11
author: "Theo Voss"
tags: ["ai-security-alert", "cisa", "nist", "advisory", "monitoring", "threat-intelligence", "patch-management"]
category: "analysis"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/how-to-track-ai-security-alerts.png
heroAlt: "Tracking AI Security Alerts: CISA, NIST, and Vendor Sources"
sources:
  - title: "CISA AI Security Guidance"
    url: "https://www.cisa.gov/ai"
  - title: "NIST AI Risk Management Framework"
    url: "https://www.nist.gov/system/files/documents/2023/01/26/AI RMF 1.0.pdf"
  - title: "CISA Known Exploited Vulnerabilities Catalog"
    url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
  - title: "NVD CVE Feed"
    url: "https://nvd.nist.gov/vuln/search"
schema:
  type: "TechArticle"
---

Security teams managing AI systems face a fragmented alerting landscape. Unlike traditional software, where a small number of well-established channels — NVD, vendor security bulletins, CVE feeds — cover most of what matters, the AI security alert ecosystem is distributed across government agencies, ML framework maintainers, foundation model vendors, academic research groups, and community trackers. Knowing which sources are authoritative for which types of incidents, and how to build a monitoring workflow that doesn't drown in noise, is non-trivial.

This post maps the major AI security alert sources, describes what each publishes and at what cadence, and proposes a tiered monitoring structure that covers the full AI stack without requiring a full-time analyst.

---

## Why AI Security Alerts Are Harder to Track Than Traditional Software Advisories

Traditional enterprise software has decades of practice at advisory publishing. Vendors maintain dedicated product security teams, publish CVEs through MITRE, and push to NVD. Security teams subscribe to vendor bulletins, pipe NVD into their SIEM or vulnerability management platform, and act on what arrives.

AI/ML systems break this pattern in several ways:

**The stack is deep and heterogeneous.** A single AI system might run on Python 3.11, use PyTorch for inference, serve requests through vLLM, store embeddings in a vector database, orchestrate with LangChain, and be deployed on a Kubernetes cluster. Each of those layers has its own disclosure channel, and most of them are not enterprises with mature security organizations.

**Many AI components are not formally CVE-assigned.** A disclosed vulnerability in an open-source ML framework might appear first on a GitHub security advisory, then in a maintainer blog post, then — weeks later — in NVD. Teams relying solely on CVE feeds miss the initial disclosure window, which is often when exploitation risk is highest.

**Model-layer risks have no CVE equivalent.** Prompt injection vulnerabilities, jailbreaks, training data poisoning, and model theft are not tracked in CVE databases at all. These require different alerting sources: academic preprints, red-team disclosures, and community tracking databases.

**Vendor transparency is inconsistent.** Foundation model providers publish safety incident disclosures at different levels of detail and on different schedules. OpenAI, Anthropic, Google DeepMind, and Meta AI each have different disclosure postures, and none is formally integrated with CISA or NVD.

The result is that comprehensive AI security alert monitoring requires integrating at least four distinct source categories: government advisories, ML component CVEs, model-layer disclosures, and research outputs.

---

## Tier 1: Government and Regulatory Sources

### CISA AI Security Guidance

The Cybersecurity and Infrastructure Security Agency maintains a dedicated AI security section at `cisa.gov/ai`. CISA's AI-relevant outputs include:

- **Joint advisories** on AI security threats published with partner agencies (NSA, FBI, international CERTs). These are typically high-signal, operationally focused documents covering confirmed threat actor activity against AI systems.
- **AI-specific secure-by-design guidance** documents — currently covering securing AI deployments, AI bill of materials practices, and securing the supply chain for models and datasets.
- **Known Exploited Vulnerabilities (KEV) additions** relevant to AI/ML infrastructure. CISA's KEV catalog covers components actively exploited in the wild, which includes AI-adjacent components (Python, Jupyter, Kubernetes, GPU drivers). For a breakdown of KEV entries relevant to AI systems, see our [CISA KEV analysis for AI/ML systems](/posts/cisa-kev-ai-ml-vulnerabilities-analysis/).

CISA publishes sporadically — joint advisories appear a few times per year, while KEV additions are continuous. The CISA AI page does not have an RSS feed, but the KEV catalog does publish a JSON feed that can be monitored for additions.

**Cadence:** KEV: continuous (check weekly). Joint advisories: 4-8 per year.

**How to monitor:** Subscribe to CISA alerts at `cisa.gov/news-events/alerts`. For KEV specifically, use the JSON feed at `cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json` and filter for components in your AI/ML stack.

### NIST AI Risk Management Framework (AI RMF) and AI 100 Series

NIST publishes AI security guidance primarily through the AI RMF (NIST AI 100-1) and the subsequent AI 100 series, which covers specific risk domains including adversarial machine learning (AI 100-4), generative AI (AI 100-1 generative extension), and cybersecurity of AI systems. These are not advisory documents in the traditional sense — they don't publish active threat indicators or CVEs — but they provide the governance framework within which most compliance-driven AI security programs operate.

NIST also maintains the National Vulnerability Database (NVD), which is the authoritative repository for CVE records including those relevant to AI/ML components. NVD receives CVE data from MITRE and enriches it with CVSS scoring and additional metadata.

**Cadence:** NVD: continuous. NIST AI 100 series: publication-driven (a few documents per year).

**How to monitor:** NVD JSON feeds by component or keyword. For AI-specific framework updates, monitor `nist.gov/artificial-intelligence`.

### NSA and NCSC Joint Publications

The NSA, in coordination with NCSC (UK), ACSC (Australia), and other Five Eyes partners, has published AI security guidance covering topics including securing AI infrastructure, protecting model intellectual property, and LLM red-teaming guidance. These documents tend to be more operational than NIST guidance and more tactical than CISA's general advisories.

**Cadence:** Occasional — published when a topic reaches sufficient operational importance.

**How to monitor:** Subscribe to NSA Cybersecurity advisories at `nsa.gov/Press-Room/Cybersecurity-Advisories-Technical-Guidance/`.

---

## Tier 2: ML Framework and Tooling Advisories

### GitHub Security Advisories (GHSA)

The majority of open-source AI/ML frameworks — PyTorch, TensorFlow, Hugging Face transformers, LangChain, vLLM, Ollama, ChromaDB, Weaviate — publish security advisories through GitHub's security advisory system. GHSA advisories are published before NVD in most cases, often by weeks. For AI/ML components with rapid exploitation timelines, the GHSA publication is the first authoritative alert.

GitHub allows subscribing to security advisories for specific repositories via the repository's "Watch" functionality, or via the GitHub Advisory Database API at `api.github.com/advisories`.

**Key repositories to monitor for AI/ML:**
- `pytorch/pytorch`
- `tensorflow/tensorflow`
- `huggingface/transformers`
- `langchain-ai/langchain`
- `vllm-project/vllm`
- `ollama/ollama`
- `chroma-core/chroma`
- `weaviate/weaviate`
- `qdrant/qdrant`
- `apache/airflow` (ML pipeline orchestration)
- `jupyter/notebook` and `jupyterhub/jupyterhub`

**Cadence:** Continuous, published as discovered.

**How to monitor:** GitHub repository "Watch" with security alert notifications. For programmatic access, the GHSA REST API supports filtering by ecosystem, severity, and date range.

### PyPI Malware Reports

The Python Package Index (PyPI) is the primary distribution channel for AI/ML libraries and a persistent target for supply chain attacks. PyPI-reported malicious packages targeting AI/ML environments have included typosquat attacks on popular ML libraries, packages embedding credential stealers in install scripts, and packages that exfiltrate local model weights or API keys on import.

PyPI's security team publishes removal notices and malware reports, but these are not aggregated in a machine-readable feed. Community aggregators, including the Open Source Security Foundation's Package Analysis project, maintain more comprehensive tracking.

**Cadence:** Continuous.

**How to monitor:** PyPI Security blog. OSSF Package Analysis project outputs. Commercial SCA tools with PyPI malware detection.

### Vendor-Specific Security Bulletins

Foundation model providers and major AI platform vendors publish security bulletins and incident disclosures on varying schedules:

- **OpenAI:** Publishes security disclosures in the `openai.com/blog` and maintains a security page at `openai.com/security`. OpenAI's bug bounty program through HackerOne surfaces some vulnerability disclosures publicly.
- **Anthropic:** Security policy and disclosures published at `anthropic.com/security`. Anthropic's Constitutional AI and red-teaming work is published in research papers but not through a structured advisory channel.
- **Google DeepMind:** Security disclosures related to Gemini and other models are published through Google's Project Zero and Security blogs. Vertex AI advisories appear in Google Cloud's security bulletins.
- **Hugging Face:** Security advisories published to GitHub (`huggingface/hub-docs` security advisories) and through the GHSA database. The Hugging Face platform publishes notices of malicious model removals via blog posts.
- **NVIDIA:** NVIDIA publishes security bulletins for GPU drivers, CUDA, and Triton Inference Server through `nvidia.com/en-us/security/`. These are formally integrated with the CVE process and appear in NVD.

For a detailed breakdown of Hugging Face incidents and supply chain risks, see our post on [compromised Hugging Face models and pickle exploits](/posts/compromised-huggingface-models-pickle-exploits/).

---

## Tier 3: Research and Community Sources

### arXiv cs.CR and cs.LG Security Papers

A substantial share of AI security vulnerability research is published on arXiv before peer review, sometimes before vendor notification. The `cs.CR` (Cryptography and Security) and `cs.LG` (Machine Learning) arXiv categories contain papers on adversarial examples, prompt injection, model extraction, training data poisoning, and LLM jailbreaks that may represent novel AI security threats.

arXiv publishes daily digest emails by category. For AI security tracking, monitoring both `cs.CR` and `cs.LG` for keywords (prompt injection, adversarial, jailbreak, poisoning, extraction, membership inference) surfaces research-stage threats before they become operational concerns.

**Cadence:** Daily.

**How to monitor:** arXiv email lists (`arxiv.org/help/subscribe`). Semantic Scholar and Papers With Code APIs for keyword-based filtering.

### AI Incident Database

The AI Incident Database (AIID) at `incidentdatabase.ai` maintains a structured record of AI-related incidents, including security incidents. AIID's taxonomy is broader than security-only (it includes safety incidents, bias incidents, and operational failures), but filtering for security-relevant entries provides a useful longitudinal view of how AI security incidents materialize in production.

**Cadence:** Continuous additions; weekly digest available.

**How to monitor:** AIID RSS feed and email subscription.

### Community Aggregators and Trackers

Several community-maintained resources aggregate AI security alerts and incidents:

- **mlcves.com** — maintains a database of CVEs affecting ML infrastructure components with component-level filtering and severity scoring.
- **LLM Security** (llmsecurity.net) — tracks prompt injection, jailbreaks, and LLM-specific attack research.
- **Hacker News AI security threads** — high-signal community discussion of newly disclosed AI vulnerabilities, particularly for open-source components.

---

## Building a Monitoring Workflow

Given the volume of sources, a tiered monitoring approach prevents alert fatigue:

### Daily (high-priority, low-effort check)

- **CISA KEV JSON feed diff:** Automate a daily comparison of the KEV JSON against your AI/ML component inventory. Any new KEV addition matching your stack is an immediate action item.
- **GHSA new advisories:** Pull new GHSA advisories for repositories in your AI/ML stack. Filter by severity: Critical and High get same-day review; Medium gets weekly batched review.
- **Vendor security RSS/blog:** Subscribe to feeds for your specific foundation model providers.

### Weekly (structured review)

- **NVD CVE feed for AI/ML keywords:** Run a weekly NVD query for CVEs in components from your ML stack. This catches CVEs that were not yet in GHSA, or which have received NVD enrichment since initial disclosure.
- **arXiv digest review:** Scan `cs.CR` and `cs.LG` weekly digest for security-relevant paper titles. Full read is only needed for papers that appear to describe novel exploitable techniques.
- **mlcves.com new entries:** Weekly check for new ML CVE entries, particularly for frameworks and serving infrastructure you run.

### Monthly (strategic, lower cadence)

- **CISA joint advisory review:** Read any new CISA AI joint advisories in full. These are infrequent but high-signal.
- **AI Incident Database additions:** Review recent AIID entries for security-category incidents. Useful for identifying emerging incident patterns before they become your incident.
- **PyPI malware report review:** Review reported malicious PyPI packages for anything in the ML ecosystem you depend on.

---

## Integrating AI Security Alerts Into Existing Workflows

Most security teams already have a vulnerability management workflow centered on CVE feeds and patch cycles. Integrating AI security alerts requires extending that workflow in two directions:

**Extend the asset inventory to include ML components.** Traditional vulnerability management operates on a software bill of materials (SBOM) for applications. Effective AI security alert monitoring requires an SBOM that includes model serving frameworks, ML libraries, vector databases, orchestration tools, and notebook infrastructure — components that are often managed by ML engineers outside of IT security visibility.

**Add a non-CVE alert category.** CVE-based workflows have no mechanism for tracking model-layer threats (prompt injection, jailbreaks) or ML-specific supply chain risks (malicious models, poisoned training data). These require separate tracking, typically in a threat intelligence platform or even a simple structured notes system, with defined review triggers (new class of technique discovered, vendor discloses breach of model repository).

For organizations using the NIST AI RMF as a governance framework, the GOVERN and MAP functions provide the structure for formalizing AI security alert monitoring as part of the broader AI risk management program.

---

## What Good Alert Management Looks Like

A practical benchmark: a team managing a moderate AI/ML stack (2-4 ML frameworks, 1-2 vector databases, 1 serving framework, cloud-hosted model APIs) should be able to cover the above monitoring with approximately 2-3 hours per week of analyst time if the high-cadence checks are automated.

The automated components that provide the most leverage:
1. **CISA KEV JSON comparison against SBOM** — catches the highest-priority vulnerabilities with confirmed exploitation.
2. **GHSA advisory notifications for tracked repositories** — catches ML framework vulnerabilities at initial disclosure.
3. **NVD keyword feed for ML component names** — catches formal CVE records for components not in GHSA.

The manual components that cannot be automated efficiently:
1. **arXiv research review** — requires human judgment to assess exploitation relevance of new research.
2. **Vendor security blog reading** — vendor disclosures are often in prose form without structured data.
3. **AI incident pattern analysis** — recognizing emerging incident patterns requires contextual interpretation.

For teams building out AI security alert processes from scratch, the [AI security audit checklist](/posts/ai-security-audit-checklist/) on this site provides a complementary framework for systematic coverage assessment.

---

## Sources

- [CISA AI Security Guidance](https://www.cisa.gov/ai) — CISA's authoritative page for AI security advisories and guidance documents.
- [NIST AI Risk Management Framework](https://www.nist.gov/system/files/documents/2023/01/26/AI%20RMF%201.0.pdf) — NIST AI RMF 1.0 document.
- [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) — KEV catalog with JSON feed.
- [NVD CVE Feed](https://nvd.nist.gov/vuln/search) — primary CVE database.
