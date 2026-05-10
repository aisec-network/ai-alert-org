---
title: "Tool Review: Garak, the LLM Vulnerability Scanner"
description: "Garak is an open-source LLM vulnerability scanner from NVIDIA that probes language models for dozens of failure modes. Here's what it tests, how to run it, and where it falls short."
pubDate: 2026-05-07
author: "Theo Voss"
tags: ["garak", "tool-review", "llm-scanner", "vulnerability-scanner", "red-teaming", "open-source", "nvidia"]
category: "tool-review"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/tool-review-garak-llm-scanner.png
heroAlt: "Garak LLM Vulnerability Scanner Tool Review"
sources:
  - title: "Garak: A Framework for LLM Red-Teaming"
    url: "https://arxiv.org/abs/2406.11036"
  - title: "Garak GitHub repository"
    url: "https://github.com/NVIDIA/garak"
  - title: "Garak documentation"
    url: "https://docs.garak.ai"
schema:
  type: "TechArticle"
---

Garak (Generative AI Red-teaming and Assessment Kit) is an open-source LLM vulnerability scanner developed at NVIDIA. It's the closest thing the field has to a systematic automated testing framework for LLM security properties — not a replacement for human red-teaming, but a repeatable, scriptable first pass that organizations can integrate into CI/CD pipelines or pre-deployment validation.

This review covers what Garak tests, how to run it against local and API-accessible models, what its results look like, and where it falls short as a security assessment tool.

## What Garak Is

Garak is a framework for probing LLMs for failure modes across a defined taxonomy of "probes." Each probe is a structured test: it sends one or more inputs to a target LLM and evaluates the response against one or more "detectors" that check whether the response exhibits a targeted failure.

The framework was formally described in the paper "Garak: A Framework for LLM Red-Teaming" (Derczynski et al., 2024, arXiv:2406.11036) and is maintained at [github.com/NVIDIA/garak](https://github.com/NVIDIA/garak).

As of mid-2026, Garak ships with over 100 probes across categories including:

- **Jailbreaks**: Tests based on known jailbreak templates (DAN, JAILBREAK, base64-encoded instructions, roleplay framings)
- **Prompt injection**: Direct and indirect injection patterns
- **Toxicity elicitation**: Probes that attempt to generate harmful, offensive, or dangerous content
- **Information hazards**: Tests for generation of synthesis routes, malware, CBRN-relevant information
- **Hallucination and factuality**: Tests for confident confabulation on known facts
- **Data leakage**: Probes for memorized training data, PII, and confidential string recall
- **Encoding and obfuscation**: Tests using ROT13, base64, Pig Latin, homoglyph substitutions to bypass content filters
- **Continuation attacks**: Prompts designed to elicit problematic completions

## Installation and Setup

```bash
pip install garak
```

Garak requires Python 3.9+ and installs with minimal dependencies. For API-based targets (OpenAI, Anthropic, Cohere, etc.), you'll need the appropriate API keys in your environment. For local models, Garak supports Hugging Face transformers and llama.cpp backends.

To list available probes:

```bash
garak --list_probes
```

To run a full scan against an OpenAI model:

```bash
garak --model_type openai --model_name gpt-4o --probes all
```

A full run against a capable model takes 30–90 minutes depending on the number of probes and API rate limits. Garak supports parallel probe execution with the `--parallel_attempts` flag.

## Running Targeted Probes

For most production assessments, running all probes is overkill and expensive. Garak supports targeted probe selection:

```bash
# Test only jailbreak probes
garak --model_type openai --model_name gpt-4o --probes jailbreak

# Test specific probe categories
garak --model_type openai --model_name gpt-4o --probes jailbreak,promptinjection,encoding
```

For local models via Hugging Face:

```bash
garak --model_type huggingface --model_name mistralai/Mistral-7B-Instruct-v0.2 --probes jailbreak
```

## Understanding the Output

Garak produces a structured report in JSON and a human-readable summary. The key metric per probe is the **hit rate**: the fraction of probe inputs that successfully elicited the targeted failure mode.

A typical summary looks like:

```
jailbreak.DAN: 3/20 attempts triggered (15.0%)
jailbreak.JAILBREAK: 1/20 attempts triggered (5.0%)
encoding.Base64Probe: 7/20 attempts triggered (35.0%)
```

High hit rates on encoding probes are common even against models with strong RLHF alignment — encoding-based bypass remains a persistent weakness. High hit rates on direct jailbreak probes indicate more significant alignment gaps.

The JSON output includes per-attempt details: the exact input sent, the model's response, and which detector(s) flagged the response. This is useful for debugging — you can review exactly what triggered a hit and decide whether it's a genuine failure or a false positive.

## What Garak Tests Well

**Known jailbreak coverage**: Garak's jailbreak probe library is maintained and updated with documented techniques. Running it against a new model or fine-tune gives you coverage of the historical jailbreak catalogue quickly.

**Encoding bypass testing**: The encoding probes (base64, ROT13, etc.) are among Garak's strongest contributions — this is an underappreciated attack surface that most organizations don't test systematically.

**Regression testing**: Because Garak is scriptable and produces structured output, it integrates cleanly into CI/CD pipelines for regression testing. If a fine-tuning run degrades safety properties, a Garak run in the deployment pipeline will catch it before production.

**Reproducibility**: Garak runs are reproducible given the same probe set and model version, which is important for compliance documentation and comparative before/after assessments.

## Where Garak Falls Short

**Not a substitute for human red-teaming**: Garak's probes are drawn from known attack techniques. It will not discover novel attack patterns. A human red-teamer exploring the specific model and deployment context will find vulnerabilities that Garak misses.

**Context-free testing**: Garak sends probes directly to the model without the surrounding context of a real deployment (system prompts, retrieval context, surrounding application logic). A model that passes Garak's jailbreak probes when tested naked may still be vulnerable when tested as deployed, with a weak system prompt.

**Detector quality varies**: Garak's detectors — the components that evaluate whether a model response represents a failure — use a mix of pattern matching, string classifiers, and secondary LLM calls. False positive and false negative rates vary considerably across detector types.

**API cost**: A full scan against a commercial API model can generate thousands of requests. At GPT-4 pricing, a full garak run can cost $20–50+. Budget accordingly.

**English-centric**: The probe library is overwhelmingly English-language. For multilingual deployments, Garak's coverage of non-English attack vectors is limited.

## Recommended Usage Pattern

1. Run a targeted probe set (jailbreak + promptinjection + encoding) as a gate in your model deployment pipeline.
2. After deployment, run a full scan at cadence (monthly or on major model updates) and track hit rates over time.
3. Use Garak output as a checklist for human red-teaming: the categories with highest hit rates are where to focus manual investigation.
4. Combine with LLM Guard or similar runtime guardrail tools — Garak tells you where the model is vulnerable; guardrails mitigate those vulnerabilities in production.

## Verdict

Garak is the most complete open-source option for systematic LLM vulnerability scanning. For organizations that have deployed LLM products or are evaluating fine-tunes, it should be part of the pre-deployment validation workflow. Its results should be interpreted as a floor, not a ceiling — passing Garak means you've covered the known catalogue, not that the model is secure.

## References

- Derczynski, L. et al. (2024). [Garak: A Framework for LLM Red-Teaming](https://arxiv.org/abs/2406.11036). arXiv:2406.11036.
- [github.com/NVIDIA/garak](https://github.com/NVIDIA/garak)
- [docs.garak.ai](https://docs.garak.ai)
