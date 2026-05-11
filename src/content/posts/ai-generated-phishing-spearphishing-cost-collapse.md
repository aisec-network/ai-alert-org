---
title: "AI-Generated Phishing and the Collapse of Spearphishing Cost"
description: "Crafting a convincing, personalized phishing email once required hours of research per target. Large language models have reduced that cost to seconds. This post examines the economics of AI-assisted phishing, 2024-2025 incident data, and what defenders can measure."
pubDate: 2026-05-10
author: "Theo Voss"
tags: ["phishing", "spearphishing", "social-engineering", "llm-abuse", "threat-intelligence", "bec", "enterprise-security"]
category: "threat-brief"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/ai-generated-phishing-spearphishing-cost-collapse.png
heroAlt: "AI-Generated Phishing: The Cost Collapse of Spearphishing"
sources:
  - title: "NCSC: The Near-Term Impact of AI on the Cyber Threat (2024)"
    url: "https://www.ncsc.gov.uk/report/impact-of-ai-on-cyber-threat"
  - title: "IBM X-Force Threat Intelligence Index 2025"
    url: "https://www.ibm.com/reports/threat-intelligence"
  - title: "Abnormal Security: AI-Generated BEC Attack Report 2024"
    url: "https://abnormalsecurity.com"
schema:
  type: "TechArticle"
---

Spearphishing — personalized, targeted phishing — has always had a cost asymmetry in the defender's favor. Crafting a convincing email that references the target's recent activities, uses their colleagues' names correctly, matches their organization's communication style, and arrives at the right moment required hours of open-source intelligence (OSINT) research per target. Threat actors running spearphishing campaigns at scale faced a real bottleneck in the human labor required to personalize attacks.

Large language models have effectively eliminated that bottleneck. The economics of spearphishing have changed fundamentally, and the 2024-2025 incident data is beginning to reflect this change.

## The Old Economics vs. The New

**Before LLMs:** A financially motivated threat actor building a business email compromise (BEC) campaign would spend hours per high-value target — researching the target's role, their manager's name, recent company events, typical email formatting, active vendor relationships. The per-target cost of a high-quality spearphish might be $50-200 in labor equivalent. This constrained campaigns to the highest-value targets.

**With LLMs:** The same research can be automated: scrape LinkedIn, public company filings, press releases, and social media. Feed the results to an LLM with a prompt like "Write a convincing email from [CEO name] to [CFO name] requesting an urgent wire transfer for [recent acquisition that appeared in news], using a style that matches these example emails from the company's public communications." The LLM produces a grammatically polished, contextually accurate email in seconds. The per-target cost has dropped to under $1 in API costs.

This is not hypothetical. The UK's National Cyber Security Centre documented this threat vector explicitly in their January 2024 AI threat report, noting that AI is "enabling relatively unskilled threat actors to carry out more effective access and information gathering operations, and will enhance the impact of social engineering attacks."

## 2024-2025 Incident Data

Security vendors have begun reporting measurable changes in phishing campaign characteristics that align with LLM-assisted generation:

**Grammar and spelling quality.** Traditionally, non-native English speakers conducting phishing campaigns produced emails with characteristic grammatical errors — a useful (if imperfect) detection signal. Abnormal Security and Proofpoint both reported in 2024 that the proportion of phishing emails containing grammatical or spelling errors dropped significantly. Campaigns originating from threat actors previously identifiable by poor English quality began producing fluent, idiomatic text.

**Personalization at volume.** IBM X-Force's 2025 Threat Intelligence Index documented BEC campaigns in 2024 that combined bulk volume with high degrees of personalization — a combination that was economically impossible before LLM-assisted generation. Targets received emails referencing specific recent transactions, named colleagues, and situationally appropriate context at volumes consistent with automated generation.

**Multilingual expansion.** Threat actors previously limited to their native language have expanded into other languages. Groups historically operating exclusively in Russian have been observed conducting high-quality English and German-language phishing campaigns. Groups previously limited to English have expanded into Japanese and Korean markets. LLM translation and generation enables language expansion without human translators.

**Synthetic persona development.** Researchers at multiple security vendors documented campaigns using AI-generated personas for the first time at scale in 2024: fake LinkedIn profiles with AI-generated photos, synthetic email histories, and LLM-maintained conversational backstories used for multi-step social engineering attacks (building rapport before the phishing ask).

## Business Email Compromise: The Highest-Impact Vector

BEC — where attackers impersonate executives or trusted vendors to redirect payments — remains the highest-dollar-value cybercrime category reported to the FBI. The FBI's 2024 IC3 report recorded over $3 billion in BEC losses in the United States alone.

LLM assistance amplifies BEC at both ends:

**Volume and personalization.** BEC attacks targeting mid-market companies (which may not have sophisticated email security) can now be produced at the volume previously reserved for generic phishing, with the personalization quality previously reserved for targeted attacks on high-value individuals.

**Real-time adaptation.** LLM-assisted BEC operators can maintain multi-turn email conversations that adapt to the target's responses in real time, sustaining convincing impersonation across a thread rather than relying on a single email.

## What Changed for Defenders

The quality improvement in AI-generated phishing degrades several traditional detection signals:

- **Grammar/spelling error detection:** Largely ineffective against LLM-generated content.
- **Language pattern fingerprinting:** Threat actors can now generate text that doesn't match their known linguistic fingerprint.
- **Volume as a signal:** High-quality personalization no longer implies low volume.

Detection signals that remain meaningful:

- **Sender authentication:** DMARC, SPF, and DKIM remain effective against domain spoofing regardless of email content quality.
- **Behavioral anomalies:** Wire transfer requests arriving via email to finance personnel, even if the email content is flawless, remain detectable via behavioral baselines (sender is new, request is unusual for this account, timing is anomalous).
- **Link and attachment analysis:** LLMs improve email text quality but don't change the properties of malicious links or attachments, which remain detectable via URL reputation and sandboxing.
- **Payment process controls:** Multi-step payment verification controls (call-back procedures for wire transfers, dual-approval requirements) remain the most reliable control against BEC.

For organizations tracking the threat landscape on AI-abused capabilities, the [AI Incidents database](https://aiincidents.org) tracks incidents where AI tools were used offensively. [adversarialml.dev](https://adversarialml.dev) covers academic work on AI-enabled attack capabilities, including research on LLM-assisted social engineering. For defensive controls that can help detect AI-generated phishing at the organizational layer, see [aidefense.dev](https://aidefense.dev).

## Sources

- [NCSC: Near-Term Impact of AI on Cyber Threat (2024)](https://www.ncsc.gov.uk/report/impact-of-ai-on-cyber-threat) — authoritative government assessment.
- [IBM X-Force Threat Intelligence Index 2025](https://www.ibm.com/reports/threat-intelligence) — commercial threat intelligence with BEC data.
- [Abnormal Security BEC Report](https://abnormalsecurity.com) — email security vendor data on AI-generated BEC campaigns.


---

*→ This post is part of the [AI Security Intelligence Hub](/posts/ai-security-intelligence-hub) — the complete resource index for AI security on ai-alert.org.*