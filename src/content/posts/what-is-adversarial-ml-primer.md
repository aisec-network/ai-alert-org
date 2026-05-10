---
title: "What Is Adversarial ML? A Practitioner's Primer"
description: "A practitioner-focused introduction to adversarial machine learning: evasion, poisoning, and inference attacks, why they matter in production, key papers, and real incidents."
pubDate: 2026-05-04
author: "Theo Voss"
tags: ["adversarial-ml", "evasion", "poisoning", "membership-inference", "primer", "nist"]
category: "primer"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/what-is-adversarial-ml-primer.png
heroAlt: "What Is Adversarial ML? A Practitioner's Primer"
sources:
  - title: "NIST AI.100-2: Adversarial Machine Learning — A Taxonomy and Terminology of Attacks and Mitigations"
    url: "https://csrc.nist.gov/pubs/ai/100/2/e2023/final"
  - title: "Explaining and Harnessing Adversarial Examples (Goodfellow et al., 2015)"
    url: "https://arxiv.org/abs/1412.6572"
  - title: "Towards Evaluating the Robustness of Neural Networks (Carlini & Wagner, 2017)"
    url: "https://arxiv.org/abs/1608.04644"
schema:
  type: "TechArticle"
---

Adversarial machine learning is the study of attacks against ML systems and the defenses that resist them. The term covers a family of techniques that manipulate either the model's inputs, its training data, or the inference queries made against it — sometimes all three. For practitioners running ML in production, understanding the taxonomy is not academic. Each attack class has different preconditions, different mitigations, and lands in a different part of your threat model.

This is the primer we wish existed when we first needed it.

## The Attack Surface: Where ML Is Different

Traditional software vulnerabilities live in code. A buffer overflow exploits a specific implementation bug and is fixed by patching that bug. Adversarial ML attacks often exploit fundamental properties of how models learn and generalize — properties that survive code changes and model retraining. That makes them structurally different from most of what appears in a CVE feed.

NIST's [AI.100-2 taxonomy](https://csrc.nist.gov/pubs/ai/100/2/e2023/final) organizes ML attacks along two axes: the phase of the ML lifecycle they target, and the attacker's level of access to the model. The four primary attack categories are evasion, poisoning, inference, and abuse.

## Evasion Attacks

Evasion attacks occur post-deployment. The model is already trained and running. The attacker crafts inputs specifically designed to cause misclassification or unexpected output without modifying the model itself.

The canonical formulation comes from [Goodfellow et al. (2015)](https://arxiv.org/abs/1412.6572): take a correctly classified image, compute the gradient of the loss with respect to the input, and add a small perturbation in that gradient direction. The result looks identical to the original but consistently fools the classifier. This is the Fast Gradient Sign Method (FGSM), and it spawned a decade of follow-on work.

For vision models, evasion attacks typically take the form of adversarial patches — physical objects or printed patterns that cause object detectors to misclassify vehicles, stop signs, or people. Researchers demonstrated in 2018 that an adversarial patch printed on a shirt caused a person-detector to reliably miss the wearer. Real-world deployments in autonomous vehicles and physical security systems are the practical concern.

For language models, evasion looks different. Adversarial suffixes — character sequences appended to prompts — can reliably shift model outputs. [Carlini & Wagner (2017)](https://arxiv.org/abs/1608.04644) introduced C&W attacks as a more powerful alternative to FGSM. Later work applied similar optimization to generate suffix strings that cause aligned LLMs to comply with refused requests. The 2023 GCG paper from CMU/UCSD demonstrated that such suffixes transferred across different model families.

**Defensive posture for evasion:** Input preprocessing (smoothing, JPEG compression, randomization) reduces adversarial perturbation. Certified defenses provide provable bounds on robustness within a perturbation radius. For LLMs, output filtering and behavioral classifiers catch a subset of adversarial outputs. None of these provide complete coverage.

## Poisoning Attacks

Poisoning targets the training phase. An attacker who can influence the training dataset can degrade model performance, introduce systematic biases, or implant backdoors.

**Performance poisoning** is the simpler variant: inject enough mislabeled or out-of-distribution samples to corrupt the model's learned representations. A few percentage points of poisoned data in a large dataset can meaningfully shift behavior on targeted inputs.

**Backdoor poisoning** is operationally more dangerous. The attacker implants a trigger: a specific pattern in the input that, when present, causes the model to produce attacker-specified output. The backdoored model performs normally on clean inputs and passes standard evaluation — the trigger activates it. The required fraction of poisoned training samples can be small. Research has demonstrated working backdoors inserted with control over fewer than 0.2% of training examples.

For ML systems that train or fine-tune on user-generated data, community-contributed datasets, or web-scraped corpora, poisoning is a realistic threat. The 2023 PoisonGPT paper demonstrated that a 7B parameter model could be modified to produce false factual claims for targeted queries while maintaining normal performance on benchmarks.

**Defensive posture for poisoning:** Data provenance tracking, anomaly detection on training data distributions, differential privacy during training, and post-training model inspection. Activation clustering can detect some backdoor patterns. Supply chain controls on training data sources are often more practical than technical defenses.

## Inference Attacks

Inference attacks probe a deployed model to extract information that should be private: whether a specific record was in the training set, the model's weights, or examples from the training data.

**Membership inference** determines whether a given data point was used during training. This matters when the training set is sensitive — medical records, private communications, proprietary code. A successful membership inference attack can confirm that a specific user's data was ingested without consent. Accuracy of such attacks against large language models has improved significantly since 2021.

**Model extraction** reconstructs a proprietary model by querying the API at scale and using the outputs to train a surrogate. The surrogate approximates the original's behavior without the attacker having access to the weights. This is an IP theft attack as much as a security attack: it can undermine the business value of a model and circumvent per-query pricing.

**Training data extraction** recovers verbatim training samples from a model's outputs. The 2021 Carlini et al. paper demonstrated that GPT-2 would reproduce exact memorized text — including personal information, code, and source text — when prompted with appropriate prefixes. This class of attack is why verbatim memorization in large models is a compliance issue, not just a research curiosity.

**Defensive posture for inference:** Rate limiting and query monitoring catch extraction at scale. Differential privacy training limits memorization provably. Output filtering prevents verbatim regurgitation of sensitive patterns. Membership inference is harder to prevent without degrading model utility.

## Real-World Incidents Worth Knowing

The attack categories are not purely theoretical:

- **ImageNet-scale adversarial examples** were demonstrated to transfer between models and survive JPEG compression, establishing physical-world feasibility.
- **Bing Chat (2023)** users elicited unintended persona behaviors through prompt-based manipulation, an early public demonstration of LLM behavioral boundary issues.
- **Hugging Face supply chain compromise (2024)**: malicious models uploaded to the Hub contained pickle-format payloads executing arbitrary code on load, a poisoning-adjacent supply chain attack.
- **Samsung confidential code leak (2023)**: employees pasting proprietary code into ChatGPT raised training data ingestion concerns, prompting Samsung to ban internal AI tool use.

These incidents span the taxonomy. None required a novel research exploit — they combined known techniques with access that production deployments routinely provide.

## What Practitioners Should Take From This

Three things that do not come through clearly enough in most introductions:

**Phase matters for defense.** Evasion attacks happen at inference time and require runtime defenses. Poisoning happens at training time and requires supply chain and data controls. Inference attacks happen at inference time but require different defenses than evasion. Lumping "adversarial ML" into a single category produces unfocused mitigation.

**Access level changes the threat.** A white-box attacker with gradient access to the model can mount far more powerful attacks than a black-box attacker with only API access. Your threat model should specify which access level is realistic for each adversary you care about.

**There is no complete defense.** NIST's AI.100-2 is explicit: "there is no foolproof way as yet to protect AI from misdirection." Published mitigations "currently lack robust assurances that they fully mitigate the risks." Defense in depth, monitoring, and designing for graceful failure are the correct posture — not searching for a single control that closes the gap.

## Sources

- [NIST AI.100-2: Adversarial Machine Learning Taxonomy](https://csrc.nist.gov/pubs/ai/100/2/e2023/final) — the primary U.S. government taxonomy for ML attacks and defenses, January 2024.
- [Goodfellow et al. (2015): Explaining and Harnessing Adversarial Examples](https://arxiv.org/abs/1412.6572) — the foundational paper establishing adversarial examples and FGSM.
- [Carlini & Wagner (2017): Towards Evaluating the Robustness of Neural Networks](https://arxiv.org/abs/1608.04644) — stronger adversarial attack methods showing limits of earlier defenses.
