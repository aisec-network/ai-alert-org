---
title: "Major Jailbreak Techniques of 2025: Disclosures, Patches, and What Persists"
description: "A roundup of significant jailbreak techniques disclosed or widely documented in 2025, including many-shot jailbreaking, crescendo attacks, cipher-based bypasses, and their patch status across major models."
pubDate: 2026-05-10
author: "Theo Voss"
tags: ["jailbreaking", "alignment-bypass", "red-teaming", "llm-security", "disclosure", "safety", "adversarial-prompting"]
category: "analysis"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/jailbreak-techniques-2025-roundup.png
heroAlt: "Jailbreak Techniques 2025 Roundup"
sources:
  - title: "Many-Shot Jailbreaking (Anthropic, 2024)"
    url: "https://www.anthropic.com/research/many-shot-jailbreaking"
  - title: "Crescendo: A Multi-Turn Jailbreak Attack (Microsoft Research, 2024)"
    url: "https://arxiv.org/abs/2404.01833"
  - title: "GPT-4 Technical Report — Safety Evaluations"
    url: "https://arxiv.org/abs/2303.08774"
  - title: "Universal and Transferable Adversarial Attacks on Aligned Language Models (Zou et al., 2023)"
    url: "https://arxiv.org/abs/2307.15043"
draft: false
schema:
  type: "TechArticle"
---

Jailbreaking research in 2024-2025 matured from demonstrating that LLM safety training can be bypassed into systematically characterizing when and why bypasses work, which ones transfer across model families, and which mitigations actually reduce attack success rates. This roundup covers the techniques with the clearest documentation and the most significant disclosure processes.

We follow the distinction between jailbreaking (subverting alignment training) and prompt injection (exploiting model context handling) established in our [jailbreaking vs. prompt injection primer](/posts/jailbreaking-vs-prompt-injection/). This post covers jailbreaking specifically.

A note on scope: we cover publicly disclosed techniques with research backing. We do not cover specific user-developed workarounds traded in informal communities, which change faster than any roundup can track and often lack rigorous success-rate documentation.

## Many-Shot Jailbreaking — Anthropic's Own Disclosure (2024)

In April 2024, Anthropic published a disclosure of a technique they named **many-shot jailbreaking**, affecting models with extended context windows.

**Mechanism:** Long-context models can be manipulated by placing a large number of demonstration examples in the context before the actual harmful request. If each demonstration example shows the model "agreeing" to answer a question it would normally refuse, the model's in-context behavior shifts toward compliance for the final query. This is a scaled-up version of few-shot steering — but the "many-shot" version works because long-context models weight in-context demonstrations more heavily as example count increases.

Anthropic's research found that attack success rates increased log-linearly with the number of shots — roughly, more examples in context meant a higher probability of compliance with the final harmful query. Models with very long context windows (100K+ tokens) were most affected.

**Disclosure approach:** Anthropic published the research themselves, including the success rate data, as part of their commitment to proactive safety disclosure. This is one of the clearer examples of a lab identifying and disclosing its own model's vulnerability before external researchers did.

**Patch status:** Anthropic reported applying mitigations. The specific technical approach was not fully disclosed, but their paper indicates that context position weighting and explicit recognition of in-context demonstration manipulation were part of the mitigation. Success rates were reported to drop after patching, though the degree was not quantified publicly.

**Relevance to practitioners:** Any model with a long context window is potentially exposed to this technique. Deployments that allow users to provide very long initial context (document analysis, code review) without filtering the structure of that context have elevated exposure.

## Crescendo: Multi-Turn Escalation (Microsoft Research, 2024)

Microsoft Research published a jailbreak technique in 2024 named **Crescendo**, targeting the stateful nature of multi-turn conversations.

**Mechanism:** Rather than attempting a harmful request directly (which alignment training is specifically optimized to refuse), Crescendo approaches the target topic gradually across multiple conversation turns. Each turn establishes context that makes the next request seem like a natural continuation. The model's in-context state is gradually shifted toward the harmful topic through seemingly benign intermediate steps.

The process works because alignment training optimizes heavily on single-turn refusal — the model learns to refuse specific request patterns. Gradual escalation across turns, where each individual turn looks benign, can cross the threshold without triggering the refusal behavior that direct requests would.

The Microsoft research documented success against multiple major commercial models, including measured attack success rates across topic categories. The paper is publicly available at arXiv:2404.01833.

**Patch status:** Multi-turn jailbreak resistance is more difficult to patch than single-turn refusal because it requires the model to maintain awareness of conversation trajectory, not just evaluate individual inputs. Vendors applied various mitigations — periodic conversation summarization and safety evaluation, more aggressive refusal triggered by topic drift patterns — with partial success. Crescendo variants continue to circulate in red-team communities.

**Relevance to practitioners:** Chat applications where users have extended multi-turn sessions are more exposed to this class than single-turn API deployments. Deployers running extended-session agents should evaluate whether their safety infrastructure monitors conversation trajectory, not just individual turns.

## Cipher and Encoding-Based Bypasses

A class of bypasses documented extensively in 2024-2025 exploits the fact that safety training is optimized on natural language text — if a harmful request is encoded in a different representation, the safety classifiers may not recognize it.

**Documented variants include:**

**Base64 encoding:** Encoding the harmful portion of a request in Base64 and asking the model to decode and respond. Many models are capable of decoding Base64 natively; some safety classifiers process only the surface text, not the decoded content.

**ROT13 and simple substitution ciphers:** Similar to Base64 — the harmful request is obscured by a simple transformation the model can reverse. Research published in 2024 showed measurable bypass success rates with cipher-encoded requests against models that were robust to the plaintext equivalents.

**Code comment embedding:** Placing harmful requests inside code comments in a code-focused prompt. The model, primed for code generation, may process the comment's instructions without applying the same safety evaluation as a direct text request.

**Non-ASCII script substitution:** Using visually similar characters from other Unicode scripts to replace characters in keywords that safety classifiers match on. "Homoglyph attacks" of this type were documented against commercial LLMs in 2024.

**Patch status:** Decoder-aware safety classifiers (which process model-decoded representations, not just surface text) have been deployed by major providers. Coverage is incomplete; new encoding variations continue to circulate. The fundamental challenge is that a model capable of understanding multiple encodings faces an infinite space of potential encoding variations to block.

**Cross-reference:** The [jailbreakdb.com](https://jailbreakdb.com) database maintains a categorized record of jailbreak techniques with their disclosure dates, success rates where documented, and patch status.

## Adversarial Suffix Attacks — 2025 Status

The GCG attack from Zou et al. (2023) — algorithmically generated suffixes appended to refused queries that cause consistent compliance — remained active as a research focus through 2025.

**2025 developments:**

Researchers published improved suffix generation algorithms that reduced the compute required to find effective suffixes, making the attack more accessible to adversaries without large compute budgets. Improved transfer across model architectures was also demonstrated: suffixes generated against open-weight models transferred to commercial API-only models at meaningful rates.

Concurrent work on adversarial suffix defenses showed that **randomized smoothing** (introducing small random perturbations to inputs before model evaluation) significantly reduces the effectiveness of gradient-based adversarial suffixes, because they are typically fragile to input perturbations. However, randomized smoothing introduces latency and may affect model quality.

**Patch status:** Major commercial providers apply input filtering that detects known adversarial suffix patterns, but this is a signature-based defense against a class of attacks that generates novel suffixes. Detection of known suffixes does not prevent generation of new ones.

## Multi-Modal Jailbreaking in Vision-Language Models

The expansion of commercial LLMs to accept image inputs introduced jailbreak surface in the vision modality.

**Documented technique:** Instructions or text embedded in images — either visually readable text (asking the model to "read and follow" the image's instructions) or adversarially perturbed image patches that shift the model's behavior without visible change to human observers — were demonstrated to bypass safety training in vision-language models in 2024.

The image modality is relevant because safety classifiers for text-input models often do not extend to text extracted from images. A model that refuses a text-based harmful request may comply when the same request is presented as text in an image.

**Patch status:** Vendors have applied OCR-based safety evaluation (extracting text from images and evaluating it as text) and image-level classifiers. Research demonstrates that these can be bypassed with adversarial image perturbations, creating an ongoing detection/evasion cycle.

## What Persists — Structural Properties That Make Jailbreaking Durable

Reading across these techniques, several properties create durable attack surface regardless of specific technique patches:

**Training distribution limits.** Safety training optimizes on a finite set of refusal examples. Novel attack formulations — new encodings, new escalation patterns, new modalities — are outside the training distribution and may not trigger refusal behavior until specifically addressed.

**Alignment tax tradeoffs.** Stronger refusal behavior comes with costs: higher false-positive rates (refusing benign requests), lower model capability on edge cases, reduced instruction-following quality. Safety training is optimized under this constraint; the cost of closing every jailbreak is higher refusal rates on legitimate use cases.

**Open-weight model proliferation.** Public model weights can be fine-tuned to remove safety training entirely. Safety-fine-tuned open-weight models have been stripped of their alignment training within days of release. For deployment scenarios where open-weight model users are the threat model, alignment training provides limited protection.

The [jailbreakdb.com](https://jailbreakdb.com) database provides ongoing tracking of jailbreak disclosures with patch status updated as vendor responses are published. The [adversarialml.dev](https://adversarialml.dev) research index covers the academic literature on alignment bypass techniques.

## Sources

- [Anthropic: Many-Shot Jailbreaking (2024)](https://www.anthropic.com/research/many-shot-jailbreaking) — Anthropic's self-disclosure of long-context jailbreaking technique.
- [Crescendo (arXiv:2404.01833)](https://arxiv.org/abs/2404.01833) — Microsoft Research's multi-turn jailbreak demonstration.
- [Zou et al.: Universal and Transferable Adversarial Attacks on Aligned Language Models (arXiv:2307.15043)](https://arxiv.org/abs/2307.15043) — GCG adversarial suffix attack and transfer results.
- [GPT-4 Technical Report — Safety Evaluations](https://arxiv.org/abs/2303.08774) — baseline documentation of GPT-4 safety evaluation methodology.


---

*→ This post is part of the [AI Security Intelligence Hub](/posts/ai-security-intelligence-hub) — the complete resource index for AI security on ai-alert.org.*

For more context, [AI incident tracker](https://aiincidents.org/) covers related topics in depth.
