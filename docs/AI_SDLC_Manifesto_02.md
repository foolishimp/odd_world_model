# AI SDLC Manifesto 02

Source images: `Slide1.png` through `Slide26.png`.

This document captures the slide deck as text and Mermaid diagrams. Some small
labels were reconstructed from the rendered slide images and OCR, so wording is
best-effort where the source text was low resolution.

## Slide 1 - AI SDLC Method

Theme:

- Bootstrapping intent
- The consciousness loop
- The future is organic

```mermaid
flowchart TB
  Method["AI SDLC Method"]
  Method --> Intent["Bootstrapping Intent"]
  Method --> Loop["The Consciousness Loop"]
  Method --> Organic["The Future is Organic"]
```

## Slide 2 - Where Does Intent Come From?

The slide frames intent as a human bootstrap mechanism. Reality is too complex
to store directly. Humans observe reality, form a mental abstraction, evaluate
the difference between observation and their mental model, and generate intent.
That intent drives the construction of IT systems and world models.

```mermaid
flowchart LR
  Reality["Reality<br/>Infinitely complex"]
  Human["Human observer"]
  Mental["Mental abstraction<br/>Mental model"]
  Intent["Intent"]
  Problem["Observed problem"]
  IT["IT System"]
  WM["World Model"]
  Data["Data?"]

  Reality -->|observes| Human
  Human -->|evaluates| Mental
  Mental -->|mismatch produces| Intent
  Intent --> Problem
  Problem -->|build systems to solve| IT
  Problem -->|model the domain| WM
  IT <--> WM
  WM --> Data
```

## Slide 3 - Differences Between Humans, LLMs And Agents

For system design, the slide maps human cognitive surfaces to LLM surfaces, and
then positions agents as proxies for human intent.

```mermaid
flowchart LR
  subgraph Human["Human"]
    HWM["Working memory"]
    HAF["Attention / focus"]
    HK["Knowledge<br/>(life experiences)"]
    HEI["Observe -> Evaluate -> Intent"]
  end

  subgraph LLM["LLM"]
    LCW["Context window"]
    LAF["Attention / focus"]
    LLS["Latent space<br/>(recorded human knowledge)"]
  end

  subgraph Agents["Agents"]
    A["Agent tools<br/>proxies for human intent"]
    Examples["Claude Code<br/>Gemini CLI<br/>Codex<br/>Copilot"]
  end

  HWM <--> LCW
  HAF <--> LAF
  HK <--> LLS
  HEI <--> A
  A --> Examples
```

## Slide 4 - Human Tools For LLMs

Humans have limited individual capacity, but use hierarchies and networks to
manage complexity beyond one person. The slide argues that if agents are
functionally equivalent at some tasks, parts of those hierarchies can be
automated.

```mermaid
flowchart TB
  Person["Person"]
  Network["Human hierarchy / network"]
  Complexity["Complexity beyond one individual"]
  Agents["Agent automation"]
  Work["Parts of the work network"]

  Person --> Network
  Network --> Complexity
  Complexity --> Work
  Work --> Agents
```

## Slide 5 - The Future Is Constant Transformation

Spec Driven Development at the business and organization level is presented as
the mechanism for continuous reconfiguration and evolution.

```mermaid
flowchart TB
  Reality["Reality"]
  Human["Human observer"]
  Mental["Mental abstraction"]
  Intent["Intent"]
  Org["Organization / system network"]
  SDD["Spec Driven Development"]
  Reconfig["Constant reconfiguration<br/>and evolution"]

  Reality -->|observes| Human
  Human -->|evaluates| Mental
  Mental --> Intent
  Intent --> Org
  SDD --> Org
  Org --> Reconfig
```

## Slide 6 - AI Organisation Roadmap

The roadmap is outcome driven. The organization evolves in service of an
outcome: an agile, constantly reconfiguring environment and eventually an
AI-organic organization.

```mermaid
flowchart LR
  Pre["Pre-AI industrialised<br/>organization"]
  Gate["Gate"]
  S1["Stage 1<br/>Risk model defined<br/>AI assurance model<br/>Observability and traceability"]
  S2["Stage 2<br/>AI augmented development lifecycles<br/>AI memory banks<br/>World model from domain use-cases<br/>Start small, fail fast"]
  S3["Stage 3<br/>AI in production<br/>Automation and supervision<br/>Human circuit breakers<br/>World model over memory banks<br/>Integrated Dev to Production automation"]
  Demand["On-demand applications<br/>Integrated Dev to Production ecosystem<br/>Event-sourced nervous system<br/>Mesh memory banks<br/>Mesh evaluation hierarchy"]
  Organic["AI-organic organization<br/>Full internal observability<br/>External visibility<br/>Self-model<br/>Internal/external evaluation<br/>Reflexive action"]
  Outcome["Outcome:<br/>agile, constantly reconfiguring environment"]

  Pre --> Gate --> S1 --> S2 --> S3 --> Demand --> Organic --> Outcome
```

## Slide 7 - Spec Driven Development And Context Engineering

LLM context is treated as equivalent to active human memory. The methodology
manages what is in active memory so the model has enough qualified context
without losing attention in excess detail.

```mermaid
flowchart TB
  Context["LLM context window<br/>human active memory"]
  Calc["Calculation design"]
  Best["Best practices"]
  Data["Data definitions"]
  Regs["Regulations"]
  Constraint["Constrained overlap<br/>where the solution is"]
  TooMuch["Too much detail<br/>attention drift<br/>partial results"]
  TooLittle["Insufficient context<br/>hallucination"]
  Method["Methodology manages<br/>attention drift and hallucination"]

  Context --> Calc
  Context --> Best
  Context --> Data
  Context --> Regs
  Calc --> Constraint
  Best --> Constraint
  Data --> Constraint
  Regs --> Constraint
  TooMuch --> Method
  TooLittle --> Method
  Constraint --> Method
```

## Slide 8 - AI Augmented Asset Building

AI augmented asset building is defined as a human-in-the-middle process for
managing project context.

```mermaid
flowchart LR
  Human["Human in the middle<br/>intent engine"]
  Context["Full context<br/>of project"]
  Builder["Agent code builder<br/>context window"]
  Output["Output asset"]

  Human -->|manages context| Context
  Context --> Builder
  Human -->|guides| Builder
  Builder --> Output
  Human -->|evaluates output| Output
```

## Slide 9 - Building Systems From Intent

The AI augmented SDLC places humans above the lifecycle as observers,
evaluators, intent providers, and outcome guides. Feedback and telemetry run
across the full loop.

```mermaid
flowchart LR
  Intent["Intent"]
  Spec["Specification / requirements"]
  Design["Design / technology"]
  Code["Code / tests / shepherd"]
  Deploy["Deploy"]
  Ops["Operations"]
  IT["IT System"]
  WM["World Model / data"]
  Telemetry["Telemetry"]
  Human["Human role:<br/>observe, evaluate,<br/>provide intent, guide outcome"]

  Intent --> Spec --> Design --> Code --> Deploy --> IT
  IT <--> WM
  IT --> Ops
  Ops --> Telemetry
  Telemetry --> Spec
  Telemetry --> Design
  Telemetry --> Code
  Human --> Spec
  Human --> Design
  Human --> Code
  Human --> Ops
```

## Slide 10 - Builder / Executor

The builder-executor pattern separates asset construction from asset execution
and the creation of domain data. Each process can be annotated with
verification, security, gates and controls, and versioning.

```mermaid
flowchart LR
  Intent["Intent"]
  Builder["Builder"]
  Asset["Domain asset service<br/>or stored asset"]
  Deployer["Deployer"]
  Executor["Executor"]
  DomainData["Domain data"]
  Controls["Verification<br/>Security<br/>Gates and controls<br/>Versioning"]

  Intent --> Builder
  Builder -->|1. Build the asset| Asset
  Asset -->|2. Store the asset| Deployer
  Deployer -->|3. Asset executes| Executor
  Executor -->|4. Creates| DomainData
  Controls -. annotates .- Builder
  Controls -. annotates .- Asset
  Controls -. annotates .- Executor
```

## Slide 11 - Observer / Evaluator

The observer-evaluator pattern separates the changing world, observation, and
evaluation against a required-world model. The evaluator creates intent and
requirements pressure.

```mermaid
flowchart LR
  World["Domain data / world"]
  Observer["Observer"]
  Evaluator["Evaluator"]
  Model["Homeostasis model<br/>requirements"]
  Intent["Intent"]
  DomainData["New or updated<br/>domain data"]
  Controls["Verification<br/>Security<br/>Gates and controls<br/>Versioning"]

  World -->|1. Domain data| Observer
  Observer -->|2. Observes changing world| Evaluator
  Model --> Evaluator
  Evaluator -->|3. Evaluates observed world<br/>against required world| Intent
  Evaluator -->|4. Creates| DomainData
  Controls -. annotates .- Observer
  Controls -. annotates .- Evaluator
```

## Slide 12 - Discovery

The slide contains only the title `Discovery`.

```mermaid
flowchart TB
  Discovery["Discovery"]
```

## Slide 13 - Meaning

The slide contains only the title `Meaning`.

```mermaid
flowchart TB
  Meaning["Meaning"]
```

## Slide 14 - Creativity / Synthesis

The slide contains only the title `Creativity / Synthesis`.

```mermaid
flowchart TB
  Creativity["Creativity / Synthesis"]
```

## Slide 15 - Intent Categories

Intent is divided into discovery and builder intent.

```mermaid
flowchart LR
  Intent["Intent"]
  Discovery["Discovery<br/>find new solutions<br/>to improve the homeostatic model"]
  Builder["Builder<br/>known category of solution<br/>that can be built to meet the model"]
  Categories["Builder solution categories"]

  Intent --> Discovery
  Intent --> Builder
  Builder --> Categories
```

## Slide 16 - Building Systems From Intent: Traditional SDLC

The traditional SDLC is shown as a linear flow with feedback from the deployed IT
system back into earlier lifecycle stages.

```mermaid
flowchart LR
  Intent["Intent"]
  Req["Requirements"]
  DesignBuild["Design and build"]
  Test["Test"]
  Ops["Ops"]
  IT["IT System"]
  WM["IT World Model"]
  Feedback["Feedback"]

  Intent --> Req --> DesignBuild --> Test --> Ops --> IT
  IT <--> WM
  IT --> Feedback
  Feedback --> Req
```

## Slide 17 - Personas And Context For Each Stage Of AI SDLC

Each stage has a persona and context boundary. The technical build stages sit
inside a shared context region.

```mermaid
flowchart LR
  Intent["Intent"]
  Req["Requirements"]
  Design["Design"]
  Tasks["Tasks"]
  Code["Code"]
  SystemTesting["System testing"]
  UAT["User acceptance testing"]

  PO["Product owner"]
  BA["Business analyst"]
  TL["Tech lead"]
  Coder["Coder"]
  ST["System tester"]
  UATT["UAT tester"]

  Intent --> Req --> Design --> Tasks --> Code --> SystemTesting --> UAT
  PO -. persona .- Req
  BA -. persona .- Req
  TL -. persona .- Design
  Coder -. persona .- Code
  ST -. persona .- SystemTesting
  UATT -. persona .- UAT
```

## Slide 18 - AI Augmented Asset Building: Unit Of AI Builder

The unit of AI building is a loop of full context, intent manager, agent LLM,
and output. The intent manager decides intent, manages context, and evaluates
output.

```mermaid
flowchart LR
  Context["Full context<br/>of project"]
  IntentManager["Intent manager"]
  Agent["Agent LLM<br/>context window"]
  Output["Output asset"]

  IntentManager -->|manages context| Context
  IntentManager -->|decides on intent| Agent
  Context --> Agent
  Agent --> Output
  IntentManager -->|evaluates output| Output
  Output -->|feedback| Context
```

## Slide 19 - Use Case 1: Data Calc Platform - DCP

The DCP example applies the builder-executor pattern to data calculation assets.

```mermaid
flowchart LR
  subgraph Builder["Builder"]
    Dataiku["Dataiku"]
    MarsDnD["Mars drag n drop"]
    AISDLC["AI SDLC"]
  end

  subgraph Assets["Assets"]
    Modules["Modules"]
    Rules["Rules tables"]
    Pipelines["Pipelines"]
  end

  Deployer["Deployer"]

  subgraph Executor["Executor"]
    MARSSandbox["MARS sandbox"]
    EDPCluster["EDPCluster"]
  end

  subgraph Domain["Domain data"]
    CDH["EDP.CDH"]
  end

  Builder -->|1. Build the asset| Assets
  Assets -->|2. Store the asset| Deployer
  Deployer -->|3. Asset executes| Executor
  Executor -->|4. Creates domain data| Domain
```

## Slide 20 - Use Case 1: DCP, Tooling View

This version maps builder tools, Git/code storage, cloud execution, and cloud
domain data.

```mermaid
flowchart LR
  subgraph Builder["Builder"]
    Dexd["dexd"]
    subgraph AISDLC["AI SDLC"]
      ContextMgmt["Context management"]
      Claude["Claude Code"]
    end
    VS["Visual Studio"]
  end

  subgraph Assets["Assets"]
    Git["Git repo"]
    Code["Code"]
  end

  CICD["CI/CD"]

  subgraph Executor["Executor"]
    CloudExec["Cloud execution environments"]
    AppPlatforms["App platforms"]
    DataPlatforms["Data platforms"]
  end

  subgraph Domain["Domain data"]
    Storage["Cloud storage"]
    CDH["CDH"]
  end

  Builder -->|1. Build the asset| Assets
  Assets --> CICD
  CICD -->|2. Store / deploy asset| Executor
  Executor -->|3. Asset executes| Domain
```

## Slide 21 - Secure Software Development Life Cycle

The slide marks `Building Block 1`.

```mermaid
flowchart TB
  SSDLC["Secure Software Development Life Cycle"]
  BB1["Building Block 1"]
  SSDLC --> BB1
```

## Slide 22 - Building Systems From Intent Augmented With AI

The augmented SDLC splits lifecycle stages and attaches persona/context lanes
to each stage.

```mermaid
flowchart LR
  Intent["Intent"]
  Req["Requirements"]
  Design["Design"]
  Tasks["Tasks"]
  Build["Build"]
  UIT["Unit and integration test"]
  UAT["User acceptance test"]
  Ops["Ops"]

  Intent --> Req --> Design --> Tasks --> Build --> UIT --> UAT --> Ops

  PO["Product owner"] -. context .- Req
  BA["Business analyst"] -. context .- Req
  TL["Tech lead"] -. context .- Design
  Coder["Coder"] -. context .- Build
  Tester1["Tester"] -. context .- UIT
  Tester2["Tester"] -. context .- UAT
  SRE["SRE"] -. context .- Ops
```

## Slide 23 - Intent, IT Systems, And Data

This slide restates the origin of intent and adds the key data claim:

- The IT system is an abstraction of the real world.
- It is a collection of business processes.
- Data is the saved business-process representation.
- Without the original system context, data is meaningless.

The example is a trading system: software engineers work with traders to build
a trading system; traders use it to enact and record trades; the recorded trade
data loses meaning if the context and business rules are lost.

```mermaid
flowchart LR
  Real["Real world<br/>infinitely complex"]
  Human["Human observer"]
  Mental["Mental model"]
  Intent["Intent<br/>requirements"]
  IT["IT system<br/>business processes"]
  WM["IT world model"]
  Data["Saved representation<br/>data"]
  Context["Original system context<br/>business rules"]

  Real -->|observes| Human
  Human --> Mental
  Mental -->|mismatch| Intent
  Intent --> IT
  IT <--> WM
  IT --> Data
  Context --> Data
  Data -->|meaning depends on| Context
```

## Slide 24 - Observe / Interpret / Solve Cycle

The cycle is a simple model of how people solve problems individually or as a
group. Each person brings life experience, or a solution set, to the abstracted
problem. The slide connects this to the scientific method and treats the cycle
as iterative at every granularity.

```mermaid
flowchart LR
  Reality["Reality"]
  Observation["Observation and interpretation"]
  Abstract["Abstract problem domain"]
  SolutionSets["Diverse solution sets<br/>life experience"]
  Solution["Solution"]
  Apply["Solution sets collaboratively applied"]
  Test["Tested against the real world"]

  Reality --> Observation --> Abstract --> SolutionSets --> Solution --> Apply --> Test --> Reality
```

## Slide 25 - Business Domain Software Life Cycle

The business domain lifecycle translates reality into an abstract problem
domain, then into graphs, DAGs, applications, and transformations.

```mermaid
flowchart LR
  Reality["Reality"]
  BA["Business analyst<br/>translates domain<br/>into abstract domain"]
  Abstract["Abstract problem domain"]
  Architect["Data architect<br/>creates graphs<br/>representing the domain"]
  DAG["DAG<br/>domain model along<br/>a query path"]
  Developer["Developer<br/>translates abstract domain<br/>into business functions<br/>over the DAG"]
  App["Application"]
  Pipeline["Transformation pipeline"]
  Transform["Developer writes<br/>transformations between DAGs"]

  Reality --> BA --> Abstract
  Abstract --> Architect --> DAG
  Abstract --> Developer --> App
  DAG --> Pipeline
  Developer --> Transform --> Pipeline
```

## Slide 26 - Business Domain Software Life Cycle With Plato

Plato is introduced as the generating center between the abstract domain graph,
destination declarations, schemas, applications, and transformation code.

```mermaid
flowchart LR
  Reality["Reality"]
  BA["Business analyst<br/>abstracts the domain"]
  Abstract["Abstract problem domain"]
  Architect["Data architect<br/>creates graph over domain"]
  DomainGraph["Abstract domain graph"]
  Dev["Developer<br/>declares destination DAG,<br/>functions, and generators"]
  Plato["Plato"]
  Schema["Destination schema"]
  Code["Transformation code"]
  App["Application"]
  Pipeline["Transformation pipeline"]

  Reality --> BA --> Abstract
  Abstract --> Architect --> DomainGraph
  DomainGraph --> Plato
  Dev --> Plato
  Plato --> Schema
  Plato --> Code
  Schema --> App
  Code --> Pipeline
```

## Consolidated Model

Across the deck, the model can be compressed as:

```mermaid
flowchart TB
  Reality["Reality"]
  Observation["Observation"]
  Abstraction["Mental / problem abstraction"]
  Intent["Intent"]
  Context["Managed context"]
  Agent["Agent / LLM / builder"]
  Asset["Built asset"]
  Execution["Executor / runtime"]
  Data["Domain data"]
  WorldModel["World model"]
  Evaluation["Observer / evaluator"]
  Feedback["Telemetry / feedback"]

  Reality --> Observation --> Abstraction --> Intent
  Intent --> Context --> Agent --> Asset --> Execution --> Data
  Data --> WorldModel
  Data --> Evaluation
  WorldModel --> Evaluation
  Evaluation --> Feedback --> Intent
```

