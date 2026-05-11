---
title: "AI Security: Attack Categories, Defense Gaps, and How to Respond"
description: "A practitioner guide to the four core attack categories against AI/ML systems — from adversarial inputs to supply chain compromise — with mitigation priorities and framework references."
pubDate: 2026-05-09
author: "AI Alert Desk"
tags: ["ai-security", "adversarial-ml", "prompt-injection", "supply-chain", "nist", "llm-security"]
category: "disclosure"
sources:
  - title: "NIST AI.100-2: Adversarial Machine Learning Taxonomy and Terminology"
    url: "https://www.nist.gov/news-events/news/2024/01/nist-identifies-types-cyberattacks-manipulate-behavior-ai-systems"
  - title: "NIST AI Risk Management Framework"
    url: "https://www.nist.gov/itl/ai-risk-management-framework"
  - title: "OWASP LLM01:2025 Prompt Injection"
    url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
schema:
  type: "TechArticle"
---

AI security encompasses the practices, tools, and frameworks used to protect artificial intelligence systems from manipulation, exploitation, and unauthorized access. For security teams managing AI deployments in 2026, the threat surface has grown considerably: adversaries now target not just the infrastructure running AI, but the models themselves, their training data, and the inference pipeline. This post maps the attack categories, the gaps in current defenses, and where to focus mitigation effort.

## The Four Attack Categories

NIST published [*Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations* (AI.100-2)](https://www.nist.gov/news-events/news/2024/01/nist-identifies-types-cyberattacks-manipulate-behavior-ai-systems) in January 2024, establishing four principal attack categories against ML systems. That taxonomy remains the baseline reference for practitioners assessing AI/ML risk.

**Evasion attacks** occur post-deployment. An adversary crafts inputs specifically to cause misclassification or unexpected behavior without modifying the model itself. A canonical example: modifying road-sign images with imperceptible pixel perturbations to cause autonomous vehicle systems to misread a stop sign. Against LLMs, evasion attacks typically take the form of adversarial suffixes — character strings appended to prompts that reliably shift model outputs despite containing no human-readable instruction.

**Poisoning attacks** target the training phase. By injecting malicious samples into training data or fine-tuning datasets, an attacker can introduce backdoors that activate on specific trigger inputs while leaving general model performance intact. NIST notes that poisoning can be achieved by controlling "a few dozen training samples" in large datasets — a low bar for a well-positioned adversary.

**Privacy attacks** probe deployed models to extract training data or model internals. Membership inference determines whether a specific record was in the training set. Model extraction attacks reconstruct a proprietary model by querying it at scale. Both classes have produced working exploits against commercial APIs.

**Abuse attacks** feed false information into sources the AI system will consume: knowledge bases, RAG corpora, or web pages the model treats as ground truth. Research labeled "PoisonedRAG" demonstrated that inserting five malicious documents into a corpus of millions caused a retrieval-augmented LLM to return attacker-specified false answers for targeted queries 90% of the time.

NIST's report is unambiguous on the defensive posture: "there is no foolproof way as yet to protect AI from misdirection." Published mitigations "currently lack robust assurances that they fully mitigate the risks."

## Prompt Injection: The Operational Priority

[OWASP's LLM Top 10 for 2025](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) places prompt injection at position one (LLM01). The ranking reflects both frequency and severity in production deployments. Unlike the four attack categories above, prompt injection requires no training-time access — it executes through normal inference channels using inputs the system is designed to accept.

**Direct injection** manipulates model behavior through crafted user inputs: jailbreaks, role-play framings, instruction overrides. **Indirect injection** is operationally more dangerous: malicious instructions embedded in external content that the AI system retrieves and processes. A document, web page, or email the model reads on a user's behalf can contain instructions that alter behavior for the entire session — exfiltrating context, taking unauthorized actions through connected tools, or propagating injected instructions to subsequent queries.

For AI agents with tool access — systems that can execute code, browse the web, or manage files — indirect injection elevates from information disclosure to arbitrary action execution. The attack succeeds silently from the user's perspective.

OWASP's mitigation guidance centers on constraining model behavior through detailed system prompts, enforcing least-privilege for tool access, segregating untrusted external content, validating output formats, and requiring human approval for high-risk actions. The guidance acknowledges that "fool-proof prevention remains uncertain due to how generative AI fundamentally operates." Defense in depth, not a single control, is the operational posture.

[aisec.blog](https://aisec.blog) tracks attack development in this area, including multimodal injection, adversarial suffix research, and agent exploitation techniques.

## Supply Chain Risk in ML Systems

AI systems carry supply chain exposure at multiple layers: pre-trained model weights, ML frameworks (PyTorch, TensorFlow, ONNX), model-serving stacks (vLLM, TGI, Triton), orchestration libraries (LangChain, LlamaIndex), and vector database dependencies. Each layer is an entry point independent of the model's own security properties.

Framework-level CVEs in ML serving infrastructure have appeared with increasing frequency. Compromising a serving stack achieves code execution on the host running the model, bypassing model-level controls entirely. Deserialisation flaws, path traversal, and SSRF vulnerabilities have all appeared in widely used ML components in the past two years.

Supply chain risk extends to model weights. Pickle-format model files — the default serialisation format for PyTorch — can embed arbitrary Python code that executes on load. Hugging Face has promoted Safetensors as a safer alternative, but pickle-format weights remain common. Any model file loaded from an external or community source without verification is an unsigned executable.

[mlcves.com](https://mlcves.com) maintains a searchable database of ML-specific CVEs across frameworks and serving stacks, organized by product and severity, useful for tracking exposure in a known-component inventory.

## Managing AI Security Risk: The NIST Framework

NIST released the [AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework) in January 2023 and extended it with a Generative AI Profile in July 2024 addressing risks specific to foundation models and RAG systems. The framework organizes AI risk management into four functions: Govern, Map, Measure, and Manage.

For security operations teams the practical outputs are:

- **Map** AI components and their data flows before deployment, identifying where external content enters the inference pipeline.
- **Measure** model behavior against defined acceptable-use boundaries and flag drift from expected output distributions.
- **Manage** runtime monitoring for anomalous output patterns — unusual tool call sequences, out-of-schema responses, and unexpected data references.
- **Govern** access to AI systems and their connected tools, with audit logs covering model inputs and outputs.

An April 2026 concept note for an AI RMF Profile on Trustworthy AI in Critical Infrastructure signals that sector-specific guidance is forthcoming for operators in high-stakes environments.

## Mitigation Priorities

No single control closes the AI security gap. Current best practice stacks several:

1. **Input validation and output filtering.** Reject or flag inputs matching known injection patterns. Validate that model outputs conform to expected schemas before acting on them.
2. **Least-privilege tool access.** AI agents should have the minimum permissions needed for their task. Revoke access to sensitive APIs or file systems unless specifically required.
3. **Runtime monitoring.** Log model inputs and outputs. Anomaly detection on response patterns can surface indirect injection attempts and behavioral drift before damage accumulates.
4. **Dependency hardening.** Pin ML framework versions, audit model files before loading, prefer Safetensors over pickle, and track CVEs in your serving stack proactively.
5. **Red-team before deployment.** Adversarial testing that includes indirect injection, multi-step agent exploitation, and supply chain simulation should precede production rollout of any AI system with tool access.

## Sources

- [NIST AI.100-2: Adversarial Machine Learning Taxonomy and Terminology](https://www.nist.gov/news-events/news/2024/01/nist-identifies-types-cyberattacks-manipulate-behavior-ai-systems) — NIST's January 2024 publication establishing four ML attack categories and documenting the current limits of available defenses.
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) — the primary U.S. government framework for AI risk management, including the July 2024 Generative AI Profile covering foundation model and RAG-specific risks.
- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) — OWASP's top-ranked LLM risk entry, with direct and indirect injection taxonomy, real-world exploit examples, and mitigation strategies.


---

*→ This post is part of the [AI Security Intelligence Hub](/posts/ai-security-intelligence-hub) — the complete resource index for AI security on ai-alert.org.*