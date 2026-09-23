# Versioning

Semantic versioning, `MAJOR.MINOR.PATCH`, released as a git tag `vX.Y.Z`.
The public surface is: **token names and their roles**, **component names and
props**, the three scope attributes, and the package entry points. Guideline cards
and reference screens are documentation — they never drive the number alone.

## MAJOR — a consumer must edit code

- A token is removed or renamed (`--ds-*`), or its *role* changes so an existing
  use now reads wrong (e.g. an ink token becoming a fill).
- A component is removed or renamed; a prop is removed or renamed; a prop's type
  narrows; a default changes what is already on screen.
- A value of `data-ds-theme` / `-appearance` / `-density` is dropped.
- An entry point moves.
- The minimum React version rises.

## MINOR — new surface, nothing breaks

- A new token, component, prop (with a backwards-compatible default), tenant theme
  block, icon in the vocabulary, or guideline card.
- A deprecation: the old name keeps working as an alias and is marked
  `@deprecated` in the `.d.ts` with the replacement named. **Every removal must
  ship one minor as an alias first** — a rename is never a single release.

## PATCH — same surface, better behaviour

- A colour, size or duration corrected inside an existing token role.
- A bug fix, an accessibility fix, a contrast fix that keeps the API.
- Docs, cards, reference screens, `MIGRATION.md`.

## Rules

1. **Tokens are the contract, not the hexes.** Retuning a ramp is a patch; renaming
   a step is a major.
2. **Pre-1.0 does not apply** — the system shipped internally, so start at 1.0.0.
3. One tag, one CHANGELOG entry, one line per change, written for the consumer
   ("`DsChip` gains `count`"), not for the author ("refactored chip").
4. A theme added for a new tenant is a minor, even though it is only a CSS block:
   consumers list themes in their own settings UI.
5. `_ds_bundle.js`, `_ds_manifest.json` and `_adherence.oxlintrc.json` are generated
   artefacts. They are committed so the design-tool round-trip keeps working, and
   are never hand-edited or cited in the changelog.
