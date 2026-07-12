import { constructNode, type Node } from "../substrate_binding/rc3_api.ts";
import { assetNameSlug } from "./identifiers.ts";

const COMMON_CONTEXT_REFS = Object.freeze([
  "context://odd_world_model/product/v1",
  "context://odd_world_model/authority/v1",
  "context://odd_world_model/temporal/v1",
  "context://odd_world_model/lineage/v1"
]);

const schemaRef = (name: string): string =>
  `workspace://build_tenants/common/schemas/${name}.schema.json`;

const graphContractRef = (name: string): string =>
  `${schemaRef("graph_function_contracts")}#/$defs/${name}`;

const graphOutcomeRef = (name: string): string =>
  `${schemaRef("graph_function_outcomes")}#/$defs/${name}`;

interface AssetNodeInput {
  readonly name: string;
  readonly kind: string;
  readonly schemaRef: string;
  readonly markov: readonly string[];
  readonly outputContractRefs?: readonly string[];
  readonly authorityKindRef?: string;
  readonly constructorInputAssetKinds?: readonly string[];
  readonly rendererRefs?: readonly string[];
  readonly renderedViewDigestPolicyRef?: string | null;
  readonly sectionKindRefs?: readonly string[];
  readonly clauseKindRefs?: readonly string[];
}

function assetNode(input: AssetNodeInput): Node {
  const nodeSlug = assetNameSlug(input.name);
  return constructNode({
    id: `node://odd_world_model/${nodeSlug}/v1`,
    name: input.name,
    schema: { kind: "symbolic", ref: input.schemaRef },
    markov: input.markov,
    assetSurface: {
      kind: input.kind,
      requiredContexts: COMMON_CONTEXT_REFS,
      standardsRefs: [
        "standard://specification_methodology/ODD_METHOD",
        "standard://specification_methodology/WORLD_MODEL_METHOD"
      ],
      outputContractRefs: input.outputContractRefs ?? [input.schemaRef],
      constructorRefs: [`constructor://odd_world_model/${nodeSlug}/v1`],
      constructorInputAssetKinds: input.constructorInputAssetKinds ?? [],
      rendererRefs: input.rendererRefs ?? [],
      renderedViewDigestPolicyRef: input.renderedViewDigestPolicyRef ?? null,
      sectionKindRefs: input.sectionKindRefs ?? [],
      clauseKindRefs: input.clauseKindRefs ?? [],
      authoritySlots: [
        {
          authorityKindRef: input.authorityKindRef ?? "authority-kind://odd_world_model/product",
          disposition: "normal"
        }
      ],
      proofObligationRefs: [`proof-obligation://odd_world_model/${nodeSlug}/v1`]
    },
    tags: ["odd_world_model", "gtl_asset", input.kind]
  });
}

export const environmentAssets = Object.freeze({
  exactProductBinding: assetNode({
    name: "ExactProductBinding",
    kind: "exact_product_binding",
    schemaRef: graphContractRef("exact_product_binding"),
    markov: ["product:exact", "compatibility:verified"]
  }),
  authorityContext: assetNode({
    name: "AuthorityContext",
    kind: "authority_context",
    schemaRef: graphContractRef("authority_context"),
    markov: ["authority:declared", "admission:required"]
  }),
  temporalContext: assetNode({
    name: "TemporalContext",
    kind: "temporal_context",
    schemaRef: graphContractRef("temporal_context"),
    markov: ["time:role-separated", "cut:as-of"]
  }),
  lineageContext: assetNode({
    name: "LineageContext",
    kind: "lineage_context",
    schemaRef: graphContractRef("lineage_context"),
    markov: ["lineage:recoverable", "source:exact"]
  }),
  typedGapSet: assetNode({
    name: "TypedGapSet",
    kind: "typed_gap_set",
    schemaRef: schemaRef("typed_gap"),
    markov: ["gap:typed", "closure:honest"]
  }),
  policyContext: assetNode({
    name: "PolicyContext",
    kind: "policy_context",
    schemaRef: graphContractRef("policy_context"),
    markov: ["policy:versioned", "authority:bounded"]
  }),
  replayEvidenceRefs: assetNode({
    name: "ReplayEvidenceRefs",
    kind: "replay_evidence_refs",
    schemaRef: graphContractRef("replay_evidence_refs"),
    markov: ["replay:exact", "events:admitted"]
  })
});

export const sharedEnvironmentNodes = Object.freeze(Object.values(environmentAssets));

export const domainPublicationAssets = Object.freeze({
  request: assetNode({
    name: "DomainPublicationRequest",
    kind: "domain_publication_request",
    schemaRef: graphContractRef("domain_publication_request"),
    markov: ["source-scope:exact", "intent:publish-domain"]
  }),
  observed: assetNode({
    name: "ObservedSourceEvidence",
    kind: "observed_source_evidence",
    schemaRef: schemaRef("source_observation"),
    markov: ["evidence:observed", "source:digest-bound"]
  }),
  proposed: assetNode({
    name: "ConstructedDomainSemantics",
    kind: "constructed_domain_semantics",
    schemaRef: schemaRef("semantic_proposal"),
    markov: ["semantics:proposed", "authority:not-yet-admitted"]
  }),
  admitted: assetNode({
    name: "AdmittedDomainClaims",
    kind: "admitted_domain_claims",
    schemaRef: schemaRef("accepted_semantic_cut"),
    markov: ["claims:admitted", "lineage:recoverable"]
  }),
  projected: assetNode({
    name: "ProjectedDomainCut",
    kind: "projected_domain_cut",
    schemaRef: schemaRef("candidate_markov_object_cut"),
    markov: ["object-cut:immutable", "status:honest"]
  }),
  outcome: assetNode({
    name: "PublishedDomainOutcome",
    kind: "published_domain_outcome",
    schemaRef: graphOutcomeRef("domain_publication_outcome"),
    outputContractRefs: [
      schemaRef("published_semantic_cut"),
      schemaRef("semantic_cut_attestation"),
      schemaRef("abg_admission_witness")
    ],
    markov: ["semantic-cut:published", "physical-cut:attested"]
  })
});

export const publicFunctionAssets = Object.freeze({
  semanticLinks: Object.freeze({
    request: assetNode({
      name: "SemanticLinkPublicationRequest",
      kind: "semantic_link_publication_request",
      schemaRef: graphContractRef("semantic_link_publication_request"),
      markov: ["endpoints:exact", "intent:publish-links"]
    }),
    outcome: assetNode({
      name: "PublishedSemanticLinkOutcome",
      kind: "published_semantic_link_outcome",
      schemaRef: graphOutcomeRef("semantic_link_publication_outcome"),
      outputContractRefs: [
        schemaRef("semantic_link"),
        schemaRef("semantic_cut_attestation"),
        schemaRef("abg_admission_witness")
      ],
      markov: ["links:admitted", "endpoints:reference-preserved"]
    })
  }),
  composition: Object.freeze({
    request: assetNode({
      name: "WorldModelCompositionRequest",
      kind: "world_model_composition_request",
      schemaRef: graphContractRef("world_model_composition_request"),
      markov: ["components:exact", "intent:compose"]
    }),
    outcome: assetNode({
      name: "ComposedWorldModelOutcome",
      kind: "composed_world_model_outcome",
      schemaRef: graphOutcomeRef("world_model_composition_outcome"),
      outputContractRefs: [
        schemaRef("composed_world_model"),
        schemaRef("semantic_cut_attestation"),
        schemaRef("abg_admission_witness")
      ],
      markov: ["composition:reference-preserving", "authority:local"]
    })
  }),
  mesh: Object.freeze({
    request: assetNode({
      name: "MeshResolutionRequest",
      kind: "mesh_resolution_request",
      schemaRef: graphContractRef("mesh_resolution_request"),
      markov: ["goal:declared", "scope:bounded"]
    }),
    outcome: assetNode({
      name: "BoundedMeshOutcome",
      kind: "bounded_mesh_outcome",
      schemaRef: graphOutcomeRef("mesh_resolution_outcome"),
      outputContractRefs: [
        schemaRef("bounded_mesh_cut"),
        schemaRef("abg_admission_witness")
      ],
      markov: ["mesh:finite", "basis:exact"]
    })
  }),
  contextProjection: Object.freeze({
    request: assetNode({
      name: "ContextProjectionRequest",
      kind: "context_projection_request",
      schemaRef: graphContractRef("context_projection_request"),
      markov: ["mesh-cut:exact", "projection-contract:declared"]
    }),
    outcome: assetNode({
      name: "ContextProjectionOutcome",
      kind: "prompt_invocation_asset",
      schemaRef: graphOutcomeRef("context_projection_outcome"),
      outputContractRefs: [
        schemaRef("context_basis"),
        schemaRef("context_projection"),
        schemaRef("abg_admission_witness")
      ],
      constructorInputAssetKinds: ["bounded_mesh_cut", "context_projection_contract"],
      rendererRefs: ["renderer://odd_world_model/context-projection/canonical-json/v1"],
      renderedViewDigestPolicyRef: "digest-policy://odd_world_model/context-projection/rfc8785-sha256/v1",
      sectionKindRefs: ["section-kind://odd_world_model/context-basis", "section-kind://odd_world_model/context-content"],
      clauseKindRefs: ["clause-kind://odd_world_model/exact-ref", "clause-kind://odd_world_model/declared-loss"],
      markov: ["basis:immutable", "loss:declared"]
    })
  }),
  interpretation: Object.freeze({
    request: assetNode({
      name: "ContextInterpretationRequest",
      kind: "context_interpretation_request",
      schemaRef: graphContractRef("context_interpretation_request"),
      markov: ["basis:exact", "model-capability:bound"]
    }),
    outcome: assetNode({
      name: "ContextInterpretationOutcome",
      kind: "context_interpretation_outcome",
      schemaRef: graphOutcomeRef("context_interpretation_outcome"),
      outputContractRefs: [
        schemaRef("context_invocation_record"),
        schemaRef("semantic_proposal"),
        schemaRef("abg_admission_witness")
      ],
      markov: ["output:attributed-proposal", "semantic-truth:not-admitted"]
    })
  }),
  query: Object.freeze({
    request: assetNode({
      name: "WorldModelQueryRequest",
      kind: "world_model_query_request",
      schemaRef: graphContractRef("world_model_query_request"),
      markov: ["cut:attested", "query-contract:declared"]
    }),
    outcome: assetNode({
      name: "WorldModelQueryOutcome",
      kind: "world_model_query_outcome",
      schemaRef: graphOutcomeRef("world_model_query_outcome"),
      outputContractRefs: [
        schemaRef("query_projection"),
        schemaRef("abg_admission_witness")
      ],
      markov: ["projection:reproducible", "truth:read-only"]
    })
  })
});
