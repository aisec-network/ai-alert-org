---
title: "Model Extraction Attacks: How Adversaries Steal AI Models Through the API"
description: "Model extraction attacks reconstruct proprietary AI models by querying their public APIs. Here's how they work, what has been demonstrated against real systems, and how to reduce exposure."
pubDate: 2026-05-09
author: "Theo Voss"
tags: ["model-extraction", "model-theft", "api-security", "adversarial-ml", "intellectual-property", "privacy", "llm-security"]
category: "deep-dive"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/model-extraction-attacks-explained.png
heroAlt: "Model Extraction Attacks Explained"
sources:
  - title: "Stealing Machine Learning Models via Prediction APIs"
    url: "https://arxiv.org/abs/1609.02943"
  - title: "Model Leeching: An Extraction Attack Targeting LLMs"
    url: "https://arxiv.org/abs/2309.10544"
  - title: "Knockoff Nets: Stealing Functionality of Black-Box Models"
    url: "https://arxiv.org/abs/1812.02766"
schema:
  type: "TechArticle"
---

Model extraction attacks — also called model stealing attacks — are a class of adversarial ML technique where an adversary queries a target model's API and uses the resulting input-output pairs to train a surrogate model that approximates the target's functionality. The goal is to replicate proprietary model behavior without the cost of the original training and without access to the model weights.

For organizations that have invested significantly in proprietary fine-tuned models, model extraction represents a direct intellectual property threat. For organizations that deploy models for security-sensitive applications, extracted surrogate models enable targeted evasion attacks that might not generalize to the original model. This post covers how extraction attacks work, what has been demonstrated in practice, and what limited mitigations exist.

## How Model Extraction Works

The foundational paper is Tramèr et al.'s 2016 "Stealing Machine Learning Models via Prediction APIs" (arXiv:1609.02943), which demonstrated extraction of decision tree, logistic regression, SVM, and shallow neural network models using API queries alone. The core insight: if you can query a model and observe its outputs (including soft output probabilities), you can reconstruct its decision boundary.

The basic algorithm:

1. Sample a query distribution that covers the model's input space
2. Query the target model with those inputs and record responses
3. Train a surrogate model on the (input, response) pairs
4. Iterate, using uncertainty sampling or active learning to focus queries on informative regions of the input space

For classification models, soft probability outputs (the full probability vector over classes) are dramatically more informative than hard labels. Extraction attacks against APIs that return probability distributions converge faster and to higher fidelity surrogates.

## Extraction Against LLMs

Applying extraction to large language models is substantially harder than against classification models — the output space is effectively unbounded text rather than a probability vector. But meaningful LLM extraction has been demonstrated.

**Logit-based extraction**: If the target API returns token-level logprobs (as OpenAI's completions API optionally does), those probabilities contain rich information about the model's internal distributions. Wallace et al. and subsequent researchers have shown that logprob access substantially accelerates extraction compared to text-only outputs.

**Fine-tune distillation**: Rather than reconstructing the full model, distillation-style extraction targets specific capabilities. An adversary queries the target model extensively on a domain of interest (code generation, medical question answering, legal reasoning) and fine-tunes a smaller open-source base model on the resulting dataset. This doesn't recover the full proprietary model but does recover specialized capabilities at low cost. This technique is used routinely in practice — it's inexpensive and produces useful results.

**Jailbreak-mediated extraction**: An adversary may combine jailbreaking with extraction — using jailbreak techniques to probe how the model behaves without its safety fine-tuning, then modeling that behavior. This produces a surrogate that approximates the underlying capability without safety training.

The 2023 paper "Model Leeching: An Extraction Attack Targeting LLMs" (arXiv:2309.10544) demonstrated extraction of ChatGPT capabilities using a structured query strategy. The resulting surrogate performed comparably to the target on several benchmarks at a fraction of the training cost.

## Extraction as an Evasion Enabler

Even an imperfect surrogate model is highly useful for an adversary developing evasion attacks. Gradient-based adversarial example generation requires access to model gradients — impossible against a black-box API. But if you have a surrogate model, you can compute gradients against the surrogate and transfer the resulting adversarial examples to the original model.

**Transferability**: Adversarial examples crafted against a surrogate tend to transfer to the original model, especially if the surrogate is architecturally similar or was extracted from the same target. This is the primary reason model extraction is a security concern even when the extracted surrogate has degraded performance — a low-fidelity extraction can still enable effective evasion attacks against the original.

## API Fingerprinting and Detection

Before extraction can proceed at scale, an adversary typically performs API fingerprinting to understand the target model's architecture and training — information that helps design an efficient extraction strategy. Fingerprinting queries probe specific behaviors: mathematical reasoning patterns, specific factual knowledge, response formatting, and safety refusal patterns. Clusters of fingerprinting queries may be detectable in API logs as unusual query patterns from a single principal.

Detection of extraction attempts in API logs relies on:

- **Query volume anomalies**: Extraction requires many queries. High-volume querying from a single API key or IP range, especially with systematically varied inputs, is a signal.
- **Query distribution anomalies**: Extraction queries tend to be more diverse and systematically distributed across the input space than normal usage. Statistical tests on query distributions can flag anomalous patterns.
- **Latency analysis on queried inputs**: Some extraction approaches use active learning strategies that produce characteristic batching patterns.

These heuristics produce false positives. Distinguishing a legitimate researcher running large-scale evaluations from an adversary running extraction is difficult using behavioral signals alone.

## Mitigations and Their Limitations

**Return only hard outputs (no probabilities)**: If an API returns only generated text rather than token probabilities or class scores, extraction is harder. Against LLMs, this is often the default — most text generation APIs don't expose logprobs unless explicitly requested.

**Rate limiting and query volume caps**: Hard rate limits per API key make large-scale extraction expensive and slow. They don't prevent extraction — they increase cost. For commercial APIs, cost-per-query is already a barrier; for APIs with generous free tiers, rate limiting matters more.

**Output rounding and perturbation**: For classification APIs that return probability scores, rounding outputs or adding small calibrated noise reduces information content per query, increasing the queries-to-fidelity ratio. This is a well-studied mitigation; it has diminishing returns against sophisticated extraction strategies that are designed to work with perturbed outputs.

**Prediction confidence thresholding**: Returning lower-confidence responses for inputs near decision boundaries (the most informative regions for extraction) reduces the efficiency of active learning-based extraction. This comes with accuracy costs for legitimate users and is generally not deployed.

**Watermarking model outputs**: Embedding statistical watermarks in model outputs enables detection of surrogates trained on extracted data. The Radioactive Data watermarking approach and subsequent LLM output watermarking schemes allow an API provider to query a suspected surrogate and determine with statistical confidence whether it was trained on their outputs.

**Legal deterrence**: Terms of service provisions against systematic extraction exist at most commercial AI APIs. Legal recourse is available but slow and requires identifying the extracting party. For state-level adversaries or international actors, legal deterrence is not meaningful.

## The Honest Assessment

Model extraction cannot be fully prevented against a sufficiently determined adversary with API access. The information in the model's outputs is irreversibly disclosed with each query. The practical goal is making extraction expensive enough to exceed the benefit for most adversaries, and detecting when extraction is occurring so you can revoke access and investigate.

For organizations with genuinely proprietary models (significant investment in domain-specific fine-tuning, competitive differentiation from model capabilities), embedding output watermarks and monitoring for API abuse are the highest-value controls.

**Related resources:** The research literature on model extraction and model stealing attacks is mapped at [adversarialml.dev](https://adversarialml.dev). For the privacy angle — specifically membership inference and training data extraction — [aiprivacy.report](https://aiprivacy.report) covers how these attacks affect individuals whose data may be in the training set. Benchmarks for measuring how well a model resists extraction attempts are tracked at [aisecbench.com](https://aisecbench.com).

## References

- Tramèr, F. et al. (2016). [Stealing Machine Learning Models via Prediction APIs](https://arxiv.org/abs/1609.02943). arXiv:1609.02943.
- See, C. et al. (2023). [Model Leeching: An Extraction Attack Targeting LLMs](https://arxiv.org/abs/2309.10544). arXiv:2309.10544.
- Orekondy, T. et al. (2018). [Knockoff Nets: Stealing Functionality of Black-Box Models](https://arxiv.org/abs/1812.02766). arXiv:1812.02766.


---

*→ This post is part of the [AI Security Intelligence Hub](/posts/ai-security-intelligence-hub) — the complete resource index for AI security on ai-alert.org.*