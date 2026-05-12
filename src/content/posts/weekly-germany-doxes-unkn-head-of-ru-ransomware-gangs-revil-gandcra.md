---
title: "Germany names UNKN: what the BKA's REvil and GandCrab dox actually buys"
description: "Germany's BKA has put a name and a face to UNKN, the operator behind GandCrab and REvil. Russia will not extradite, but the wanted notice is doing other work — and there is a lesson for everyone running a ransomware-readiness program."
pubDate: 2026-05-05
author: "Theo Voss"
tags: ["ransomware", "revil", "gandcrab", "attribution", "threat-intel", "law-enforcement"]
category: "deep-dive"
sources:
  - title: "Germany Doxes \"UNKN,\" Head of RU Ransomware Gangs REvil, GandCrab — KrebsOnSecurity"
    url: "https://krebsonsecurity.com/2026/04/germany-doxes-unkn-head-of-ru-ransomware-gangs-revil-gandcrab/"
  - title: "German authorities identify REvil and GandCrab ransomware bosses — BleepingComputer"
    url: "https://www.bleepingcomputer.com/news/security/german-authorities-identify-revil-and-gangcrab-ransomware-bosses/"
  - title: "BKA Identifies REvil Leaders Behind 130 German Ransomware Attacks — The Hacker News"
    url: "https://thehackernews.com/2026/04/bka-identifies-revil-leaders-behind-130.html"
  - title: "German Police Unmask REvil Ransomware Leader — SecurityWeek"
    url: "https://www.securityweek.com/german-police-unmask-revil-ransomware-leader/"
schema:
  type: "NewsArticle"
---

Germany's Federal Criminal Police, the Bundeskriminalamt (BKA), has [publicly named two Russian nationals](https://krebsonsecurity.com/2026/04/germany-doxes-unkn-head-of-ru-ransomware-gangs-revil-gandcrab/) as the people behind the GandCrab and REvil ransomware operations that ran from early 2019 through mid-2021. The man who posted under the handle "UNKN" — for years one of the most-watched personas on the Russian-language XSS cybercrime forum — is, according to the BKA, 31-year-old Daniil Maksimovich Shchukin of Krasnodar. The group's principal developer is named as 43-year-old Anatoly Sergeevitsch Kravchuk, born in Makiivka, Ukraine.

Both men remain in Russia. Russia does not extradite its citizens. The BKA's wanted notices will not, on their own, put either of them in a courtroom in Frankfurt or Wiesbaden. But that is not the only thing public attribution is for, and reading these notices as merely symbolic misses what the BKA has actually done.

## What the BKA put on paper

The BKA's two notices identify Shchukin as the public-facing operator of the affiliate program — the man who recruited partners, ran negotiations, and ran the brand on XSS — and Kravchuk as the developer who wrote and maintained the encryptor. The agency [counts at least 130 ransomware incidents](https://thehackernews.com/2026/04/bka-identifies-revil-leaders-behind-130.html) against German targets between 2019 and 2021, with 25 of those resulting in roughly €1.9 million in paid ransoms. The BKA's estimate of total damages — including downtime, incident response, recovery costs, and lost business — is north of €35 million.

The notices also list the aliases the BKA attributes to Shchukin: UNKN, UNKNOWN, Oneiilk2, Oneillk2, Oneillk22, and the brand "GandCrab" itself. That handle history is the kind of detail that matters operationally. It tells threat intelligence teams which historical forum posts to re-read with the assumption that they are reading Shchukin's own words, not a generic persona. It tells investigators which old wallet clusters to revisit. It tells reporters where to look in archived XSS dumps.

A 2023 U.S. Department of Justice filing referenced in the [KrebsOnSecurity coverage](https://krebsonsecurity.com/2026/04/germany-doxes-unkn-head-of-ru-ransomware-gangs-revil-gandcrab/) describes a digital wallet linked to Shchukin holding more than $317,000 in cryptocurrency. That is a relatively small number against the multi-billion-dollar headline figures GandCrab itself once boasted, but it is corroborating evidence rather than the totality of his proceeds — and it is the kind of cross-jurisdictional artifact that makes the attribution stick.

## How GandCrab and REvil actually worked

GandCrab launched in January 2018 and ran until May 2019, when its operators very publicly retired with the claim that they had collected "over $2 billion" in ransoms. REvil — also known as Sodinokibi — emerged from former GandCrab affiliates almost immediately, replicating the affiliate-recruitment model and then [adding the public leak site and "data auction" mechanics](https://www.bleepingcomputer.com/news/security/german-authorities-identify-revil-and-gangcrab-ransomware-bosses/) that defined the second wave of double extortion.

The technical core was unremarkable by 2026 standards: a Windows ransomware payload, an affiliate panel, a Tor-hosted negotiation chat, and a leak site. What made REvil different from a long tail of similar operators was operational discipline. The group ran professional negotiation, picked targets where a leak threat had real weight, and used affiliate splits — typically 70/30 in favor of the affiliate after the first few attacks — that successfully recruited talent away from competing brands.

That talent recruitment is what made the business work, and it is also what made the attribution finally possible. Every affiliate who joined the program touched some part of the back-end infrastructure. Every negotiator who logged in to the chat panel left timing data. Every cash-out chain went through services that, by 2022, were under sustained scrutiny by U.S. and European blockchain forensics teams.

The Kaseya VSA supply-chain attack in July 2021 is the moment the trajectory of this group bent. Hitting [roughly 1,500 downstream businesses](https://www.bleepingcomputer.com/news/security/german-authorities-identify-revil-and-gangcrab-ransomware-bosses/) through a single managed service provider compromise raised the political cost of leaving REvil alone past the point where it could be quietly tolerated. Within weeks the group's primary infrastructure was offline, and law enforcement began the period of access and monitoring that produced both the January 2022 Russian arrests and, eventually, the data behind today's BKA notices.

## What "doxing without arrest" is actually for

The reflexive read on a wanted notice that names a Russian national living in Russia is that it is symbolic at best and theatrical at worst. That read is incomplete. Public attribution at this level of specificity does at least four things that arrests do not.

First, it constrains travel. Shchukin and Kravchuk can no longer plan a holiday in any country with a working extradition relationship with Germany — and the list of countries that fall outside that net has shrunk steadily over the last decade. They can move within Russia, Belarus, and a handful of friendlier jurisdictions. They cannot fly through a Gulf state hub on the way to anywhere else without a real risk of detention. For ransomware operators in their thirties, that is a meaningful life sentence on personal mobility.

Second, it freezes the target's economic identity. Once a name is publicly tied to an OFAC-relevant criminal organization, every regulated financial institution on earth has a positive obligation to refuse business with that name. Even if Shchukin has never personally touched a U.S. dollar, his ability to convert future cryptocurrency proceeds through any compliant service is now negligible. That collapses his realistic exit options to non-compliant exchanges, OTC desks willing to take legal risk, and a steadily shrinking set of cash-out paths that themselves are under increasing pressure.

Third, it forces the operators to re-tool. Every alias the BKA listed is now burned. Every forum post under those handles is now part of a public attribution package. Any successor brand the same crew tries to launch — and the GandCrab-to-REvil transition shows they have done this before — has to be built from scratch, without any of the reputational capital that the old handles accumulated. In a market where affiliates pick partners partly on perceived reliability, that re-tooling cost is real money.

Fourth, and most underrated, it builds the evidence base for everyone else. The BKA's notices are not standalone. They are a contribution to a dossier that the FBI, Europol, the U.S. Treasury, and a half-dozen other agencies will draw on the next time one of these individuals slips up. Every piece of formal attribution narrows the search space for the next investigator.

## Original analysis: attribution-as-disruption is now the dominant doctrine

The instinct to grade these actions on whether they end in a perp walk is a holdover from a pre-2020 model of cybercrime enforcement. That model assumed an arrest was the point and that everything short of it was a failure. The current Western law-enforcement doctrine — visible across the BKA notices, the FBI's [Wanted](https://www.fbi.gov/wanted/cyber) program, U.S. Treasury OFAC designations against ransomware operators and their crypto wallets, and Europol's coordinated takedowns — has quietly shifted to a different theory of the case.

The new theory is that ransomware is a business problem and that the most effective intervention is to raise the operating costs of running that business until the unit economics break. Arrests are useful when available, but they are one tool among several. Public attribution, infrastructure seizures, sanctions, exchange enforcement, and cooperation with insurers to harden ransom-payment workflows are all part of the same campaign.

By that yardstick, the BKA's notices are not a consolation prize. They are a contribution to a campaign that, over the last three years, has measurably extended the time it takes for a new ransomware brand to reach scale, increased the operational security overhead these groups must carry, and pushed at least some operators into the lower-margin parts of the market. None of this means ransomware is going away. It does mean that the doctrine the West is running is producing the kind of slow, cumulative pressure that defenders should expect, plan around, and where possible feed.

The counter-argument is that this campaign also produces moral hazard. If the cost of running a ransomware operation from inside Russia is "your name is eventually published in a country you do not plan to visit," some would-be operators will judge that an acceptable price. That is true. The BKA's notices will not deter the next Shchukin from trying. They will, however, change what tools that next operator has to build with, what aliases they have to invent, what infrastructure they have to host, and what payment paths they have to use. Each of those changes is a cost. Each cost is a place where defenders, intelligence teams, and law enforcement get another shot.

## What this means for defenders right now

For [security teams](https://techsentinel.news/posts/weekly-how-ai-assistants-are-moving-the-security-goalposts/), the headline is not the name. The headline is what the BKA's confidence level says about the maturity of cross-border ransomware attribution in 2026. If the German federal police can publicly identify the head of REvil five years after the fact, with detail down to alias history and birthplace, the same machinery is being pointed at every active ransomware brand right now. Threat intelligence [teams should](https://sentryml.com/posts/bridging-the-ai-agent-authority-gap-continuous-observability/) treat any 2025–2026 ransomware operator with the working assumption that their identity is, or will shortly be, known to at least one Western agency.

That assumption changes how to read the threat landscape. It is no longer plausible that the operators behind the major brands believe themselves to be permanently anonymous. They are making explicit risk trades — accepting the eventual loss of anonymity in exchange for present cash flow — and that risk trade has implications for tradecraft. Expect more frequent rebranding. Expect shorter-lived affiliate programs. Expect more energy spent on operational security and less on volume.

The other piece worth flagging is the affiliate-model angle. GandCrab and REvil pioneered the structure that nearly every meaningful ransomware brand still uses: a small core team running infrastructure and a large rotating cast of affiliates running intrusions. That structure is now being augmented by automation. The use of large language models to draft phishing pretexts, summarize stolen data for extortion threats, and triage compromised environments is well-documented in current intrusion sets. Readers tracking the offensive-AI side of this evolution will find more on the agent-and-tooling angle on our sister publication, [aisec.blog](https://aisec.blog), and the broader cybercrime-news context on [techsentinel.news](https://techsentinel.news). The point for defenders is that the affiliate model that REvil perfected in 2019 is the same model now being scaled with AI assistance, and the attribution doctrine being applied to Shchukin today is the same doctrine that will be applied to the operators of those AI-assisted programs three years from now.

For everyone running a ransomware-readiness program, the operational posture has not changed. Patch the perimeter. Segment the network. Enforce phishing-resistant MFA. Test the backup restore. Have the incident response retainer in place. Decide the ransom-payment policy in advance, not on the day of the attack. None of that is new. The BKA's notices are a reminder that the people on the other side of those defenses are real, identifiable, and increasingly being treated as such by the agencies whose job it is to make their lives expensive.

The AI-augmented ransomware tradecraft described above — LLMs drafting phishing pretexts, triaging stolen data for extortion — is tracked at [aiattacks.dev](https://aiattacks.dev), which maps offensive AI techniques used by active threat groups. For practitioners concerned about the data exfiltration and privacy implications of ransomware breaches, [aiprivacy.report](https://aiprivacy.report) covers the intersection of AI and personal data exposure. Defense controls for the AI-assisted intrusion paths that modern ransomware affiliates use are catalogued at [aidefense.dev](https://aidefense.dev).

## Sources

- [Germany Doxes "UNKN," Head of RU Ransomware Gangs REvil, GandCrab — KrebsOnSecurity](https://krebsonsecurity.com/2026/04/germany-doxes-unkn-head-of-ru-ransomware-gangs-revil-gandcrab/) — Brian Krebs's original write-up of the BKA disclosure, with detail on the alias history and the 2023 U.S. DOJ filing referencing the $317,000 crypto wallet linked to Shchukin.
- [German authorities identify REvil and GandCrab ransomware bosses — BleepingComputer](https://www.bleepingcomputer.com/news/security/german-authorities-identify-revil-and-gangcrab-ransomware-bosses/) — Reporting on the affiliate-program transition from GandCrab to REvil, the introduction of the leak-site/data-auction model, and the Kaseya supply-chain attack scope.
- [BKA Identifies REvil Leaders Behind 130 German Ransomware Attacks — The Hacker News](https://thehackernews.com/2026/04/bka-identifies-revil-leaders-behind-130.html) — Detail on the BKA wanted notices themselves, the full alias list attributed to Shchukin, the XSS forum advertisement in June 2019, and the October 2024 Russian sentencing of four REvil members.
- [German Police Unmask REvil Ransomware Leader — SecurityWeek](https://www.securityweek.com/german-police-unmask-revil-ransomware-leader/) — Confirms the BKA wanted-notice paths and the headline numbers on incident count, paid ransoms, and total damages.

## Related across the network

- [AI Agents Are Rewriting the Threat Model, and Most Security Teams Aren't Ready](https://techsentinel.news/posts/weekly-how-ai-assistants-are-moving-the-security-goalposts/) — *techsentinel.news*
- [AI Assistants Are Rewriting the Threat Model, Not Just the Workflow](https://techsentinel.news/posts/how-ai-assistants-are-moving-the-security-goalposts/) — *techsentinel.news*
- [FTC logs $2.1B in social media scam losses as TAKE IT DOWN deadline lands](https://neuralwatch.org/posts/threatsday-bulletin-sms-blaster-busts-openemr-flaws-600k-rob/) — *neuralwatch.org*
- [The Agent Authority Gap Is an Observability Problem in a Security Costume](https://sentryml.com/posts/weekly-bridging-the-ai-agent-authority-gap-continuous-observability/) — *sentryml.com*
- [The Authority Gap Is an Observability Problem: What MLOps Teams Should Borrow](https://sentryml.com/posts/bridging-the-ai-agent-authority-gap-continuous-observability/) — *sentryml.com*

## See also

- [AI incident tracker](https://aiincidents.org/)
- [AI security digest](https://aisecdigest.com/)
- [weekly AI security roundup](https://aisecweekly.com/)
