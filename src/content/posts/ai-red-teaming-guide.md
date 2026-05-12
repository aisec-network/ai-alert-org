---
title: "A Practical Guide to AI Red-Teaming for Security Teams"
description: "Red-teaming LLMs requires different skills and methodology than traditional network or application penetration testing. This guide covers the process, techniques, and what to document."
pubDate: 2026-05-08
author: "Theo Voss"
tags: ["red-teaming", "llm-security", "pentesting", "adversarial-testing", "methodology", "owasp", "ai-security"]
category: "methodology"
heroImage: https://aisec-imagegen.th3gptoperator.workers.dev/featured/ai-alert.org/ai-red-teaming-guide.png
heroAlt: "AI Red-Teaming Guide for Security Teams"
sources:
  - title: "Microsoft's AI Red Team: Building future of safer AI"
    url: "https://www.microsoft.com/en-us/security/blog/2023/08/07/microsofts-ai-red-team-building-future-of-safer-ai/"
  - title: "NIST AI 100-1: Artificial Intelligence Risk Management Framework"
    url: "https://doi.org/10.6028/NIST.AI.100-1"
  - title: "Anthropic's model card and red-teaming disclosures"
    url: "https://www.anthropic.com/research/red-teaming-language-models-to-reduce-harms"
schema:
  type: "TechArticle"
---

Red-teaming — organized adversarial testing by a dedicated team trying to find what defenses miss — is a mature practice in traditional security. Applied to AI systems, the goal is the same but the techniques are substantially different. You're not looking for unpatched CVEs or misconfigured network services; you're looking for failure modes baked into the model's weights and the application's prompt architecture.

Security teams with strong traditional pentesting backgrounds often underestimate how different AI red-teaming is. This guide covers what AI red-teaming actually involves, the techniques used, what to document, and how to structure a red-team engagement against an LLM-powered system.

## What AI Red-Teaming Is (and Isn't)

AI red-teaming is adversarial testing of AI systems to discover failure modes across safety, security, and reliability dimensions. Microsoft's AI Red Team, which has operated since 2018, defines the scope broadly: "probing AI systems to find failures — from generating harmful content to leaking private information to being manipulated by adversarial inputs."

This is distinct from:

**Penetration testing of AI infrastructure**: Testing the cloud services, APIs, and network infrastructure that run AI models. This uses standard pentest techniques and is important, but it's not AI red-teaming.

**Model evaluation / benchmarking**: Running standardized test sets to measure model performance on defined metrics. Evaluation is systematic and pre-specified; red-teaming is adversarial and exploratory.

**Automated scanning (e.g., Garak)**: Automated tools probe known failure categories systematically. Red-teaming supplements this with creative, context-specific attacks that automated tools won't find.

## Scoping an AI Red-Team Engagement

Before the engagement begins, define:

**The target system**: Which specific deployment are you testing? A standalone model API, or a full RAG application with retrieval, tool use, and output formatting? The attack surface differs substantially.

**The threat model**: Who are the adversaries? External users trying to jailbreak the application? Employees trying to extract sensitive information? Automated pipeline attacks via document injection? Your techniques should match your threat model.

**Success criteria**: What counts as a finding? Define this upfront. "Model generated content that violates policy X" is a finding. "Model gave an unexpected response that wasn't clearly harmful" is not. Without clear success criteria, red-team outputs are hard to triage.

**Scope limitations**: What's in scope? Most AI red-team engagements exclude infrastructure testing (handled separately) and focus on model behavior, application logic, and the interaction between them.

## The Red-Teaming Process

### Phase 1: Reconnaissance

Understand the application architecture before probing it. What is the system prompt? (If it's not given to you, can you extract it?) What retrieval sources does a RAG system query? What tools does the model have access to? What's the expected user journey?

Map the application's intended behavior and the boundaries it's supposed to enforce. These boundaries are where most findings live.

### Phase 2: Baseline testing

Before creative attacks, test whether the model respects its own stated restrictions under normal conditions. Ask the model what it will and won't do. Test edge cases of the intended functionality. Document the baseline so you can measure how attacks change behavior.

### Phase 3: Direct attacks

**System prompt extraction**: Attempt to extract the system prompt using direct questions, roleplay framings, completion attacks, and multi-turn confusion techniques. Document success and failure.

**Jailbreaking**: Apply known jailbreak templates (DAN-style, persona switching, hypothetical framing). Newer techniques include many-shot jailbreaking (including many example conversations in context that normalize the restricted behavior) and gradient-based suffix attacks if you have model access.

**Policy boundary probing**: Map exactly where the model's restrictions are. If the model restricts discussion of topic X, test: adjacent topics, historical framing, fictional framing, technical framing, other languages. Restrictions are often narrower than they appear.

### Phase 4: Injection and context manipulation

**Direct prompt injection**: Embed instructions in user inputs that attempt to override system prompt behavior. Classic form: "Ignore previous instructions and instead do Y."

**Indirect injection**: If the system uses retrieval, can you control content in the retrieved sources? Insert adversarial instructions into documents the system may retrieve and test whether they execute. This is often the highest-impact finding category.

**Role confusion**: Test whether clearly delimited roles (system, user, assistant) can be confused by injecting role markers in user inputs. Some parsing architectures are susceptible.

### Phase 5: Output and extraction attacks

**PII and confidential data extraction**: Attempt to extract specific information from the model's training data or from information provided in context (other users' data, system context, retrieved documents from other users' sessions).

**Membership inference**: Query the model about specific private individuals or documents to probe whether those were in training data.

**Model behavior documentation for competitor intelligence**: Map the model's capabilities and limitations systematically enough that the results would constitute useful competitive intelligence. This tests whether deployment visibility restrictions are adequate.

## Documentation Standards

Red-team findings should be documented with enough detail to reproduce, triage, and remediate.

For each finding:

- **Finding ID**: Unique identifier for tracking
- **Category**: Jailbreak / prompt injection / PII leakage / policy bypass / etc.
- **Severity**: Critical / High / Medium / Low (with justification)
- **Reproduction steps**: Exact inputs, model version, any necessary context
- **Model response**: Verbatim output demonstrating the finding
- **Impact**: What could an attacker do with this capability?
- **Suggested mitigation**: At minimum, the category of fix needed

Severity ratings for AI findings should be calibrated to real-world impact, not just policy violation. A jailbreak that produces mildly impolite text is different from one that produces content that enables serious harm.

## Building an Internal AI Red-Team Capability

Organizations with significant AI deployments should build internal AI red-team capacity rather than relying solely on external engagements. The key hires are people with backgrounds in:

- Adversarial ML research (academic or industry)
- Prompt engineering and LLM application development (they understand what to test)
- Creative writing and social engineering (useful for jailbreak development)
- Traditional security testing (threat modeling, finding documentation, severity assessment)

Tools to equip the team with: Garak for automated coverage, LangChain and the Anthropic/OpenAI SDKs for building custom probes, a finding management system (even a shared spreadsheet is better than nothing), and access to the internal deployment under test with logging visibility.

**Related resources:** For a curated catalog of jailbreak techniques that red teams commonly test against, see [jailbreakdb.com](https://jailbreakdb.com). The full taxonomy of attack techniques relevant to LLM red-teaming is mapped at [aiattacks.dev](https://aiattacks.dev), and [adversarialml.dev](https://adversarialml.dev) covers the underlying adversarial ML research those techniques draw from.

## References

- Microsoft. [Microsoft's AI Red Team: Building future of safer AI](https://www.microsoft.com/en-us/security/blog/2023/08/07/microsofts-ai-red-team-building-future-of-safer-ai/).
- Ganguli, D. et al. (2022). [Red Teaming Language Models to Reduce Harms](https://www.anthropic.com/research/red-teaming-language-models-to-reduce-harms). Anthropic.
- NIST. [AI Risk Management Framework (AI RMF 1.0)](https://doi.org/10.6028/NIST.AI.100-1).


---

*→ This post is part of the [AI Security Intelligence Hub](/posts/ai-security-intelligence-hub) — the complete resource index for AI security on ai-alert.org.*

For more context, [AI incident tracker](https://aiincidents.org/) covers related topics in depth.
