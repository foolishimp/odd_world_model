# APRA Liquidity Source Authority

This source-authority surface records the bounded official APRA liquidity
documents pulled into the retained `odd_world_model` trade-to-APRA proving slice.

The current retained APRA input remains an interpreted local regulatory slice,
not a direct row-for-row extraction from APRA forms. Its role is now explicit:

- official APRA documents provide the regulatory source authority
- local sandbox inputs provide the bounded interpreted reporting-position slice
  used in the current MVP corpus

## Official Source Set

### 1. APRA liquidity landing page

- local file:
  `authority/apra_liquidity_landing_page.html`
- canonical URL:
  `https://www.apra.gov.au/liquidity`
- role:
  official index for the current APRA liquidity standard, guidance, reporting
  standard, reporting form, and related resources

### 2. APS 210 Liquidity

- local file:
  `authority/aps_210_liquidity_2025.html`
- canonical URL:
  `https://www.legislation.gov.au/F2025L00653/latest/text`
- in-force date shown on APRA index:
  `1 July 2025`
- role:
  primary prudential-standard source for liquidity-risk management and adequacy
  obligations applying to ADIs

### 3. APG 210 Liquidity

- local file:
  `authority/apg_210_liquidity_2025.pdf`
- canonical URL:
  `https://www.apra.gov.au/sites/default/files/2025-07/Prudential%20practice%20guide%20APG%20210%20-%20Liquidity%20-%20Clean.pdf`
- status shown on APRA index:
  `Current`, `July 2025`
- role:
  prudential-practice guidance to assist interpretation and implementation of
  APS 210

### 4. ARS 210.0 Liquidity

- local file:
  `authority/ars_210_0_liquidity_2023.html`
- canonical URL:
  `https://www.legislation.gov.au/F2023L00417/asmade/2023-04-04/text/original/epub/OEBPS/document_1/document_1.html`
- effective date shown on APRA index:
  `4 April 2023`
- role:
  primary reporting-standard source for liquidity and funding information
  provision to APRA

### 5. APRA liquidity frequently asked questions

- local file:
  `authority/apra_liquidity_faq.html`
- canonical URL:
  `https://www.apra.gov.au/liquidity-frequently-asked-questions`
- role:
  supplementary interpretive guidance for bounded liquidity questions

## Current Bounding Rule

The current APRA side of the MVP corpus is still intentionally narrow.

It currently interprets only these local semantic centers:

- regulatory reporting position
- counterparty classification
- agreement treatment basis
- liquidity bucket assignment

Those semantic centers are now bounded by an extracted authority-claim surface:

- `authority_claims.json`

This extracted surface does not replace the official documents. It is the
current reviewed source-object set over them for the retained MVP slice.

Those interpreted claims are currently materialized from the bounded local
`domain_input.json` surface, but they are now governed against the official
APRA source set listed above rather than standing alone as free-floating
sandbox policy.

## Current Limitation

The retained APRA slice is not yet a full direct extracted model of APS 210,
APG 210, ARS 210.0, or APRA reporting forms.

It is still:

- a bounded interpreted and document-reviewed APRA slice
- intended for the first proving corpus only

The next deepening wave should replace more of the remaining local interpreted
assumptions with direct document-traced and assured claims derived from these
official APRA sources.
