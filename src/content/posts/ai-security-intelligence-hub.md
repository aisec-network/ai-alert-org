---
title: "AI Security Intelligence Hub: The Complete Resource Index on ai-alert.org"
description: "The central resource index for AI security on ai-alert.org — incidents, CVEs, jailbreak disclosures, red team methodology, threat intelligence, and compliance guidance, organized by topic."
pubDate: 2026-05-11
author: "Theo Voss"
tags: ["hub", "ai-security", "incidents", "cve", "threat-intelligence", "red-team", "compliance", "jailbreaking"]
category: "hub"
draft: true
schema:
  type: "Article"
---

AI security in 2026 is no longer a niche concern for ML researchers. Enterprise deployments are being red-teamed at scale for the first time. CISA is publishing binding guidance on AI system development. CVEs in model-serving infrastructure are landing in the Known Exploited Vulnerabilities catalog with federal patch deadlines. The attack surface is real, the attacker interest is real, and the gap between what most organizations have deployed and what they've secured is substantial.

AI Alert covers this landscape from a security journalism perspective: primary sources over speculation, attribution over vendor PR, and practical guidance over framework recitations. We track vulnerability disclosures in AI/ML infrastructure, document security incidents involving deployed AI systems, cover jailbreak and attack technique disclosures, and translate the regulatory and compliance environment into actionable guidance for security and product teams.

This hub page organizes the most useful content on this site into a single indexed resource. The categories below reflect the major threat and policy clusters that matter for practitioners in 2026. Use it to find depth on a specific topic or to get oriented on an area you're approaching for the first time.

---

## Start Here: Foundational Reading

**[AI Security: Attack Categories, Defense Gaps, and How to Respond](/posts/ai-security)**
A practitioner's map of the AI attack surface — adversarial inputs, training data poisoning, model extraction, and supply chain attacks — with mitigation priorities and NIST/OWASP framework references. The best single overview of the threat landscape if you're starting from scratch.

**[Jailbreaking vs Prompt Injection: Not the Same Attack](/posts/jailbreaking-vs-prompt-injection)**
These two attack classes are conflated constantly. They target different parts of the stack, require different threat actor capabilities, and have different mitigations. This post is the prerequisite for understanding anything else on this site.

**[A Practical Guide to AI Red-Teaming for Security Teams](/posts/ai-red-teaming-guide)**
End-to-end red team methodology for LLM deployments: how to scope an engagement, the technique categories to test, what to document, and how to communicate findings to a model team that doesn't speak security.

**[AI System Security Audit Checklist for 2026](/posts/ai-security-audit-checklist)**
A structured audit checklist covering model inputs, training pipeline, outputs, access control, logging, and red team requirements. Each item includes the risk it addresses.

---

## Incident Analysis

**[AI Agent Security Incidents: What Happened When Autonomous AI Went Wrong](/posts/ai-agent-security-incidents-2025)**
A documented review of security incidents involving autonomous AI agents in 2024–2025: tool misuse, privilege escalation via prompt injection, and the architectural patterns that created the exposure.

**[The Samsung ChatGPT Data Leak: What Happened and What It Means for Enterprise AI Policy](/posts/ai-incident-samsung-data-leak)**
The incident that defined the enterprise AI data governance risk category. Three Samsung employees leaked proprietary source code and meeting notes through ChatGPT. This post covers what happened, the organizational response, and what policy controls would have prevented it.

**[How System Prompt Leaks Happen: Techniques, Incidents, and Defenses](/posts/gpt4-system-prompt-leak-incident)**
Prompt injection attacks that expose system prompts are among the most common real-world LLM exploits. This post covers the mechanics of system prompt extraction, documented incidents, and the defensive controls that actually work.

**[Model Theft via API: How Extraction Attacks Against Closed LLMs Work in Practice](/posts/gpt4-model-theft-incident-analysis)**
The cost of querying a proprietary LLM at scale has collapsed. Model extraction attacks can reconstruct meaningful approximations of closed models at surprisingly low cost. Covers the economics, rate-limit bypass strategies, and what API providers can and can't protect against.

**[Compromised Models on Hugging Face: Pickle Exploits in the Model Hub](/posts/compromised-huggingface-models-pickle-exploits)**
Malicious model files containing pickle payloads that execute code on download. Covers the 2024 incident, how pickle exploitation works in model files, and what Hugging Face's SafeTensors migration means for practitioners.

**[Hugging Face Security Incidents: Malicious Models, Stolen Tokens, and Hub Exposure](/posts/hugging-face-security-incidents)**
A broader review of Hugging Face platform security incidents, including the 2024 Spaces infrastructure breach and the systemic risks of community-shared model weights.

---

## CVE and Vulnerability Tracking

**[CVE Roundup: AI/ML Infrastructure Vulnerabilities — Q1 2026](/posts/cve-roundup-ai-ml-infrastructure-q1-2026)**
A quarterly review of critical CVEs in model serving infrastructure: Ollama, vLLM, NVIDIA Triton Inference Server, LangChain, and related tooling. Patch status and exploitation notes included.

**[AI/ML CVE Roundup: May 2026 — What Got Patched](/posts/cve-roundup-ai-ml-may-2026)**
A monthly summary of AI and ML-adjacent CVEs across model serving frameworks, vector databases, and LLM API libraries.

**[CISA Adds Actively Exploited Linux Kernel LPE CVE-2026-31431 to KEV](/posts/cisa-adds-actively-exploited-linux-root-access-bug-cve-2026)**
A local privilege escalation flaw in the Linux kernel's AEAD crypto interface under active exploitation, with a federal patch deadline. Coverage of the vulnerability, affected kernels, and available patches.

**[CVE-2026-7669: Deserialization flaw in SGLang's HuggingFace tokenizer loader](/posts/cve-2026-7669-a-vulnerability-was-detected-in-sgl-project-sg)**
A medium-severity deserialization bug in SGLang's tokenizer loading code. All releases up to 0.5.9 are affected; no vendor patch has shipped.

**[CVE-2026-7845: Hash collision in Langchain-Chatchat lets attackers swap pasted images](/posts/cve-2026-7845-a-flaw-has-been-found-in-chatchat-space-langch)**
A weak-hash flaw in the vision chat paste-image handler that lets adjacent attackers overwrite uploaded images with attacker-controlled content for vision LLM analysis.

**[CISA's Known Exploited Vulnerabilities Catalog: What It Tells Us About AI/ML Security](/posts/cisa-kev-ai-ml-vulnerabilities-analysis)**
Analyzing KEV entries for AI/ML-adjacent components to understand which parts of the AI stack are attracting real-world attacker attention.

---

## Attack Technique Disclosures

**[Major Jailbreak Techniques of 2025: Disclosures, Patches, and What Persists](/posts/jailbreak-techniques-2025-roundup)**
A roundup of significant jailbreak techniques documented in 2025 — many-shot jailbreaking, Crescendo, cipher-based bypasses — with patch status across major models and what remains exploitable.

**[LLM Supply Chain Poisoning: Training Data Attacks and Model Backdoors](/posts/llm-supply-chain-poisoning)**
Training data poisoning and model supply chain attacks. Covers how backdoors are inserted during instruction tuning, how they persist through safety training, and what controls exist.

**[Model Extraction Attacks: How Adversaries Steal AI Models Through the API](/posts/model-extraction-attacks-explained)**
How model extraction reconstructs proprietary models through API queries. Covers the cost-of-extraction economics, documented attacks against real systems, and practical defenses.

**[AI-Generated Phishing and the Collapse of Spearphishing Cost](/posts/ai-generated-phishing-spearphishing-cost-collapse)**
Personalized phishing emails that once required hours of research now take seconds. Covers the economics of AI-assisted phishing, 2024–2025 incident data, and what defenders can measure.

---

## Red Team Methodology

**[What Red Teamers Are Finding in 2026: LLM Defense Gaps and Recurring Failure Modes](/posts/ai-red-teaming-llm-jailbreak-defenses-2026)**
Enterprise LLM deployments are being red-teamed at scale for the first time. The consistent failure patterns: misconfigured system prompts, inadequate output filtering, and agentic privilege escalation paths operators didn't anticipate.

**[How to Benchmark AI Security Tools: Evaluation Methodology for 2026](/posts/aisecbench-2026-evaluation-methodology)**
A structured evaluation framework for AI security tooling: the metrics that matter, the pitfalls of vendor-provided benchmarks, and how to run reproducible evaluations.

---

## Monitoring and Response

**[LLM Security Alerts: Monitoring, Detection, and Response for AI Systems](/posts/llm-security-alerts-monitoring-response)**
A practical guide to LLM security alerting: what to monitor, what alert patterns indicate compromise or attack, how to triage incidents, and what a response playbook looks like.

**[How to Track AI Security Alerts: CISA, NIST, Vendor Advisories, and Research Feeds](/posts/how-to-track-ai-security-alerts)**
The official and community sources for AI security alerts — what each publishes, how frequently, and how to integrate them into a monitoring workflow without alert fatigue.

**[Tool Review: LLM Guard for Input/Output Filtering](/posts/ai-tool-security-review-llm-guard)**
An honest review of LLM Guard (Protect AI): what it detects, deployment architecture, latency profile, real limitations, and when it belongs in a defense-in-depth stack.

---

## Regulatory and Compliance Guidance

**[CISA AI Security Guidance: What Organizations Need to Know in 2026](/posts/cisa-ai-security-guidance-2026)**
CISA's published AI security guidance — secure-by-design AI principles, the AI SBOM framework, and joint international advisories — translated into organizational action items.

---

## Cross-Site Reading

AI Alert covers threat intelligence and incident reporting. For offensive technique deep dives, see [aisec.blog](https://aisec.blog). For defensive engineering and guardrails, see [GuardML](https://guardml.io). For AI policy and regulatory coverage, see [NeuralWatch](https://neuralwatch.org).
