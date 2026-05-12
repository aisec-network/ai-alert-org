---
title: "ChatGPT Security: Risks, Controls, and How to Use It Safely"
description: "A practitioner's guide to ChatGPT security in 2026: how OpenAI protects enterprise data, where prompt injection and account-takeover risks live, and the controls that actually move the needle."
pubDate: 2026-05-11
author: "AI Alert Desk"
tags: ["chatgpt", "llm-security", "openai", "prompt-injection", "enterprise-ai", "data-privacy"]
category: "guide"
sources:
  - title: "Enterprise privacy at OpenAI"
    url: "https://openai.com/enterprise-privacy/"
  - title: "Security and privacy at OpenAI"
    url: "https://openai.com/security-and-privacy/"
  - title: "OWASP GenAI Top 10 — LLM01:2025 Prompt Injection"
    url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
  - title: "OpenAI Business data, privacy, and security"
    url: "https://openai.com/business-data/"
  - title: "OWASP LLM Prompt Injection Prevention Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html"
schema:
  type: "TechArticle"
---

ChatGPT security depends less on the model itself and more on the surrounding context: which tier you use, what data your employees paste into prompts, which connectors and custom GPTs you allow, and how you handle account credentials. The platform has serious controls in place — SOC 2 Type 2, ISO/IEC 27001:2022, AES-256 encryption at rest, TLS 1.2+ in transit — but the failure modes that send organizations to incident review almost never involve OpenAI's infrastructure. They involve a user, a connector, or a prompt.

This guide breaks down what the actual risk surface looks like in 2026, how to evaluate the consumer, Team, and Enterprise tiers against your threat model, and which controls do real work versus which are theater.

## What OpenAI does and does not do with your data

OpenAI publishes two distinct data-handling regimes. For the free and Plus consumer tiers, conversation content can be used to train future models unless the user opts out in the data controls panel. For [ChatGPT Enterprise, Team, Edu, and the API platform](https://openai.com/business-data/), inputs and outputs are excluded from training by default, and the business or admin owns the data. OpenAI does not sell or share customer business data with third parties for marketing.

Encryption is standard: AES-256 at rest, TLS 1.2+ in transit. ChatGPT Enterprise supports Enterprise Key Management (EKM) via AWS KMS so customers hold their own keys. Enterprise customers can configure data residency in the US, UK, EU, Japan, Canada, South Korea, Singapore, Australia, India, or the UAE, which matters for GDPR, UK Data Protection Act, and various sectoral regimes. [OpenAI's enterprise privacy page](https://openai.com/enterprise-privacy/) lists the current certifications: SOC 2 Type 2, ISO/IEC 27001:2022, ISO/IEC 27017, ISO/IEC 27018, ISO/IEC 27701, and CSA STAR Level 1.

The practical implication: the legal and technical posture of ChatGPT Enterprise is comparable to other SaaS productivity tools your security team already trusts. The consumer tier is not. If employees use personal accounts on company devices to process company data, you have an unmanaged shadow-AI problem, not an OpenAI problem.

## The real risks: prompt injection, data exfiltration, and account takeover

Three categories of incident drive most of the ChatGPT-related ticket volume security teams are actually seeing.

**Prompt injection.** [OWASP ranks prompt injection as LLM01](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) — the top risk for LLM applications in 2025. Direct injection happens when an attacker writes instructions into a chat that override system behavior. Indirect injection is more dangerous in production: an attacker plants malicious instructions inside content the model will later read — a PDF, a web page browsed by the agent, an email summarized by a connector, the README of a repo a custom GPT crawls. When the model reads it, those instructions execute. With ChatGPT's web browsing, file uploads, and third-party connectors, indirect injection is a realistic exfiltration vector. The [OWASP LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) documents mitigations including privilege constraints, output filtering, and human-in-the-loop for sensitive actions. For deeper coverage of attack patterns and defenses, see [promptinjection.report](https://promptinjection.report).

**Data leakage through prompts.** The most common incident is unglamorous: a developer pastes proprietary source code, a recruiter pastes a candidate's resume, a finance analyst pastes a draft 10-Q. On consumer tiers, that content may be used for model improvement unless training is disabled. Even on Enterprise, those prompts are now stored in conversation history, indexed for search, and accessible to anyone who later compromises the user's account. This is the dominant ChatGPT security risk for most organizations, and it is a governance problem, not a vendor problem.

**Account takeover.** OpenAI accounts are high-value targets. A compromised account exposes months of conversation history that may include credentials, internal architecture, customer names, code, and pasted secrets. SSO with SAML, mandatory MFA, IP allowlisting, and SCIM-based deprovisioning are available on Enterprise and Edu. Anything less than SSO + MFA for an account that has touched sensitive data is negligent at this point.

A fourth category worth flagging is **custom GPTs and the GPT Store**: third-party GPTs can include actions that send your prompt content to external endpoints. Treat them as untrusted code. Enterprise admins can restrict which GPTs are usable.

## Controls that actually move the needle

The list below is ordered roughly by leverage per hour of work, based on what shows up in post-incident reviews.

1. **Move sensitive use cases to ChatGPT Enterprise, Team, or the API.** The training-data exclusion, SSO, retention controls, EKM, and audit logging are not available on free or Plus. Without these, you are using a consumer product to handle business data.
2. **Enforce SSO + MFA, and disable personal account usage on managed devices.** Block `chat.openai.com` and `chatgpt.com` logins outside your IdP, or use a CASB to enforce it. This single control eliminates the shadow-AI problem.
3. **Configure retention.** Enterprise lets admins set conversation retention windows; align them with your existing records policy. Default-forever is rarely the right answer.
4. **Govern connectors and custom GPTs.** Restrict third-party GPTs by default. For the Connectors that link ChatGPT to Google Drive, SharePoint, GitHub, etc., apply least-privilege scopes and log access. A connector with broad read access is a prompt-injection blast radius.
5. **Treat outputs as untrusted input to downstream systems.** If you pipe ChatGPT output into a build script, a database query, or an email — assume it can contain attacker-controlled content from an indirect injection chain. Apply the same output sanitization you would to any user-supplied data. [Guardrails and runtime defenses](https://guardml.io) sit at this layer.
6. **Train users on what not to paste.** PII, source code containing secrets, customer records, M&A material, [security incident](https://aiincidents.org/) details, and credentials should not enter any LLM that you do not control. The simplest policy is the one that gets followed.
7. **Audit.** ChatGPT Enterprise exposes audit logs via the Compliance API. Pipe them to your SIEM and alert on bulk exports, role changes, and connector additions.

## What's coming

Two trajectories matter for 2026. First, agentic features — ChatGPT operating browsers, executing code, calling tools autonomously — keep raising the consequences of a successful prompt injection. A bad instruction is no longer just a bad answer; it can be a posted comment, a sent email, or a moved file. Second, regulators are catching up. The EU AI Act's obligations for general-purpose AI systems are in force, and US sectoral regulators (HHS, SEC, FTC) are scrutinizing how regulated firms handle LLM-processed data. Document your controls now; you will be asked about them.

ChatGPT is not insecure. The way most organizations deploy it is.

## Sources

- [Enterprise privacy at OpenAI](https://openai.com/enterprise-privacy/) — official documentation of certifications, encryption, EKM, residency regions, and the no-training-by-default policy for business products.
- [Security and privacy at OpenAI](https://openai.com/security-and-privacy/) — overview of OpenAI's security program covering infrastructure, vulnerability disclosure, and bug bounty.
- [OWASP GenAI Top 10 — LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) — authoritative classification of prompt injection as the leading LLM application risk, with attack types and example scenarios.
- [OpenAI Business data, privacy, and security](https://openai.com/business-data/) — specifics on data ownership, training exclusions, and admin controls across ChatGPT Enterprise, Team, Edu, and the API.
- [OWASP LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) — practical mitigation patterns including privilege constraints, segregation of external content, and human approval for high-impact actions.

For more context, [AI security digest](https://aisecdigest.com/) covers related topics in depth.
