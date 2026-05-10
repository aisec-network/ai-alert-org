---
title: "Tool Review: LLM Guard for Input/Output Filtering"
description: "LLM Guard is an open-source input/output filtering library for LLM applications. We review what it detects, how it deploys, its real limitations, and when it fits into a defense-in-depth architecture."
pubDate: 2026-05-05
author: "Theo Voss"
tags: ["tools", "llm-guard", "input-filtering", "output-filtering", "prompt-injection", "pii", "defense"]
category: "tools"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/ai-tool-security-review-llm-guard.png
heroAlt: "Tool Review: LLM Guard for Input/Output Filtering"
sources:
  - title: "LLM Guard — GitHub (protectai/llm-guard)"
    url: "https://github.com/protectai/llm-guard"
  - title: "LLM Guard Documentation"
    url: "https://llm-guard.com"
schema:
  type: "TechArticle"
---

LLM Guard is an open-source library published by Protect AI that adds input and output scanning to LLM application pipelines. It sits in front of (and behind) your LLM calls, running prompts and completions through a configurable set of detectors before they reach users or downstream systems.

This review is for practitioners evaluating whether LLM Guard belongs in their defense stack, not for researchers looking for benchmark comparisons. We focus on deployment realities, what the tool actually catches, and where it does not help.

## What LLM Guard Is

LLM Guard is a Python library. You import it, configure a set of input scanners and output scanners, and wrap your LLM calls. Prompts are passed through input scanners before they go to the model. Completions are passed through output scanners before they go back to the caller.

The library is model-agnostic: it works with OpenAI, Anthropic, Azure OpenAI, and any other inference API you call from Python. It does not modify the model or interact with the model host.

The project lives at [github.com/protectai/llm-guard](https://github.com/protectai/llm-guard) and maintains its own documentation at llm-guard.com. As of early 2026, the library is actively maintained with regular scanner additions.

## What It Detects

LLM Guard's detection capabilities are organized into input scanners (running on the user's prompt before the model sees it) and output scanners (running on the model's response before the caller receives it).

**Input scanners include:**

- **Prompt Injection:** Detects common prompt injection patterns including role-play jailbreaks, instruction override attempts, and known bypass formulations. Uses a combination of regex patterns and a fine-tuned classifier model. Configurable sensitivity threshold.
- **Toxicity:** Flags toxic, threatening, or harassing content in prompts. Useful for consumer-facing applications where the input surface is public.
- **PII Detection:** Identifies personally identifiable information in prompts — names, email addresses, phone numbers, SSNs, credit card numbers, and similar. Configurable to redact or block. Useful when you need to prevent users from sending sensitive personal data to external model APIs.
- **Ban Substrings / Ban Topics:** Configurable blocklists for specific terms, phrases, or topic categories. Blunt but fast.
- **Code Scanner:** Detects code injections within prompts. Relevant for code-assistant applications where users might attempt to inject harmful code.
- **Secrets Detection:** Identifies common secret patterns (API keys, credentials, private keys) in prompts before they are sent to a model API. Particularly relevant for code assistants used with engineering prompts.

**Output scanners include:**

- **No Refusal:** Detects when the model has refused to answer a request. Useful for logging refusals or catching jailbreaks that resulted in refusal.
- **Sensitive Data (output):** Mirrors the input PII scanner on model outputs — catches cases where the model reproduces personal data it should not have.
- **Toxicity (output):** Catches toxic or harmful content in completions.
- **Regex / Ban Patterns (output):** Configurable output filtering.
- **JSON / Code validation:** Validates that outputs conform to expected formats.
- **Relevance / Fact checking:** Experimental scanners that assess whether a completion is relevant to the prompt or consistent with a provided reference document. These are higher false-positive rate.

## Deployment Patterns

**Library integration:** The most common pattern. Add LLM Guard to your existing Python LLM client code with a few wrapper calls. Input scanners run synchronously before each LLM call; output scanners run on each completion before returning. The overhead depends on which scanners are enabled.

**REST API / sidecar:** LLM Guard provides a FastAPI-based server mode that exposes scanning over HTTP. This allows non-Python services to use LLM Guard, and supports deploying it as a sidecar alongside your model serving layer.

**Latency considerations:** This is the primary operational constraint. Scanners that use small fine-tuned classifier models (the Prompt Injection scanner, Toxicity scanner) add latency per call. In our experience the prompt injection scanner adds 80-200ms depending on the hardware it runs on. Running all scanners in a production environment on CPU adds up. GPU acceleration or running LLM Guard on separate hardware helps. Being selective about which scanners you enable is the practical solution — not all scanners are needed in every deployment.

## Real Limitations

**Prompt injection detection is not a solved problem.** LLM Guard's prompt injection scanner catches known patterns and many variants of common bypasses. It will not catch novel adversarial suffixes optimized against the scanner, indirect injections embedded in retrieved documents (the scanner sees only the user's direct prompt by default), or sufficiently creative role-play framings. It should be treated as one layer in a defense-in-depth stack, not a complete solution.

**PII detection has false positives.** The PII scanner will flag legitimate technical content containing numbers, addresses in code examples, and similar. Tuning thresholds is necessary in most deployments. Out-of-the-box sensitivity generates noise in engineering-focused applications.

**No protection against indirect injection by default.** LLM Guard scans the user's prompt and the model's output. It does not scan retrieved documents, tool outputs, or other external content that enters the model's context. For RAG applications and agents, you need to pipe retrieved content through input scanners yourself — this is not done automatically.

**Scanner models can be bypassed.** The underlying classifier models used for toxicity and prompt injection detection were trained on known datasets. Adversarially crafted inputs that evade those classifiers exist and are not difficult to construct for a motivated attacker.

**No context across turns.** LLM Guard scans each input and output independently. Multi-turn attacks that build up to a harmful output across several benign-looking turns are not caught by per-message scanning.

## When to Use It, When Not to

**Good fit:**

- You are deploying a consumer-facing application and want basic filtering of toxic inputs and harmful outputs. LLM Guard's straightforward integration and out-of-the-box coverage makes sense here.
- You need to prevent users from sending PII or secrets to external model APIs. The secrets and PII scanners are practically useful and reduce a real data handling risk.
- You want refusal logging and basic output monitoring. LLM Guard gives you structured scan results per call that are easy to log and alert on.
- You have a known threat model with specific banned content categories. The configurable blocklists and topic bans are fast and reliable for this.

**Not a fit, or needs supplementation:**

- You have an agentic application where the model processes external documents, web content, or tool outputs. You need to handle indirect injection at the application architecture level; LLM Guard alone is insufficient.
- Your threat model includes sophisticated, motivated adversaries. Prompt injection classifiers are a speed bump, not a wall. Red-team testing will bypass them.
- You need a complete AI security posture. LLM Guard addresses a narrow slice of the AI security problem — input/output filtering. Training-time attacks, model supply chain risks, inference infrastructure vulnerabilities, and access control are outside its scope.

## What It Complements

LLM Guard fits alongside tools that address what it does not cover. [aisecreviews.com](https://aisecreviews.com) maintains independent reviews of the broader AI security tooling landscape, including model scanning tools and infrastructure-level defenses. [bestaisecuritytools.com](https://bestaisecuritytools.com) tracks the current state of the market for teams comparing options before procurement.

For teams integrating LLM Guard into a broader security program: pair it with network-level logging of LLM API calls, separate monitoring of agent action traces, and periodic red-team exercises that target the scanner layer directly.

## Sources

- [LLM Guard on GitHub (protectai/llm-guard)](https://github.com/protectai/llm-guard) — source, scanner list, and integration documentation.
- [LLM Guard Documentation](https://llm-guard.com) — official documentation including scanner configuration reference.
