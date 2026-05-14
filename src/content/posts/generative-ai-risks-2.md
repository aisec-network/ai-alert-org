---
title: "Generative AI Risks: A Technical Reference for Security and Operations Teams"
description: "A practitioner-focused breakdown of generative AI risks mapped against NIST AI 600-1 and the OWASP Top 10 for LLMs — prompt injection, data poisoning, supply-chain compromise, and mitigation priorities."
pubDate: 2026-05-14
author: "AI Alert Desk"
tags: ["generative-ai", "llm-security", "prompt-injection", "data-poisoning", "ai-risk-management"]
category: "disclosure"
sources:
  - title: "NIST AI 600-1: Generative AI Profile"
    url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence"
  - title: "OWASP Top 10 for LLM Applications 2025"
    url: "https://genai.owasp.org/llm-top-10/"
  - title: "OWASP LLM01:2025 Prompt Injection"
    url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
  - title: "OWASP LLM04:2025 Data and Model Poisoning"
    url: "https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/"
schema:
  type: "TechArticle"
---

Enterprises integrating [large language models](https://techsentinel.news/posts/llm-security-risks/) into production workflows now face a documented, expanding set of [generative AI risks](https://techsentinel.news/posts/generative-ai-risks/) — catalogued formally by NIST in July 2024 and tracked annually by OWASP's Generative AI Security Project. Both frameworks converge on the same core finding: [the attack surface](https://aisec.blog/posts/llm-security/) is structurally different from traditional software vulnerabilities, and generic vulnerability management programs require modification to handle it.

## The NIST Taxonomy: 12 Risk Categories

[NIST AI 600-1](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence), the Generative AI Profile of the AI Risk Management Framework published July 26, 2024, identifies 12 top-level risk categories specific to generative AI systems. The most operationally significant for security teams:

**Confabulation (hallucination).** Models generate plausible but factually incorrect outputs with unwarranted confidence. In security-sensitive contexts — vulnerability assessments, CVE triage, CISO briefings — confabulated outputs carry direct operational risk. A model that misidentifies affected version ranges for a critical CVE can cause a patch to be deprioritized.

**Data poisoning.** An adversary who can influence training or fine-tuning data can embed backdoors or bias model outputs at inference time. NIST treats this as distinct from traditional data integrity attacks because corruption is often undetectable until triggered by a specific input pattern. Fine-tuning on third-party datasets — a widespread cost-reduction practice — materially expands this surface.

**Information security: offensive capability uplift.** Generative AI lowers the barrier for producing functional exploit scripts, spearphishing templates, and social engineering content at scale. Models can generate highly contextual phishing lures tailored to individual targets drawn from OSINT, reducing attack timelines from days to minutes.

**Value chain and component integration.** Dependencies on model providers, fine-tuning services, embedding pipelines, and vector databases introduce supply-chain exposure at every layer. A compromise at any third-party node — model weights, tokenizer, inference server — can propagate silently to all downstream applications.

**Privacy.** Training corpora frequently contain PII, confidential documents, or proprietary data. Models can leak this material through targeted extraction prompts even when privacy controls were applied during training. NIST categorizes this under the broader principle of membership inference risk.

## The OWASP LLM Top 10: Attack-Layer View

Where NIST focuses on organizational governance, the [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/) maps risks to discrete exploit patterns testable by red teams and AppSec engineers.

**LLM01 — Prompt Injection** leads the list. Direct prompt injection overrides system instructions through user input. Indirect injection embeds malicious instructions in content the model retrieves from external sources — documents, web pages, or tool outputs. Indirect injection is operationally more dangerous because an attacker can stage it in advance: plant instructions in a public document, wait for an AI agent to ingest it, and the attack executes without further interaction. For in-depth attack patterns and jailbreak mechanics, [aisec.blog](https://aisec.blog) maintains a running technical index.

**LLM03 — Supply Chain.** Model weights, adapters, and inference dependencies sourced from public repositories carry the same risks as open-source packages: malicious commits, typosquatting, and dependency confusion. The transformers and vLLM ecosystems have already logged supply-chain CVEs. OWASP recommends applying the same software composition analysis (SCA) controls used for application dependencies to model artifacts — hash verification, provenance checks, and scanning for serialization-based payloads.

**LLM04 — Data and Model Poisoning.** Targets the training pipeline. Per [OWASP's 2025 specification](https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/), poisoning can create "sleeper agent" behavior: a backdoor trigger embedded during fine-tuning remains dormant under normal inputs and activates only on attacker-controlled input patterns. Embedding store poisoning is particularly accessible — an attacker who can inject documents into a RAG retrieval corpus can steer model responses without touching model weights at all.

**LLM05 — Improper Output Handling.** LLM output fed directly into system shells, SQL interpreters, or browsers without sanitization enables injection vulnerabilities in the downstream interpreter. The attack chain is: user-controlled input → model generation → unsanitized output → interpreter execution. This pattern recurs in agentic deployments where models invoke tools based on their own generated text.

**LLM06 — Excessive Agency.** Agentic systems granted broad tool permissions — file writes, external API calls, web browsing — amplify every other risk category. A prompt-injected agent with network-egress and file-write capabilities can exfiltrate data without triggering conventional DLP rules, because the exfiltration appears as an authorized model action in audit logs.

**LLM09 — Misinformation.** Distinct from confabulation in that adversaries deliberately use LLMs to generate and distribute false content at scale. For security operations, the direct concern is AI-generated threat intelligence contaminating analyst workflows or poisoning shared threat feeds.

## What Defenders Should Prioritize

Security teams deploying generative AI should map controls to each layer of the risk taxonomy rather than relying on a single perimeter control.

**Input layer — Prompt injection.** Apply strict input validation. Separate untrusted user content from system-instruction channels using structural delimiters. Use structured output schemas to constrain what the model can return to downstream systems. For a catalog of defensive prompt-layer and guardrail implementations, see [guardml.io](https://guardml.io).

**Supply chain — Model artifacts.** Treat model checkpoints like software packages. Verify SHA256 hashes against registry manifests before loading. Prefer safetensors format over pickle-based checkpoints, which execute arbitrary code on load. Scan fine-tuning datasets for anomalies before training.

**Output handling.** Sanitize all LLM output before passing it to interpreters, databases, or rendered HTML — regardless of the model provider's stated safety alignment. Model alignment is a statistical property, not a security boundary.

**Agent permissions.** Scope tool permissions to the minimum required for each specific task. Log all tool invocations with full request/response payloads. Implement human-in-the-loop checkpoints for irreversible operations: file writes, network egress, external API calls with side effects.

**Governance.** NIST AI 600-1 provides a vendor-neutral governance baseline applicable across sectors. For organizations operating in the EU, the AI Act's high-risk AI provisions take effect in August 2026. [neuralwatch.org](https://neuralwatch.org) tracks implementation milestones and published guidance under both frameworks.

---

## Sources

- [NIST AI 600-1: Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) — NIST's July 2024 companion to the AI RMF, defining 12 generative AI risk categories and recommended governance controls across the AI product lifecycle.
- [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/) — Annual ranked list of discrete LLM attack patterns maintained by the OWASP Generative AI Security Project; updated for 2025 with supply-chain and embedding-layer entries.
- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) — Technical specification for the top-ranked LLM vulnerability, covering direct and indirect injection vectors, detection methods, and input-validation mitigations.
- [OWASP LLM04:2025 Data and Model Poisoning](https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/) — Covers pre-training, fine-tuning, and embedding-store poisoning vectors, including sleeper-agent backdoor patterns and dataset provenance controls.

## Related across the network

- [Generative AI Risks: A Practitioner's Guide to What Actually Matters](https://techsentinel.news/posts/generative-ai-risks/) — *techsentinel.news*
- [LLM Security Risks: The Top Threats Facing Large Language Models in 2025](https://techsentinel.news/posts/llm-security-risks/) — *techsentinel.news*
- [LLM Security: A Practitioner's Map of the Attack Surface](https://aisec.blog/posts/llm-security/) — *aisec.blog*
- [AI Defense Techniques for LLMs: A Practitioner's Guide to Securing Large Language Models](https://aidefense.dev/posts/ai-defense-techniques-llm/) — *aidefense.dev*
- [Machine Learning Security: Governance Frameworks, Supply Chain Risks, and Defender Priorities](https://techsentinel.news/posts/machine-learning-security-2/) — *techsentinel.news*
