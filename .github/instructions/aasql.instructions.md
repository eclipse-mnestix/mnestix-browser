---
name: 'AAS Query Language (AASQL)'
description: 'How to read, write, and integrate AAS Query Language (AASQL) queries against an AAS Repository/Registry, per IDTA-01002 Part 2.'
applyTo: 'src/lib/**/*.ts'
---

# AAS Query Language (AASQL)

This project persists digital twins in an AAS environment (Mnestix, accessed via
[mnestix_http_client.py](../../backend/app/storage/mnestix_http_client.py)). AASQL (defined in
IDTA-01002 Part 2, "Query Language" and "HTTP/REST API" clauses) is the standardized way to let
the *server* filter AAS/Submodel/ConceptDescription data instead of fetching everything and
filtering client-side in Python. Use this guide whenever you need to add or modify a query against
an AAS Repository or Registry.

## When AASQL applies

- Only **Repository** and **Registry** services expose query endpoints. A single AAS/Submodel
  Service (one object at a fixed endpoint) does **not** support querying.
- Only **Identifiables** can be the target of a query: Asset Administration Shells, Submodels,
  ConceptDescriptions, and their Descriptors (AssetAdministrationShellDescriptor,
  SubmodelDescriptor). You cannot query for an arbitrary SubmodelElement as the top-level result;
  you can only use SubmodelElement attributes as **conditions** to filter the containing
  Identifiable.
- For SubmodelElements (`$sme`), only these fields are queryable: `semanticId`,
  `supplementalSemanticIds`, `idShort`, `value`, `valueType`, `language`. You cannot traverse into
  `Entity/statements`, `AnnotatedRelationshipElement/annotations`, or `Operation/outputVariables`.

## HTTP endpoints

Queries are sent as `POST` with the serialized query as the JSON request body (never as query
string parameters):

| Target               | Endpoint                       |
|-----------------------|---------------------------------|
| Asset Administration Shells | `POST /query/shells`      |
| Submodels             | `POST /query/submodels`        |
| Concept Descriptions  | `POST /query/concept-descriptions` |
| AAS Descriptors (Registry) | `POST /query/shell-descriptors` |
| Submodel Descriptors (Registry) | `POST /query/submodel-descriptors` |

Before relying on querying against a given server, check its `/description` endpoint for a
`ServiceSpecificationProfileEnum` entry ending in a "Query Profile" (e.g.
`.../SubmodelRepositoryServiceSpecification/SSP-005`). Not every AAS implementation supports it.

A malformed query (fails JSON Schema) is rejected with HTTP `400`. Semantically unsupported but
syntactically valid combinations get `422`.

## Query object shape

```json
{
  "$select": "id",
  "$condition": { "<logicalExpression>": [...] },
  "$filters": [
    { "$fragment": "<FieldIdentifierFragment>", "$condition": { "<logicalExpression>": [...] } }
  ]
}
```

- `$condition` (required): the actual filter, a `logicalExpression`.
- `$select` (optional): only the literal value `"id"` is allowed. Omit it to get full objects back;
  set it to return only a list of identifiers (much cheaper). **BaSyx quirk:** `"$select": "id"`
  currently errors against the project's BaSyx (basyx-go-components) AAS environment — omit
  `$select` entirely and retrieve/filter full objects instead until this is fixed upstream.
- `$filters` (optional): reduces returned *content* of the matched objects (not which objects
  match) — see "Reducing response size" below. Rarely needed; prefer `$select`/normal retrieval
  first.

## Known BaSyx quirks (basyx-go-components)

This project's AAS environment is backed by
[basyx-go-components](https://github.com/eclipse-basyx/basyx-go-components) (Go + PostgreSQL), not
basyx-java. Known deviations from the plain IDTA-01002 spec:

- `"$select": "id"` currently causes an error on this backend. Do not rely on it; always request
  full objects and extract `id` client-side if only identifiers are needed.

## FieldIdentifiers — how to point at a value

A `FieldIdentifier` always has the form `<root>[.<idShortPath>]#<attribute>`.

| Root | Points into | Example |
|------|-------------|---------|
| `$aas` | AssetAdministrationShell | `$aas#assetInformation.globalAssetId` |
| `$sm` | Submodel | `$sm#semanticId` |
| `$sme` | SubmodelElement (recursive search unless an idShortPath follows) | `$sme#value`, `$sme.Nameplate.ManufacturerName#value` |
| `$cd` | ConceptDescription | `$cd#id` |
| `$aasdesc` | AssetAdministrationShellDescriptor (Registry only) | `$aasdesc#assetKind` |
| `$smdesc` | SubmodelDescriptor (Registry only) | `$smdesc#endpoints[0].protocolinformation.href` |

Notes:
- `$sme` without an idShortPath (`$sme#value`) searches **recursively** through the whole
  SubmodelElement hierarchy of a submodel. `$sme.<idShortPath>#value` addresses one specific
  element.
- `semanticId` / `supplementalSemanticIds` are shortcuts for `<field>.keys[0].value`; you rarely
  need to write out `.keys[0].value` yourself.
- List indices use `[<n>]` for a specific element or `[]` to mean "any element of the list"
  (e.g. `$aas#assetInformation.specificAssetIds[].name`).
- All prefixes are lower-case and must match exactly (`$aasDesc` is invalid).

## Operands and literals

Every comparison operand is one of:
- `{ "$field": "<FieldIdentifier>" }` — a reference to a field.
- A literal: `{ "$strVal": "..." }`, `{ "$numVal": 123 }`, `{ "$hexVal": "16#FF" }`,
  `{ "$dateTimeVal": "2024-01-01T00:00:00Z" }`, `{ "$timeVal": "12:00:00" }`,
  `{ "$boolean": true }`.
- An explicit cast of another operand: `{ "$strCast": <operand> }`, `{ "$numCast": <operand> }`,
  `{ "$hexCast": <operand> }`, `{ "$boolCast": <operand> }`, `{ "$dateTimeCast": <operand> }`,
  `{ "$timeCast": <operand> }`.
- `FieldIdentifier` values are treated as strings by default; comparing them against a number/bool/
  date implicitly casts the field's value to that type. An invalid cast makes that single candidate
  silently drop out of the result set — it never raises a server error.

## Comparison operators

`"$<op>": [operand1, operand2]`

| Operator | Meaning | Allowed types |
|----------|---------|----------------|
| `$eq`, `$ne` | equals / not equals | string, number, hex, bool, dateTime, time |
| `$gt`, `$ge`, `$lt`, `$le` | ordered comparison | string, number, hex, dateTime, time |
| `$contains`, `$starts-with`, `$ends-with`, `$regex` | string-only | string |

## Logical operators

- `$and`: `{ "$and": [<logicalExpression>, <logicalExpression>, ...] }` (min 2 operands)
- `$or`: `{ "$or": [<logicalExpression>, ...] }` (min 2 operands)
- `$not`: `{ "$not": <logicalExpression> }`
- `$boolean`: a plain boolean literal usable as a full expression (e.g. `true` to match everything).
- Parentheses/nesting are expressed simply by nesting these objects; there is no separate grouping
  construct in JSON.

## `$match` — correlating conditions on the same list element

Plain `$and` evaluates each condition independently across *any* element of a list, which can
produce false positives when two conditions must hold on the **same** array entry (e.g. the same
`SpecificAssetId` object). Use `$match` to force that:

```json
{
  "$match": [
    { "$eq": [{ "$field": "$aas#assetInformation.specificAssetIds[].name" }, { "$strVal": "supplierId" }] },
    { "$eq": [{ "$field": "$aas#assetInformation.specificAssetIds[].value" }, { "$strVal": "aas-1" }] }
  ]
}
```
This only matches if `name == "supplierId"` and `value == "aas-1"` on the *same* list entry.
`$match` may contain only comparisons or nested `$match` — never a general `logicalExpression`
like `$and`/`$or`/`$not`.

## Querying into a `SubmodelElementList`

Elements of a `SubmodelElementList` have no `idShort` — they're addressed purely by position.
Use `[<n>]` for a specific index or `[]` for "any element" directly after the list's own
idShortPath segment, then continue with the queryable `$sme` attribute:

```
$sme.<path-to-list>[]#value
$sme.<path-to-list>[3]#value
```

Example: find Submodels where any element of the `Measurements` list has the value `"42"`:

```json
{
  "$condition": {
    "$eq": [
      { "$field": "$sme.Measurements[]#value" },
      { "$strVal": "42" }
    ]
  }
}
```

If the list is nested deeper, extend the idShortPath accordingly:
`$sme.Parent.Measurements[]#value`.

To require that the matching value belongs to the *same* list element as a specific
`semanticId` (instead of two independent elements somewhere in the list satisfying each
condition separately), combine both conditions with `$match`:

```json
{
  "$condition": {
    "$match": [
      { "$eq": [{ "$field": "$sme.Measurements[]#semanticId" }, { "$strVal": "https://example.com/myProperty" }] },
      { "$eq": [{ "$field": "$sme.Measurements[]#value" }, { "$strVal": "42" }] }
    ]
  }
}
```

## Reducing response size with `$filters` (advanced, rarely needed)

`$filters` entries use `$fragment` (a `FieldIdentifierFragment`, no `[n]`/`[]` on the *last*
segment unless it's a row-wise array filter) plus a `$condition` to decide which parts of the
*returned* object to keep. This only trims payload content; it never changes which objects match
`$condition`. Prefer letting the client discard unneeded fields unless payload size is a proven
problem.

## Worked examples for this project

Find all Submodels of type TimeSeries (see
[standard_references.py](../../backend/app/shared/building/standard_references.py)):

```json
{
  "$condition": {
    "$eq": [
      { "$field": "$sm#semanticId" },
      { "$strVal": "https://admin-shell.io/idta/TimeSeries/1/1" }
    ]
  }
}
```

Find all AAS whose Nameplate submodel element `ManufacturerName` equals "ACME":

```json
{
  "$condition": {
    "$eq": [
      { "$field": "$sme.Nameplate.ManufacturerName#value" },
      { "$strVal": "ACME" }
    ]
  }
}
```

POST this body to `/query/shells` (or `/query/submodels` if targeting submodels directly).

Find Submodels containing an `ActivationState` property with value `"ACTIVE"`, anywhere inside
the Alert/TimeSeries submodel's `SubmodelElementCollection` hierarchy (see
[create_dummy_aas.py](../../dev_utils/create_dummy_aas.py)). This is addressable **without** a
static idShortPath: the containing segment collection's idShort is generated per-device from a
SHA256 hash (`AlertCondition<hash>`), so you cannot write `$sme.Segments.AlertConditionXXXX...`.
Instead, use the recursive `$sme` root (no idShortPath) and correlate `semanticId` + `value` on
the same element via `$match`:

```json
{
  "$condition": {
    "$match": [
      { "$eq": [{ "$field": "$sme#semanticId" }, { "$strVal": "https://sdc2aas.org/AlertCondition/ActivationState" }] },
      { "$eq": [{ "$field": "$sme#value" }, { "$strVal": "ACTIVE" }] }
    ]
  }
}
```

So: querying through `SubmodelElementCollection`s with dynamic/non-static idShorts *is* possible —
you just drop the idShortPath and let `$sme` recurse through the whole element tree, using
`$match` to keep `semanticId` and `value` bound to the same element instead of two independent
matches anywhere in the tree.

## Implementation guidance in this repo

- Add new query helper functions next to the existing REST helpers in
  [mnestix_http_client.py](../../backend/app/storage/mnestix_http_client.py), following its
  existing `_send_*_request_*` helpers rather than building a new HTTP client.
- Always construct the query body as a plain Python `dict` mirroring the JSON shapes above and let
  the existing JSON serialization handle encoding — do not hand-write JSON strings.
- Validate assumptions against the target server's `/description` profile list before depending on
  query support; log a clear error if the required query profile is absent.
- When a query returns no result, treat it the same as "empty list", not as an error — this is
  normal AASQL behavior (e.g. invalid casts, non-existent fields) per the specification's
  evaluation semantics.
