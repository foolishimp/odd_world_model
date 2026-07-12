# T-027 Uplift WM Intent And Product To The Current GTL/ABG/GLC Context-Memory Line

- id: T-027
- title: Uplift WM intent and product to the current GTL/ABG/GLC context-memory line
- type: feature
- ticket_category: intent_and_specification_uplift
- status: completed
- governance_method: STDO
- governance_scope: STDO Method — SPEC_METHOD, TICKET_METHOD, WORLD_MODEL_METHOD, sourced from /Users/jim/src/apps/specification_methodology/specification/standards/
- ticket_role: uplift carrier AND dormancy-recovery context anchor — this ticket is the context reference point for future WM work sessions
- method_stack: SPEC_METHOD, TICKET_METHOD, DESIGN_MODULE_METHOD, ODD_METHOD, WORLD_MODEL_METHOD
- goal: proving-wave-07
- change_intent: reprice odd_world_model as a GLC-specialized governed memory bank for versioned, bounded, loss-declared LLM context over the current published GTL/ABG/GLC contract boundary, without constitutionally tethering WM to a release number or storage technology
- change_class: intent_reprice
- re_entry_point: specification/INTENT.md
- triaged_at: 2026-07-12
- priority: high
- review_status: accepted_by_F_H
- dependencies: none — this specification uplift precedes realization work
- affected_tickets: T-026 (active TS rebuild carrier; re-bases on this ticket's grounding), T-023 (mesh context boundary)
- links: basis:specification/PRODUCT.md, basis:specification/GOALS.md, basis:specification/INTENT.md, basis:specification/requirements/05-product-definition-authority.md, basis:specification/requirements/25-governed-context-memory-capability.md, basis:specification/requirements/35-governed-context-memory-constraints.md, basis:specification/requirements/50-odd-method-gtl-carrier.md, basis:specification/requirements/95-release-installation-governance.md, basis:build_tenants/TENANT_REGISTRY.md, basis:build_tenants/typescript/design/adrs/ADR-001-typescript-gtl-abg-tech-stack.md, basis:.ai-workspace/tickets/active/T-026-rebuild-world-model-in-typescript-tenant.md, basis:/Users/jim/src/apps/specification_methodology/specification/standards/authority_compressions/stdo_compressed.md, basis:/Users/jim/src/apps/abiogenesis/specification/PRODUCT.md, basis:/Users/jim/src/apps/abiogenesis/docs/ABIOGENESIS_RC_RELEASE_NOTE.md, basis:/Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-EVENTS.md, basis:/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-221-close-exact-4-6-prior-release-boundary.md, basis:/Users/jim/src/apps/odd_glc/specification/PRODUCT.md, basis:/Users/jim/src/apps/odd_glc/.ai-workspace/tickets/completed/T-036-cut-odd-glc-0-1-0.md
- intake_source: F_H owner direction — WM blurs application, data, and processing into a governed memory bank for LLM context; keep GTL/ABG and GLC dependency versions floating because abiogenesis 5.0 and GLC 1.0 are active lines; use the released 4.6/0.1 pair as current grounding evidence, not constitutional tether; every concrete build/proof/release/install records its exact resolution; WM builds on top of GLC, specialized to a domain; driving use case is `/Users/jim/src/apps/odd_trading_eval/specification`
- affected_boundary: odd_world_model intent, product, and requirement surfaces versus the published substrate/lifecycle contracts and the governed LLM-context consumption boundary
- release_scope: none frozen — no WM release cut is claimed, qualified, or scheduled by this ticket
- created_at: 2026-07-12
- updated_at: 2026-07-12 (owner context-memory and floating-version rulings incorporated)
- closed_at: 2026-07-12
- terminal_disposition: specification_reprice_accepted

## Context Capsule (cold-start reference)

This project has been dormant since 2026-05-15. This section deliberately
carries more context than a normal ticket so that a fresh agent or operator
can reload the whole project from this ticket alone. It is a read model:
where the capsule and the live specification disagree after the uplift lands,
`specification/` wins.

### What odd_world_model is

`odd_world_model` (WM) is a systems world model: it builds a model of a
system from its entities plus all the lawful actions available to manipulate
them. The instinct is object-oriented — objects with behavior — corrected by
the lessons of DDD: bounded contexts, published language, and local authority
instead of a naive global object graph. Entities may converge into candidate
Markov-object cuts — stable identity directions plus distributed evidence and
admissible treatment/transition surfaces — derived from source code AND from
business process documents and standards, so the model captures what the
system does and what the business lawfully means by it. Formal statistical
Markov-object status remains reserved for cuts that pass the current method's
conditional-independence promotion gate. The LLM is used as a mapper that
projects world-model objects into technology
frameworks (schemas, API contracts, mapping documents, `dbt` transforms,
covariant streams) under F_D-checkable constraint: the LLM proposes,
deterministic machinery and ABG admission make truth. WM builds ON TOP of
`odd_glc`, specialized to this domain through GLC's Downstream Program
Contract, and sits upstream of `data_mapper`, supplying the Markov objects
and covariance structure from which `data_mapper` emits lawful covariant
streams.

WM also blurs the traditional application/data/data-processing boundary at the
LLM context surface. Code, records, events, documents, transformations, and
published semantic cuts become one governed memory bank while retaining their
source authority. Each invocation consumes an exact bounded mesh cut through a
versioned context basis with declared freshness, fidelity, loss, omissions,
and gaps. Candidate Markov-object cuts provide recoverable semantic compression;
the LLM consumes deterministic basis identity and produces an F_P proposal.

The spec's own framing (`specification/PRODUCT.md`): a federated world-model
mesh, not a central monolith — teams publish bounded world-model fragments
and higher-order views are stitched without erasing local authority — defined
by the semantic chain
`source observation -> traced evidence -> assured claim -> attribute ledger
-> immutable object cut -> published domain artifact -> composed world model
-> typed mesh -> bounded mesh cut -> context basis/projection or query/proof
projection -> attributed output`.

### Driving use case

`odd_trading_eval` (`/Users/jim/src/apps/odd_trading_eval/specification`) is
the current concrete use case driving this general-purpose uplift: WM tech is
used to derive trade world models — bounded contexts, Markov objects,
treatments, covariance — from existing trading-system code. The
general-purpose product is developed against that named pressure, per the
STDO lifecycle-signal law: product development is driven by named operational
pressure, not speculation. It also answers odd_trading_eval's known
"treatment authorship at scale" risk directly: WM derivation-from-code is the
treatment-authoring machine.

### Dormancy state — what was true when work stopped

- The specification is dated 2026-05-15 (`specification/PRODUCT.md` header);
  the active goal wave is proving-wave-07 (`specification/GOALS.md`),
  explicitly specification-first.
- T-026 is the in-flight TS rebuild carrier
  (`.ai-workspace/tickets/active/T-026-rebuild-world-model-in-typescript-tenant.md`).
  Its realized slice is a deterministic filesystem runner whose own README
  (`build_tenants/typescript/README.md`) declares it "not the final
  ABG-backed graph execution path" — open drift against ADR-001's
  GraphFunction carrier law
  (`build_tenants/typescript/design/adrs/ADR-001-typescript-gtl-abg-tech-stack.md`).
- The installed governance line records
  `@abiogenesis/typescript-tenant@3.7.1-rc.3`
  (`.ai-workspace/runtime/odd_sdlc-typescript-installation.json`) — three
  substrate lines behind current law.
- The Python tenant (`build_tenants/python/`) is a frozen reference:
  `build_tenants/TENANT_REGISTRY.md` classifies it historical
  active/reference, retained as executable comparison evidence with no
  forward implementation work.

### Substrate ground truth as of 2026-07-12

- **ABG**: there is no final 4.6.0. `4.6.0-rc.3` is the exact immutable
  predecessor product — abiogenesis T-221 closed `abandoned_and_rebound`
  under `DEC-5.0-PROP-001` — so "grounded on 4.6" means grounded on the
  4.6-generation law rc.3 publishes. The ABG 5.0 target is in an active
  constitutional course correction; no released successor currently replaces
  rc.3 as the consumed immutable substrate.
- **GLC**: `odd_glc 0.1.0` is released (odd_glc T-036,
  `@odd-glc/route-one-typescript 0.1.0`, tag `v0.1.0`), exact-compatible
  with ABG `4.6.0-rc.3` only — it publishes no API-stability promise and no
  compatibility range. That constrains today's concrete resolution; it does
  not pin WM's constitutional dependency law (recorded in Gaps below).
- The full consumed-contract capture with citations is this ticket's
  "Ground Truth Consumed" section.

### Sibling topology

- `/Users/jim/src/apps/abiogenesis` — GTL/ABG substrate WM consumes: the
  runtime kernel owning traversal, admission, events, and projection.
- `/Users/jim/src/apps/odd_glc` — the generic lifecycle layer; WM's base
  layer via the Downstream Program Contract.
- `/Users/jim/src/apps/odd_sdlc` — the governance product; this workspace is
  governed by `odd_sdlc.TS` (see `CLAUDE.md` in the repo root).
- `/Users/jim/src/apps/odd_manager` — observer/browser surface over
  ai-workspace and proof truth.
- `data_mapper` — downstream consumer of WM's Markov objects and covariance
  for lawful covariant streams; no checkout exists under
  `/Users/jim/src/apps` at capsule time — it is known here through WM spec
  references (`specification/PRODUCT.md`, `specification/INTENT.md`,
  `specification/requirements/10-world-model-object-representation.md`).
- `/Users/jim/src/apps/specification_methodology` — shared method law source
  (SPEC_METHOD, TICKET_METHOD, WORLD_MODEL_METHOD, and the rest of the
  standards line).

### Reload order for a cold session

1. This ticket, end to end.
2. `/Users/jim/src/apps/specification_methodology/specification/standards/authority_compressions/stdo_compressed.md`
   — the STDO compression; verify its `source_digests` against the full
   standards before trusting it (it declares itself stale if a source digest
   changes).
3. WM constitutional surfaces: `specification/GOALS.md`,
   `specification/INTENT.md`, `specification/PRODUCT.md`.
4. `.ai-workspace/tickets/active/T-026-rebuild-world-model-in-typescript-tenant.md`
   — the active realization carrier this ticket re-bases.
5. `/Users/jim/src/apps/abiogenesis/specification/PRODUCT.md` and
   `/Users/jim/src/apps/abiogenesis/docs/ABIOGENESIS_RC_RELEASE_NOTE.md` —
   substrate contract and rc.3 identity.
6. `/Users/jim/src/apps/odd_glc/specification/PRODUCT.md` and
   `/Users/jim/src/apps/odd_glc/.ai-workspace/tickets/completed/T-036-cut-odd-glc-0-1-0.md`
   — base-layer contract and the 0.1.0 release claim.

### Standing owner laws that bind here

- **Triage-first tickets**: every ticket opens with a performed intake
  triage — substantive-pressure judgment, boundary, upward-propagation walk
  to the first missing layer, derived change class, re-entry point, affected
  span, release scope. Pro forma triage fields are a defect.
- **F_D/F_P boundary**: F_D carries mechanical truth only; LLM semantic work
  is F_P over declared calibration. F_D drift into F_P responsibility is
  constitutional failure — harness LLMs, never replace them. WM's
  LLM-as-mapper identity lives or dies by this boundary.
- **Fix the framework, never the scenario**: when live gates fail, the
  GTL/ABG/GLC framework is fixed; scenarios are never patched around.
- **The specification is constitutional**: `specification/` is the truth
  surface; tickets (including this one) and code are not. This capsule and
  everything else in this ticket are read models over that authority.

## Intake Triage

This triage is performed, not pro forma. Each judgment below was made against
the cited ground-truth surfaces read at intake.

### 1. Is the pressure substantive?

Yes. The WM specification was written 2026-05-15 against an ABG 3.x-era
substrate: the installed governance line records
`package:@abiogenesis/typescript-tenant@3.7.1-rc.3`
(`.ai-workspace/runtime/odd_sdlc-typescript-installation.json`), and no file
under `specification/` mentions odd_glc, abiogenesis 4.x, or any 4.6-law
surface (verified by search at intake). Since then two substrate facts changed
constitutionally:

- **ABG 4.6 law exists.** The 4.6 generation publishes law WM's spec does not
  know: the deterministic witness/operator/observer/tuner substrate with the
  published witness-act family (`reprice`, `attest`, `hygiene-stamp`,
  `intake`, `run-resumed`, `run-stopped`); the published runtime event-kind
  census as a versioned conformance contract (REQ-R-ABG3-EVENTS-029,
  `RUNTIME_EVENT_KIND_VALUES` through the released `./abg/m03` package export);
  governed plugin seams (`plugin.transform.C`, `plugin.evaluate.C`,
  `plugin.consequence.C`) with catalog-resolved, capability-gated selection;
  the conformance proof verb (`typecheck-gtl-program` /
  `typecheckGtlProgram(...)`); the seven-term C authoring algebra; the Public
  Operator Contract verb families; and typed contract modules through the
  released package exports. Exact per-verb operator contracts and a resolvable
  schema/public-contract catalog are not published by rc.3 and remain named
  upstream gaps.
- **GLC exists as the lifecycle layer WM should sit above.** `odd_glc 0.1.0`
  is a real released cut (odd_glc T-036: `@odd-glc/route-one-typescript
  0.1.0`, release commit `a878475e`, tag `v0.1.0`, exact-compatible with ABG
  `4.6.0-rc.3`). Its PRODUCT.md publishes exactly the generic-lifecycle /
  domain-specialization split WM's product definition should be consuming:
  GLC owns generic lifecycle meaning at any scale; downstream programs
  specialize it with domain assets, schemas, policies, evidence expectations,
  and semantic proof interpretation, while GTL/ABG keep all runtime truth.

A specification that does not know its own base layer exists is a substantive
product-definition defect, not a documentation nit.

### 2. Where is the boundary?

The boundary is WM's specification surface versus the published contracts of
its substrate and lifecycle layers:

- WM `specification/*` (spec-owned, this ticket's mutation surface)
- abiogenesis published contracts: PRODUCT.md operator contract, EVENTS-029
  census, plugin-seam law, conformance surface, published-contract schema law
  (consumed, never edited here)
- odd_glc published contracts: PRODUCT.md constitutional position,
  product-owned surfaces, Downstream Program Contract, 0.1.0 release claim
  (consumed, never edited here)

No abiogenesis or odd_glc file is in scope for mutation. Gaps found in their
published surfaces are recorded as Gaps with owners, not patched from WM.

### 3. Upward-propagation walk

Walking the STDO chain from the symptom upward to the first missing layer:

- **Code/Tests**: the TS tenant slice is a deterministic filesystem runner
  (`build_tenants/typescript/README.md` states it is "not the final
  ABG-backed graph execution path") — drift vs ADR-001, but a symptom.
- **Design**: ADR-001 binds to GTL `GraphFunction`/`Job`/`Module` law from the
  3.x-era builder guide — stale, but derivable from spec once spec is right.
- **Requirements**: families 05/50/95 carry no GLC consumption law or current
  conformance/census/witness law, and no family defines context basis,
  loss-declared projection, invocation lineage, or staleness — stale, but
  downstream of Intent and Product.
- **Product**: `specification/PRODUCT.md` does not know GLC exists as WM's
  base layer, states no substrate-generation grounding, and does not define
  governed LLM context memory.
- **Intent**: the existing purpose externalizes expert understanding but does
  not state that WM unifies application, data, and processing evidence into a
  governed memory bank for LLM context. **This is the first missing layer after
  the owner's context-memory ruling.**
- Goals remain valid: proving-wave-07 is specification-first and already calls
  for the full technology-independent product definition.

⇒ **Derived change class**: `intent_reprice`; Product and affected requirements are
re-derived downstream inside that one change span.
⇒ **Re-entry point**: `specification/INTENT.md`.

### 4. Affected span

- `specification/INTENT.md` (primary re-entry)
- `specification/PRODUCT.md` (product shape derived downstream)
- `specification/requirements/05-product-definition-authority.md` — grounding
  and version law become product-definition authority
- `specification/requirements/10-world-model-object-representation.md` — the
  current set-membership blanket wording is repriced to candidate identity-
  projection law from current `WORLD_MODEL_METHOD.md`
- `specification/requirements/25-governed-context-memory-capability.md` and
  `35-governed-context-memory-constraints.md` — exact context basis,
  loss-declared projection, semantic compression, invocation lineage,
  staleness, and no-hidden-context law
- `specification/requirements/30-domain-build-and-composition-constraints.md`
  and `40-domain-build-verification.md` — F_P proposal/F_D checking, ABG
  admission, and candidate-status proof are made explicit
- `specification/requirements/50-odd-method-gtl-carrier.md` — GTL carrier law
  restated against the 4.6 surface (GraphFunction carrier, conformance verb,
  event census, plugin seams)
- `specification/requirements/95-release-installation-governance.md` —
  installed-builder provenance must record consumed substrate/GLC identities
- `specification/scenarios/20-generated-uat-testcases.md`,
  `30-generated-testcase-authority.md`, and `40-generated-scenarios.md` —
  re-derive acceptance trace for the repriced obligations
- other requirement families (00/10/20/30/40/60/70/80/90) swept for stale
  substrate assumptions; repriced only where the walk finds pressure
- `build_tenants/TENANT_REGISTRY.md` — records the tenant line's substrate
  grounding note (registry note only; no tenant work authorized)
- T-026 — interaction: continues as the TS rebuild carrier, re-based on this
  ticket's grounding (see Repricing Intent d)

### 5. Release scope

None frozen. This ticket authorizes specification uplift only. No WM release
cut, no realization work, no substrate or GLC change.

## Ground Truth Consumed

Every claim below cites its published source. This section is the contract
capture the reprice writes against.

### ABG 4.6 — what "grounded on 4.6" concretely means

- **There is no final 4.6.0.** Abiogenesis T-221 closed
  `abandoned_and_rebound` under `DEC-5.0-PROP-001`: `4.6.0-rc.3` is the exact
  immutable predecessor product (P4), package
  `@abiogenesis/typescript-tenant@4.6.0-rc.3`, tag `v4.6.0-rc.3`,
  deterministic suite 1430/1430. A consumer "grounded on 4.6" is grounded on
  the 4.6-generation law as published by rc.3, not on a tapped 4.6.0.
  (Source: `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-221-close-exact-4-6-prior-release-boundary.md`.)
- **Witness family**: deterministic witness/operator/observer/tuner substrate
  retained from T-217; `witness <act>` admits operator-witnessed acts
  (`reprice`, `attest`, `hygiene-stamp`, `intake`, `run-resumed`,
  `run-stopped`) as events in the same append-only stream. (Sources: rc.3
  release note; abiogenesis PRODUCT.md Public Operator Contract.)
- **Event census law**: REQ-R-ABG3-EVENTS-029 makes the complete runtime
  event-kind union a published, versioned conformance contract — a conformant
  tenant produces exactly the census kinds under the canonical envelope, no
  missing kinds, no extras, no rival envelope; authoritative roster is
  `RUNTIME_EVENT_KIND_VALUES` reachable from the released `./abg/m03` package
  export.
  (Source: `/Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-EVENTS.md`.)
- **Plugin seams**: declared plugin selection resolves governed seam
  references through the standard catalog; seams are `plugin.transform.C`,
  `plugin.evaluate.C`, `plugin.consequence.C`; plugins propose, ABG admission
  makes truth; plugins do not write ledgers, emit runtime events, or dispatch
  workers. (Sources: rc.3 release note; abiogenesis PRODUCT.md.)
- **Conformance surface**: `typecheck-gtl-program` is the public conformance
  proof verb, the operator binding of the programmatic `typecheckGtlProgram(...)`
  surface. (Source: abiogenesis PRODUCT.md.)
- **Operator and target contract on rc.3**: the Product at tag
  `v4.6.0-rc.3` publishes `start`, `gaps`, `assess-result`, `witness`,
  `observe`, `tune`, `typecheck-gtl-program`, and the install-time verbs
  `context-bootstrap`, `install`, `gen-config`, and `release-snapshot` as its
  public verb families. `start` accepts `next`,
  `graph_function:<published_handle>`, and conditionally
  `asset:<published_handle>`. The rc.3 CLI resolves a graph-function target
  through the exact workspace binding's declared `runtimeRegistryStartup`
  catalog; the GTL `Module` constructor requires jobs and candidate families
  to reference graph functions published by that module. This is a real
  binding-declared target catalog, but it is not the later standalone catalog
  product or graph shell. (Sources: abiogenesis PRODUCT.md at
  `v4.6.0-rc.3`, `Public Operator Contract` and `Canonical GTL Topology
  Anchors`; package sources `code/src/cli/command.ts` and
  `code/src/gtl/m02/contracts/constructors.ts` at that tag.) The rc.3 release
  note explicitly excludes ABG 5.0 catalog, graph-shell, marketplace,
  broad-public-consumption, and self-hosting claims. The exact per-verb
  flags/defaults/output/exit contract also remains an rc.3 gap. WM must not
  import the broader mutable 5.0 Product vocabulary into rc.3 evidence.
- **Published-contract schema law**: exact wire and serialization authority for
  rc.3 is the typed contract modules reachable from the released package
  exports (`.`, `./gtl/m01`, `./gtl/m02`, `./abg/m03`, and
  `./abg/m03/transport`). Runtime shape and source paths are not schema
  authority. A resolvable `schema://` registry or later public-contract catalog
  is not an rc.3 claim. (Source: abiogenesis PRODUCT.md at `v4.6.0-rc.3`.)
- **Authoring algebra**: the seven-term C authoring algebra (`C.of`, `C.id`,
  `C.compose`, `C.edge`, `workflow.C`, `C.batch`, `C.retry`) with typed native
  and raw-admission rejection of category errors. (Source: rc.3 release note,
  T-220.)

### GLC 0.1 — what WM builds on top of

- **Release state**: `odd_glc 0.1.0` is released (T-036, completed
  2026-07-11): `@odd-glc/route-one-typescript 0.1.0`, release commit
  `a878475e4609e2d74d3260eb36ee05c4657b1879`, branch `release/0.1.0`, tag
  `v0.1.0`, exact-compatible with ABG `4.6.0-rc.3`, installed-product Hello
  World proof run `20260711T042644380Z_pid39224`. Its explicit exclusions: no
  API-stability promise, no general ABG compatibility range, no standalone
  GLC runtime or CLI. (Source: `/Users/jim/src/apps/odd_glc/.ai-workspace/tickets/completed/T-036-cut-odd-glc-0-1-0.md`.)
- **What it publishes**: lifecycle vocabulary and node declarations,
  lifecycle/software-build overlays and startup bindings, policy data,
  substrate provenance, and read-only lifecycle interpretation. ABG remains
  the runtime. (Source: T-036 release claim.)
- **Constitutional position**: GLC owns generic lifecycle meaning over
  admitted GTL/ABG truth at any scale (task through portfolio, nesting over
  ABG zoom-frame/graph-span/foldback truth). It is domain-agnostic; "software
  delivery, world-model construction, trading evaluation ... may specialize it
  without changing its generic lifecycle law." GLC owns no systems
  functionality: GTL is declarative syntax, ABG is the runtime kernel, GLC is
  domain-agnostic lifecycle knowledge. (Source: `/Users/jim/src/apps/odd_glc/specification/PRODUCT.md`.)
- **Downstream Program Contract**: a downstream program specializes GLC by
  adding domain-specific assets, schemas, policies, evidence expectations,
  and semantic proof interpretation — and must still use GTL/ABG for graph
  structure, traversal, execution, admission, evidence, fold, residual,
  continuation, replay, and re-entry truth. This is constitutional source law
  at `v0.1.0`; the 0.1.0 package file list does not install the contract as a
  separately addressable asset. (Source: GLC PRODUCT.md and T-036.)
- **Typed lifecycle asset surface**: the lifecycle surface classification
  (`LifeCycleWorksiteAsset`, `LifecycleContextAsset`, `IntentAsset`,
  `ProductDefinitionAsset`, `RequirementSetAsset`, view assets over ABG
  requirement-environment/destination-topology/evidence-binding/assurance-fold/
  residual projections, `ReentryDecisionAsset`) is published as labels and
  queries over GTL/ABG truth, not as native carriers. (Source: GLC PRODUCT.md.)

### WM intake state

- At intake, the spec was dated 2026-05-15; the installed substrate pin was
  `@abiogenesis/typescript-tenant@3.7.1-rc.3`; zero mentions of odd_glc or
  4.6-generation law anywhere under `specification/`.
- T-026 is the active TS rebuild carrier; its ADR-001 binds the tenant to
  `GraphFunction`/`Job`/`Module` publication with ABG owning traversal.
- The realized TS slice is a deterministic filesystem runner that its own
  README declares "not the final ABG-backed graph execution path" — open
  drift against ADR-001's GraphFunction carrier law.

## Repricing Intents

### (a) WM layers on top of GLC as a domain-specialized product

The uplifted PRODUCT.md SHALL state that `odd_world_model` is a downstream
domain specialization of `odd_glc`: GLC owns generic lifecycle
meaning; WM owns world-model domain meaning. Concretely, WM's domain layer is:

- **entities and lawful actions**: bounded contexts in the DDD sense, world-model
  objects, treatment surfaces, covariance edges, adjoint mappings — the
  domain's things and the actions that are lawful over them;
- **candidate Markov-object cuts as identity/transition carriers**: immutable
  object cuts projected from the attribute ledger, carrying identity,
  distributed evidence, state, and treatment/transition semantics derived from
  source code, business documents, and standards. They remain candidate-class
  until the current method's conditional-independence promotion gate passes;
- **LLM-as-mapper under F_D-checkable constraint**: probabilistic workers
  (F_P) project world-model objects into technology frames (schemas, API
  contracts, mapping documents, `dbt` transforms, covariant streams) only
  under contracts whose outputs deterministic machinery (F_D) and ABG
  admission can check; the LLM proposes, admission makes truth.

WM enters GLC through GLC's Downstream Program Contract: domain assets,
schemas, policies, evidence expectations, and semantic proof interpretation.
WM SHALL NOT re-own anything GLC or the substrate owns: no lifecycle
vocabulary of its own where GLC's applies, no runtime, no local
ledger/retry/closure machinery, no second traversal controller.

### (b) Grounded on the current published GTL/ABG contract

The uplifted specification SHALL carry the stable substrate obligations
established by the current published contract captured above: the event census as a conformance
contract (EVENTS-029), the witness family, governed plugin seams, the public
operator verb families with `GraphFunction` as the sole named callable
carrier, the `typecheck-gtl-program` conformance verb, and the
typed-package-contract schema law. Requirement family 50 (GTL carrier) is the
primary carrier of this restatement; family 95 carries the provenance
obligations (installed builder projects record exact consumed substrate and
GLC identities).

### (c) Version law — floating constitution, exact artifact evidence

The uplifted PRODUCT.md SHALL declare WM's version posture:

> `odd_world_model` names the GTL/ABG and GLC contracts it consumes, not a
> constitutional dependency version. Mutable development may resolve governed
> development or released dependency products through those contracts and
> must honor the compatibility declared by that resolution. Every concrete build,
> proof, release, and install records the exact package, version, source or tag,
> manifest, and digest identities it used. Those evidence identities never
> become timeless WM product law.

Today the exact released grounding evidence resolves to `odd_glc 0.1.0` over
`abiogenesis 4.6.0-rc.3` (the immutable predecessor; no final 4.6.0 exists).
ABIogenesis 5.0 and GLC 1.0 may replace that resolution without a WM product
reprice when their published contracts preserve WM's declared ownership and
behavioral boundary. A changed contract still enters through normal triage.

### (d) Supersede T-026's substrate pin assumption

T-026 was triaged against the 3.7.1-rc.3-era installed line. This ticket
supersedes that grounding assumption only. T-026 continues as the TS rebuild
carrier — its requirement-first re-entry, tenant selection, ADR set, and
retained-example scope stand — but it re-bases on this ticket's grounding:
its remaining design and realization work targets the floating contract
boundary under intent (c), not the 3.7.1-rc.3 install. Each concrete T-026
build or proof records the exact dependency resolution it exercises. A
re-basing note is added to T-026 recording this interaction. No other
part of T-026 is repriced here.

### (e) Close the ADR-001 drift honestly

The current TS slice is a deterministic filesystem runner, which ADR-001's
own law classifies as not the constructive carrier. The uplift SHALL restate
the GraphFunction carrier obligation against the 4.6 GTL surface in
requirement family 50: constructive world-model work is carried by published
`GraphFunction` declarations reached through the public operator contract
(`start` targeting `graph_function:<published_handle>` through the published
catalog), conformance-checkable via `typecheck-gtl-program`, with tenant
events conforming to the EVENTS-029 census. The filesystem runner is
recorded as retained comparison evidence, not as carrier realization. Closing
the drift in code is T-026 realization work, not this ticket's.

### (f) WM is governed context memory for LLMs

The uplifted Intent and Product SHALL state the owner framing directly:

> WM blurs application, data, and data processing into a governed memory bank
> for LLM context.

The blur occurs at the context-consumption boundary, not at source authority.
Code, records, events, documents, transformations, and published semantic cuts
become governed context evidence while retaining distinct provenance,
authority, and temporal coordinates.

Each governed invocation consumes a context projection over an exact bounded
mesh cut. Its context basis records exact node/link refs and digests, purpose,
scope, closure, temporal coordinates, projection contract, freshness,
fidelity, loss, exclusions, truncation, and unresolved gaps. Candidate
Markov-object cuts and related semantic surfaces provide recoverable
compression without gaining established epistemic status. Every output records
its basis, model/invocation identity, digest, and admission state; the LLM
output remains an F_P proposal.

The hand-built `stdo_compressed.md` authority asset is current precedent: it
declares source refs, source digests, a compression profile, prompt consumers,
and a staleness rule. WM generalizes that contract. Iceberg snapshots, Git
history, object stores, databases, vector indexes, and prompt renderers are
candidate realization mechanisms, not Product law.

## Closure Law

This ticket closes only when:

1. `specification/INTENT.md`, `specification/PRODUCT.md`, and the affected
   requirement families (05, 10, 25, 30, 35, 40, 50, and 95 at minimum;
   others where the sweep finds pressure) are
   present-tense against the current published GTL/ABG/GLC contract boundary,
   with floating constitutional dependencies and no "will adopt" language for
   consumed law that is already published;
2. every consumed contract in the uplifted spec is cited to its published
   source (abiogenesis PRODUCT.md section, REQ-R-ABG3-* requirement, rc.3
   release note, T-221 disposition, GLC PRODUCT.md section, GLC T-036
   release claim);
3. anything WM needs that the substrate or GLC lines do not yet publish is
   recorded as an explicit Gap with a named owner (see Gaps), never silently
   assumed or locally compensated;
4. UAT, product-scenario, and testcase-authority surfaces trace the repriced
   substrate, Markov, mesh, and context-memory obligations without claiming
   realization proof;
5. the T-026 re-basing note exists and T-026's metadata reflects it;
6. `build_tenants/TENANT_REGISTRY.md` carries the grounding note;
7. no realization work beyond specification is performed or claimed —
   design, tenant code, runtime bindings, and proof runs stay with T-026 and
   successors.

## Gaps (recorded at intake; extended during slice 1)

- **No final ABG 4.6.0 exists.** rc.3 is the immutable predecessor; the 4.6
  window closed `abandoned_and_rebound`. WM's current released grounding
  evidence resolves to an RC-identity substrate cut. The next ABIogenesis release line is under
  T-242/T-249 course correction. Owner: abiogenesis. WM states the current
  resolution without predicting the successor identity.
- **GLC 0.1.0 publishes no API-stability promise and no compatibility
  range.** Today's concrete build resolution must therefore honor its exact
  ABIogenesis peer constraint. Owner: odd_glc (future release policy). WM
  records that artifact constraint without turning it into constitutional
  version law.
- **GLC world-model-domain specialization is asserted generically, not yet
  proven.** GLC PRODUCT.md names world-model construction as a
  specializable domain, but no WM-shaped specialization proof exists on the
  0.1 cut. Owner: shared — WM (this line's successors) over GLC's
  specialization seam (GLC T-018 lineage).
- **GLC 0.1.0 does not install its Downstream Program Contract as a packaged
  contract asset.** The contract is citable constitutional source law at tag
  `v0.1.0`, while the package exports route-one declarations/read models and
  provenance only. Owner: odd_glc release/product packaging. WM cites rather
  than republishes GLC law.
- **ABIogenesis rc.3 has a binding-declared graph-function target catalog but
  no complete addressable contract/catalog product.** `start` can resolve a
  `graph_function:<published_handle>` through the exact workspace binding's
  `runtimeRegistryStartup`, and the released GTL module contracts can publish
  graph functions and jobs. The RC does not publish the later standalone
  catalog operations/product, graph shell, broad public-consumption contract,
  exact per-verb contracts, or resolvable `schema://` registry. Owner:
  abiogenesis successor line. WM may prove the exact rc.3 binding-declared path
  or defer for the successor; it must not infer the excluded 5.0 surfaces.
- **Markov-object statistical closure is not established.** Current
  `WORLD_MODEL_METHOD.md` requires candidate-class publication until the
  direction-native conditional-independence promotion gate succeeds. Owner:
  WM requirement/proof line; this ticket reprices representation and proof law,
  while realization stays with T-026 or a named successor.
- **Governed context memory has no current realization proof.** The existing
  TypeScript slice does not publish a context basis, loss-declared context
  projection, invocation record, or staleness result. Owner: T-026 realization
  and proof. This ticket defines WHAT only.
- Any further consumed contract found `missing`, `placeholder`, or unpublished
  on the exact cuts SHALL be added here with an owner, following GLC's own
  defer/block/reprice rule rather than compensating locally.

## Execution Plan

1. **Substrate/GLC contract capture** — freeze the consumed-contract table:
   exact published sources, identities, and section citations for every 4.6
   and GLC-0.1 surface WM consumes; extend the Gaps table with owners.
2. **INTENT and PRODUCT reprice** — define GLC-downstream product position
   (intent a), current contract grounding (intent b), floating version law
   (intent c), and governed context memory (intent f) while preserving the
   semantic chain, one truth surface, federated mesh, candidate Markov-object
   status, and F_P/F_D/admission boundary.
3. **Requirement family reprice** — reprice 05 (floating dependency and exact
   artifact-evidence law), 10 (candidate identity-projection law), add 25/35
   (context memory capability and constraints), 30/40 (F_P proposal,
   deterministic checking, ABG admission, and proof status), 50 (GTL carrier
   restated on the rc.3 surface), and 95 (exact release/install dependency
   provenance); sweep remaining families and reprice only where the walk finds
   pressure.
4. **Acceptance trace reprice** — update the specification UAT, product
   scenario, and testcase-authority surfaces for the new obligations without
   editing realization design or claiming proof.
5. **T-026 re-basing note** — record the interaction of intent (d) in T-026
   and in this ticket's closure evidence.
6. **F_H review** — owner reviews the uplifted specification against this
   ticket's closure law; residuals become successor tickets, not silent debt.

## Current Execution State

The specification reprice is implemented across Intent, Product, requirements,
and constitutional acceptance surfaces. T-026 and the tenant registry carry
the downstream grounding interaction. No design or runtime realization is
claimed.

Validation completed on 2026-07-12:

- all requirement refs used by specification scenarios resolve to live
  requirement IDs;
- no duplicate requirement, UAT, or product-scenario IDs were introduced;
- every new or repriced T-027 requirement is represented in UAT, product
  scenario, and testcase-authority surfaces;
- `stdo_compressed.md` source digests match all five current source standards;
- `git diff --check` passes; and
- the retained TypeScript test lane passes 2/2 as regression evidence only.

Claude's concurrent storage-stack strategy post is retained as possible T-026
design input, not as T-027 realization authority. Codex review
`20260711T174718Z_REVIEW_claude-wm-storage-stack-boundary.md` records the
required semantic-cut/snapshot, F_P/write, and WM/ABG ownership corrections.
That strategy post does not substitute for adversarial review of the uplifted
Intent, Product, and requirement surfaces. The later Claude queue review found
one valid exact-cut issue: the first contract capture had mixed broader mutable
ABI 5.0 operator/catalog vocabulary into rc.3 grounding. That issue is repaired
above and reviewed in
`20260711T181643Z_REVIEW_t027-closure-and-queue-triage.md`.

F_H accepted and closed T-027 on 2026-07-12 after the exact rc.3
operator/catalog repair. F_H also selected the exact rc.3 GraphFunction family
as the next proving substrate rather than waiting for the successor catalog.
The rationale is incremental concept testing: current work is deliberately
bounded and designed for straightforward migration, so waiting would defer
learning without changing the Product contract. Context-memory realization and
proof remain T-026 work.

## Out Of Scope

- any abiogenesis or odd_glc change (gaps are recorded with owners, upstream)
- tenant design, code, runtime bindings, installs, or proof runs (T-026 line)
- closing the filesystem-runner drift in code (T-026 realization)
- any WM release cut or qualification
- T-023 mesh design/realization/proof and T-024 operational-semantics
  enrichment scope; T-023's specification reprice remains a separate carrier
