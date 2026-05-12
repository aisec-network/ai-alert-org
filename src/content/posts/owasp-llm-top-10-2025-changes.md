---
title: "OWASP LLM Top 10 2025: What Changed and Why It Matters"
description: "The OWASP Top 10 for Large Language Model Applications was updated for 2025. Here is a breakdown of what moved, what was added, and why the changes reflect the evolving threat landscape for AI deployments."
pubDate: 2026-05-10
author: "Theo Voss"
tags: ["owasp", "llm-security", "top-10", "prompt-injection", "rag", "agent-security", "risk-framework"]
category: "analysis"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/owasp-llm-top-10-2025-changes.png
heroAlt: "OWASP LLM Top 10 2025 Changes Analysis"
sources:
  - title: "OWASP Top 10 for Large Language Model Applications 2025"
    url: "https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/"
  - title: "OWASP LLM AI Security & Governance Checklist"
    url: "https://genai.owasp.org/resource/llm-ai-security-governance-checklist/"
  - title: "OWASP LLM01:2025 Prompt Injection"
    url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
  - title: "OWASP LLM10:2025 Unbounded Consumption"
    url: "https://genai.owasp.org/llmrisk/llm10-unbounded-consumption/"
draft: false
schema:
  type: "TechArticle"
---

When OWASP published the original LLM Top 10 in 2023, it captured a snapshot of a threat landscape that was still being mapped in real time. The 2025 edition reflects two more years of incident data, responsible disclosures, and real-world deployments at scale. Several entries shifted position, two were substantially rewritten, and the framing of agent security moved from theoretical appendix to first-tier concern.

This post walks through the meaningful changes — not a list recitation, but an analysis of what the changes signal about where the field has moved.

## What Stayed at the Top: Prompt Injection (LLM01)

Prompt injection held the top slot, and nothing in the incident record from 2024-2025 suggests that was the wrong call. The core definition was tightened: the 2025 edition draws a clearer line between **direct prompt injection** (user-controlled input overriding system instructions) and **indirect prompt injection** (external content processed by the model containing embedded instructions).

The practical significance of that distinction is that indirect injection has a completely different threat model. Direct injection is a user-trust problem — you are deciding how much to trust your own users. Indirect injection is an architectural problem — any content the model retrieves and processes becomes a potential attack vector, regardless of who the user is or how trusted they are.

The 2025 edition also added explicit guidance on agent-specific injection: when a model is operating as an agent (reading documents, browsing web pages, calling external APIs), the attack surface for indirect injection expands with every new tool granted. A model that can read and send email, calendar invites, and Slack messages is exposed to injection via all three content types simultaneously. This point was present but underemphasized in 2023.

For practical guidance on the direct vs. indirect distinction, see our earlier post on [jailbreaking vs. prompt injection](/posts/jailbreaking-vs-prompt-injection/).

## Insecure Output Handling: Now Explicitly Covers Agent Outputs (LLM02)

The 2023 version of LLM02 focused primarily on output that was unsafely rendered in downstream systems — cross-site scripting via LLM output, code injection when LLM output was concatenated into SQL queries or shell commands.

The 2025 revision broadened the scope to explicitly cover **agent action outputs**: when an LLM agent decides to take an action (call a function, write a file, send an API request), the action itself is an "output" that must be validated before it executes. The key mitigation addition was the concept of a **human-in-the-loop approval gate** for high-consequence actions — any action that is irreversible, high-impact, or outside the agent's expected operating parameters should require an explicit human confirmation before execution.

This represents a maturation of the guidance: it is no longer sufficient to validate the text the model produces. You have to validate the actions the model initiates.

## Training Data Poisoning: Elevated and Expanded (LLM03)

Training data poisoning moved up in the 2025 list, reflecting the documented increase in malicious model uploads to public repositories and the demonstrated viability of poisoning instruction-tuning datasets with small numbers of adversarial examples.

The 2025 entry is more specific about the attack vectors: it distinguishes between **pre-training poisoning** (injecting content into web-crawled datasets), **fine-tuning poisoning** (compromising instruction-tuning datasets), and **RLHF poisoning** (inserting adversarial human feedback signals). Each has a different detection profile and a different control set.

Notably, the 2025 edition calls out **RAG corpus poisoning** as a subset of training data poisoning — an attacker who can inject content into a retrieval database that an LLM uses is effectively poisoning the model's inference-time "training data." This is operationally relevant because RAG corpora are often updated continuously and may have weaker integrity controls than the initial training datasets.

Our post on [LLM supply chain poisoning](/posts/llm-supply-chain-poisoning/) covers the mechanics in detail.

## The New Entry: System Prompt Leakage (LLM07)

One of the more significant structural additions in 2025 was an explicit entry for **system prompt leakage** — the disclosure of confidential system prompt contents through adversarial questioning, prompt injection, or model behavior that reveals instruction-shaped content.

System prompts are where operators embed business logic, confidentiality requirements, and behavioral constraints. In 2024, multiple high-profile system prompt leaks confirmed that models can be caused to output their system prompts through sufficiently crafted user inputs. The Samsung data exposure incident — where employees uploaded confidential data to ChatGPT — was an early signal that confidential content entered into AI systems is not reliably protected.

The 2025 mitigation guidance for this entry is pragmatic: treat system prompts as sensitive configuration, not as access control. A system prompt that says "do not reveal this information" does not securely protect that information — the model may comply, but it is not a cryptographic guarantee. Genuinely sensitive information belongs in access-controlled systems, not in model context.

## Unbounded Consumption: The Renamed Denial-of-Service Entry (LLM10)

What was called "Model Denial of Service" in 2023 became "Unbounded Consumption" in 2025. The rename reflects a broader scope: it now covers not just computational denial-of-service (flooding a model API with expensive requests), but also **token budget exhaustion** in agent workflows, **excessive API cost accumulation**, and **resource consumption via long-context manipulation**.

The 2025 version documents that in agentic systems, an attacker who can cause an agent to loop, to generate very long outputs, or to recursively call tools can exhaust computational budgets without triggering traditional rate limits. Token quotas and per-session cost caps are highlighted as necessary controls that most deployments do not implement by default.

## What the Changes Signal

Reading the diff between the 2023 and 2025 editions, a few themes emerge consistently:

**Agents changed the risk profile substantially.** The 2023 list was written for systems where the LLM produces text that a human reads. The 2025 list reflects systems where the LLM produces actions that machines execute. This is the most significant structural shift in the threat model.

**Supply chain risks are more concrete.** In 2023, training data poisoning was theoretical in most enterprise contexts. By 2025, there were documented incidents of malicious models on Hugging Face, confirmed poisoning research against instruction-tuning workflows, and enterprise deployments dealing with third-party fine-tune provenance questions.

**Output validation has become architectural.** The guidance consistently moved from "filter model outputs" toward "validate all model-initiated actions before execution." This is a more demanding control requirement and reflects the practical experience of deployers who discovered that text filters were insufficient when the model started calling APIs.

The OWASP Top 10 for LLMs is a useful baseline, not a complete framework. But tracking how it evolves is a reliable signal of where the practitioner community has accumulated real-world experience. The 2025 changes point clearly at agentic deployments, supply chain integrity, and the limits of system prompts as a security boundary.

**Related resources:** [promptinjection.report](https://promptinjection.report) provides detailed coverage of the LLM01 prompt injection category including indirect injection techniques and real-world incident documentation. For the supply chain and model artifact risks highlighted in LLM03, [mlcves.com](https://mlcves.com) tracks CVEs across the ML toolchain. Defense patterns for the LLM02 insecure output handling class — including agent action validation and guardrail architectures — are covered at [aidefense.dev](https://aidefense.dev).

## Sources

- [OWASP Top 10 for Large Language Model Applications 2025](https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/) — the primary reference.
- [OWASP LLM AI Security & Governance Checklist](https://genai.owasp.org/resource/llm-ai-security-governance-checklist/) — companion checklist for enterprise deployments.
- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) — expanded prompt injection taxonomy with agent-specific guidance.
- [OWASP LLM10:2025 Unbounded Consumption](https://genai.owasp.org/llmrisk/llm10-unbounded-consumption/) — renamed and expanded denial-of-service entry.

## See also

- [AI incident tracker](https://aiincidents.org/)
- [AI security digest](https://aisecdigest.com/)
