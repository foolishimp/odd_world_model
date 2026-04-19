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

## Current Goals

- Use `odd_world_model` on one real source-system slice and force the product domain
  to comprehend the function that creates the record of representation rather
  than relying on detached dumps or catalog descriptions alone.
- Prove the first MVP in a sandbox install lane that ingests bounded source
  evidence, builds initial world-model objects and Markov objects, and exposes
  the resulting representations for inspection and gap discovery.
- Publish one local world fragment with bounded context, functional surface,
  source evidence, world-model objects or Markov objects, and at least one
  downstream treatment path.
- Define the publication and stitching contract for fragments so local world
  fragments can later compose into a federated world-model mesh instead of a
  central monolith.
- Generate the conventional enterprise artifacts the corporation already
  expects from the same world model, including a mapping document and `dbt`
  transformations where applicable.
- Generate `data_mapper` covariant transforms from that same world model and
  run them side by side with the conventional artifact path as the primary
  proof strategy.
- Compare the side-by-side paths on semantic continuity, provenance,
  explainability, declared loss, and drift visibility rather than only on
  structural output equivalence.
- Prove one stitched path from one upstream source fragment into one adjacent
  downstream treatment or reporting fragment so the line demonstrates
  cross-domain covariance rather than only local comprehension.
- Establish the adoption pattern for future expansion: publish one fragment,
  stitch one adjacent fragment, answer one question the incumbent pipeline
  cannot answer cleanly, then repeat.
