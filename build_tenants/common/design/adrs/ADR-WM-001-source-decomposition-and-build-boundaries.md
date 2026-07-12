# ADR-WM-001 Source Decomposition And Build Boundaries

**Status**: Accepted
**Date**: 2026-07-12 (re-adopted into current ADR topology)
**Ticket**: T-028; original decision lineage T-005/T-009
**Scope**: Source-ingestion, lineage, and publication boundaries for `odd_world_model`
**Implements**:
- REQ-ODD-WORLD-MODEL-WORLD-OBJECT-004
- REQ-ODD-WORLD-MODEL-WORLD-OBJECT-009
- REQ-ODD-WORLD-MODEL-BUILD-CAP-001
- REQ-ODD-WORLD-MODEL-BUILD-CAP-002
- REQ-ODD-WORLD-MODEL-BUILD-CAP-007
- REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-006
**Derives from**:
- INT-ODD-WORLD-MODEL-001
- PROD-ODD-WORLD-MODEL-001
**Supersedes**: original root-level ADR placement; the decision content is
re-adopted, not rewritten from legacy implementation

## Context

`odd_world_model` needs strong lineage and provenance over heterogeneous source
families such as:

- PDF
- Markdown
- Scala or other code
- schemas and interfaces
- structured data
- official standards such as FpML

To get lawful provenance, the system must first deconstruct those sources into
stable source objects such as:

- page
- section
- clause
- paragraph
- table
- row
- cell
- package
- type
- method
- field
- trade header
- product surface
- leg

The design risk is letting that decomposition layer become a competing truth
surface or an accidental project-specific compatibility layer.

## Decision

### 1. Adapters Are Categorical

Adapters are categorical readers over source families.

They know how to deconstruct a source syntax or document family, for example:

- `fpml_confirmation`
- `pdf_policy_document`
- `markdown_spec`
- `scala_codebase`

They do not know the project's publication decisions.

They do not own:

- project-specific object ids
- bounded-context publication ids
- treatment decisions
- composition decisions
- world-model truth

### 2. Adapter Output Is Review-Only

Adapter output is a constructor and review aid only.

It exists so the project can inspect:

- what source objects were recovered
- what locators or spans were found
- what candidate structure is available for lineage

It is not a durable truth surface.

### 3. Build Lines Are Instanced

The build line is the instanced project-specific construction line.

It decides:

- which source files are in scope
- which decomposed source objects matter
- which source objects become a published source domain
- which interpreted world-model domain is derived from that source domain
- which ids, traces, assurances, and ledger entries are written

### 4. Durable Truth Is Published By The Build Line

Durable truth is published only at the build-line boundary.

That means:

- source truth may be published as a bounded `source domain`
- interpreted truth may be published as a downstream `world-model domain`

There is no third truth surface between them.

The lawful shape is:

`raw source -> categorical adapter -> review observation -> build line -> published source domain -> interpreted world-model domain`

### 5. Source Domains Preserve Deconstruction For Provenance

Where lineage and provenance depend on preserving source structure, the build
line should publish a bounded source domain over the deconstructed source
objects.

Examples:

- a PDF source domain over clauses, tables, and spans
- a Scala source domain over packages, types, methods, and fields
- an FpML source domain over trade header, product surface, and legs

The downstream interpreted domain may then simplify or reinterpret that source
structure, but the published source domain remains explorable.

## Consequences

### Positive

- lineage and provenance start from stable source objects
- source decomposition stays reusable across many concrete documents or codebases
- bounded contexts remain explicit
- the system can preserve both source-truth structure and interpreted semantic
  truth without inventing a hidden middle layer

### Negative

- some lines will publish two domains instead of one
- build lines must be explicit about whether a source domain is required
- adapter output must be kept clearly subordinate to published domains

## Retained Evidence

In the historical FpML trade lane:

- the adapter is categorical:
  `build_tenants/python/code/odd_world_model/adapters/fpml_confirmation.py`
- the review observation is subordinate:
  `review/parsed_trade_observation.json`
- the build line publishes:
  - `fpml_confirmation_source_domain`
  - `trade_representation_domain`

This remains valid proving evidence for future PDF, Markdown, code, and
data-backed domain lines. The Python paths do not define the forward tenant.
