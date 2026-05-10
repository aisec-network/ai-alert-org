---
title: "CISA's Known Exploited Vulnerabilities Catalog: What It Tells Us About AI/ML Security"
description: "The CISA KEV catalog tracks vulnerabilities with confirmed active exploitation. Examining KEV entries for AI/ML-adjacent components reveals which parts of the AI stack are attracting real-world attacker attention — and which systemic weaknesses are being targeted."
pubDate: 2026-05-10
author: "Theo Voss"
tags: ["cisa", "kev", "known-exploited", "vulnerability", "ml-infrastructure", "cve", "patch-management", "federal"]
category: "analysis"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/cisa-kev-ai-ml-vulnerabilities-analysis.png
heroAlt: "CISA KEV Catalog: AI/ML Vulnerability Analysis"
sources:
  - title: "CISA Known Exploited Vulnerabilities Catalog"
    url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
  - title: "CISA AI Security Guidance"
    url: "https://www.cisa.gov/ai"
  - title: "NVD CVE Database"
    url: "https://nvd.nist.gov/vuln/search"
schema:
  type: "TechArticle"
---

The CISA Known Exploited Vulnerabilities (KEV) catalog is among the most operationally useful signals in vulnerability management. Unlike the broader CVE database — which includes theoretical vulnerabilities, proof-of-concept research disclosures, and findings with no known exploitation — the KEV catalog is restricted to vulnerabilities for which CISA has evidence of active exploitation in the wild. A KEV entry means: threat actors have actually exploited this, not just demonstrated that exploitation is theoretically possible.

For AI/ML security practitioners, tracking the KEV catalog reveals which parts of the AI infrastructure stack are attracting real-world attacker attention. This post examines KEV entries relevant to AI/ML systems and what patterns emerge.

## AI/ML-Adjacent KEV Entries: What's in the Catalog

A search of the KEV catalog through Q1 2026 for vulnerabilities in components commonly found in AI/ML deployments reveals several categories of confirmed exploited vulnerabilities:

**Python and package management infrastructure.** Multiple KEV entries cover vulnerabilities in PyPI package tooling, `pip`, and Python runtime components. These are foundational to virtually every AI/ML development and serving environment. Notably, CVE-2024-3488 (a vulnerability in `pip`'s dependency resolution that could be exploited by a malicious package to execute code during installation) was added to KEV in late 2024 following confirmed exploitation targeting ML engineering workstations.

**Jupyter and notebook infrastructure.** Jupyter Notebook and JupyterHub have produced KEV-listed entries, with confirmed exploitation of authentication bypass and code execution vulnerabilities in exposed JupyterHub instances. This is particularly relevant to AI/ML environments where JupyterHub is widely deployed for collaborative notebook workflows and often exposed on internal (sometimes external) networks.

**Container orchestration.** Kubernetes and Docker component vulnerabilities appearing in KEV are relevant to ML teams running containerized training and serving infrastructure. Exploitation of container escape vulnerabilities in training clusters with access to GPU resources has been observed in cloud-hosted environments.

**Apache components.** Vulnerabilities in Apache Spark and Apache Airflow — widely used in ML data pipelines — have appeared in KEV. Airflow's web interface, in particular, has a history of authentication and RCE vulnerabilities, some of which progressed from disclosure to active exploitation within weeks.

**NVIDIA components.** NVIDIA GPU driver and CUDA-related vulnerabilities, while not exclusively AI-relevant, disproportionately affect AI/ML environments due to their heavy GPU dependence. Several driver-level privilege escalation vulnerabilities have been exploited in cloud GPU environments to escape VM isolation.

## What KEV Tells Us About Attacker Priorities

The pattern in KEV entries for AI/ML-adjacent components is informative:

**Infrastructure-layer attacks dominate over model-layer attacks.** The majority of KEV entries for AI/ML environments concern infrastructure components (Python package management, Jupyter, container runtime, data pipeline orchestration), not novel AI-specific attack techniques. Attackers are exploiting AI infrastructure with the same techniques they use elsewhere — they've simply targeted the AI stack because it's valuable and often less hardened than adjacent production infrastructure.

**Jupyter exposure is the clearest risk.** JupyterHub instances exposed on internal networks with default or weak authentication are a frequently exploited target. This is consistent with AI/ML environments where Jupyter is often deployed by research teams who prioritize accessibility over security. The pattern of Jupyter exploitation is not new, but the number of exposed instances has grown substantially as AI/ML teams have expanded.

**Rapid exploitation timelines.** Several AI/ML-adjacent vulnerabilities progressed from initial disclosure to KEV-listed confirmed exploitation in under 30 days. For security teams relying on patch cycles longer than 30 days, this means many KEV-listed vulnerabilities were exploited before patches were applied.

**Cloud metadata as a target.** Multiple exploits in ML serving infrastructure have been used to reach cloud provider instance metadata endpoints (the SSRF-to-cloud-credentials attack pattern). AI/ML environments with serving infrastructure on cloud VMs are attractive SSRF targets because GPU instances often carry elevated IAM permissions.

## The Federal Binding Operational Directive Context

CISA's BOD 22-01 requires federal civilian executive branch agencies to remediate KEV-listed vulnerabilities within specified timeframes (generally 2 weeks for critical, 4-6 weeks for others). This creates a direct compliance obligation for AI/ML systems operated by federal agencies and their contractors.

For the broader security community, BOD 22-01 timelines are a useful operational benchmark: if CISA considers a vulnerability critical enough to mandate federal remediation within 2 weeks, commercial organizations should be treating it with equivalent urgency.

## Practical Application: Using KEV for AI/ML Patch Prioritization

For AI/ML security practitioners, the KEV catalog provides a prioritization signal that cuts through CVE noise:

**Generate a component inventory.** For the AI/ML components in your environment (Python version, ML framework versions, Jupyter version, orchestration components, GPU drivers, container runtime), compare versions against KEV-listed CVEs. KEV entries for components you run represent the highest-priority patch items.

**Monitor KEV additions for your stack.** CISA publishes KEV additions via a JSON feed (`https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json`). Teams maintaining a software bill of materials for their ML stack can automate KEV comparison and alerting.

**Treat Jupyter exposure as a critical finding.** If JupyterHub is reachable from any network segment that contains untrusted users or devices, treat it as a critical vulnerability regardless of current CVE status. The history of Jupyter exploitation in ML environments makes it a high-priority hardening target.

For teams tracking CVEs specifically in ML components, [mlcves.com](https://mlcves.com) maintains a curated database with component-level filtering that complements the broader KEV catalog. The [AI security auditing checklist](/posts/ai-security-audit-checklist/) on this site covers component inventory and patch management in the context of AI/ML deployments.

## Sources

- [CISA KEV Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) — authoritative source for confirmed-exploited vulnerabilities.
- [CISA AI Security Guidance](https://www.cisa.gov/ai) — CISA's AI-specific security recommendations.
- [NVD CVE Database](https://nvd.nist.gov/vuln/search) — full CVE records including KEV-listed entries.
