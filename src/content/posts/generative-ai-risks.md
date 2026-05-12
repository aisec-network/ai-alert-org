---
title: "Generative AI Risks: A Practical Taxonomy for Security and Operations Teams"
description: "Generative AI risks span prompt injection, data poisoning, supply chain vulnerabilities, hallucination, and governance failures. A technical breakdown of the major threat categories with mitigation priorities."
pubDate: 2026-05-11
author: "AI Alert Desk"
tags: ["generative-ai", "ai-risks", "llm-security", "prompt-injection", "data-poisoning", "ai-governance"]
category: "analysis"
sources:
  - title: "NIST AI 600-1: Artificial Intelligence Risk Management Framework — Generative AI Profile"
    url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence"
  - title: "OWASP Top 10 for Large Language Model Applications 2025"
    url: "https://genai.owasp.org/llm-top-10/"
  - title: "Generative AI Security Risks: What Enterprises Need to Know — Proofpoint"
    url: "https://www.proofpoint.com/us/blog/information-protection/generative-ai-security-risks"
schema:
  type: "TechArticle"
---

Generative AI risks have moved from theoretical concern to documented incident in the span of two years. With 88% of organizations now running AI in at least one business function, and only 24% having a robust governance framework to match, the gap between deployment velocity and security posture is widening. Security teams need a clear map of what the threats actually are — not a marketing summary, but the working taxonomy that informs architecture decisions, pen test scope, and vendor evaluation.

What follows is that map.

## How the Risk Categories Are Structured

Two frameworks define the field. [NIST AI 600-1](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence), published in July 2024 as a companion to the broader AI RMF, identifies 12 risk categories specific to generative AI systems — including confabulation, data privacy violations, harmful bias, human manipulation, information integrity failures, and misuse for generating malicious content. It was developed through a public working group of more than 2,500 contributors and maps directly onto the GOVERN / MAP / MEASURE / MANAGE functions from the parent framework.

The [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/), updated for 2025, approaches the same space from an offensive angle: where are the exploitable weaknesses? The two lists overlap substantially but have different orientations. NIST is risk-management language; OWASP is vulnerability language. Both belong in any serious security program.

The practical risk categories break into four operational zones: model manipulation, data exposure, supply chain, and governance failure. Each has distinct technical causes and different remediation paths.

## Model Manipulation: Prompt Injection and Poisoning

Prompt injection is OWASP LLM01 — the top-ranked risk — and has held that position through both the 2023 and 2025 editions because the incidents keep coming. In a direct injection attack, an adversarial user crafts input that overrides system instructions. In indirect injection, malicious content embedded in a document, email, or web page the model retrieves hijacks the session without any direct adversarial user interaction. The second variant is more dangerous in agentic contexts: a model with access to email, calendar, and internal APIs is exposed to injection via every piece of content it reads.

Data poisoning targets the training or fine-tuning pipeline rather than inference time. Research published in 2025 found that corrupting as little as 0.001% of medical training tokens increased harmful model outputs by 4.8%. In code-generation models, 3% poisoned training data produced a 41% attack success rate for backdoored outputs. The window for detecting a poisoning attack closes once the affected model is deployed; retrospective detection typically requires comparing model behavior against a clean checkpoint.

For teams monitoring these attack classes in production, [aisec.blog](https://aisec.blog) maintains coverage of prompt injection incidents and jailbreak techniques as they emerge in the wild.

## Data Exposure and Privacy Risks

The most common generative AI data [breach](https://aiincidents.org/) is not a sophisticated attack — it is an employee pasting confidential information into a public AI tool. [Proofpoint research](https://www.proofpoint.com/us/blog/information-protection/generative-ai-security-risks) found that 77% of enterprise employees who use AI have pasted company data into a chatbot query; 22% of those inputs included confidential personal or financial data. The problem compounds when organizations use third-party AI products that retain input data for model improvement by default.

Training data extraction is the technical underside of this. A model that was trained on sensitive data — internal code, customer records, proprietary documents — can leak that information through sufficiently targeted prompts. The attack does not require special access; it requires knowing what the model was trained on and crafting prompts that surface memorized content. NIST AI 600-1 classifies this as a data privacy risk and recommends differential privacy techniques, training data audits, and contractual controls on data retention with AI vendors.

OWASP LLM02 (Sensitive Information Disclosure) covers the runtime side: models surfacing personal data, API keys, or internal configuration details through normal conversational queries. This is distinct from training extraction — it occurs when the model's context window contains sensitive material that is then referenced in a response. System prompt leakage (OWASP LLM07) is a related failure mode that has appeared in multiple commercial deployments when adversarial prompts caused the model to reproduce its own instructions verbatim.

For teams working through data privacy compliance implications alongside these technical risks, [aiprivacy.report](https://aiprivacy.report) tracks regulatory developments and inference attack research.

## Supply Chain and Infrastructure Risks

Generative AI introduces supply chain risk at every layer: training data sources, pre-trained base models, fine-tuning datasets, inference libraries, and third-party model hosting. OWASP LLM03 covers this class of vulnerabilities. A compromised or backdoored base model can propagate through any fine-tuning that builds on it. Malicious models distributed through public repositories — Hugging Face has documented several incidents — can execute arbitrary code via unsafe deserialization formats like pickle during model loading, before any inference occurs.

The dependency surface also includes vector databases (OWASP LLM08), RAG retrieval pipelines, and embedding models. An attacker who can manipulate retrieved documents influences model outputs without touching the model itself. This is the mechanism behind RAG poisoning attacks, where adversarial content inserted into a knowledge base steers the model toward attacker-controlled answers.

OWASP LLM10 — Unbounded Consumption — addresses the infrastructure abuse end: models invoked at scale to exhaust compute budgets, trigger denial of service, or extract proprietary information through high-volume sampling. Rate limiting, per-user quotas, and anomaly detection on token consumption patterns are the primary mitigations.

## Governance Gaps Amplify Every Other Risk

Shadow AI is the multiplier. 78% of AI users in enterprise environments bring their own tools, bypassing IT procurement, security review, and DLP controls. Each unauthorized AI integration is a potential data exfiltration channel and an unmonitored prompt injection surface. Proofpoint estimates that shadow AI use adds an average of $670,000 to data breach costs when an incident occurs.

NIST AI 600-1 and the OWASP governance checklist both converge on the same prescription: inventory all AI in use, classify data sensitivity before integrating with AI systems, implement access controls at the model API layer, and establish monitoring for anomalous usage patterns. Defensive tooling for this layer — guardrails, content filters, and runtime monitors — is covered in depth at [guardml.io](https://guardml.io).

The 24% of organizations with mature AI governance frameworks are not operating in a fundamentally different threat environment. They have an asset inventory that matches their actual exposure.

## Sources

- **[NIST AI 600-1: Artificial Intelligence Risk Management Framework — Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)** — NIST's July 2024 companion document to the AI RMF, covering 12 generative AI risk categories and more than 400 management actions.

- **[OWASP Top 10 for Large Language Model Applications 2025](https://genai.owasp.org/llm-top-10/)** — The 2025 update of the OWASP LLM risk list, incorporating two years of incident data and expanded coverage of agent security and supply chain vulnerabilities.

- **[Generative AI Security Risks: What Enterprises Need to Know — Proofpoint](https://www.proofpoint.com/us/blog/information-protection/generative-ai-security-risks)** — Enterprise-focused analysis of data exposure, shadow AI, and social engineering risks, including survey data on employee AI usage behavior.

For more context, [AI security digest](https://aisecdigest.com/) covers related topics in depth.
