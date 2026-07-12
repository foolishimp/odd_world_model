# Current Query And Traversal Slice

**Status**: Superseded topology; retained query-subordination reference
**Superseded by**: `WORLD_MODEL_COMMON_ARCHITECTURE.md`, ADR-WM-003
**Scope**: Low-volume query and traversal over published domain artifacts and
composed world models

## Purpose

Define the current `odd_world_model` query and traversal slice without changing the
constitutional split between:

- domain build
- world-model composition
- any future dedicated query plane

This surface is downstream of the publication truth carried by published domain
artifacts and composed world models.

## Current Lane

The historical lane is filesystem-first.

It operates over:

- published domain artifacts
- their object cuts
- attribute-ledger entries
- review surfaces such as trace and assurance records
- treatment, covariance, and adjoint artifacts

## Query Responsibility

The retained historical query/traversal slice SHALL:

- load published artifacts directly from the filesystem
- resolve logical refs such as `ledger://`, `review://`, and `input://`
- answer bounded explainability, lineage, treatment, and mapping questions
- remain subordinate to the published semantic truth

The current query/traversal slice SHALL NOT:

- become a competing mutable source of semantic truth
- require a database-backed serving layer for the current proving lane
- bypass published artifacts in favor of hidden builder state

## Current Proving Questions

The first proving questions are:

- which ledger-backed cut governs this published value?
- which assurance and trace records support it?
- which source document, code, or data surface does it trace to?
- which treatment, covariance edge, or adjoint explains the mapping between
  two artifacts?

## Future Query-Plane Seam

If the current lane later outgrows filesystem-first traversal, the future seam
is:

`published domain artifacts / composed world models -> regenerated query plane`

Any future query plane is a regenerated serving surface. It does not become the
publication authority and it does not replace published artifact cuts as the
governing semantic source.
