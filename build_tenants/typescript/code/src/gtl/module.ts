import {
  constructContractRef,
  constructJob,
  constructModule,
  constructModuleImport,
  constructRefinementBoundary,
  constructRole,
  emptySerializedAttrs,
  materializeGraphFunction
} from "../substrate_binding/rc3_api.ts";
import {
  PUBLIC_GRAPH_FUNCTION_HANDLES,
  publicGraphFunctions
} from "./graph_functions.ts";

export const WORLD_MODEL_MODULE_REF = "gtl://module/odd_world_model/context-memory/v1";
export const WORLD_MODEL_OVERLAY_REF = "overlay://odd_world_model/context-memory/v1";

export const worldModelRoles = Object.freeze({
  deterministic: constructRole({
    id: "role://odd_world_model/deterministic-constructor/v1",
    name: "odd_world_model.deterministic_constructor",
    tags: ["odd_world_model", "F_D"],
    policyHooks: emptySerializedAttrs()
  }),
  probabilistic: constructRole({
    id: "role://odd_world_model/probabilistic-interpreter/v1",
    name: "odd_world_model.probabilistic_interpreter",
    tags: ["odd_world_model", "F_P"],
    policyHooks: emptySerializedAttrs()
  }),
  humanAuthority: constructRole({
    id: "role://odd_world_model/human-authority/v1",
    name: "odd_world_model.human_authority",
    tags: ["odd_world_model", "F_H"],
    policyHooks: emptySerializedAttrs()
  })
});

function jobFor(graphFunctionIndex: number) {
  const graphFunction = publicGraphFunctions[graphFunctionIndex];
  if (graphFunction === undefined) throw new Error(`missing public GraphFunction ${graphFunctionIndex}`);
  const roles = graphFunction.name === PUBLIC_GRAPH_FUNCTION_HANDLES[5]
    ? [worldModelRoles.probabilistic, worldModelRoles.deterministic]
    : [worldModelRoles.deterministic];
  return constructJob({
    id: `job://odd_world_model/${graphFunction.name.replace(/^odd_world_model\./, "").replace(/_/g, "-")}/v1`,
    name: `${graphFunction.name}.job`,
    contracts: [constructContractRef({ kind: "graph_function", targetId: graphFunction.id })],
    roles,
    tags: ["odd_world_model", "public_job"],
    policyHooks: emptySerializedAttrs()
  });
}

export const worldModelJobs = Object.freeze(publicGraphFunctions.map((_, index) => jobFor(index)));

export const worldModelModule = constructModule({
  name: WORLD_MODEL_MODULE_REF,
  graphs: publicGraphFunctions.map((graphFunction) => materializeGraphFunction(graphFunction)),
  graphFunctions: publicGraphFunctions,
  refinementBoundaries: [
    constructRefinementBoundary({
      id: "refinement-boundary://odd_world_model/publish-domain-model/v1",
      name: "odd_world_model.publish_domain_model.refinement",
      inputs: publicGraphFunctions[0]!.inputs,
      outputs: publicGraphFunctions[0]!.outputs,
      hints: emptySerializedAttrs(),
      tags: ["odd_world_model", "private_refinement", "foldback_required"]
    })
  ],
  candidateFamilies: [],
  jobs: worldModelJobs,
  roles: Object.values(worldModelRoles),
  operators: [],
  evaluators: [],
  rules: [],
  imports: [
    constructModuleImport({
      source: "package:@odd-glc/route-one-typescript",
      names: ["ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY", "ODD_GLC_STARTUP_BINDING"],
      version: "0.1.0"
    })
  ],
  policyHooks: emptySerializedAttrs(),
  metadata: emptySerializedAttrs()
});
