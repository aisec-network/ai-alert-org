---
title: "AI System Security Audit Checklist for 2026"
description: "A practical audit checklist for AI systems covering model inputs, training pipeline, outputs, access control, logging, and red-team requirements. Each item includes a brief explanation of the risk it addresses."
pubDate: 2026-05-08
author: "Theo Voss"
tags: ["checklist", "audit", "prompt-injection", "data-poisoning", "access-control", "logging", "red-team", "primer"]
category: "primer"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/ai-security-audit-checklist.png
heroAlt: "AI System Security Audit Checklist for 2026"
sources:
  - title: "NIST AI Risk Management Framework"
    url: "https://www.nist.gov/itl/ai-risk-management-framework"
  - title: "OWASP LLM Top 10 for 2025"
    url: "https://genai.owasp.org/llmrisk/"
  - title: "MITRE ATLAS — Adversarial Threat Landscape for AI Systems"
    url: "https://atlas.mitre.org"
schema:
  type: "TechArticle"
---

Security audits of AI systems require a different checklist than traditional software audits. The threat surface includes the model itself, its training pipeline, its inference API, the content it processes, and the actions it can take — all of which have attack classes that standard software security reviews do not cover.

This checklist is structured around six control domains. It is designed for practitioners conducting a first-pass security review of an AI system going into production, or auditing an existing deployment against a minimum security baseline. It is not exhaustive; treat it as a starting point, not a certification framework.

References to NIST AI RMF and OWASP LLM Top 10 are noted where relevant.

---

## Domain 1: Model Inputs — Prompt Injection and Input Validation

**1.1 Direct prompt injection controls**

- [ ] The system prompt is not user-readable or exfiltrable through normal queries.
- [ ] Instructions in the system prompt include explicit refusal guidance for instruction-override attempts ("ignore previous instructions," role-play persona requests, etc.).
- [ ] Known jailbreak patterns are blocked or flagged at the application layer before reaching the model.
- [ ] There is no mechanism by which user input can be concatenated directly into system-prompt-level context without sanitization.

*Why it matters:* Direct injection attacks cause models to override system-level instructions with user-supplied ones. System prompts are the primary instruction boundary and must be treated as a trust boundary.

**1.2 Indirect prompt injection controls**

- [ ] All external content sources the model processes (retrieved documents, web pages, email, ticket bodies, tool outputs) are identified and documented.
- [ ] External content is segregated from trusted instruction channels in context construction. Retrieved content is clearly bounded (e.g., wrapped in XML-style delimiters) and the model is instructed to treat it as data, not instruction.
- [ ] External content is scanned for injection patterns before being included in model context. (See: LLM Guard, custom classifiers.)
- [ ] The model's ability to include external content in responses verbatim or to act on instructions from external content is constrained by output validation.

*Why it matters:* Indirect injection via retrieved or user-submitted content is OWASP LLM01. It is operationally more dangerous than direct injection because the attack comes from infrastructure the model trusts, not from the human user.

**1.3 Input provenance**

- [ ] Every piece of content in the model's context is attributed to a source (user input, system prompt, retrieved document, tool output).
- [ ] Source attribution is preserved in logs for forensic review.

---

## Domain 2: Training Pipeline — Data Poisoning and Supply Chain

**2.1 Training data provenance**

- [ ] Training and fine-tuning datasets have documented provenance chains. Sources are known and verifiable.
- [ ] Data from user inputs or community contributions is not fed back into training without human review.
- [ ] Access to write to training data stores is audited and restricted to authorized principals.

*Why it matters:* Poisoning attacks require write access to training data. If the training pipeline can be fed arbitrary data by external parties, backdoors or performance degradation can be introduced.

**2.2 Model artifact security**

- [ ] Model weights loaded from external sources are verified against checksums or cryptographic signatures before use.
- [ ] Pickle-format model files (`.pkl`, `.pt`) from untrusted sources are not loaded without verification. Safetensors format is preferred where available.
- [ ] `trust_remote_code=True` is not used with unvetted community model repositories.
- [ ] Model artifacts in production are pinned to specific commit hashes or version tags, not `latest`.

*Why it matters:* Malicious model files can execute arbitrary code on load. This is an active supply chain threat; the Hugging Face Hub has hosted malicious models with pickle payloads.

**2.3 Fine-tuning isolation**

- [ ] Fine-tuning jobs run in isolated environments with network egress restricted to known endpoints.
- [ ] Fine-tuning data is reviewed for adversarial samples before training runs.
- [ ] Base model integrity is verified before fine-tuning begins.

---

## Domain 3: Model Outputs — Exfiltration and Output Validation

**3.1 Output filtering**

- [ ] Model outputs are scanned for PII, secrets (API keys, credentials), and sensitive data categories before being returned to users or downstream systems.
- [ ] Outputs are validated against expected schemas or formats before being acted upon by downstream systems.
- [ ] Markdown rendering of model outputs does not fetch remote URLs without user confirmation (relevant for chat interfaces that render markdown images/links).

*Why it matters:* Injection attacks and training data extraction can cause models to include sensitive content in outputs. Markdown rendering is a reliable exfiltration channel for injected instructions.

**3.2 Response integrity**

- [ ] Model outputs are not treated as trusted instructions by downstream systems without validation.
- [ ] Tool call outputs generated by the model are validated against a whitelist of permitted tool names and parameter schemas before execution.
- [ ] AI-generated content that is sent to users (email drafts, reports, summaries) undergoes human review for high-consequence content categories.

---

## Domain 4: Access Control

**4.1 Model access**

- [ ] API access to the model is authenticated. Anonymous access is not permitted in production.
- [ ] Per-user and per-tenant rate limits are enforced to limit extraction at scale.
- [ ] API keys are scoped to specific operations and rotated on a defined schedule.

**4.2 Tool and integration access**

- [ ] AI agents have explicit lists of permitted tools and are denied access to tools not on the list.
- [ ] Tool permissions follow least-privilege: agents that only need read access do not have write or delete permissions.
- [ ] High-consequence tool actions (sending email, deleting data, making external API calls) require human approval before execution.
- [ ] Tool access credentials are not visible in the model's context and cannot be retrieved through prompt injection.

*Why it matters:* Tool access is the amplifier that converts a prompt injection exploit from "model says wrong thing" to "model takes unauthorized action." Least-privilege tool access is the highest-impact mitigation for agent security.

**4.3 Data access**

- [ ] The model's retrieval corpus (RAG corpus, knowledge base) enforces the same access controls as the underlying data. The model cannot surface documents to users who should not have access to them.
- [ ] Cross-tenant data isolation is verified: a user's queries cannot cause the model to retrieve data from another tenant's corpus.

---

## Domain 5: Logging and Monitoring

**5.1 Input and output logging**

- [ ] All model inputs (including full context: system prompt, conversation history, retrieved content) are logged with timestamps and user identifiers.
- [ ] All model outputs are logged.
- [ ] Logs are written to tamper-evident storage. The model process cannot modify its own logs.
- [ ] Log retention meets compliance requirements for the deployment context.

*Why it matters:* Prompt injection attacks succeed silently from the user's perspective. Reconstruction of an incident requires full input/output logs. Many teams discover they cannot reconstruct incidents because they logged only partial context.

**5.2 Anomaly detection**

- [ ] Alerts are configured for unusual query patterns: high volume from a single user, queries that probe system prompt content, queries with structural characteristics of known injection attacks.
- [ ] Tool call logs are monitored for unexpected call sequences, unexpected parameters, or calls to endpoints outside normal operational patterns.
- [ ] Response anomalies are monitored: outputs that fail schema validation, outputs that include blocked content categories, and unusual output lengths.

**5.3 Incident response**

- [ ] There is a documented procedure for disabling model API access without taking down the broader application.
- [ ] Logs are accessible to incident responders who are not the system operators.
- [ ] There is a responsible disclosure contact for AI security issues in the deployed product.

---

## Domain 6: Red-Team Requirements

**6.1 Minimum red-team scope before production deployment**

- [ ] Direct prompt injection has been tested against the system prompt with current jailbreak techniques.
- [ ] Indirect injection has been tested against every external content source the model processes (documents, web, email, tickets, tool outputs).
- [ ] If the model has tool access: multi-step agent exploitation has been tested (injected instructions that chain tool calls to achieve impact).
- [ ] If the model processes user-uploaded content: file-based injection has been tested (PDFs, Office documents, images with embedded text).
- [ ] Supply chain has been reviewed: model artifact integrity, dependency versions, training data provenance.

**6.2 Ongoing red-team cadence**

- [ ] Red-team exercises are conducted at least annually, or following significant changes to the model, its tools, or its content sources.
- [ ] Red-team findings are tracked to resolution with SLAs.
- [ ] External security research is monitored and new disclosed techniques are evaluated against the production deployment.

---

## References and Further Reading

This checklist draws on three primary frameworks:

- [NIST AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework) — the U.S. government framework for AI risk management, with the July 2024 Generative AI Profile extending coverage to LLM and RAG deployments.
- [OWASP LLM Top 10 for 2025](https://genai.owasp.org/llmrisk/) — practitioner-focused risk taxonomy covering prompt injection, insecure output handling, supply chain, data poisoning, and eight other risk categories.
- [MITRE ATLAS](https://atlas.mitre.org) — adversarial threat landscape for AI systems, with a structured taxonomy of ML-specific attack techniques and real-world incident cases.

Practitioners looking for tooling to implement specific checklist items will find independent reviews at [aisecreviews.com](https://aisecreviews.com) and a market map at [bestaisecuritytools.com](https://bestaisecuritytools.com). For guardrail library options that address the input/output validation items in this checklist, [guardml.io](https://guardml.io) maintains a catalog of actively maintained ML guardrail projects. Teams using this checklist to scope a red-team engagement will find the attack technique reference at [aiattacks.dev](https://aiattacks.dev) useful for populating the Domain 6 test cases.


---

*→ This post is part of the [AI Security Intelligence Hub](/posts/ai-security-intelligence-hub) — the complete resource index for AI security on ai-alert.org.*

## See also

- [AI incident tracker](https://aiincidents.org/)
- [AI security digest](https://aisecdigest.com/)
- [weekly AI security roundup](https://aisecweekly.com/)
