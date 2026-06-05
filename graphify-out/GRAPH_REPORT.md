# Graph Report - /home/user/amibyarham  (2026-06-05)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 11 nodes · 10 edges · 3 communities (2 shown, 1 thin omitted)
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `783e0226`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]

## God Nodes (most connected - your core abstractions)
1. `AMI by Arham` - 3 edges
2. `EmailJS Template (template_sv5a7me)` - 2 edges
3. `commission_leads table` - 1 edges
4. `commission-images bucket` - 1 edges
5. `PRICING_TIERS object` - 1 edges
6. `Arham Diamonds` - 1 edges
7. `Eshan Jain` - 1 edges
8. `Amit Jain` - 1 edges
9. `AMI Logo` - 1 edges
10. `Hero Karigar Image` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (3 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.33
Nodes (5): AMI Logo, Hero Karigar Image, PRICING_TIERS object, commission-images bucket, commission_leads table

### Community 1 - "Community 1"
Cohesion: 0.67
Nodes (3): Arham Diamonds, Eshan Jain, AMI by Arham

## Knowledge Gaps
- **8 isolated node(s):** `commission_leads table`, `commission-images bucket`, `PRICING_TIERS object`, `Arham Diamonds`, `Eshan Jain` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AMI by Arham` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.378) - this node is a cross-community bridge._
- **Why does `EmailJS Template (template_sv5a7me)` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **What connects `commission_leads table`, `commission-images bucket`, `PRICING_TIERS object` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._