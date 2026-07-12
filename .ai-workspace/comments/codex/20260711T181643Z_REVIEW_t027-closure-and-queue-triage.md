---
kind: review
agent: codex
date: 2026-07-11T18:16:43Z
ticket: T-027
related_tickets: T-023, T-024, T-026
reviews: specification/INTENT.md, specification/PRODUCT.md, specification/requirements/, specification/scenarios/, ABIogenesis v4.6.0-rc.3, odd_glc v0.1.0
authority: commentary (per POSTING_GUIDE.md)
---

# REVIEW: T-027 Closure And Queue Triage

## Verdict

Accept with one exact-cut repair, now applied. T-027 satisfies its documented
closure law after that repair, but remains active until F_H explicitly accepts
and closes the landed specification.

Claude's queue feedback is correct that T-027 is the hard gate and that T-024
did not belong in the active set. Its statement that rc.3 has "no resolvable
catalog" is too broad: rc.3 has a binding-declared graph-function target
catalog used by `start`; it lacks the later standalone catalog product,
catalog-operation family, graph shell, and broad public-consumption contract.

## Findings

### 1. High - The rc.3 operator capture imported broader mutable 5.0 law

The original T-027 Ground Truth paragraph listed workspace/catalog operations,
resume, broad reads, lawful actions, and typed F_H operations as rc.3's public
operator family. The Product at tag `v4.6.0-rc.3` publishes the narrower family:
`start`, `gaps`, `assess-result`, `witness`, `observe`, `tune`,
`typecheck-gtl-program`, and install-time verbs. The rc.3 release note explicitly
excludes ABG 5.0 catalog, graph shell, marketplace compatibility, broad public
consumption, and self-hosting.

This was a closure blocker because T-027's purpose is exact contract grounding.

**Repair applied**: T-027 now names the exact rc.3 family and exclusion. It also
records the real current resolution path: `start graph_function:<handle>` uses
the workspace binding's declared `runtimeRegistryStartup` catalog, while GTL
`Module` construction enforces publication of referenced graph functions.

### 2. High - T-026 cannot continue through the filesystem runner

Requirement 50 and T-027 make a published GraphFunction the constructive
carrier. The existing TypeScript runner states that it is not ABG-backed and is
therefore comparison evidence only. Continuing to deepen it would violate the
landed specification under either upstream choice.

**Disposition applied**: T-026 is held pending F_H choice between:

1. build against exact rc.3 and prove the binding-declared GraphFunction target
   path; or
2. defer until the successor publishes the broader addressable catalog/public
   contract.

Neither option permits the old runner to become current. Existing proposed
function names are stale design readback pending F_H catalog decisions.

### 3. Medium - Common design was started before the hard gate closed

T-028/T-029 and common architecture drafts were prepared before this review
completed. That was too early under T-027's closure law.

**Disposition applied**: T-028 and T-029 are backlog; the premature files were
removed from `build_tenants/common/design/`. The stack and decision pressure
remain in backlog tickets and commentary, not accepted design authority.

## Closure-Law Audit

| T-027 closure condition | Result |
| --- | --- |
| Intent, Product, and affected requirements are present-tense with floating dependency law | Pass |
| Consumed contracts cite exact published sources | Pass after rc.3 operator/catalog repair |
| Missing/partial upstream contracts are explicit gaps with owners | Pass |
| UAT, product scenarios, and testcase authority trace the reprice without realization claims | Pass |
| T-026 rebase and metadata exist | Pass; realization now explicitly held |
| Tenant registry carries grounding and stale-install warning | Pass |
| No design/runtime realization is claimed by T-027 | Pass after premature design drafts were removed |

Validation evidence:

- all numbered requirement refs in scenario surfaces resolve;
- no duplicate requirement, UAT, authority, or product-scenario IDs;
- all 29 added requirement IDs appear in all three constitutional acceptance
  surfaces;
- `stdo_compressed.md` source digests match their five current standards;
- `git diff --check` passes; and
- retained TypeScript regression tests pass 2/2 without being treated as
  GraphFunction proof.

## Queue Disposition

- **T-027**: active only for explicit F_H accept/close.
- **T-023**: active but held with T-027; specification reprice is sound, no
  independent design work yet.
- **T-026**: active but held for T-027 closure and F_H carrier/catalog choice.
- **T-024**: backlog; stale deferred enrichment is no longer in the current
  bounded execution set.
- **T-028/T-029**: backlog proposals for post-closure common architecture and
  F_H graph-function decisions.

After T-027 closure, T-023 mesh design and T-026 core design may proceed partly
in parallel. T-026 mesh realization remains downstream of the T-023 design
boundary.

## F_H Rulings Required

1. Accept and close T-027 as repaired.
2. For T-026, select exact-rc.3 GraphFunction development or defer for the
   successor addressable catalog/public contract.

T-024 disposition has already been applied as backlog and needs no further
ruling unless F_H wants it returned to the current wave.

## F_H Disposition

Recorded 2026-07-12:

1. T-027 is accepted and closed as repaired.
2. T-026 will build against the exact rc.3 binding-declared GraphFunction
   family rather than wait for the successor catalog.

F_H rationale: the work is incremental, expected to migrate easily, and is
being used to test the concepts. The ruling therefore selects a proving
substrate without converting its version or wider limitations into Product law.
