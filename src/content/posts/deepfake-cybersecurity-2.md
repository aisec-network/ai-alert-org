---
title: "Deepfake Cybersecurity Incidents: Five Confirmed Cases and the Patterns They Expose"
description: "A working catalog of confirmed deepfake cybersecurity incidents from 2024 and 2025 — from Arup's $25M loss to Ferrari's averted scam — and the controls that decided each outcome."
pubDate: 2026-05-11
author: "AI Alert Desk"
tags: ["deepfakes", "incident-catalog", "social-engineering", "bec", "dprk-it-workers", "ai-security"]
category: "incident"
sources:
  - title: "Fortune: Ferrari executive foils deepfake CEO voice scam"
    url: "https://fortune.com/2024/07/27/ferrari-deepfake-attempt-scammer-security-question-ceo-benedetto-vigna-cybersecurity-ai/"
  - title: "CNN: Arup revealed as victim of $25 million deepfake scam"
    url: "https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk"
  - title: "AI Incident Database: Incident 983 (WPP CEO deepfake)"
    url: "https://incidentdatabase.ai/cite/983/"
  - title: "FBI: North Korean IT Worker Threats to U.S. Businesses"
    url: "https://www.fbi.gov/investigate/cyber/alerts/2025/north-korean-it-worker-threats-to-u-s-businesses"
  - title: "NSA/CISA/FBI: Strengthening Multimedia Integrity in the Generative AI Era"
    url: "https://media.defense.gov/2025/Jan/29/2003634788/-1/-1/0/CSI-CONTENT-CREDENTIALS.PDF"
schema:
  type: "TechArticle"
---

Deepfake cybersecurity moved from theoretical risk to a documented loss category in early 2024, when a single sequence of transactions at engineering firm Arup moved $25 million out of corporate accounts after a synthesized video call. The pattern has not stopped. Confirmed cases now span luxury goods, advertising holding companies, and engineering, and an organized state-affiliated workforce in North Korea is using deepfake interviews to obtain remote IT roles inside US companies. This post catalogs five publicly confirmed deepfake cybersecurity incidents from 2024 and 2025, identifies what each attack actually targeted, and isolates the controls that decided the outcome.

For broader context on AI-enabled fraud and adversarial AI incidents, [AI Incidents Org](https://aiincidents.org) maintains an open record of confirmed cases.

## Case 1: Arup — $25 million wire fraud via multi-party deepfake video call

In January 2024, a finance employee in Arup's Hong Kong office completed 15 wire transfers totaling HK$200 million (approximately $25.6 million) to five Hong Kong bank accounts after participating in a video conference that featured deepfake representations of the company's CFO and several colleagues. The transfers were not flagged until the employee later raised the meeting with a senior UK contact who had no knowledge of it. The case was confirmed publicly by Arup in May 2024 and reported by [CNN Business](https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk). No funds have been recovered. The initial access vector was a spear-phishing email; the deepfake call functioned as the confirmation channel that defeated the employee's initial suspicion. A [World Economic Forum retrospective](https://www.weforum.org/stories/2025/02/deepfake-ai-cybercrime-arup/) identified the core procedural failure: no mandatory out-of-band verification existed for transfers in the amount range actually moved.

## Case 2: Ferrari — averted CEO deepfake voice scam

In July 2024, a Ferrari executive received WhatsApp messages and a call featuring what appeared to be CEO Benedetto Vigna's voice, urging confidentiality on an acquisition that needed immediate action. The executive picked up on slight intonation artifacts in the cloned voice and asked the caller the title of a book the real Vigna had recently recommended. The attacker could not answer. The call ended. As reported by [Fortune](https://fortune.com/2024/07/27/ferrari-deepfake-attempt-scammer-security-question-ceo-benedetto-vigna-cybersecurity-ai/), no funds moved and no information was disclosed. The control that worked was a shared knowledge challenge that did not exist in any digital record an attacker could obtain through open-source collection.

## Case 3: WPP — unsuccessful deepfake video call targeting an executive

In May 2024, attackers built a WhatsApp account using a publicly available image of WPP CEO Mark Read and arranged a Microsoft Teams meeting with another senior WPP executive. The meeting included an AI-cloned voice of Read and used YouTube footage to construct a video presence. The attackers reinforced the impersonation through Teams chat while soliciting personal details and asking the target to set up a new business entity. The target identified the inconsistencies and disengaged. The case is documented as [Incident 983 in the AI Incident Database](https://incidentdatabase.ai/cite/983/). WPP later confirmed no money or information was lost.

## Case 4: North Korean IT workers — deepfake interviews for credential access

The FBI's 2025 alert on [North Korean IT Worker Threats to U.S. Businesses](https://www.fbi.gov/investigate/cyber/alerts/2025/north-korean-it-worker-threats-to-u-s-businesses) describes an organized state-sponsored pattern. Operatives use AI face-swap and voice tools to pass remote video interviews for legitimate IT roles at US companies, then operate those roles using laptop farms run by US-based facilitators. The Department of Justice in December 2024 indicted 14 North Koreans connected to schemes that generated at least $88 million across six years. A coordinated June 2025 enforcement action included searches of 29 laptop farms across 16 states. The FBI estimates more than 300 US firms have unknowingly hired operatives. This case differs from the others in scope: the deepfake is not the entire attack, but the credentialing step that opens the network. A countermeasure that has worked in practice, [reported by The Register](https://www.theregister.com/2025/04/29/north_korea_worker_interview_questions/), is a directly political interview question; the candidate's reaction is observably distinct from a Western applicant's.

## Case 5: Cross-vendor voice cloning attempts on finance functions

Through 2024 and 2025, security teams at financial services firms recorded a steady volume of attempted attacks following the Arup template at smaller scales. Few of these reach public disclosure because they were intercepted before money moved. The aggregate pattern is consistent: an inbound email or messaging-app contact from a supposed senior executive, followed by a voice or short video confirmation that overcomes the receiver's initial channel suspicion. The January 2025 NSA/CISA/FBI joint advisory titled [Strengthening Multimedia Integrity in the Generative AI Era](https://media.defense.gov/2025/Jan/29/2003634788/-1/-1/0/CSI-CONTENT-CREDENTIALS.PDF) explicitly recommends C2PA Content Credentials adoption for government and critical infrastructure media pipelines as a structural counter to this class of attack. Cryptographic provenance is the only signal in the chain that does not depend on the receiver detecting synthetic media manually.

## Patterns across the five cases

A few operational signals emerge from the outcomes:

- The cases that ended without loss all involved either a shared-knowledge challenge (Ferrari), a direct identity verification check that the impersonation could not satisfy (WPP), or a target trained for synthetic media risk (DPRK candidate screening).
- The case that lost money (Arup) had a procedural gap, not a detection gap. There was no mandatory out-of-band verification for transfers in the moved amount range. The synthetic media was effective, but it was not the determining factor; the missing control was.
- The DPRK interview pattern is structurally different. It is a continuous workforce-scale operation, not an opportunistic one-off scam. Detection at the hiring stage is the only point at which an organization can interdict it before network access is granted.
- None of the publicly confirmed cases identified the attackers via forensic analysis of the synthetic media itself. The interdiction signals were behavioral, procedural, or knowledge-based. This aligns with the broader research data showing that current automated deepfake detectors lose substantial effectiveness against real-world content compared to benchmark performance.

The five-incident pattern points in one direction: the controls that decide deepfake cybersecurity outcomes are procedural and verification-based, not detection-based. Out-of-band confirmation for financial workflows, shared-knowledge challenges for high-stakes executive communications, and identity proofing with liveness in hiring pipelines are the categories where the publicly confirmed wins are concentrated. Organizations without those controls in place are running the Arup configuration.

---

## Sources

- **[Fortune: Ferrari executive foils deepfake attempt](https://fortune.com/2024/07/27/ferrari-deepfake-attempt-scammer-security-question-ceo-benedetto-vigna-cybersecurity-ai/)** — Reporting on the averted Benedetto Vigna voice clone scam and the shared-knowledge control that stopped it.

- **[CNN Business: Arup revealed as victim of $25 million deepfake scam](https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk)** — Public confirmation of the Arup Hong Kong wire fraud, transaction count, and amount moved.

- **[AI Incident Database: Incident 983 (WPP CEO deepfake)](https://incidentdatabase.ai/cite/983/)** — Documented case record of the Mark Read deepfake impersonation attempt on WPP.

- **[FBI: North Korean IT Worker Threats to U.S. Businesses (2025 alert)](https://www.fbi.gov/investigate/cyber/alerts/2025/north-korean-it-worker-threats-to-u-s-businesses)** — Official FBI alert describing deepfake-enabled DPRK IT worker schemes targeting US companies.

- **[NSA/CISA/FBI: Strengthening Multimedia Integrity in the Generative AI Era (Jan 2025)](https://media.defense.gov/2025/Jan/29/2003634788/-1/-1/0/CSI-CONTENT-CREDENTIALS.PDF)** — Joint advisory recommending C2PA Content Credentials adoption for critical infrastructure media pipelines.

For more context, [AI security digest](https://aisecdigest.com/) covers related topics in depth.
