# Storage Tenant Dependency Resolution

**Status**: Current proving resolution
**Date**: 2026-07-12
**Ticket**: T-030

The first local proof used:

- Python `3.12.8`;
- DuckDB `1.4.5` LTS;
- DuckDB Iceberg extension `2f229463` from the signed `core` repository, with
  local macOS ARM64 binary SHA-256
  `fefbc8dbf9c58c1ec6e1c443bd4fdd99f0958a84a62e795629b12b9508691f1e`;
- PyIceberg `0.11.1`;
- PyArrow `25.0.0`;
- SQLAlchemy `2.0.51`;
- RFC 8785 `0.1.4`; and
- the complete transitive set in `requirements.lock.txt`.

`pyproject.toml` pins the direct runtime dependencies. The lock records the
resolved local proof environment. A successor resolution must rerun the exact
snapshot, idempotency, CLI, and cross-language tests before it becomes current
evidence.

The extension binary is a proving-machine identity, not a portable release
lock. Release packaging must carry a platform-specific signed extension lock
or an equivalent immutable install mechanism.
