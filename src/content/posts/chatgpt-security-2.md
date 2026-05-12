---
title: "ChatGPT Security: Patched Flaws, Persistent Gaps, and What's Still Unsolved"
description: "A technical review of ChatGPT security vulnerabilities disclosed in 2025-2026: DNS-based data exfiltration, ZombieAgent prompt injection bypass, Codex command injection, and the credential market driving account takeovers."
pubDate: 2026-05-11
author: "AI Alert Desk"
tags: ["chatgpt", "openai", "prompt-injection", "data-exfiltration", "llm-security", "vulnerability-disclosure"]
category: "disclosure"
sources:
  - title: "OpenAI Patches ChatGPT Data Exfiltration Flaw and Codex GitHub Token Vulnerability"
    url: "https://thehackernews.com/2026/03/openai-patches-chatgpt-data.html"
  - title: "OpenAI patches déjà vu prompt injection vuln in ChatGPT"
    url: "https://www.theregister.com/2026/01/08/openai_chatgpt_prompt_injection"
  - title: "OpenAI says AI browsers may always be vulnerable to prompt injection attacks"
    url: "https://techcrunch.com/2025/12/22/openai-says-ai-browsers-may-always-be-vulnerable-to-prompt-injection-attacks/"
  - title: "ChatGPT Security for Enterprises: Risks and Best Practices"
    url: "https://www.wiz.io/academy/ai-security/chatgpt-security"
  - title: "ChatGPT Atlas Browser Can Be Tricked by Fake URLs into Executing Hidden Commands"
    url: "https://thehackernews.com/2025/10/chatgpt-atlas-browser-can-be-tricked-by.html"
schema:
  type: "TechArticle"
---

The ChatGPT security disclosure record for late 2025 and early 2026 is a useful corrective to both the alarmism and the dismissiveness that surround LLM risk discussions. Three separate vulnerability chains were researched, reported, and patched — DNS-based conversation exfiltration, a prompt injection bypass that achieved persistence via the memory feature, and a command injection flaw in Codex that handed attackers GitHub access tokens. None required novel theoretical attacks. All exploited the same structural problem: an AI system that cannot reliably distinguish trusted instructions from attacker-controlled content it reads at runtime.

## DNS-Based Data Exfiltration and Remote Shell Access

Check Point researchers disclosed a vulnerability in ChatGPT's Linux-based code execution environment that allowed sensitive conversation data — including user messages and uploaded files — to be siphoned using DNS requests as a covert channel. The attack required only a single malicious prompt.

ChatGPT's sandboxed runtime is designed to prevent direct outbound network connections, but it does not apply the same restriction to DNS lookups. An attacker could encode conversation content into DNS query hostnames, each query resolving through infrastructure the attacker controlled. Because DNS traffic is low-volume and DNS queries often bypass corporate inspection rules, this exfiltration path is harder to detect than a conventional HTTP callback.

The same research chain identified that the vulnerability also allowed remote shell access inside the runtime environment — meaning an attacker with code execution in the sandbox could execute arbitrary bash commands. The full scope of what was reachable from that shell was not detailed in public reporting.

[OpenAI patched the flaw on February 20, 2026](https://thehackernews.com/2026/03/openai-patches-chatgpt-data.html), following responsible disclosure. No evidence of in-the-wild exploitation was found. The remediation details were not published; it is not clear whether the fix closes DNS-based exfiltration generically or addresses only the specific technique demonstrated.

## ZombieAgent: When the Initial Fix Gets Bypassed

The DNS exfiltration disclosure was not an isolated event. Radware security researchers had separately reported an indirect prompt injection chain — called ShadowLeak — that OpenAI patched in September 2025. ShadowLeak allowed malicious instructions embedded in connected content (emails, Drive documents, SharePoint files) to trigger ChatGPT into making a network request to an attacker's server with conversation data appended as URL parameters.

OpenAI's fix was to prevent ChatGPT from dynamically constructing or modifying URLs — it could open URLs exactly as provided, but could no longer append data as parameters. Radware's follow-up research found a full bypass.

The successor attack, named ZombieAgent, avoids dynamic URL construction entirely. Instead of building a single URL with encoded data appended, it uses a pre-constructed set of URLs where each URL terminates in a different character — `example.com/a`, `example.com/b`, through the full character set. The model exfiltrates content one character at a time by selecting from these pre-built paths, making URL-parameter modification unnecessary and bypassing the patch completely.

[ZombieAgent also achieved persistence](https://www.theregister.com/2026/01/08/openai_chatgpt_prompt_injection) by abusing ChatGPT's long-term memory feature. The attacker embeds memory-modification instructions inside a shared file. When the model reads the file, it stores new instructions in its persistent memory that direct future sessions to execute commands from attacker-controlled emails and exfiltrate responses before replying normally. The attack survives conversation resets.

OpenAI patched the ZombieAgent technique on December 16, 2025. The broader problem it exposes — that indirect prompt injection chains through connected content sources are structurally difficult to block — remains open. [OpenAI's own preparedness team told TechCrunch](https://techcrunch.com/2025/12/22/openai-says-ai-browsers-may-always-be-vulnerable-to-prompt-injection-attacks/) that prompt injection for browser agents may never be fully solved: "adversaries will spend significant time and resources to find ways to make ChatGPT agent fall for these attacks." For documented attack catalogs, [aisec.blog](https://aisec.blog) tracks prompt injection techniques and agentic exploitation patterns as they are published.

## Codex Command Injection and GitHub Token Theft

A separate vulnerability chain in OpenAI's Codex tool — the coding assistant with direct GitHub integration — was discovered by BeyondTrust and disclosed on December 16, 2025. OpenAI patched it on February 5, 2026.

The flaw was a command injection weakness in Codex's task creation flow. When Codex processes a repository, it uses parameters including the GitHub branch name. The branch name field was not properly sanitized, allowing attackers to smuggle arbitrary shell commands through a maliciously named branch. Those commands executed inside Codex's container.

The consequence was credential theft. Codex authenticates to GitHub using a GitHub User Access Token, the same token generated when a user connects their GitHub account. An attacker who controlled the repository or who could create a branch with a malicious name could recover that token and gain read and write access to any repository the victim's GitHub account could reach — effectively the entire codebase. [BeyondTrust's reporting](https://thehackernews.com/2026/03/openai-patches-chatgpt-data.html) characterized this as potential lateral movement across a victim's full development environment.

No public CVE ID has been assigned to either the Codex vulnerability or the DNS exfiltration issue. Both were remediated under OpenAI's internal disclosure process.

## Account Takeover via Credential Markets

Separate from these application-layer vulnerabilities, ChatGPT accounts are actively traded on criminal marketplaces harvested through endpoint malware. Over 225,000 ChatGPT and OpenAI credentials appeared on dark web markets during 2025, primarily collected by infostealer families including LummaC2. The attacker path here does not require any ChatGPT vulnerability: malware on an employee endpoint captures the saved password or session cookie, and the attacker logs in with valid credentials.

This matters because a compromised ChatGPT account exposes months of conversation history. For employees who use the platform without governance controls in place, that history may contain pasted source code with embedded secrets, internal architecture documents, draft communications, customer names, or credentials copied from other tools. The account takeover gives an attacker a comprehensive intelligence snapshot assembled involuntarily over weeks of use.

[Wiz's enterprise security guidance](https://www.wiz.io/academy/ai-security/chatgpt-security) notes that the most common ChatGPT security incidents in enterprise environments are not direct exploits of OpenAI infrastructure — they are compromised endpoints, shadow AI usage on personal accounts, and unsanctioned connector configurations. Enforcing SSO with SAML-based provisioning, requiring MFA, and blocking personal ChatGPT accounts on managed devices eliminates the credential market risk for employees covered by those controls.

## What Security Teams Should Act On

The vulnerability disclosures above produce a short action list for teams running ChatGPT in any capacity:

**For enterprise deployments:** Audit which connectors are authorized. Each connector that links ChatGPT to email, calendar, Drive, or code repositories extends the blast radius of a successful prompt injection. Apply the minimum scopes needed, and log connector activity. Review whether ChatGPT's memory feature is enabled and whether that is appropriate given your threat model — ZombieAgent's persistence vector relied on it.

**For agentic workflows:** Treat every document, email, or web page the agent reads as potentially adversarial input. Do not allow agents to take irreversible actions — sending email, committing code, modifying records — without a human-in-the-loop checkpoint. For runtime guardrails and output filtering, [guardml.io](https://guardml.io) covers the current tooling landscape.

**For credential hygiene:** Deploy an endpoint detection solution capable of identifying infostealer activity. LummaC2 and similar families exfiltrate browser-stored credentials silently; the only reliable detection is behavioral monitoring on the endpoint, not perimeter inspection.

**For Codex users specifically:** Review GitHub access token scopes granted to Codex. If the integration does not need write access across all repositories, restrict it to the minimum scope. Rotate tokens if there is any uncertainty about exposure during the affected window (before February 5, 2026).

None of these controls require waiting for OpenAI to close the next disclosure. The structural issue — an AI platform that ingests attacker-controlled content and executes instructions extracted from it — is unlikely to be fully patched by any single fix. Defense requires assuming the model can be manipulated and building controls around the actions it is permitted to take.

## Sources

- [OpenAI Patches ChatGPT Data Exfiltration Flaw and Codex GitHub Token Vulnerability](https://thehackernews.com/2026/03/openai-patches-chatgpt-data.html) — The Hacker News coverage of Check Point's DNS exfiltration research and BeyondTrust's Codex command injection disclosure, including timeline and remediation dates.
- [OpenAI patches déjà vu prompt injection vuln in ChatGPT](https://www.theregister.com/2026/01/08/openai_chatgpt_prompt_injection) — The Register's reporting on ZombieAgent, the ShadowLeak successor technique that achieved persistence via the ChatGPT memory feature and bypassed OpenAI's initial URL-parameter fix.
- [OpenAI says AI browsers may always be vulnerable to prompt injection attacks](https://techcrunch.com/2025/12/22/openai-says-ai-browsers-may-always-be-vulnerable-to-prompt-injection-attacks/) — TechCrunch interview with OpenAI's head of preparedness acknowledging prompt injection as a structurally unsolved problem for agentic AI systems.
- [ChatGPT Security for Enterprises: Risks and Best Practices](https://www.wiz.io/academy/ai-security/chatgpt-security) — Wiz's enterprise security guide covering data theft, malicious code generation, unauthorized access, and organizational governance controls.
- [ChatGPT Atlas Browser Can Be Tricked by Fake URLs into Executing Hidden Commands](https://thehackernews.com/2025/10/chatgpt-atlas-browser-can-be-tricked-by.html) — Earlier Hacker News coverage of the Atlas browser manipulation vulnerabilities that preceded the ZombieAgent disclosure, providing context for the multi-patch disclosure chain.

## See also

- [AI incident tracker](https://aiincidents.org/)
- [AI security digest](https://aisecdigest.com/)
