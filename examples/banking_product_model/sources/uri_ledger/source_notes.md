# Banking Product Notes

This example seeds a bounded banking-product catalog.

It is grounded by the FIBO banking-product hierarchy, then narrowed into a
small local offer catalog for:

- loans
- home loans
- savings accounts
- credit cards

The retained local reference set now includes:

- `data/authority/fibo_home.html`
- `data/authority/fibo_products.html`
- `data/authority/fibo_schema_financial.html`
- `data/fibo_category_snapshot.json`
- `data/schema_snapshot.json`
- `code/fibo_credit_card_markup_example.jsonld`

The current slice is intended to give `odd_world_model` a second non-trade
product domain to model without forcing regulatory semantics into the banking
example too early.
