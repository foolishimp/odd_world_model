# Full-Build Adversarial Assurance Correction

**Date**: 2026-07-12
**Scope**: full-build storage seam and assurance findings
**Tickets**: T-026, T-030
**Change class**: design reframe within the accepted storage boundary, followed by realization refactor
**Authority**: commentary and review evidence; not ticket closure, requirement closure, release, or ABG admission

## Ruling

The review cited the pre-repair 27-TypeScript/11-Python surface. Findings 1, 2,
and 4 were already changed in the live tree, but the review correctly identified
that their direct regression evidence needed to be unmistakable. Finding 3
remained structurally valid; vocabulary scoping was insufficient.

## Disposition

1. **Typed failures through exit `2`: fixed and directly proven.** The transport
   accepts protocol exit statuses `0` and `2`, then decodes the one stdout line.
   A new cross-language test writes one request, changes its content under the
   same identity, and receives `idempotency_conflict` as a typed result.
2. **Construction and verifier failures: fixed and directly proven.** Dispatch
   catches store construction failures; the CLI has a final one-line fallback;
   DuckDB construction is lazy. Tests inject store and DuckDB constructor
   failures. The post-commit case returns failed physical observations and all
   completed snapshots without a successful attestation.
3. **Provider-authored assurance in the attestation: removed.** The attestation
   contains only exact cut, snapshot, lineage, temporal, fidelity, and digest
   identity. PyIceberg and DuckDB run afterward. Their actual results travel as
   a separate `PhysicalEffectObservation` bound to the exact attestation ID,
   digest, and snapshot set. The observation is provider output offered to ABG;
   it is not acceptance or admission.
4. **Omitted optional digest fields: directly proven.** Python validates the raw
   received payload before Pydantic defaults. A TypeScript-built request omitting
   both `graph_invocation_ref` and `temporal_coordinates` crosses the real
   process boundary successfully.

## Cleanup Disposition

- removed the hardcoded requirement count from proof generation;
- made the DuckDB observer lazy;
- centralized graph-function handle/asset identifier derivation;
- centralized exact semantic-link resolution across composition and mesh; and
- centralized GTL compute-regime declarations used by graph construction and
  catalog projection.

## Current Gates

- strict TypeScript compile: pass;
- TypeScript tests: 33/33;
- Python tests: 21/21;
- common Draft 2020-12 schemas: pass, including
  `physical_effect_observation.schema.json`;
- no successful result can pair an observation with a different attestation or
  snapshot set.

T-026 and T-030 remain active pending final review. The persisted proof bundle
at `build_tenants/typescript/test_env/proof/20260712T000000Z_full-build-v1/`
was refreshed after this correction; no release authority is claimed.
