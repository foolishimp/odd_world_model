# STRATEGY: World-Model Mesh Through A Category-Theoretic Lens

**Author**: codex
**Date**: 2026-04-17T00:53:29Z
**Addresses**: `specification/PRODUCT.md`, `specification/INTENT.md`, `specification/requirements/60-multi-domain-mapping-capability.md`, `specification/requirements/70-multi-domain-mapping-constraints.md`, `specification/requirements/80-world-model-mesh-capability.md`, `specification/requirements/90-world-model-mesh-constraints.md`, `.ai-workspace/tickets/active/T-023-build-world-model-mesh.md`, `build_tenants/common/design/MULTI_DOMAIN_MAPPING_LINE.md`, `build_tenants/common/design/ATTRIBUTE_LEDGER_BUILD_LINE.md`, `/Users/jim/src/apps/specification_methodology/specification/standards/WORLD_MODEL_METHOD.md`
**Status**: Draft

## Summary

This post explores a stronger conceptual frame for the world-model mesh:
`odd_domain` as a system for publishing semantic objects and governed
structure-preserving morphisms between them.

The short version is:

- published domain artifacts, common models, and composed world models behave
  like mesh objects
- mapping records behave like morphisms, not just field-match tables
- the important question is not only whether values correspond, but what
  structure is preserved
- the mesh then starts to look like a category:
  objects, identities, morphisms, and morphism composition

This is not proposed as ratified mathematical doctrine yet. It is a strategy
frame that may help tighten the mesh and mapping lines before they harden.

## Analysis

### 1. Reframing The Mesh

The current product line already says:

- published domain artifacts are the durable semantic publication units
- composed world models are built by reference
- the end-state is a federated world-model mesh rather than one central model

Under a category-theoretic reading, that becomes:

- **Objects**
  published domain artifacts, common models, composed world models
- **Identity morphisms**
  each published cut preserving its own lawful self-identity
- **Morphisms**
  governed correspondences between published semantic cuts
- **Composition of morphisms**
  multi-hop explainability, mapping, and traversal across the mesh

That is attractive because the mesh is already trying to preserve:

- identity
- boundary
- version
- supersession
- topology
- treatment semantics
- provenance

Those are structural concerns, not just value concerns.

### 2. Mapping As Morphism Classification

The mapping line currently classifies correspondences such as:

- exact identity
- constrained equivalence
- treatment projection
- derived mapping
- aggregation or rollup
- split mapping
- reference alignment
- lossy mapping
- incompatible or no mapping

Those categories can be tightened by asking:

- what kind of morphism is this?
- what structure does it preserve?
- what structure does it collapse, forget, or add?

Useful readings:

- **isomorphism**
  reversible semantic equivalence
- **monomorphism / embedding**
  source structure embeds faithfully into the target
- **epimorphism / quotient**
  source distinctions collapse into a coarser target
- **adjoint pair**
  forward and reverse movements exist but are not strict inverses
- **endofunctor**
  treatment over one domain without leaving that domain
- **functor**
  mapping between domains that preserves composition/topology enough to remain
  lawful

This is valuable because it moves the mapping record away from:

- matched vs unmatched
- same-name vs different-name

and toward:

- preserved identity
- preserved topology
- preserved temporal structure
- preserved treatment semantics
- preserved provenance
- declared loss

### 3. Trade To APRA As A Morphism Family

The current retained trade-to-APRA line is likely not an isomorphism.

It looks closer to a composed morphism family:

- an embedding of trade identity and some topology into the reporting line
- a treatment morphism into regulatory semantics
- a quotient or rollup where regulatory buckets collapse trade distinctions
- an adjoint-style interpretation where some reporting surfaces can be read
  back, but not as full inverses

That suggests a stronger rule for mapping:

`Every mapping correspondence should classify both morphism kind and preserved structure.`

### 4. What This Would Mean For The Mesh

If the mesh is taken seriously in this frame, then:

- a common model is not an ambient doctrine surface
  it is a reusable published object in the mesh
- composition should happen over explicit shared objects or morphisms
  not by flattening domains into one anonymous graph
- traversal becomes path reasoning over published objects and morphisms
- explainability becomes:
  object -> morphism -> object -> morphism -> object

This also makes the mesh line compatible with the current constraints:

- no central flattened truth
- published nodes only
- reference before copy
- query and mapping stay downstream

### 5. Limits Of The Frame

This should not be overclaimed.

Risks:

- mathematical terminology could become decorative rather than operational
- forcing every real-world relation into a strict categorical label too early
  could create fake precision
- the first retained line still needs practical carrier boundaries, not just a
  high-level abstract framing

So the right use is:

- sharpen the design language
- sharpen the mapping record
- sharpen what the mesh preserves

Not:

- pretend the product already has a full formal category implementation

## Recommended Action

If we want to use this frame productively, the smallest concrete move is:

1. keep the current mesh and mapping requirements intact
2. add one design section in the future mesh design line for:
   - mesh objects
   - morphism kinds
   - preserved structure vocabulary
3. extend the mapping record schema later so each correspondence can state:
   - morphism kind
   - preserved structure
   - collapsed structure
   - reversibility or adjoint basis
4. use the retained trade/APRA pair as the first proof that this framing adds
   real explanatory value

The key strategic sentence is:

`odd_domain` should reason about semantic correspondence as structure-preserving morphism over published world-model objects, not only as field-level match.
