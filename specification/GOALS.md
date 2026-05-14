# Goals

**ID**: GOALS-ODD-WORLD-MODEL-001
**Status**: Draft
**Date**: 2026-04-15
**Wave**: proving-wave-01

## Position

Goals define the bounded proving wave for `odd_world_model`.

They are narrower than intent and product definition. Intent states why the
product domain exists. Product definition states what the next released
`odd_world_model` product is becoming. Goals choose the next concrete slice that
proves the line can work in reality without pretending the whole federated
world-model mesh is already built.

This wave follows three operating principles:

- dogfood the product on real source systems rather than keeping it theoretical
- boil the frog through incremental semantic capture and composition rather
  than demanding enterprise convergence up front
- do not boil the ocean; keep the slice narrow enough to complete and evaluate

The current proving wave is now install-first.

The steel thread is no longer "prove the trade-to-APRA corpus as the product."
The steel thread is:

1. install a versioned sandbox cut of `odd_world_model`
2. configure that installed sandbox for one retained source corpus
3. run the world builder inside that sandbox against that configured source
4. prove that the same installed product can be restamped and reconfigured for
   another source corpus without changing the product code by hand

## Closed Goals

1. Goal 1 is closed. `odd_world_model` now carries the retained bounded FpML
   trade source slice directly inside the sandbox, so the current wave no
   longer depends on a separate standalone example lane to prove real-source
   grounding.
2. The old shared example lane under `build_tenants/common/examples/` is
   closed. Root-level example domains now own retained source corpora and
   versioned sandbox installs directly.

## Current Goals

- Prove that a versioned installed sandbox cut can be stamped lawfully with
  immutable `.genesis/odd_world_model` product assets and no leakage of source
  project realization structure into the installed sandbox root.
- Prove that an installed sandbox can be configured explicitly for one domain
  corpus rather than inheriting a hard-coded proving line from the source
  workspace.
- Prove that the world builder inside the installed sandbox can discover and
  use the configured retained source corpus for that sandbox rather than
  assuming the trade/APRA corpus.
- Establish a source-configuration contract that lets later `odd_world_model`
  cuts rebuild the same domain from the same retained `sources/` corpus while
  also allowing different domain sandboxes to point at different source sets.
- Separate product-level runtime assets from proving-corpus-specific assets so
  package bootstrapping, asset inventory, constructor dispatch, and self-test
  selection are driven by sandbox configuration instead of hard-coded example
  paths.
- Prove at least one complete sandbox-local world build from configured source
  evidence through publication of a local world fragment and inspection
  surfaces.
- Keep cross-domain composition, mapping, and proof as downstream proving work,
  but stop treating the trade-to-APRA corpus as the implicit default runtime
  for every installed sandbox.
- Prove one generic topology-aware mapping slice over the retained example
  domains so published objects can be matched through semantic boundary,
  adjacency, composition, treatment, and constructive-history signals rather
  than through lexical similarity alone.
- Project higher-order concept candidates and hierarchical or intersectional
  boundary candidates from that generic mapping slice without silently
  promoting those inferred structures into domain truth.
- Establish the repeatable adoption pattern for future work:
  retain sources once, stamp a sandbox cut, configure the sandbox, run the
  world builder, inspect the publication, then restamp the next cut over the
  same sources or over a different source corpus.
