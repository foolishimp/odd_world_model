# Banking Product Source Authority

This source-authority surface records the retained source set for the bounded
banking-product example domain.

The current example is intentionally narrow. It is not a full bank operating
model or a full retail-product ontology. It is a bounded product-catalog slice
grounded in the FIBO banking-product hierarchy and then specialized into a
small local offer catalog.

## Global Model Catalog

### 1. FIBO home page

- local file:
  `data/authority/fibo_home.html`
- canonical URL:
  `https://spec.edmcouncil.org/fibo/`
- role:
  authoritative publication surface for the Financial Industry Business
  Ontology, the global ontology family used as the retained banking-model
  source for this example

### 2. FIBO products page

- local file:
  `data/authority/fibo_products.html`
- canonical URL:
  `https://spec.edmcouncil.org/fibo/page/products`
- role:
  authoritative source describing the published FIBO product forms and the
  derived catalog surfaces available to downstream users

### 3. FIBO schema banking hierarchy page

- local file:
  `data/authority/fibo_schema_financial.html`
- canonical URL:
  `https://spec.edmcouncil.org/fibo/page/schema`
- role:
  bounded catalog surface showing the banking-product hierarchy used in this
  example, including:
  - `DepositAccount`
  - `LoanOrCredit`
  - `MortgageLoan`
  - `CreditCard`

### 4. Bounded FIBO category snapshot

- local file:
  `data/fibo_category_snapshot.json`
- role:
  retained local snapshot of the bounded FIBO category hierarchy and example
  properties carried by this example domain for rebuild stability

### 5. FIBO credit-card markup example

- local file:
  `code/fibo_credit_card_markup_example.jsonld`
- source page:
  `data/authority/fibo_schema_financial.html`
- role:
  retained code-side reference example showing how a banking product can be
  expressed using the FIBO schema.org financial extension

### 6. Local product-catalog schema snapshot

- local file:
  `data/schema_snapshot.json`
- role:
  local bounded source-contract snapshot for the retained banking-product
  catalog lane

## Current Bounding Rule

The current banking-product example keeps only these semantic centers:

- a bank or issuer
- a retail offer catalog
- deposit-account product offers
- loan and mortgage product offers
- credit-card product offers

The local `domain_input.json` surface is a bounded product-offer slice over
those retained global FIBO categories and local schema snapshots.
