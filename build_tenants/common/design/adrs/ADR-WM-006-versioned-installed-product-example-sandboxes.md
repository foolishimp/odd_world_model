# ADR-WM-006: Versioned Installed-Product Example Sandboxes

**Status**: Accepted by F_H direction for reference-product proving
**Date**: 2026-07-12
**Ticket**: T-031
**Decision class**: Design reframe

## Context

The retained example domains already separate shared source authority from
generated sandbox cuts:

```text
examples/<domain>/sources/
examples/<domain>/sandbox/<cut>/
```

That shape is useful because the same source corpus can be rebuilt by multiple
`odd_world_model` versions. The retained Python and early TypeScript cuts do
not, however, prove a deployed-version boundary. Their manifests point back to
the mutable source workspace, omit exact product and dependency digests, and
the historical TypeScript runner wrote local pass events instead of preserving
runtime evidence.

The product specification already requires a released builder product,
project-local source configuration, exact dependency locks, source-workspace
isolation, and retained-corpus proof. This ADR chooses the realization shape.

## Decision

### 1. Sandbox identity

A sandbox is an immutable world-model **instance cut** produced by one exact
installed product over one exact source inventory. It is not the product, the
release cut, or the mutable source project.

New cuts retain the existing location:

```text
examples/<domain>/sandbox/<run-time>_<wm-product-version>.<tenant>/
```

The directory name is for navigation. `wm-instance.json` is the prime identity
surface. It binds:

- instance and interaction-goal identity;
- exact source-inventory ref and digest;
- exact installed-product manifest ref and digest;
- WM product version, artifact digest, and release/development status;
- exact GTL/ABG, GLC, storage, and relevant adapter identities;
- execution mode and known capability gaps;
- runtime-event, semantic-publication, mesh, context, query, and proof refs;
- creation time and immutable cut digest.

No consumer reconstructs identity from the directory name.

### 2. Product deployment boundary

The sandbox orchestrator invokes an installed WM product through a versioned
JSON subprocess protocol. It does not import WM implementation files from the
mutable source project.

Each deployment has an immutable manifest containing:

- product name and exact package version;
- release product or development-cut classification;
- package artifact digest and install-root digest;
- recoverable artifact-base locator and installed storage-package digest;
- source commit or release ref;
- installed entrypoint and protocol version;
- exact dependency artifacts and digests; and
- explicit compatibility and capability declarations.

A development deployment may be used for comparison and predecessor evidence.
It cannot claim release or installed-release qualification.

### 3. Source authority and replay

`examples/<domain>/sources/` remains the human-visible retained authority. Each
run records a sorted inventory of every consumed file with relative path,
media type, byte length, and SHA-256 digest. The inventory digest, not an
ambient path, binds the source cut.

The instance may reference the shared source files rather than duplicate them.
Replay must fail if any consumed file differs from the recorded digest. A
released proof additionally requires a recoverable immutable source locator.

### 4. Instance projection

The instance cut uses one stable, comparable projection:

```text
wm-instance.json
install/product-binding.json
input/source-inventory.json
semantic/source-observation.json
semantic/candidate-markov-objects.json
semantic/published-cut.json
physical/semantic-cut-attestation.json
mesh/bounded-mesh-cut.json
context/context-basis.json
context/context-projection.json
query/world-model-query.json
evidence/runtime-events.jsonl.gz
evidence/runtime-event-summary.json
evidence/admission-witnesses.json
proof/artifact-manifest.json
proof/verification.json
comparison/reference-comparison.json
```

Only applicable artifacts are emitted. The gzip archive preserves the verbatim
JSONL event stream while avoiding repeated registry-event storage inflation.
The byte-level artifact manifest covers every emitted file except itself and
the prime manifest; the prime manifest binds its digest. Omitted capabilities
appear as typed gaps in the prime manifest and proof projection.

### 5. Runtime and assurance truth

ABG-emitted events are preserved verbatim. The orchestrator may index or hash
them but may not mint substitute lifecycle, admission, convergence, or pass
events.

The installed product returns typed artifacts and evidence. The orchestrator
checks digests, path confinement, declared schema kinds, exact product binding,
and the absence of undeclared output. It does not award semantic or release
authority.

### 6. Immutability and comparison

An existing sandbox directory is never overwritten. A repeated request with
the same identity either verifies exact equality or fails closed. A different
WM product version always creates a distinct instance cut.

Comparison is a projection over two prime manifests. It compares source basis,
semantic output identity, object and link census, declared fidelity/loss,
mesh/context/query shape, runtime evidence, and typed gaps. It does not compare
copied runtime internals or infer equivalence from filenames.

### 7. Current reference limitation

The first implementation packages the completed rc.3 reference kernel as an
exact development deployment. Its GraphFunctions carry exact references and
ABG evidence but do not execute WM semantic payload transforms natively. F_P
authorship is fixture-calibrated rather than model-authored. The instance must
record both gaps and must not close T-026.

## Consequences

- The same example sources can be rebuilt side by side across WM versions.
- A sandbox becomes inspectable product evidence rather than a generated file
  dump.
- Deployment identity and instance identity remain separate and recoverable.
- Historical sandboxes remain useful comparisons but are not upgraded by this
  decision.
- Native ABG 5.0 migration can replace the installed worker implementation
  without changing the sandbox projection contract.

## Rejected Alternatives

- **Copy the mutable source tree into every sandbox**: confuses source project,
  product install, and builder project.
- **Run the historical filesystem constructor**: hides the constructive
  carrier and fabricates runtime truth.
- **Use a version label without artifact digests**: cannot distinguish or
  replay deployed products.
- **Overwrite one latest sandbox**: destroys cross-version comparison and
  historical basis identity.
- **Wait for ABG 5.0 before testing examples**: loses useful predecessor
  evidence; the development classification already prevents overclaiming.
