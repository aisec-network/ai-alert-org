---
title: "Model Theft via API: How Extraction Attacks Against Closed LLMs Work in Practice"
description: "Model extraction attacks let adversaries reconstruct proprietary LLMs by querying their APIs at scale. We examine the mechanics, cost-of-extraction economics, what rate limits actually protect, and findings from 2024-2025 research."
pubDate: 2026-05-06
author: "Theo Voss"
tags: ["model-extraction", "model-theft", "inference-attacks", "openai", "anthropic", "api-security", "analysis"]
category: "analysis"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/gpt4-model-theft-incident-analysis.png
heroAlt: "Model Theft via API: How Extraction Attacks Against Closed LLMs Work in Practice"
sources:
  - title: "Stealing Part of a Production Language Model (Carlini et al., 2024)"
    url: "https://arxiv.org/abs/2403.06634"
  - title: "Scalable Extraction of Training Data from Production LLMs (Nasr et al., 2023)"
    url: "https://arxiv.org/abs/2311.17035"
  - title: "Thieves on Sesame Street: Model Extraction of BERT-based APIs (Wallace et al., 2020)"
    url: "https://arxiv.org/abs/1910.12366"
schema:
  type: "TechArticle"
---

The business model of every closed AI API depends on one assumption: that you cannot reconstruct the model from its outputs. That assumption is partially wrong, and the research of 2024-2025 made clear exactly how wrong it is in practice.

Model extraction — reconstructing a proprietary model by querying its public API — has been theoretically understood since the mid-2010s. What changed recently is scale: researchers demonstrated that meaningful components of production LLMs, including specific architectural parameters, can be extracted from real commercial APIs using API costs that many security researchers can afford.

This is the current state of the attack, what it realistically achieves, and how the defenses deployed by the major labs actually work.

## The Mechanics of Model Extraction

Model extraction attacks construct a surrogate model that approximates the target model's behavior by training on (query, response) pairs sampled from the target's API. The attacker sends inputs to the target, collects outputs, and uses those outputs as training signal for their own model.

The simplest variant is **functional extraction**: build a surrogate that matches the target's input-output behavior on a distribution of queries, without caring about the underlying architecture. This is tractable with enough queries and is the most common form in practice. The resulting surrogate approximates the target's behavior on similar queries but may not generalize the same way on distribution shifts.

More targeted is **architectural extraction**: recover specific structural properties of the model — layer count, embedding dimension, number of attention heads — rather than just replicating behavior. The 2024 [Carlini et al. paper](https://arxiv.org/abs/2403.06634) demonstrated this against production deployments of OpenAI's models by exploiting the structure of logprobs outputs. They showed that the embedding dimension of GPT-3.5-turbo and GPT-4's transformer could be extracted with a small number of crafted queries by analyzing the rank of the response's log-probability matrix. The attack cost was estimated at under $2,000 USD for the embedding dimension extraction.

This does not mean they reconstructed the full model. Recovering the embedding dimension is not the same as recovering the weights. But it demonstrates that meaningful, non-public information about a closed model's architecture leaks through its API outputs.

## Cost-of-Extraction Economics

The economics of extraction depend on what you want to extract and at what fidelity.

**Full functional surrogate of a large model:** Extremely expensive. Building a surrogate that matches a GPT-4 class model on general tasks requires training a model of comparable scale, which means billions of dollars of compute plus the query cost. This is not a realistic threat from individual actors.

**Domain-specific functional surrogate:** Moderately expensive. If an attacker only needs the target model's behavior on a narrow domain — legal document classification, medical coding, a specific customer service task — they can query the API on that domain's distribution specifically. The surrogate only needs to match on that distribution, which requires far fewer parameters and far less training. For a narrow domain, a useful surrogate might cost $5,000-$50,000 in API fees and training compute.

**Architectural parameters (as above):** Cheap. The Carlini et al. attack recovered specific architectural properties for under $2,000. Rate limits slowed this but did not prevent it.

**Verbatim training data extraction:** A different attack class but worth noting. The [Nasr et al. (2023)](https://arxiv.org/abs/2311.17035) paper demonstrated that production LLMs could be caused to emit verbatim memorized training data — including personal information and copyrighted text — through specific prompting strategies. This is extracting training data, not the model architecture, but it compounds the IP theft concern for labs that trained on proprietary corpora.

## What Rate Limiting Actually Protects Against

Rate limits are the primary operational defense against extraction at scale. Understanding what they protect — and what they do not — is important for evaluating the realistic threat.

**What rate limits protect against:**

- **Mass functional extraction.** Querying a model millions of times to construct a large functional surrogate is time-limited and cost-imposes the attacker. At standard API pricing, constructing a general functional surrogate becomes expensive enough that it is not economically rational for most attackers.
- **Training data extraction at scale.** The memorization extraction attacks require many queries with specific prompt variants. Rate limits slow this substantially.
- **Automated scraping of API outputs for bulk training data.** Terms of service plus rate limits together block the large-scale data harvesting that would feed a competing training run.

**What rate limits do not protect against:**

- **Targeted architectural extraction.** The Carlini et al. attack required only hundreds to thousands of carefully chosen queries. Rate limits add time cost but do not prevent the attack — the query count is simply too low.
- **Sufficiently patient or distributed attackers.** Rate limits per API key do not stop an attacker using many keys (possibly through compromised accounts or purchased reseller access) or an attacker willing to spread extraction over months.
- **Domain-specific functional surrogates.** A narrow functional surrogate can be built within reasonable API quotas by a paying customer.

The labs are aware of these limitations. OpenAI's usage policies prohibit extraction explicitly. Anthropic's acceptable use policy similarly prohibits using outputs to train competing models. These are legal/contractual controls, not technical ones, and their enforceability against sophisticated actors is limited.

## Detection Approaches

Commercial API providers use several signals to detect extraction attempts:

**Query distribution anomalies.** Extraction attacks tend to generate queries with different statistical properties than normal use — unusually diverse prompts, structured sweeps across input space, queries that probe the model near capability boundaries. Rate-limiting anomaly detection can flag accounts exhibiting these patterns.

**Logprob access monitoring.** Some architectural extraction attacks specifically require access to the full logprobs distribution. Restricting logprob access (returning only the top-k tokens or removing the endpoint entirely) meaningfully reduces the information available for architectural attacks. OpenAI restricted logprob access in 2024 partly in response to this class of research.

**Output watermarking.** Embedding statistical watermarks in model outputs that persist into surrogate models trained on those outputs allows attribution of surrogates back to the source model. This is an active research area; practical deployment-grade watermarking for LLMs remains challenging, but several groups have published promising schemes.

## The Competitive Reality

Model extraction is, at its core, an IP theft mechanism. The most realistic threat is not individual researchers replicating GPT-4 but:

- Competitors using API access to build domain-specific surrogates at a fraction of training cost.
- Nation-state actors interested in characterizing adversary AI capabilities without direct model access.
- Cost arbitrage: distilling a cheap surrogate from an expensive model API, then serving the surrogate to avoid per-query fees.

The distillation case is particularly relevant. Knowledge distillation — training a smaller model to replicate a larger one's outputs — is standard practice in ML, and the line between legitimate distillation of your own model and extraction via API of a competitor's model is one of policy, not technical capability.

**What the 2024-2025 research changed:** It shifted the conversation from "is extraction possible in theory" to "here are specific parameters extracted from production models, here are the costs, here are the query counts." This has practical implications for labs evaluating whether logprob endpoints and other information-rich API outputs are worth the extraction risk they introduce.

## Defensive Implications for Organizations Using Commercial APIs

If your organization is on the other side — using a commercial model API rather than offering one — the relevant concern is not extraction of your vendor's model but the data your queries contain. Your queries to commercial APIs may contain proprietary business logic, customer data, or sensitive context. That data trains or influences future model versions depending on your contract. Review your vendor's data handling terms before treating API-based inference as equivalent to on-premise deployment.

## Sources

- [Carlini et al. (2024): Stealing Part of a Production Language Model](https://arxiv.org/abs/2403.06634) — demonstration of architectural parameter extraction from GPT-3.5-turbo and GPT-4 using logprobs.
- [Nasr et al. (2023): Scalable Extraction of Training Data from Production LLMs](https://arxiv.org/abs/2311.17035) — systematic demonstration of verbatim training data extraction from ChatGPT and other production models.
- [Wallace et al. (2020): Thieves on Sesame Street](https://arxiv.org/abs/1910.12366) — foundational work on functional extraction of BERT-based APIs.
