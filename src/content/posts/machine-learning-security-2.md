---
title: "Machine Learning Security Across the Pipeline: Training Data to Deployed Model"
description: "Machine learning security vulnerabilities enter at every stage — data ingestion, model training, artifact storage, and inference. A practitioner's breakdown of where attacks land and what controls hold up."
pubDate: 2026-05-11
author: "AI Alert Desk"
tags: ["machine-learning-security", "ml-pipeline", "data-poisoning", "supply-chain", "mlsecops"]
category: "guide"
sources:
  - title: "NCSC: Understanding Adversarial Attacks Against Machine Learning and AI"
    url: "https://www.ncsc.gov.uk/paper/understanding-adversarial-attacks-against-machine-learning-and-ai"
  - title: "NIST AI Risk Management Framework"
    url: "https://www.nist.gov/itl/ai-risk-management-framework"
  - title: "ISACA: Combating the Threat of Adversarial Machine Learning to AI-Driven Cybersecurity"
    url: "https://www.isaca.org/resources/news-and-trends/industry-news/2025/combating-the-threat-of-adversarial-machine-learning-to-ai-driven-cybersecurity"
  - title: "Cloud Security Alliance: Hidden Security Threats in Your ML Pipeline"
    url: "https://cloudsecurityalliance.org/blog/2025/09/11/the-hidden-security-threats-lurking-in-your-machine-learning-pipeline"
schema:
  type: "TechArticle"
---

Machine learning security is not a single problem. It is a set of distinct problems — each tied to a different stage of the ML lifecycle — that share one property: traditional application security controls miss most of them. A web application firewall does not detect backdoored training data. A SIEM rule does not flag a model checkpoint that has been silently modified in an artifact store. Understanding which attacks target which pipeline stage is the prerequisite for building controls that actually land.

This piece maps the four major stages — data, training, artifacts, serving — to the attacks they face and the defenses with the best evidence behind them.

## The four-stage attack surface

**Stage 1: Training data.** Data poisoning is the dominant threat at this stage. An adversary who can inject crafted samples into a training corpus can degrade overall accuracy (availability poisoning), cause systematic misclassification of targeted inputs (targeted poisoning), or embed a hidden trigger that activates only when a specific pattern appears at inference time (backdoor poisoning). According to recent research, even contaminating as little as 0.001% of training data can degrade model accuracy by up to 30% in targeted scenarios.

The [NCSC's adversarial ML paper](https://www.ncsc.gov.uk/paper/understanding-adversarial-attacks-against-machine-learning-and-ai) classifies training data poisoning as one of seven attack classes, noting it is distinct from malicious model training — where an adversary modifies hyperparameters, the training algorithm itself, or architecture choices — though both are training-stage threats. The detection problem is hard: a model with a clean-data accuracy of 97% and a backdoored accuracy of 96.8% will pass any test suite that does not probe the trigger distribution.

Key control: treat training data as a software artifact. Hash datasets at ingestion, log provenance for every sample added post-initial collection, and apply statistical anomaly detection across label distributions and feature spaces before each training run.

**Stage 2: The training process.** If training runs in shared infrastructure — a cloud-managed training job, a shared Kubernetes cluster, a vendor-hosted fine-tuning API — the training process itself becomes an attack surface. Adversaries with access to the compute environment can modify hyperparameters, inject malicious callbacks, or tamper with gradient updates to achieve similar outcomes to data poisoning while leaving training logs clean.

[ISACA's 2025 analysis](https://www.isaca.org/resources/news-and-trends/industry-news/2025/combating-the-threat-of-adversarial-machine-learning-to-ai-driven-cybersecurity) flags this as an underweighted risk: organizations running training workloads on shared infrastructure treat it as a cost optimization, not a security boundary. The control posture here mirrors code build security — immutable infrastructure, signed training scripts, hash verification of framework packages before training launch.

**Stage 3: Model artifacts.** A trained model is a binary artifact, and like any binary it can be tampered with post-production. The NCSC taxonomy labels this "model artefact manipulation" — modifying weights, altering architecture definitions, or swapping associated tokenizer files in ways that alter behavior without breaking the model's API surface. This attack class is particularly relevant when models are stored in shared artifact registries, distributed via model hubs, or transferred through CI/CD pipelines.

The [Cloud Security Alliance's ML pipeline threat analysis](https://cloudsecurityalliance.org/blog/2025/09/11/the-hidden-security-threats-lurking-in-your-machine-learning-pipeline) highlights a secondary artifact-stage risk: transitive dependency compromise. ML systems depend on packages (PyTorch, Transformers, ONNX runtimes, serving stacks) that themselves have transitive dependencies. A single compromised package deep in the dependency tree can affect every model that runs on it. This is the ML-specific variant of the software supply chain problem, and it is why CVE tracking for ML infrastructure — not just the model weights — is operationally relevant. See [mlcves.com](https://mlcves.com) for a curated feed of ML library and framework CVEs.

Key control: sign model artifacts at training completion and verify signatures before loading at serving time. Apply the same dependency pinning and lockfile practices to ML pipelines that CI/CD systems use for application code.

**Stage 4: Inference serving.** The deployed model endpoint faces a different category of attacks. Evasion attacks craft inputs that are within the model's expected input distribution but are perturbed just enough to flip predictions — without touching the model itself. Privacy attacks at inference time include membership inference (probing whether a specific record was in the training set) and model inversion (using repeated queries to reconstruct features of training data). Model extraction attacks query the endpoint systematically to clone the model's behavior, producing a functionally equivalent replica the attacker controls.

For privacy risks in deployed models — particularly membership inference against models trained on sensitive data — see [aiprivacy.report](https://aiprivacy.report) for current research and case studies. For teams deploying guardrails and filters to address inference-time threats, [guardml.io](https://guardml.io) tracks the tooling landscape.

## Supply chain: the entry point most teams miss

Pulling a pretrained checkpoint from a public model hub is functionally equivalent to adding an unverified external library to a production codebase. The model's weights may have been trained with poisoned data, modified after publication, or include serialization-format exploits (pickle-based checkpoints are the most common vector). For a deeper treatment of adversarial techniques targeting the supply chain, [adversarialml.dev](https://adversarialml.dev) covers attack classes and their mitigations in detail.

The practical controls are the same ones that application security teams apply to open-source dependencies: hash pinning on every external model pull, provenance verification against the original publisher, and preferring formats with safer deserialization (SafeTensors over pickle where available).

## Fitting ML security into a risk framework

The [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework), released January 2023 with a Generative AI profile added in July 2024, provides the governance layer that makes ML security operationally tractable. Its four core functions — GOVERN, MAP, MEASURE, MANAGE — translate into concrete program requirements: inventory your AI systems, map the threat surface at each pipeline stage, measure exposure with adversarial testing, and manage residual risk with documented controls and incident response plans. The framework is voluntary but has become the de facto reference for organizations that need to demonstrate AI risk governance to customers, auditors, or regulators.

At the practice level, adversarial testing is the highest-leverage investment for teams that have done nothing yet. Running an attack simulation against your highest-value model — generating evasion examples, probing for membership inference, attempting query-based extraction — reveals the actual residual exposure after whatever controls are already in place. It is the ML equivalent of a penetration test, and like a pen test, it is useful precisely because it operates under real attacker constraints.

## Sources

- [NCSC: Understanding Adversarial Attacks Against Machine Learning and AI](https://www.ncsc.gov.uk/paper/understanding-adversarial-attacks-against-machine-learning-and-ai) — UK National Cyber Security Centre taxonomy of seven ML attack classes, including model artefact manipulation and hardware attacks; maps attacker goals to attack classes across the ML lifecycle.
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) — NIST's voluntary governance framework (January 2023, with Generative AI Profile added July 2024) covering GOVERN, MAP, MEASURE, and MANAGE functions for AI risk.
- [ISACA: Combating the Threat of Adversarial Machine Learning to AI-Driven Cybersecurity](https://www.isaca.org/resources/news-and-trends/industry-news/2025/combating-the-threat-of-adversarial-machine-learning-to-ai-driven-cybersecurity) — 2025 analysis of evasion, poisoning, prompt injection, and extraction attacks against AI-driven security tools; defense recommendations including adversarial testing and continuous validation.
- [Cloud Security Alliance: Hidden Security Threats in Your ML Pipeline](https://cloudsecurityalliance.org/blog/2025/09/11/the-hidden-security-threats-lurking-in-your-machine-learning-pipeline) — CSA analysis of pipeline-specific threats including supply chain compromise, cross-tool access exploitation, and the MLSecOps framework for extending DevSecOps to ML systems.

## See also

- [AI incident tracker](https://aiincidents.org/)
- [AI security digest](https://aisecdigest.com/)
