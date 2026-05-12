---
title: "OpenAI Security: Bug Bounties, CVE Disclosure, and the 2025 Mixpanel Breach"
description: "A practitioner's overview of OpenAI security in 2026: their bug bounty program, CNA status, the November 2025 Mixpanel breach, and what security teams operating on OpenAI's platform need to monitor."
pubDate: 2026-05-12
author: "AI Alert Desk"
tags: ["openai", "bug-bounty", "cve", "breach", "vulnerability-disclosure", "ai-security"]
category: "disclosure"
sources:
  - title: "OpenAI Mixpanel Incident Notice"
    url: "https://openai.com/index/mixpanel-incident/"
  - title: "OpenAI Safety Bug Bounty Program — Help Net Security"
    url: "https://www.helpnetsecurity.com/2026/03/27/openai-safety-bug-bounty-program/"
  - title: "OpenAI CVE Assignment Policy"
    url: "https://openai.com/policies/openai-cve-assignment-policy/"
  - title: "OpenAI Coordinated Vulnerability Disclosure Policy"
    url: "https://openai.com/policies/coordinated-vulnerability-disclosure-policy/"
  - title: "OpenAI User Data Exposed in Mixpanel Hack — SecurityWeek"
    url: "https://www.securityweek.com/openai-user-data-exposed-in-mixpanel-hack/"
schema:
  type: "TechArticle"
---

OpenAI security covers more ground than most practitioners realize: traditional infrastructure vulnerabilities, AI-specific safety risks, third-party supply chain exposure, and a maturing disclosure program that now includes formal CVE assignment authority. Each domain operates under different policies and reward structures, and each carries distinct risks for the security teams, developers, and platform owners who depend on OpenAI's infrastructure.

This piece covers what's changed and what security teams actually need to track in 2026.

## Bug Bounty Programs: Two Tracks, Different Scope

OpenAI runs two parallel bug bounty programs through Bugcrowd that address different parts of its attack surface.

The **Security Bug Bounty** handles traditional infrastructure and API vulnerabilities — authentication bypasses, authorization flaws, injection points in the platform surface, and similar issues. Payouts range from $200 for low-severity findings to $20,000 for critical discoveries, with exceptional reports eligible for more.

The **Safety Bug Bounty**, [launched publicly in March 2026 with a $1 million annual pool](https://www.helpnetsecurity.com/2026/03/27/openai-safety-bug-bounty-program/), targets AI-specific abuse scenarios that the traditional security program was never designed to catch. The scope includes:

- **Agentic hijacking**: reproducible attacks where an adversary hijacks an AI agent to perform unauthorized actions, including via the Model Context Protocol (MCP). Reports must demonstrate reproducibility at 50% or better.
- **Proprietary data exposure**: model outputs that reveal internal reasoning traces, confidential system prompts, or other data OpenAI treats as non-public.
- **Account and platform integrity**: unauthorized access to features, bypasses of anti-automation controls, or account-level privilege escalations.

Standard Safety Bug Bounty payouts reach $20,000, with the ceiling raised to $100,000 for "exceptional and differentiated critical findings." General content policy bypasses — jailbreaks that produce off-topic content without clear safety impact — are explicitly out of scope and are not rewarded. For a deeper look at the techniques researchers use when probing LLM boundaries, [aisec.blog](https://aisec.blog) covers prompt injection and agent exploitation in detail.

One practical point for researchers: submissions are triaged by OpenAI's Safety and Security teams jointly and may be rerouted between the two programs depending on scope. File under the program whose scope fits closest and let triage handle the routing.

## The November 2025 Mixpanel Breach

The most significant third-party incident affecting OpenAI's user base in recent memory was not a breach of OpenAI's own systems. On November 9, 2025, attackers gained unauthorized access to Mixpanel — the analytics provider OpenAI used to instrument platform behavior — and exfiltrated a dataset tied to `platform.openai.com` users.

[OpenAI's incident notice](https://openai.com/index/mixpanel-incident/) and [SecurityWeek's coverage](https://www.securityweek.com/openai-user-data-exposed-in-mixpanel-hack/) document the exposed fields: names, email addresses, approximate geographic location derived from browser data (city, state, country), operating system and browser version, organization or user ID, and referring website. The primary impact population was API developers — not general ChatGPT users.

What was not in scope: API keys, passwords, API usage data, conversation content, payment details, or government IDs. No OpenAI-controlled system was penetrated.

OpenAI was notified by Mixpanel on November 25, 2025, 16 days after the initial intrusion. OpenAI's response included immediate termination of the Mixpanel relationship and an expanded security review of its full vendor ecosystem with elevated requirements for third-party data handling.

The operational risk from the exposed dataset is phishing and social engineering. The combination of name, email, organization affiliation, and the fact that the person is an API developer is enough to craft credible lures. Security teams with employees who use OpenAI's API platform should treat this as a phishing-surface expansion event and ensure those users are on alert for targeted spearphishing. See [aiincidents.org](https://aiincidents.org) for documentation of this and similar third-party AI vendor incidents.

## CVE Assignment: OpenAI as a CNA

In November 2025, OpenAI was recognized as a [CVE Numbering Authority (CNA)](https://openai.com/policies/openai-cve-assignment-policy/), allowing it to assign CVE IDs directly for vulnerabilities in its own products and services. This is a meaningful operational change for the security teams who track OpenAI-related findings.

Under the [coordinated vulnerability disclosure policy](https://openai.com/policies/coordinated-vulnerability-disclosure-policy/), OpenAI assigns CVE IDs for exploitable technical vulnerabilities in software it distributes — code that requires user action to remediate. It explicitly does not assign CVEs for:

- Server-side issues that OpenAI patches without user action
- Defense-in-depth fixes
- Misconfigurations
- Model behavior (jailbreaks, hallucinations, policy bypasses)

The CNA boundary matters for vulnerability management teams: if you run software with OpenAI dependencies — SDKs, libraries, API client packages — CVEs in that software will now have OpenAI-assigned identifiers and appear in the NVD. Server-side issues in ChatGPT or the API platform will not generate CVEs regardless of severity. For comprehensive tracking of ML library CVEs across the ecosystem, [mlcves.com](https://mlcves.com) aggregates these across PyTorch, LangChain, and similar stacks.

## What Security Teams Need to Monitor

OpenAI's security posture as of mid-2026 breaks down into four practical monitoring areas.

**Third-party vendor exposure.** The Mixpanel incident is a textbook supply chain problem. OpenAI has since elevated its vendor security requirements, but the incident demonstrated that analytics and observability tooling — often low on security review priority lists — can carry high-value metadata. Any vendor processing data derived from user interactions with a platform like OpenAI is worth including in your vendor risk reviews.

**Account credential hygiene.** In early 2025, a threat group designated Storm-2139 compromised Azure OpenAI accounts through stolen credentials and resold access to jailbroken model instances. The attack vector was credential theft, not an API vulnerability. Mandatory MFA, SSO enforcement, and monitoring for anomalous API usage are the relevant controls.

**Agentic attack surface.** As OpenAI builds out Operator-style agentic features — models that can browse, execute code, and call external tools — the prompt injection blast radius grows. An agent with write access to external systems that processes attacker-controlled content is a new category of risk. The Safety Bug Bounty program is explicitly targeting this surface, which signals that OpenAI itself considers it under-audited.

**CVE feed hygiene.** Now that OpenAI is a CNA, update your vulnerability management workflows to ensure OpenAI appears in your monitored vendor list. SDK and client library updates from OpenAI should be treated with the same urgency as any other dependency with a security patching cadence.

## Sources

- [OpenAI Mixpanel Incident Notice](https://openai.com/index/mixpanel-incident/) — OpenAI's official disclosure of the third-party Mixpanel breach affecting API developer accounts, including data categories exposed and response actions taken.
- [OpenAI Safety Bug Bounty Program — Help Net Security](https://www.helpnetsecurity.com/2026/03/27/openai-safety-bug-bounty-program/) — Coverage of the March 2026 Safety Bug Bounty launch, scope, and reward structure including the $100,000 ceiling for exceptional findings.
- [OpenAI CVE Assignment Policy](https://openai.com/policies/openai-cve-assignment-policy/) — OpenAI's formal policy as a CVE Numbering Authority: what gets a CVE ID, what does not, and how to report.
- [OpenAI Coordinated Vulnerability Disclosure Policy](https://openai.com/policies/coordinated-vulnerability-disclosure-policy/) — The outbound and inbound disclosure framework, including OpenAI's process for reporting third-party vulnerabilities it discovers in its own vendor software.
- [OpenAI User Data Exposed in Mixpanel Hack — SecurityWeek](https://www.securityweek.com/openai-user-data-exposed-in-mixpanel-hack/) — Independent reporting on the Mixpanel incident with additional context on the breach timeline and affected user population.
