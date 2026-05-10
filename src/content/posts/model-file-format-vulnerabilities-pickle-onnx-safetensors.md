---
title: "Model File Format Vulnerabilities: Pickle, ONNX, and the SafeTensors Migration"
description: "Unsafe deserialization in PyTorch's pickle-based format has enabled malicious model distribution for years. This post explains how pickle exploitation works, the ONNX supply chain risk, and why the migration to SafeTensors matters for model security."
pubDate: 2026-05-10
author: "Theo Voss"
tags: ["pickle", "onnx", "safetensors", "model-format", "deserialization", "supply-chain", "huggingface", "pytorch"]
category: "advisory"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/model-file-format-vulnerabilities-pickle-onnx-safetensors.png
heroAlt: "Model File Format Vulnerabilities: Pickle, ONNX, SafeTensors"
sources:
  - title: "Hugging Face: Pickle Security Advisory"
    url: "https://huggingface.co/blog/pickle-security"
  - title: "SafeTensors: A Simple Format for Storing Tensors Safely"
    url: "https://huggingface.co/docs/safetensors/index"
  - title: "JFrog: Malicious ML Models on Hugging Face"
    url: "https://jfrog.com/blog/data-scientists-targeted-malicious-hugging-face-ml-models-with-silent-backdoor/"
  - title: "ONNX Security Model"
    url: "https://onnx.ai/onnx/intro/converters.html"
schema:
  type: "TechArticle"
---

The security posture of AI models is not just about the model's behavior. It's also about the file format used to distribute and load model weights. For most of PyTorch's history, model files were serialized using Python's `pickle` module — a format that was never designed for security and that provides a reliable path to arbitrary code execution. This post explains how model format attacks work, maps the risk across popular formats, and explains why the industry's migration to SafeTensors is a meaningful security improvement.

## The Pickle Problem

Python's `pickle` module serializes arbitrary Python objects, including callables. When you unpickle a file, Python executes the deserialization instructions in the file — which can include calls to arbitrary Python functions. This is a well-known security property of pickle: **unpickling untrusted data is equivalent to running untrusted code**.

PyTorch's `.pt` and `.bin` file formats use pickle. This means: loading a model file from an untrusted source is equivalent to running arbitrary code on the loading machine. No vulnerability is required. It is the designed behavior of the file format.

The attack pattern is simple:
1. Create a PyTorch model file with embedded malicious pickle payload.
2. Upload it to a model hub with a legitimate-sounding name and description.
3. Users who download and load the model execute the malicious payload.

The malicious payload executes with the full permissions of the process loading the model — typically the data scientist's workstation, a training environment with access to credentials, or a model serving instance.

## Documented Exploitation

This is not theoretical. JFrog's security team documented multiple confirmed malicious model files on the Hugging Face Hub in 2024. Their analysis found models containing pickle payloads that established reverse shell connections to attacker infrastructure. The models appeared to be legitimate community contributions; their malicious behavior was invisible without inspecting the serialized payload.

Hugging Face has acknowledged this as an ongoing challenge with community-contributed models and has implemented scanning infrastructure. However, signature-based scanning for malicious pickle payloads is an adversarial game — new payload variants can evade scanners, and the fundamental issue (pickle is not a safe format) is not fixed by scanning.

## ONNX: A Different Risk Profile

The Open Neural Network Exchange (ONNX) format is an open standard for representing neural networks. Unlike pickle, ONNX is designed as a structured data format, not a Python serialization mechanism. An ONNX file should not execute arbitrary code during loading under normal use.

However, ONNX introduces different risks:

**External data references.** ONNX models can reference external data files for tensor weights. A maliciously crafted ONNX file could reference paths outside the intended data directory (path traversal) or reference URIs for remote data fetch — creating SSRF conditions when loaded in environments with external network access.

**ONNX runtime custom operators.** ONNX supports custom operators implemented as native code (`.so` / `.dll` files). An ONNX model that specifies a custom operator library effectively loads arbitrary native code. Any workflow that loads ONNX models from untrusted sources without restricting custom operator loading is exposed.

**Conversion pipeline attacks.** Many organizations convert models between formats (PyTorch → ONNX, TensorFlow → ONNX). If the conversion pipeline loads an untrusted source model, the malicious pickle in the source model executes before the conversion produces a clean ONNX output. The ONNX output may be clean while the damage occurred during conversion.

## SafeTensors: What It Fixes

SafeTensors was developed by Hugging Face specifically to address the pickle security problem. Key properties:

**No code execution.** SafeTensors files contain only tensor data and metadata in a flat binary format. Parsing a SafeTensors file cannot execute arbitrary code — there is no code path that leads from file parsing to Python function invocation.

**Bounded parsing.** The format specifies explicit header size limits and tensor size validation. A malformed SafeTensors file causes a parsing error, not memory corruption.

**Zero-copy design.** SafeTensors uses memory-mapped file access, enabling fast loading without copying large tensor buffers. This design also eliminates the need for streaming deserialization, which is where pickle's attack surface lives.

**Adoption.** As of early 2026, the majority of actively maintained models on the Hugging Face Hub are available in SafeTensors format. The `transformers` library and most major inference frameworks support it. The migration is not complete — many legacy models exist only in `.bin` (pickle) format — but for new model downloads, SafeTensors should be the default.

## Practical Guidance

For teams loading models from community sources:

**Prefer SafeTensors.** If a model is available in both `.safetensors` and `.bin` format, use SafeTensors. This is a concrete security improvement with no functional tradeoff.

**Do not use `torch.load()` on untrusted files.** The `weights_only=True` parameter added in PyTorch 1.13 restricts what can be deserialized (prohibiting arbitrary callable execution) but does not make pickle safe for untrusted files — it reduces the attack surface without eliminating it.

**Pin model versions by commit hash.** When loading from the Hugging Face Hub, specify the commit hash of the revision you've reviewed. This prevents an attacker who later compromises a model repository from swapping in a malicious payload under the same name.

**Scan before loading in pipelines.** For automated model ingestion pipelines, use `picklescan` or Hugging Face's model security scanner to detect known malicious pickle patterns before loading.

**Restrict ONNX custom operator loading** in serving infrastructure. Most production inference does not require custom operators; disabling this loading path reduces the ONNX attack surface meaningfully.

The [Hugging Face security incident review](/posts/hugging-face-security-incidents/) covers the platform-level incidents in more detail. For current CVE tracking across model-loading components, [mlcves.com](https://mlcves.com) maintains a searchable database with component filters.

## Sources

- [Hugging Face: Pickle Security](https://huggingface.co/blog/pickle-security) — official advisory and migration guidance.
- [SafeTensors documentation](https://huggingface.co/docs/safetensors/index) — format specification and security properties.
- [JFrog: Malicious Models on Hugging Face Hub](https://jfrog.com/blog/data-scientists-targeted-malicious-hugging-face-ml-models-with-silent-backdoor/) — documented malicious model analysis.
