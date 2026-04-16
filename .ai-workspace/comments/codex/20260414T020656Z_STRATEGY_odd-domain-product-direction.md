# STRATEGY: odd_domain Product Direction

**Author**: codex
**Date**: 2026-04-14T02:06:56Z
**Addresses**: `specification/INTENT.md`; `specification/PRODUCT.md`; `specification/GOALS.md`; boundary between `odd_domain`, `data_mapper`, and the originating strategy in `/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260414T011408Z_STRATEGY_domain-builder-as-pre-mapping-bounded-context-construction.md`
**Status**: Draft

## Summary

This post describes both current reality and target direction.

Current reality:

- `odd_domain` is a freshly installed project with blank constitutional
  placeholders in `specification/`.
- the project has not yet stated what product it is, what outcomes it serves,
  or how it differs from adjacent work such as `data_mapper`.

Target direction:

- `odd_domain` becomes the method and product for constructing governed domain
  information
- bounded contexts are the primary local building block
- bounded contexts can be composed into higher-order domains and enterprise
  layers
- the resulting domain model is recursive, fractal, and inspectable at each
  layer

The core claim is:

- `odd_domain` should not be framed as a one-off bounded-context editor
- it should be framed as the builder, repository, and organizer of governed
  domain truth across bounded contexts and their composition

## Analysis

### Findings

The project should start from bounded-context construction, but that is not the
full product scope.

The originating strategy direction in the parent line proposed a pre-mapping
domain builder because mapping work starts too late when it begins from schema
or payload shape alone. That direction remains correct, but the project name
chosen here implies something larger than one bounded context.

`odd_domain` is the stronger name because it can lawfully include:

- one bounded context
- many bounded contexts
- composition between bounded contexts
- aggregation of bounded contexts into business domains
- higher-order aggregation across businesses or enterprise layers

That means the project should be defined at two levels simultaneously:

1. local unit of construction
   - a bounded context with rich authority, semantics, events, policies, and
     attribute meaning
2. compositional system
   - a governed hierarchy in which bounded contexts can be related, translated,
     and aggregated into larger domain layers

The important distinction from `data_mapper` is therefore:

- `data_mapper` maps between already-understood bounded contexts
- `odd_domain` constructs and organizes the domain truth that makes those
  mappings lawful and meaningful

The important distinction from `odd_sdlc` is:

- `odd_sdlc` is a software-domain worksite builder
- `odd_domain` is a domain-information and bounded-context builder

So the product should be stated as a domain-method product, not only as a
documentation or catalog product.

### Product Direction

`odd_domain` should construct governed domain truth from business-system
reality.

That reality includes surfaces such as:

- business systems and ownership boundaries
- workflows and lifecycle states
- events that create or change domain concepts
- policies and invariants
- APIs, reports, forms, and databases
- copied, derived, stale, and overloaded representations of the same concept

At bounded-context level, `odd_domain` should answer questions like:

- what concepts exist in this context
- where is each concept authoritative
- how does an attribute actually exist in this context
- what creates it, changes it, validates it, or renders it stale
- where is it copied, derived, or degraded

At compositional level, `odd_domain` should answer:

- which bounded contexts are adjacent
- what translation or semantic correspondence exists between them
- where meaning is preserved, enriched, narrowed, or lost
- how local contexts aggregate into higher business domains

This is why the product should be described as recursive and fractal.

Each layer should be a lawful aggregation of the layer beneath it:

- attributes inside concepts
- concepts inside bounded contexts
- bounded contexts inside domains
- domains inside larger institutional domain structure

The result should remain inspectable and governed at every level rather than
collapsing into one flat enterprise model.

### First-Slice Discipline

Even though the product scope is broad, the first slice should stay narrow.

The first proving wave should likely do only this:

- construct one bounded context
- publish one concept inventory
- publish one attribute authority and derivation inventory
- publish one boundary or adjacency surface

That is enough to prove the product direction without prematurely expanding into
full cross-enterprise composition.

## Recommended Action

Keep this as commentary until the project reprices its blank constitutional
surfaces.

The next lawful steps are:

1. Fill `specification/INTENT.md` with the claim that `odd_domain` exists to
   construct and govern recursive domain truth from bounded contexts upward.
2. Fill `specification/PRODUCT.md` so the product is stated as:
   - a bounded-context builder
   - a domain-information repository
   - a compositional organizer of higher-order domain layers
3. Fill `specification/GOALS.md` with one narrow first wave focused on one
   bounded context and a minimal set of published domain surfaces.
4. Keep the first implementation slice subordinate to that narrow wave even
   though the long-term product scope is broader.
