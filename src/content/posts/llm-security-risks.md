---
title: "LLM Security Risks: A Practitioner's Field Guide for 2025"
description: "A comprehensive breakdown of LLM security risks — prompt injection, supply chain poisoning, excessive agency, and model extraction — with mitigation guidance for security and AI platform teams."
pubDate: 2026-05-11
author: "AI Alert Desk"
tags: ["llm-security", "prompt-injection", "supply-chain", "model-poisoning", "agent-security", "owasp"]
category: "analysis"
sources:
  - title: "OWASP Top 10 for Large Language Model Applications 2025"
    url: "https://genai.owasp.org/llm-top-10/"
  - title: "OWASP LLM01:2025 Prompt Injection"
    url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
  - title: "NIST AI Risk Management Framework"
    url: "https://www.nist.gov/itl/ai-risk-management-framework"
  - title: "NIST AI 100-2e2025: Adversarial Machine Learning Taxonomy and Terminology"
    url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf"
schema:
  type: "TechArticle"
---

LLM security risks have moved from theoretical concern to operational reality. Organizations running production LLM workloads are encountering live incidents — system prompt leaks, indirect prompt injection through retrieval pipelines, agent systems executing unintended actions at scale. The threat surface is documented, actively exploited, and growing as deployments mature and models gain access to more tools.

This guide covers the risk categories that matter most for security operations and AI platform teams: where the vulnerabilities live, how they are exploited, and what controls reduce exposure in practice.

## Prompt Injection: The Most Prevalent LLM Attack Vector

Prompt injection has ranked first in [OWASP's Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) since the list debuted in 2023. The 2025 edition kept it there, and the incident record supports that placement.

The vulnerability has a structural origin: LLMs cannot natively distinguish between instructions they are supposed to follow and content they are supposed to process. A model told to summarize a document will obey instructions embedded in that document if those instructions are crafted to appear authoritative.

**Direct prompt injection** targets the user-model interface. The attacker crafts inputs designed to override system prompt instructions. A customer support bot told to "never discuss refunds" can be bypassed by a user who frames their input as a higher-authority directive. This is a trust problem — the model treats the adversarial input as if it carries legitimate authority.

**Indirect prompt injection** is operationally harder to contain. When a model retrieves external content — web pages, documents, emails, database records — and processes it, instructions embedded in that content become potential attack vectors. A model browsing the web as part of an agent workflow encounters pages that may contain injected directives. If those directives are convincing enough, the model executes them.

The [OWASP LLM01:2025 guidance](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) documents nine attack scenarios: compromised customer chatbots accessing private databases, hidden instructions in web pages exfiltrating conversation history, malicious prompts split across resume sections to evade filters, and injections embedded in images processed by multimodal models. For ongoing coverage of real-world prompt injection incidents and technique documentation, [promptinjection.report](https://promptinjection.report) tracks the attack class across deployments.

Key mitigations: constrain model capabilities to the minimum required for the task, enforce strict output format validation, clearly mark external content as untrusted within model context, and require human approval before high-consequence actions execute.

## Supply Chain and Poisoning Attacks

LLM supply chain risk is layered in ways that most enterprise deployments underestimate. A typical production deployment acquired a foundation model from one vendor, fine-tuned it with a dataset from another source, serves it through an inference library with its own CVE history, and pulls context from RAG pipelines updated continuously from external sources. Compromise at any layer propagates downstream.

**Model artifact poisoning** exploits public model repositories. Serialization formats like pickle enable arbitrary code execution on model load — a well-documented attack vector that has produced real CVEs in ML infrastructure. An attacker who publishes a plausible-looking fine-tuned model to a public hub can compromise any downstream team that loads it without verifying provenance.

**Training data and fine-tuning poisoning** requires earlier access but produces more durable effects. Research has demonstrated that injecting a small number of adversarial examples into instruction-tuning datasets can install backdoors — trigger patterns that cause specific, attacker-controlled behaviors — that persist through subsequent fine-tuning rounds. The OWASP 2025 list elevated this risk based on documented incident data from 2024.

**RAG corpus poisoning** sits at the intersection of supply chain and prompt injection. An attacker who can write to a retrieval database queried at inference time effectively poisons real-time model context. RAG pipelines are frequently updated and often have weaker integrity controls than initial training datasets, making them an attractive, lower-effort target.

[NIST's 2025 adversarial machine learning taxonomy](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf) classifies these as distinct attack families — poisoning, evasion, and extraction — with separate detection and mitigation requirements. The 2025 edition expanded coverage to include RAG-specific attacks and agent vulnerabilities that were not addressed in prior versions.

## Excessive Agency: When Models Act Without Sufficient Constraints

The 2025 OWASP list elevated excessive agency (LLM06) as autonomous agent deployments became widespread. The risk is direct: an LLM granted access to tools — file systems, email, APIs, databases — can take actions with real-world consequences. If that model is manipulated through prompt injection, system confusion, or malicious retrieved content, those tools become the attack surface.

The problem compounds in multi-agent systems. A coordinating agent that dispatches work to subagents may receive manipulated responses from a compromised subagent and act on them. Trust between agents in a pipeline is usually implicit — there is no authentication or integrity verification equivalent to mutual TLS between services.

Practical controls:
- **Least privilege**: grant models access only to the tools needed for the specific task, not a maximal tool set provisioned for convenience
- **Human-in-the-loop gates**: irreversible actions — sending email, deleting records, executing financial transactions — should require explicit human confirmation before execution
- **Action logging**: all model-initiated actions should be logged at sufficient fidelity to reconstruct what the model did and why
- **Parameter validation**: treat model-generated action parameters as untrusted inputs; validate them before they reach tool implementations, the same way you would validate any external input

Defensive guardrail architectures for agentic deployments, including runtime monitoring approaches for anomalous action sequences, are covered at [guardml.io](https://guardml.io).

## Sensitive Information Disclosure and Model Extraction

LLMs memorize training data, including data that should not have been included. Large-scale training corpora contain PII, credentials, internal documents, and proprietary code. Models trained on that data can reproduce it under specific prompting conditions.

**Training data extraction** involves querying a model with prompts designed to trigger verbatim reproduction of memorized content. Documented research on GPT-2 and subsequent models demonstrated reproduction of real email addresses, phone numbers, and code snippets. Attack effectiveness scales with model capacity.

**System prompt extraction** is the narrower operational variant: causing a deployed model to reveal system prompt contents through adversarial questioning. OWASP treats this as a distinct risk category (LLM07) because system prompts frequently contain business logic, API keys, and behavioral constraints intended to be confidential. The consistent finding from disclosed incidents is that instruction-based confidentiality ("do not reveal this information") does not constitute a security control — it is behavioral guidance that adversarial inputs can override.

**Model extraction** at larger scale — reconstructing a model's behavior through API queries to the point where a functional surrogate can be built — remains a threat to proprietary deployments. An attacker with sufficient query budget can approximate proprietary model behavior without requiring access to the underlying weights.

## What Actually Reduces Exposure

There is no patch that resolves LLM security risks at the architecture level. The controls that make a measurable difference are:

1. **Input and output validation**: validate inputs before they reach the model; validate outputs before they execute or render — this is not optional for agentic deployments
2. **Privilege minimization**: models should have access to the minimum set of tools required; expand incrementally and with logging, not by default
3. **Retrieval integrity**: authenticate and validate RAG content sources; treat retrieved content as untrusted regardless of source reputation
4. **Artifact provenance**: verify checksums and signatures on model artifacts; prefer models from documented, auditable sources
5. **Behavioral monitoring**: instrument model behavior in production; anomalous output patterns often precede discovered vulnerabilities or active exploitation
6. **Adversarial testing before deployment**: red-team prompt injection, jailbreaks, and tool misuse scenarios before production, not in response to incidents

The [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) provides the governance structure for organizing these controls — its Govern, Map, Measure, and Manage functions map onto the controls above at different organizational levels. The Generative AI Profile published by NIST in mid-2024 extends the core RMF to GenAI-specific risks.

LLM security is an architectural problem, not a configuration problem. The decisions that determine exposure — what tools a model can access, what content it processes without validation, what actions it can take without human approval — are made early in the deployment design. They are difficult to retrofit after incidents confirm the risk.

## Sources

- [OWASP Top 10 for Large Language Model Applications 2025](https://genai.owasp.org/llm-top-10/) — the primary community-driven risk classification for LLM deployments, updated to reflect 2024 incident data and agentic deployment patterns.
- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) — detailed taxonomy of direct and indirect prompt injection with nine documented attack scenarios and mitigation guidance.
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) — NIST's governance framework for AI risk, including the Generative AI Profile (NIST AI 600-1) covering GenAI-specific risk categories.
- [NIST AI 100-2e2025: Adversarial Machine Learning Taxonomy](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf) — 2025 update to NIST's adversarial ML taxonomy covering poisoning, evasion, extraction, and agent-specific attack classifications with enterprise deployment guidance.
