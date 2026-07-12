# Common Architecture ADR Registry

**Status**: Current read model
**Date**: 2026-07-12

| ADR | Status | Decision boundary | Ticket |
| --- | --- | --- | --- |
| ADR-WM-001 | Accepted | Categorical source decomposition and source/publication boundary | T-028; legacy lineage |
| ADR-WM-002 | Accepted | One semantic truth, mesh/context authority, physical attestation, migration seam | T-028 |
| ADR-WM-003 | Accepted for incremental proving slice | Iceberg/PyIceberg/Parquet/SQLite/DuckDB/Git storage topology | T-028 |
| ADR-WM-004 | Accepted by F_H direction | Public/private GTL GraphFunction catalog and contracts | T-029, T-026 |
| ADR-WM-005 | Accepted for incremental proving slice | Versioned TypeScript/Python storage-effect protocol | T-028, T-030 |

Each ADR file is authoritative for its decision. This registry is an index and
must not be used to reconstruct missing ADR content.
