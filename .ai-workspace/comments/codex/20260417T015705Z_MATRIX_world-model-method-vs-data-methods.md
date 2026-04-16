# MATRIX: World Model Method Compared To Common Data Methodologies

**Author**: codex
**Date**: 2026-04-17T01:57:05Z
**Addresses**: `specification/INTENT.md`, `specification/PRODUCT.md`, `build_tenants/common/design/ATTRIBUTE_LEDGER_BUILD_LINE.md`, `build_tenants/common/design/MULTI_DOMAIN_MAPPING_LINE.md`, `/Users/jim/src/apps/specification_methodology/specification/standards/WORLD_MODEL_METHOD.md`, `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
**Status**: Draft

## Summary

This post compares `WORLD_MODEL_METHOD` with common data methodologies to
sharpen product distinction.

Current reality:

- `odd_domain` is being shaped as a world-model product, not as an ETL product,
  storage product, or reporting product
- `WORLD_MODEL_METHOD` can sit on top of ETL or ELT execution patterns
- the strongest build stack is still `WORLD_MODEL_METHOD` plus `ODD_METHOD`,
  built through `ODD_SDLC`

Target direction:

- keep semantic comprehension separate from deterministic execution
- describe world-model work as a semantic control plane
- leave downstream consumption open until the product line chooses a canonical
  serving or execution model

## Decision Table

| Method | Primary durable unit | What it optimizes | Where meaning lives | Traceability depth | LLM / AI role | Deterministic execution role | Consumption model | Relationship to `WORLD_MODEL_METHOD` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Classical ETL | job definitions, tables, files | repeatable movement and shaping of data | mostly in jobs, SQL, operator memory, and conventions | usually low to medium | optional helper outside the method | primary concern | usually fixed and explicit | `WORLD_MODEL_METHOD` can compile into ETL, but is not itself ETL |
| Data Lake | stored datasets across raw and refined zones | retention, replay, broad downstream access | distributed across files, catalogs, notebooks, and downstream readers | low unless strengthened externally | external or ad hoc | storage and processing are primary | broad but loose | world-model work can govern lake semantics, but the lake is not the semantic method |
| Warehouse + ETL Consumers | curated relational models, marts, reports | stable consumer-ready models | in warehouse models, BI logic, and reporting semantics | medium | usually over reports or curated tables | SQL and model execution are primary | explicit and mature | world-model work can compile into warehouse artifacts, but does not start from consumer views |
| Data Mesh | domain-owned data products | federated ownership and domain accountability | in each data product and its contracts | medium, varies by domain discipline | possible, but not constitutive | domain pipelines remain primary | explicit through product interfaces | world-model work can coexist with mesh; mesh solves ownership better than semantic depth |
| World Model Method | published semantic artifacts, ledgers, object cuts, treatments, composed world models | governed semantic comprehension | in published semantic truth built from traced source authority | high by design | first-class on the semantic control plane for correspondence and reasoning | downstream of accepted semantic understanding | not yet fixed in the current line | can sit above ETL, ELT, warehouse, or stream execution; best built as an ODD product through `ODD_SDLC` |

## Analysis

The main distinction is simple.

Classical data methods optimize movement, storage, shaping, and consumption.

`WORLD_MODEL_METHOD` optimizes governed understanding.

That changes the center of gravity:

- ETL asks how to move and transform data reliably
- lakes ask how to retain and expose data at scale
- warehouses ask how to serve known consumers
- mesh asks how to distribute ownership across domains
- world-model work asks what the system means, how its objects and treatments
  are bounded, what source authority supports each claim, and what deterministic
  execution should be compiled after that understanding is accepted

So the relationship is layered, not competitive.

`WORLD_MODEL_METHOD` can sit on top of ETL or ELT.

That is often the practical shape:

- source systems still emit records, events, APIs, files, and operational data
- ETL or ELT still move and reshape those artifacts
- the world model governs semantic understanding of those systems and their
  transformations
- accepted semantic understanding can later compile into deterministic ETL,
  SQL, mapping-tool assets, stream jobs, or other execution artifacts

The stronger coupling is not with ETL.

The stronger coupling is with `ODD_SDLC`.

That is the product-building stack:

- `WORLD_MODEL_METHOD` provides semantic law
- `ODD_METHOD` provides constructive product shape
- `ODD_SDLC` provides the governed build line for creating the product itself

One boundary remains intentionally open.

The current line does not yet define one canonical consumption model.

That is not a defect at this stage.

It means the product is being defined around:

- semantic publication
- composition
- traversal and query as a current delivery pillar
- downstream mapping and compilation

before freezing a single serving or consumer topology.

## Recommended Action

Use this distinction consistently in product prose:

- `WORLD_MODEL_METHOD` governs semantic truth
- ETL, ELT, warehouses, and stream jobs govern deterministic data-plane
  execution
- `ODD_SDLC` governs how the world-model product itself is built
- downstream consumption remains intentionally open in the current line

The sharp product sentence is:

`odd_domain` is not an ETL product, a lake product, or a warehouse product. It is a world-model product that governs semantic understanding and can later compile that understanding into deterministic high-volume execution.
