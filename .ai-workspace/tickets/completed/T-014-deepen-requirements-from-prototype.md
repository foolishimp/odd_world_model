# T-014 Deepen Requirements From Prototype

- id: T-014
- title: Deepen domain-build requirements from prototype steel thread
- type: feature
- status: completed
- goal: proving-wave-01
- change_intent: use the existing sandbox/proof prototype as a lawful readback surface to deepen the ratified requirement line before implementation refactor proceeds
- change_class: requirement_reprice
- re_entry_point: requirements
- triaged_at: 2026-04-15
- priority: high
- dependencies: none
- links: parent:T-009
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

`odd_world_model` already has a working prototype and proving corpus.

That prototype pre-dates the current attribute-ledger build line and should
therefore be treated as a readback surface, not as the authority to preserve.

The next lawful move is to inspect the prototype against the ratified method,
intent, product, and first requirement families, then deepen the requirement
line where the prototype exposes missing constitutional truth before the
refactor implementation begins.

This is not a request to reopen product direction casually. It is the narrow
requirement pass needed so the upcoming refactor is working to explicit truth
rather than implicit prototype precedent.

## Major Ambiguities

- the prototype may reveal missing requirement truth about trace records,
  assurance records, attribute-ledger boundaries, object-cut identity, or
  filesystem-first query expectations
- the readback must distinguish true requirement gaps from mere realization
  defects; not every prototype mismatch is constitutional drift
- the steel thread should remain bounded to the current proving corpus rather
  than expanding into unrelated future platform work

## Acceptance

- the current prototype/proving corpus is reviewed against the active world-model
  requirement families
- any newly discovered requirement gaps are written explicitly into
  `specification/requirements/`
- any mismatch judged to be realization-only is left for downstream refactor
  rather than being smuggled upward
- the resulting requirement line is specific enough that the prototype can be
  refactored as a steel thread to conform to the current design

## Completion

Completed by:

- reviewing the current FpML and trade-to-APRA prototype corpus against the
  active world-model requirement families
- identifying the missing constitutional requirement truth around explicit
  intermediate review surfaces and reverse recoverability of the build line
- adding `40-domain-build-verification.md` to capture those verification
  obligations and the prototype-readback rule explicitly
- updating `requirements/README.md` so the new verification family is part of
  the active requirement set
