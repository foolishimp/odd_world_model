# T-010 Reprice Domain-Build Requirements

- id: T-010
- title: Reprice domain-build requirements for attribute-ledger world-model construction
- type: feature
- status: completed
- goal: proving-wave-01
- change_intent: carry the ratified world-model method downstream into an explicit odd_domain requirement family for tracing, assurance, attribute-ledger materialization, immutable object-cut projection, composition, and current query/traversal delivery
- change_class: requirement_reprice
- re_entry_point: requirements
- triaged_at: 2026-04-15
- priority: high
- dependencies: none
- links: parent:T-009
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

`WORLD_MODEL_METHOD.md` now makes the core semantic chain explicit:

`source -> tracing -> assurance -> attribute ledger -> Markov object cut`

`odd_domain` needs requirement authority that reflects this build law directly,
not only high-level product language.

The current object-representation family is a start, but the line now needs
explicit downstream requirement coverage for:

- traceable source observations
- assurance of qualified claims
- attribute-ledger materialization
- immutable object-cut projection
- composed world-model construction
- current query/traversal as a delivery pillar

## Major Ambiguities

- `WORLD_MODEL_METHOD.md` is being used as the governing world-model method for
  this line, but that authority should be made explicit in project-local
  surfaces rather than only assumed by ticket prose. Carry forward until the
  affected product-definition line records it.
- query/traversal remains a current delivery pillar while not being
  constitutional core. The requirement family must preserve that split without
  letting query silently fall out of scope.
- the GTL-versus-`F_D` boundary is load-bearing. This ticket should elevate the
  constraint into a requirement or explicit downstream design-decision surface,
  not rely on inherited ticket prose only.

## Acceptance

- `odd_domain/specification/requirements/` contains an explicit requirement
  family or families covering the domain-build and composition line
- the requirement set makes attribute-level sourceability mandatory
- the requirement set makes documents, code, and data lawful evidence surfaces
- the requirement set makes the attribute ledger the immediate semantic source
  of Markov object cuts
- the requirement set records the GTL / graph-function versus deterministic
  `F_D` split as an explicit governing constraint or delegates it explicitly to
  a named downstream design decision
- the requirement set preserves query/traversal as a current delivery pillar
  without making it constitutional core
- every new requirement added for this line cites the governing method section
  and the relevant `INTENT.md` or `PRODUCT.md` clause it is carrying

## Completion

Completed by:

- adding `20-domain-build-and-composition-capability.md`
- adding `30-domain-build-and-composition-constraints.md`
- repricing `10-world-model-object-representation.md` to lawful `Active`
  lifecycle status
- updating `requirements/README.md` so the current world-model requirement
  families and citation rule are explicit
- tightening `INTENT.md` and `PRODUCT.md` so the world-model method authority
  and GTL / `F_D` posture are carried explicitly into the requirement line
