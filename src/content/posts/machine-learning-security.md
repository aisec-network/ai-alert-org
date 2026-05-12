---
title: "Machine Learning Security: Threats, Frameworks, and Defenses"
description: "A practitioner's reference for machine learning security: the canonical attack categories, the frameworks that catalog them (NIST AI 100-2, OWASP ML Top 10, MITRE ATLAS), and the defenses that actually ship in production."
pubDate: 2026-05-11
author: "AI Alert Desk"
tags: ["machine-learning-security", "adversarial-ml", "mlsecops", "nist", "owasp", "mitre-atlas"]
category: "guide"
sources:
  - title: "NIST AI 100-2 e2025: Adversarial Machine Learning — A Taxonomy and Terminology of Attacks and Mitigations"
    url: "https://csrc.nist.gov/pubs/ai/100/2/e2025/final"
  - title: "OWASP Machine Learning Security Top 10"
    url: "https://owasp.org/www-project-machine-learning-security-top-10/"
  - title: "MITRE ATLAS — Adversarial Threat Landscape for AI Systems"
    url: "https://atlas.mitre.org/"
  - title: "NCSC: Understanding adversarial attacks against machine learning and AI"
    url: "https://www.ncsc.gov.uk/paper/understanding-adversarial-attacks-against-machine-learning-and-ai"
schema:
  type: "TechArticle"
---

Machine learning security is the discipline of protecting ML models, their training data, the pipelines that build them, and the inference services that expose them — against a class of attacks that classical application security tooling does not catch. The threat surface is wider than "prompt injection." It includes data poisoning at training time, evasion at inference, membership inference and model inversion against deployed endpoints, model theft via query-based extraction, and supply-chain compromise of pretrained weights, datasets, and serving frameworks. This piece is a working reference for the categories security teams need to triage, the public frameworks that catalog them, and the defenses with the strongest evidence behind them.

## The canonical attack categories

The most useful starting point is the [NIST AI 100-2 e2025 taxonomy](https://csrc.nist.gov/pubs/ai/100/2/e2025/final), released by NIST as a formal terminology for adversarial machine learning. It organizes attacks by the stage of the ML life cycle they target and the attacker's goal.

**Training-stage attacks.** An adversary who controls some fraction of the training data, the labels, or the training code can mount a poisoning attack. Availability poisoning degrades overall accuracy; targeted poisoning makes the model misclassify specific inputs; and backdoor poisoning embeds a hidden trigger that the model responds to at inference time. Backdoors are particularly dangerous because the model behaves normally on clean test sets, so traditional accuracy-based evaluation does not flag them. NIST also classifies model-supply-chain compromise here: pulling a pretrained checkpoint from a public hub without verifying provenance is functionally equivalent to letting an unknown party participate in your training run.

**Deployment-stage attacks.** Once a model is serving traffic, an attacker without access to weights can still mount evasion attacks by crafting adversarial examples — inputs perturbed within a small budget that flip the model's prediction. Privacy attacks at this stage include membership inference (determining whether a specific record was in the training set), attribute inference, and model inversion (reconstructing training data from outputs). Model extraction attacks use repeated queries to clone the target model's behavior closely enough to either resell it or use it as a substrate for crafting evasion examples offline.

**Abuse and misuse.** NIST's taxonomy adds a fourth category — abuse — covering misuse of generative systems for influence operations, malware generation, or producing harmful content. This is where the LLM-era threats (prompt injection, jailbreaks, indirect injection via retrieved content) live.

The UK [NCSC's adversarial ML paper](https://www.ncsc.gov.uk/paper/understanding-adversarial-attacks-against-machine-learning-and-ai) draws the same map slightly differently, with seven categories that include model artefact manipulation (tampering with weights post-deployment) and model hardware attacks (side-channel and fault-injection against accelerators). Both taxonomies converge on the same operational point: defenders need controls at training time, at inference time, and on the artifacts in between.

## The frameworks worth knowing

Three public catalogs do most of the heavy lifting for threat modeling and control mapping.

[**MITRE ATLAS**](https://atlas.mitre.org/) is the ATT&CK-style knowledge base for AI systems. The v5.4.0 release (February 2026) catalogs 16 tactics, 84 techniques, 56 sub-techniques, 32 mitigations, and 42 documented case studies — including real incidents like Microsoft Tay, the ClearviewAI scraping, and adversarial patches against production object detectors. ATLAS is what you reach for when you need concrete TTPs to drive red-teaming or to map detections.

The [**OWASP Machine Learning Security Top 10**](https://owasp.org/www-project-machine-learning-security-top-10/) is the engineering-level checklist most teams already know. The 2023 edition enumerates ten categories: Input Manipulation (ML01), Data Poisoning (ML02), Model Inversion (ML03), Membership Inference (ML04), Model Theft (ML05), AI Supply Chain Attacks (ML06), Transfer Learning Attack (ML07), Model Skewing (ML08), Output Integrity Attack (ML09), and Model Poisoning (ML10). The OWASP LLM Top 10 is a separate, complementary list focused on generative systems. For background on individual attack classes, the community maintains a deeper catalog at [adversarialml.dev](https://adversarialml.dev).

**NIST AI RMF and ISO 42001** sit above these as governance frameworks — they tell you *what* to manage, not *how* to attack. They are necessary for compliance posture but do not substitute for the technical catalogs.

## Defenses that hold up in practice

No single defense generalizes across all attack classes. The evidence-based posture is layered.

Against evasion, adversarial training — augmenting training data with adversarial examples generated under the relevant threat model — remains the most studied defense, with certified-robustness methods (randomized smoothing, interval bound propagation) offering provable guarantees on bounded perturbations. Input preprocessing alone (JPEG compression, feature squeezing) has been broken repeatedly and should not be relied on as a primary control. Against poisoning, the strongest empirical defenses combine data provenance and integrity checks with statistical anomaly detection on training batches and influence-function analysis to flag suspicious samples post-training. Against extraction, rate limiting, query-pattern detection, and output perturbation (returning top-k labels rather than full softmax) raise the cost of cloning.

Privacy attacks need a different toolkit. Differential privacy applied during training (DP-SGD) bounds membership-inference risk with measurable privacy budgets; this trades a few accuracy points for a mathematically grounded guarantee. Output-side controls — confidence clipping, rejection of out-of-distribution queries — handle the residual.

Operationally, the same model-monitoring practices that catch drift catch many attacks. Sustained shifts in input distribution, prediction-class ratios, or confidence histograms are how poisoned-model triggers and large-scale evasion campaigns surface in telemetry. Teams that already track these signals for ML reliability — see [sentryml.com](https://sentryml.com) on the observability stack — are in a strong position to extend them for security.

## What to actually do this quarter

For teams starting from zero, the high-leverage moves are concrete: pin and hash every pretrained checkpoint and dataset; require signed provenance on anything pulled from public hubs; add inference-time rate limiting and per-account query budgets; run an ATLAS-driven tabletop against your highest-value model; subscribe to a feed of disclosed ML vulnerabilities (the public ML CVE corpus at [mlcves.com](https://mlcves.com) is a reasonable starting source); and extend your existing ML monitoring to alert on the distribution-shift signals that double as attack indicators. None of these require novel research — they require treating ML systems with the same artifact-integrity and runtime-controls discipline that the rest of the stack already gets.

## Sources

- [NIST AI 100-2 e2025: Adversarial Machine Learning — A Taxonomy and Terminology of Attacks and Mitigations](https://csrc.nist.gov/pubs/ai/100/2/e2025/final) — NIST's formal taxonomy of attacks across the ML life cycle, with mitigations and threat-model definitions. The canonical reference for terminology.
- [OWASP Machine Learning Security Top 10](https://owasp.org/www-project-machine-learning-security-top-10/) — Engineering-level top-ten list (ML01–ML10) covering input manipulation, poisoning, inversion, membership inference, theft, supply chain, transfer learning, skewing, output integrity, and model poisoning.
- [MITRE ATLAS](https://atlas.mitre.org/) — The ATT&CK-style knowledge base of real-world tactics, techniques, and case studies against ML systems; v5.4.0 (Feb 2026) catalogs 16 tactics and 84 techniques.
- [NCSC: Understanding adversarial attacks against machine learning and AI](https://www.ncsc.gov.uk/paper/understanding-adversarial-attacks-against-machine-learning-and-ai) — UK National Cyber Security Centre's seven-category framework, notable for including hardware and artefact-manipulation attacks the other catalogs underweight.

## See also

- [AI incident tracker](https://aiincidents.org/)
- [AI security digest](https://aisecdigest.com/)
