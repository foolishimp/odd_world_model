# odd_world_model Python Storage Tenant

This supporting tenant implements the deterministic physical-cut effect from
ADR-WM-003 and ADR-WM-005.

It is not a world-model realization tenant. It has no GTL, semantic proposal,
semantic acceptance, traversal, continuation, event-admission, or closure
authority.

The local proving topology uses PyIceberg with a SQLite `SqlCatalog`, a local
filesystem warehouse, Parquet data files, and DuckDB exact-snapshot readback.
Runtime locations are supplied through environment configuration and are never
selected by request payload.

The proving environment pins DuckDB `1.4.5` and Iceberg extension `2f229463`.
Install the signed core extension once before running the adapter:

```text
.venv/bin/python -c "import duckdb; c=duckdb.connect(); c.install_extension('iceberg')"
```

Runtime extension installation is disabled unless deployment explicitly sets
`OWM_DUCKDB_ALLOW_EXTENSION_INSTALL=1`.

Direct CLI invocation proves the cross-language protocol only. Product runtime
invocation remains behind the accepted GTL/ABG effect boundary.

## Commands

```text
python -m unittest discover -s test_env/tests -v
python test_env/proof_runtime_identity.py
python -m odd_world_model_storage
```

The CLI reads exactly one JSON request line from standard input and writes
exactly one JSON result line to standard output.
