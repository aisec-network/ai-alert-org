---
title: "CISA AI Security Guidance: What Organizations Need to Know in 2026"
description: "A breakdown of CISA's published AI security guidance — what it covers, what it requires, and how organizations should operationalize it. Includes analysis of secure-by-design AI, the AI SBOM framework, and joint advisories."
pubDate: 2026-05-11
author: "Theo Voss"
tags: ["cisa", "ai-security-guidance", "secure-by-design", "ai-sbom", "compliance", "advisory", "federal", "threat-alert"]
category: "analysis"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/cisa-ai-security-guidance-2026.png
heroAlt: "CISA AI Security Guidance 2026"
sources:
  - title: "CISA AI Security Guidance"
    url: "https://www.cisa.gov/ai"
  - title: "CISA Guidelines for Secure AI System Development (joint with international partners)"
    url: "https://www.cisa.gov/resources-tools/resources/guidelines-secure-ai-system-development"
  - title: "CISA Known Exploited Vulnerabilities Catalog"
    url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
  - title: "NIST AI Risk Management Framework"
    url: "https://airc.nist.gov/RMF/1"
schema:
  type: "TechArticle"
---

CISA has been the most operationally active US government body on AI security, publishing joint advisories, secure-by-design guidance, and vulnerability analysis that collectively define what "doing AI security right" looks like from a federal perspective. For organizations building or deploying AI systems — particularly those with federal contracts or regulatory exposure — understanding CISA's AI guidance is no longer optional.

This post provides a practical breakdown of what CISA has published, what it requires or recommends, and how to translate the guidance into concrete security controls.

---

## CISA's Role in AI Security

CISA's statutory mission is to reduce risk to critical infrastructure. AI systems are increasingly part of that infrastructure — both as components within critical systems and as targets that adversaries seek to compromise or manipulate. CISA's AI security work falls into three categories:

1. **Threat advisories:** Warnings about active threats targeting AI systems, typically published as joint advisories with partner agencies.
2. **Secure-by-design guidance:** Documentation of what good AI security practice looks like at the development and deployment stages.
3. **Vulnerability tracking:** Integration of AI/ML component vulnerabilities into the Known Exploited Vulnerabilities (KEV) catalog.

CISA does not regulate private sector AI in the way that financial regulators regulate banks, but its guidance carries practical weight for several reasons: federal contractors are often expected to align with CISA guidance, CISA's secure-by-design framework influences NIST standards which are incorporated by reference in regulations, and CISA advisories are read by threat intelligence teams that inform enterprise security policy.

---

## The Secure-by-Design AI Framework

CISA's "Guidelines for Secure AI System Development," published jointly with UK NCSC and partner agencies, is the most comprehensive single document CISA has produced on AI security. The document addresses four lifecycle phases:

### 1. Secure Design

CISA's secure design guidance for AI systems covers threat modeling adapted for AI-specific attack surfaces, the principle of minimal footprint (AI systems should request only the permissions they need, avoid storing data beyond immediate use, avoid side-effects not required for their function), and the requirement to evaluate security implications of design choices before building.

Key secure design recommendations from CISA include:

- **Threat model AI-specific attack paths** before architectural decisions are locked in. This includes adversarial input attacks (prompt injection, evasion), training data poisoning, model theft, and supply chain compromise of model weights or training data.
- **Treat model weights as sensitive assets** equivalent to private keys or credentials. Implement access controls, audit logging, and exfiltration detection for model weight storage.
- **Design for auditability.** AI systems whose behavior cannot be audited cannot be secured. Logging model inputs and outputs (with appropriate data minimization for personal information) is a prerequisite for incident detection and response.

### 2. Secure Development

CISA's guidance on secure AI development maps closely to general secure development practices (SSDLC), with AI-specific additions:

- **Dependency management for AI/ML libraries.** The AI/ML ecosystem's heavy reliance on open-source Python packages creates significant supply chain risk. CISA recommends treating ML framework dependencies with the same scrutiny as application code dependencies — pinning versions, using Software Composition Analysis tools, and tracking against the KEV catalog for components in the stack. Our [CISA KEV analysis for AI/ML systems](/posts/cisa-kev-ai-ml-vulnerabilities-analysis/) details which categories of AI/ML components have appeared in the KEV catalog.
- **AI software bill of materials (AI SBOM).** CISA recommends maintaining an inventory of model components, training datasets, and third-party models integrated into a system, extending the traditional software SBOM to cover the model supply chain.
- **Pre-deployment red-teaming.** CISA recommends structured adversarial testing before AI systems are deployed, covering both technical vulnerabilities (inference API exposure, authentication) and AI-specific attacks (adversarial inputs, prompt injection for LLMs).

### 3. Secure Deployment

Deployment-phase guidance focuses on configuration security and operational hardening:

- **Authentication and authorization on inference endpoints.** AI model serving APIs should not be exposed without authentication. API keys or OAuth tokens with defined scope should be required. This sounds obvious, but exposed inference endpoints — including public Ollama instances and unprotected vLLM deployments — remain a consistent finding in AI security audits.
- **Network exposure minimization.** Model serving infrastructure should follow the principle of least exposure: inference endpoints accessible only to systems that need them, with network controls preventing direct internet access to internal serving infrastructure.
- **Secrets management.** API keys for foundation model providers (OpenAI, Anthropic, etc.) should be stored in a secrets management system, not in application code or environment variables on shared systems. Leakage of foundation model API keys is a frequent AI security incident category with direct financial impact.
- **Input and output monitoring.** Deployed AI systems should log inputs and outputs in a form that supports anomaly detection. CISA's guidance acknowledges that prompt injection via indirect input — from documents, web content, or other external sources — represents a significant deployment-phase risk for LLM-integrated systems.

For organizations using LLMs with document processing or web-browsing capabilities, prompt injection through external content is a class of threat that requires specific monitoring and containment controls. See our analysis of [prompt injection via email AI agents](/posts/prompt-injection-email-ai-agents/) for a concrete example.

### 4. Secure Operation and Maintenance

The operations phase guidance covers incident response, patch management, and ongoing monitoring:

- **AI-specific incident response procedures.** CISA recommends that AI systems have documented incident response procedures that address AI-specific failure modes — not just general IT incident response. This includes procedures for responding to model extraction (detecting that a model is being copied), adversarial input campaigns (detecting coordinated attempts to manipulate AI outputs), and training data integrity incidents.
- **Patch management aligned with KEV timelines.** For AI/ML infrastructure components that appear in the KEV catalog, CISA's BOD 22-01 timelines apply to federal agencies. CISA recommends that commercial organizations use KEV timelines as a benchmark: Critical KEV entries within 2 weeks, others within 30 days.
- **Monitoring for data drift as a security signal.** Distribution shift in AI system inputs can indicate an adversarial campaign targeting the system's behavior. CISA's guidance recommends treating significant input distribution changes as a potential security event, not just a model performance issue.

---

## Joint Advisories: AI Threat Alerts from CISA

CISA's joint advisories represent the most actionable output for threat intelligence purposes. These documents typically describe confirmed or assessed threat actor activity, provide indicators of compromise, and include specific mitigation recommendations.

### People's Republic of China (PRC) AI Targeting

Multiple joint advisories (published with FBI, NSA, and international partners) have described PRC state-sponsored actors targeting AI research and model intellectual property. Common attack patterns described include:

- **Spearphishing targeting AI researchers** at universities, national labs, and private AI companies. The goal is credential theft to access code repositories and model training infrastructure.
- **Supply chain infiltration** of open-source AI projects, including attempts to introduce vulnerabilities via pull requests to popular ML libraries.
- **Cloud infrastructure compromise** targeting AI training workloads, particularly GPU clusters with access to large model weights.

CISA's recommendations in these advisories emphasize multi-factor authentication on development systems, code review requirements for open-source contributions from unverified contributors, and network segmentation of AI training infrastructure from general corporate networks.

### Russian Cyber Threat Actor Activity

CISA advisories on Russian state-sponsored threat actors have noted targeting of AI-enabled critical infrastructure systems, including AI-assisted industrial control system monitoring and AI-driven energy grid management tools. The advisories focus more on the infrastructure supporting these AI systems than on AI-specific attack techniques.

### Ransomware Targeting AI Infrastructure

CISA's ransomware advisories are relevant to AI systems because AI training infrastructure — high-value GPU clusters with large local storage — represents an attractive ransomware target. CISA's ransomware guidance recommends offline backups of model weights and training datasets, treated with the same backup discipline as business-critical databases.

---

## The AI SBOM Requirement

CISA's push for AI Software Bills of Materials (AI SBOMs) extends the traditional SBOM concept to cover:

**Model components:** Pre-trained model weights integrated into a system, including foundation models from providers like OpenAI, Anthropic, Hugging Face, and Meta. The AI SBOM should include model version, source, date of last update, and any fine-tuning or modification performed.

**Training dataset provenance:** For systems that are trained or fine-tuned internally, the AI SBOM should document training dataset sources, any known limitations or biases in the training data, and the version or snapshot used for training.

**Third-party ML libraries:** Python packages, serving frameworks, and orchestration tools used in the AI stack, tracked with versions and linked to CVE and GHSA records.

**Inference infrastructure:** The hardware and cloud services on which inference runs, relevant for supply chain risk assessment of the physical and cloud layers.

The practical challenge for most organizations is that AI SBOM data is distributed across multiple systems — ML engineers track framework versions, model registries track model versions, IT infrastructure tracks cloud resources — without a unified inventory. CISA's guidance acknowledges this and recommends incremental approaches: start with an inventory of external model API dependencies (the highest-risk supply chain component), then extend to the full ML stack.

---

## What CISA Guidance Does Not Cover

CISA's guidance is strong on infrastructure security and generally applicable to organizations already operating within a security program. It is less specific on:

**Prompt injection and LLM-specific attacks.** CISA's guidance mentions prompt injection as a risk category but does not provide detailed mitigation guidance for LLM-integrated systems. The [OWASP LLM Top 10](/posts/owasp-llm-top-10-2025-changes/) provides more granular guidance for LLM-specific vulnerabilities.

**Model evaluation and red-teaming methodologies.** CISA recommends red-teaming but does not specify methodology. NIST AI 100-4 (Adversarial Machine Learning) and the NIST AI RMF provide the framework basis, while operational red-teaming methodology is covered by MITRE ATLAS and academic adversarial ML literature.

**Regulatory compliance specifics.** CISA's guidance is not a compliance framework — it does not map to specific regulatory requirements. Organizations with compliance obligations (HIPAA, FISMA, SOC 2, EU AI Act) need to map CISA guidance to their specific regulatory requirements separately.

---

## Operationalizing CISA AI Security Guidance

For security teams translating CISA guidance into program-level controls, the following mapping provides a starting point:

| CISA Guidance Area | Concrete Control | Owner |
|---|---|---|
| Secure design: threat modeling | AI-specific threat model documented before system launch | Security architect |
| Secure design: minimal footprint | LLM agents restricted to minimum required tools/permissions | AI/ML engineering |
| Secure development: AI SBOM | Inventory of model providers, ML libraries, versions | Security + MLOps |
| Secure development: dependency tracking | ML library versions compared weekly to GHSA and KEV | Security operations |
| Secure deployment: endpoint authentication | No unauthenticated inference API exposure | Infrastructure |
| Secure deployment: secrets management | Foundation model API keys in secrets manager, not env vars | DevOps/Security |
| Secure deployment: input/output logging | Inference inputs and outputs logged with 90-day retention | MLOps |
| Operations: KEV patching | Critical KEV in AI stack patched within 14 days | Security operations |
| Operations: incident response | AI-specific IR playbook documented and tested | Security operations |

The [AI security audit checklist](/posts/ai-security-audit-checklist/) on this site provides a complementary framework for assessing current-state control coverage against CISA's recommendations.

---

## Staying Current With CISA AI Security Outputs

CISA does not publish a dedicated AI security advisory feed. The most reliable ways to track new CISA AI guidance:

1. **CISA alerts subscription** at `cisa.gov/news-events/alerts` — covers new advisories and guidance documents.
2. **CISA GitHub** (`github.com/cisagov`) — some CISA guidance is published as GitHub repositories with machine-readable data.
3. **GovDelivery email subscriptions** — CISA operates a GovDelivery subscription service for different alert categories.

For the CISA KEV specifically, the JSON feed at `cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json` provides machine-readable access to all KEV entries and updates, suitable for automated comparison against your AI/ML component inventory.

---

## Sources

- [CISA AI Security Guidance](https://www.cisa.gov/ai) — CISA's primary AI security page with all published guidance.
- [CISA Guidelines for Secure AI System Development](https://www.cisa.gov/resources-tools/resources/guidelines-secure-ai-system-development) — joint guidance with UK NCSC and partner agencies.
- [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) — KEV catalog and JSON feed.
- [NIST AI Risk Management Framework](https://airc.nist.gov/RMF/1) — NIST AI RMF, referenced in CISA guidance.
