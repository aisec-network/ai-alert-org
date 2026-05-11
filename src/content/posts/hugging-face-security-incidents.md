---
title: "Hugging Face Security Incidents: Malicious Models, Stolen Tokens, and Hub Exposure"
description: "A review of documented security incidents on the Hugging Face platform, including malicious model uploads, the 2024 Spaces infrastructure breach, and the risks of community-shared model weights."
pubDate: 2026-05-10
author: "Theo Voss"
tags: ["hugging-face", "supply-chain", "model-hub", "pickle", "safetensors", "infrastructure-security", "mlops"]
category: "incident-review"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/hugging-face-security-incidents.png
heroAlt: "Hugging Face Security Incidents Review"
sources:
  - title: "Hugging Face Security Advisory: Spaces Unauthorized Access (June 2024)"
    url: "https://huggingface.co/blog/space-secrets-disclosure"
  - title: "Hugging Face: Pickle Security and Malicious Model Files"
    url: "https://huggingface.co/blog/pickle-security"
  - title: "JFrog: Malicious Models Discovered on Hugging Face Hub (2024)"
    url: "https://jfrog.com/blog/data-scientists-targeted-malicious-hugging-face-ml-models-with-silent-backdoor/"
  - title: "Safetensors: A Simple Format for Storing Tensors Safely"
    url: "https://huggingface.co/docs/safetensors/index"
draft: false
schema:
  type: "TechArticle"
---

The Hugging Face Hub hosts over half a million model repositories as of 2025, making it the largest public repository of machine learning model weights in the world. That scale creates a supply chain attack surface that the security community has been working to characterize and address since the platform became critical AI infrastructure. This post reviews the documented incidents, their mechanisms, and the controls that have been deployed.

## The Pickle Deserialization Vector — Established and Ongoing

The most structurally significant security issue in the Hugging Face ecosystem is not a specific incident but a fundamental property of the default model file format. Python's pickle format, which PyTorch uses for model serialization, executes arbitrary Python code on deserialization. This is a known property of the format — it is not a bug but a design feature of pickle's extensibility mechanism.

When applied to ML models distributed via public repositories, this means that any model file in `.pkl`, `.pt`, or `.bin` format could contain an arbitrary code execution payload that runs the moment a researcher or practitioner calls `torch.load()`.

**What was documented:** JFrog's security research team published findings in 2024 documenting malicious models uploaded to the Hugging Face Hub. The payloads in documented cases included:

- **Reverse shell payloads:** Upon model loading, the payload opened a connection to an attacker-controlled server, providing remote access to the researcher's machine.
- **Credential harvesting:** Payloads that targeted environment variables commonly used to store API keys and cloud credentials — `OPENAI_API_KEY`, `AWS_ACCESS_KEY_ID`, `HF_TOKEN`, and similar.
- **Persistent access mechanisms:** Payloads that attempted to establish persistence by modifying shell configuration files (`.bashrc`, `.zshrc`) to execute code on future shell sessions.

The models were not easily distinguishable from legitimate ones by casual inspection — they appeared as normal model files with plausible names and model cards.

**Hugging Face's response:** The platform implemented automated scanning for known malicious pickle payloads using a combination of static analysis and behavioral scanning. The `safetensors` format was actively promoted as a pickle-free alternative. As of 2025, the Hub displays a warning badge on models that have not been converted to `safetensors` format. The platform also added repository-level security scanning that flags unusual patterns.

**What persists:** Pickle scanning is signature-based. Adversaries who want to place a payload in a model can construct novel payloads that are not detected by current signatures. The structural vulnerability — arbitrary code execution on model load — is not fixable without changing the serialization format. For any practitioner loading models from the Hub, the only reliable mitigation is using `safetensors` format with a library that does not execute code on deserialization.

## The June 2024 Spaces Infrastructure Breach

In June 2024, Hugging Face disclosed that it had discovered unauthorized access to its Spaces infrastructure — the platform component that hosts interactive ML demos and applications. The disclosure was made via the Hugging Face blog.

**What happened:** Hugging Face's internal investigation found that an unauthorized party had obtained access to Spaces secrets — specifically, the HuggingFace Tokens (HF tokens) that are stored as environment variables in Spaces applications to give those applications authenticated access to model repositories and other Hugging Face resources.

The company stated that it believed some Spaces secrets may have been accessed by the unauthorized party, though it did not confirm the full scope of the breach or how the initial unauthorized access was obtained.

**Impact:** HF tokens with write access to model repositories could enable an attacker to modify or replace model weights in repositories, insert backdoors into models that would then be distributed to downstream users, or access private repositories associated with compromised tokens. The impact radius of a compromised HF token depends on its associated permissions — tokens with write access to popular repositories could affect thousands of downstream users who pull those models.

**Hugging Face's response:** The company notified affected users, revoked tokens it believed were compromised, and recommended that all users regenerate HF tokens. It also published guidance on using fine-grained access tokens (tokens with limited scope, analogous to AWS IAM least-privilege tokens) rather than full-access tokens in Spaces applications.

**Significance for practitioners:** Organizations that host Spaces or that use HF tokens in CI/CD pipelines for automated model management should treat those tokens as high-value credentials requiring rotation policies, scope minimization, and access logging.

## Malicious Model Repositories Using Trust-Remote-Code

A distinct attack vector — related to but separate from pickle payloads — exploits the `trust_remote_code=True` parameter in Hugging Face `transformers`.

When a model repository contains custom Python files (for example, `modeling_custom.py`), loading the model with `trust_remote_code=True` executes those files on the loading host. This mechanism exists to support models with architectures that the `transformers` library does not natively implement.

**The attack:** An adversary creates a model repository that appears to host a legitimate model variant, includes a malicious `modeling_*.py` file containing an arbitrary Python payload, and names the repository to appear as a fine-tune or variant of a popular model. Users who download and load the model with `trust_remote_code=True` — which is common in example code and documentation — execute the payload.

**Documentation:** The NVD entry for this vulnerability (recorded against specific versions of `transformers`) was updated in 2025 to reflect confirmed exploitation in the wild after multiple malicious repositories were found on the Hub containing credential-harvesting payloads in their custom modeling files.

**Controls:** Do not use `trust_remote_code=True` with unverified repositories. Before loading any model with remote code, review the repository's Python files manually. Prefer models published by verified organizations (indicated by the verification badge on the Hub). Pin model versions by commit hash rather than using `latest`, which can be updated by the repository owner after you've reviewed it.

## Prompt Injection via Model Cards

A lower-severity but documented issue: Hugging Face model cards are rendered as Markdown, and model card content can include links, embedded images, and in some cases JavaScript. Researchers documented that model cards could be crafted to execute client-side code when viewed in certain browser configurations, or to mislead users about model provenance and safety properties through deceptive formatting.

This is less impactful than code execution on model load, but it matters in the context of automated pipelines that parse model cards to extract metadata. A model card that contains injection-style content targeting automated parsers is a social engineering amplifier — it can cause automated tooling to make incorrect decisions about model selection or trust levels.

## The Safetensors Migration and What It Solves

Hugging Face's `safetensors` format was developed specifically to address the pickle deserialization risk. The format:

- Stores tensor data in a structure that can be read without executing code
- Validates tensor shapes and data types before loading
- Does not support arbitrary Python object serialization

For organizations that maintain an ML software bill of materials, the transition to `safetensors` as the required format for model weights eliminates the arbitrary code execution vector entirely. It does not address `trust_remote_code` issues (which are about custom Python files, not weight serialization) or compromised credentials.

As of 2025, the majority of popular models on the Hub have `safetensors` versions available. For new model additions to internal registries, requiring `safetensors` format as a policy is achievable without significant capability loss.

## Supply Chain Position of the Hugging Face Hub

The incidents documented here matter beyond their individual impact because of the Hub's position in the ML supply chain. Thousands of enterprise ML deployments use Hub-hosted models as foundation weights, either directly or via fine-tuning. A successfully backdoored popular model — injected at the Hub and pulled by downstream users before detection — would represent a supply chain compromise comparable to the software package repository compromises that have affected npm, PyPI, and other ecosystems.

The Hub's security posture has improved substantially between 2023 and 2025: malware scanning, safetensors migration, fine-grained tokens, and repository verification badges all represent real mitigations. The residual risks — novel pickle payloads, trust_remote_code exploitation, credential theft — require practitioner-level controls in addition to platform-level controls.

For ongoing tracking of ML supply chain threats, [adversarialml.dev](https://adversarialml.dev) maintains a research index covering model hub security and supply chain attack research.

## Sources

- [Hugging Face: Spaces Unauthorized Access Disclosure (June 2024)](https://huggingface.co/blog/space-secrets-disclosure) — official breach disclosure.
- [Hugging Face: Pickle Security](https://huggingface.co/blog/pickle-security) — explanation of the pickle deserialization risk and safetensors migration.
- [JFrog: Malicious Models on the Hugging Face Hub (2024)](https://jfrog.com/blog/data-scientists-targeted-malicious-hugging-face-ml-models-with-silent-backdoor/) — technical analysis of discovered malicious model payloads.
- [Safetensors documentation](https://huggingface.co/docs/safetensors/index) — format specification and migration guidance.


---

*→ This post is part of the [AI Security Intelligence Hub](/posts/ai-security-intelligence-hub) — the complete resource index for AI security on ai-alert.org.*