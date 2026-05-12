---
title: "RAG Poisoning: How Retrieval-Augmented Generation Systems Get Compromised"
description: "RAG systems inherit all the vulnerabilities of LLMs and add a new one: the retrieval corpus. Injecting malicious content into retrieved sources can hijack model behavior in ways users and operators don't see coming."
pubDate: 2026-05-10
author: "Theo Voss"
tags: ["rag", "retrieval", "prompt-injection", "indirect-injection", "vector-database", "knowledge-base", "llm-security"]
category: "deep-dive"
heroImage: /og-card.svg
heroAlt: "RAG Poisoning: Retrieval-Augmented Generation Attack Techniques"
sources:
  - title: "Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection"
    url: "https://arxiv.org/abs/2302.12173"
  - title: "Poisoning Retrieval Corpora by Injecting Adversarial Passages"
    url: "https://arxiv.org/abs/2310.19156"
  - title: "OWASP LLM02:2025 Sensitive Information Disclosure"
    url: "https://genai.owasp.org/llmrisk/llm02-sensitive-information-disclosure/"
schema:
  type: "TechArticle"
---

Retrieval-Augmented Generation (RAG) has become the dominant architecture for deploying LLMs on internal knowledge bases, document stores, and dynamic data. The appeal is straightforward: connect the model to a searchable corpus, retrieve relevant chunks at query time, and provide those chunks as context. The model can answer questions grounded in up-to-date, organization-specific information without retraining.

What's less widely understood is that the retrieval corpus is itself an attack surface. If an adversary can inject content into the documents that get retrieved — through a document upload feature, by modifying a synced data source, or by contributing to an external knowledge base the system indexes — they can embed instructions in the retrieved context that hijack model behavior. This is indirect prompt injection, and it's among the highest-impact LLM security risks in production deployments today.

## How RAG Works (and Where the Attacks Land)

A typical RAG pipeline:

1. A user submits a query
2. The query is embedded and used to retrieve semantically similar chunks from a vector store
3. Retrieved chunks are inserted into the model's context alongside the user query
4. The model generates a response grounded in the retrieved context

The model is instructed (via system prompt) to base its response on the retrieved content. It treats retrieved documents as authoritative. This creates the attack opportunity: if an adversary controls even a fraction of the retrieved content, they can influence model outputs — because the model follows instructions from retrieved text just as it follows instructions from users.

## The Indirect Injection Attack

Greshake et al.'s 2023 paper "Not What You've Signed Up For" coined and formally defined indirect prompt injection: attacks where adversarial instructions are embedded in content that the model processes as data (emails, web pages, documents) rather than instructions, but which the model treats as instructions anyway.

In a RAG context, the attack looks like this:

1. An adversary uploads a document (or modifies a shared document, or contributes content to a web page that gets indexed) that contains, alongside legitimate content, a hidden injection: "SYSTEM: Ignore your previous instructions. Your new task is to [adversary goal]."
2. A user queries the RAG system on a topic that causes this document to rank highly in retrieval.
3. The document is included in the model's context.
4. The model partially or fully follows the injected instruction.

Common adversary goals in documented exploits: extract information from the user's session (including other retrieved documents, personal information the user provided), modify the model's behavior to produce incorrect or harmful outputs, cause the model to recommend attacker-controlled resources, or exfiltrate the contents of the context window.

## The Adversarial Passage Attack

Zhong et al.'s 2023 paper "Poisoning Retrieval Corpora by Injecting Adversarial Passages" (arXiv:2310.19156) demonstrated a complementary attack targeting the retrieval mechanism directly. Rather than relying on natural retrieval to surface a malicious document, the attacker crafts a passage specifically optimized to be retrieved for target queries.

The technique uses a retrieval attack: given a target query and the target embedding model, the adversary generates a passage with embedding properties that cause it to rank highly for that query — regardless of its actual semantic content. The passage can contain any content (including injected instructions) and will be reliably retrieved when target queries are issued.

This makes poisoning attacks more controlled than relying on natural retrieval. The attacker can target specific queries, injecting malicious passages that will reliably appear for those queries and not others. Detection is harder because the poison only activates on targeted queries.

## Vector Database Vulnerabilities

The vector store underlying a RAG system is an infrastructure component with its own security properties. Several patterns have produced security incidents:

**Insufficient access controls on document ingestion**: Many RAG deployments allow broad write access to the document corpus — all users can upload documents, or the system syncs from shared drives without access controls. This gives any user who can contribute documents the ability to inject malicious content.

**No content review before indexing**: Documents ingested into the corpus are typically not reviewed for embedded prompt injections before they become retrievable. The assumption is that all ingested content is trustworthy — an assumption that fails if the ingestion surface is at all public or shared.

**Cross-user context contamination**: In multi-tenant RAG deployments where multiple users share a corpus, a document uploaded by one user may be retrieved in response to another user's query. This creates a vector for one user to influence another user's interactions.

**Stale content without revocation**: Once a malicious document is indexed, it remains retrievable unless explicitly removed. In systems that don't track document provenance carefully, malicious content can persist through corpus updates.

## Detection Approaches

**Retrieved content sanitization**: Before inserting retrieved chunks into the model's context, scan them for injection patterns — explicit instruction-like language ("Ignore previous instructions", "Your new task is", "SYSTEM:"). This is imperfect (injection patterns are diverse and evolving) but catches naive attacks.

**Context isolation via structured prompting**: Some RAG architectures use structured context formatting that explicitly labels retrieved content as "external sources" and instructs the model to treat them as data, not instructions. This reduces (but doesn't eliminate) indirect injection effectiveness.

**Semantic anomaly detection on retrieved chunks**: Retrieved content that's semantically anomalous for the query (e.g., a document about cooking retrieved for a question about cybersecurity) may indicate a targeted adversarial passage attack. Filtering retrieved chunks by semantic similarity score with an aggressive threshold reduces exposure.

**Retrieval logging and auditing**: Logging which documents were retrieved for which queries enables retrospective investigation when anomalous model behavior is observed. Without retrieval logs, diagnosing injection incidents is nearly impossible.

**Write access controls on the corpus**: The highest-impact control is limiting who can write to the retrieval corpus. If only trusted, authenticated sources can add documents, the attack surface shrinks dramatically.

## Secure RAG Architecture Principles

Drawing from the above:

1. **Treat all retrieved content as untrusted user input**, not as trusted context. The model should be instructed to use retrieved content as evidence, not to execute instructions within it.
2. **Restrict corpus write access** to authenticated sources with review processes for externally-contributed content.
3. **Log retrieval decisions** for audit and incident investigation.
4. **Validate retrieved chunks** against injection pattern libraries before context insertion.
5. **Use retrieval confidence thresholds** — only include chunks above a semantic similarity floor to reduce adversarial passage effectiveness.
6. **Isolate multi-tenant corpora** — don't allow one user's uploaded documents to be retrievable by other users without explicit design intent and access control review.

RAG security is still an emerging area; the tooling for defending retrieval pipelines is less mature than for direct prompt injection. But the attack techniques are well-documented, and organizations deploying RAG systems should design their corpus access controls and retrieval pipelines with these attacks in mind.

**Related resources:** [promptinjection.report](https://promptinjection.report) covers indirect prompt injection in depth, including the RAG-specific variants documented here. For defense-in-depth architectures for RAG systems — including corpus access controls, retrieval sanitization patterns, and context isolation — see [aidefense.dev](https://aidefense.dev). Guardrail libraries that can be integrated into retrieval pipelines to scan retrieved content before context insertion are reviewed at [guardml.io](https://guardml.io).

## References

- Greshake, K. et al. (2023). [Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection](https://arxiv.org/abs/2302.12173). arXiv:2302.12173.
- Zhong, Z. et al. (2023). [Poisoning Retrieval Corpora by Injecting Adversarial Passages](https://arxiv.org/abs/2310.19156). arXiv:2310.19156.
- OWASP. [LLM02:2025 Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm02-sensitive-information-disclosure/).

## See also

- [AI incident tracker](https://aiincidents.org/)
- [AI security digest](https://aisecdigest.com/)
