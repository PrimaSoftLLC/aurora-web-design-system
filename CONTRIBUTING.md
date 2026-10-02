# Contributing

## Before you change anything

1. Read the relevant section of `README.md` and the guideline card for the area.
   Most questions were already settled and written down; a card titled in Russian
   exists to stop the argument being re-opened.
2. **Colour only through tokens. Sizes only in px.** A hard-coded hex or a `rem`
   in a component is a review failure.
3. **Reusable components never set their own external margins** — the parent owns
   spacing.

## Acceptance criteria

**Four renders**, for every screen, dialog and card touched:
DEFAULT/light/cozy, DEFAULT/dark/compact, RED2/light/cozy, RED2/dark/compact.
Plus: AXE clean, a real `:focus-visible` outline, a loading state on every button
that fires a request, and the copy rules in `README.md` §3.

## Where changes are made

The repository is the source of the design system. Edit tokens, components,
previews and documentation here. Agent rules and the release process are in
[AGENTS.md](AGENTS.md). The repository-first plan records the generator migration.

## Pull requests

- One concern per PR. Commit subjects in English, imperative.
- A prop change updates the component's `.d.ts` **and** the `@dsCard` in its folder
  in the same PR — those two are the contract.
- Add a line to `CHANGELOG.md` under `## [Unreleased]`, written for the consumer.
- Label the PR `major` / `minor` / `patch` per [VERSIONING.md](VERSIONING.md).

## Releasing

Release — AGENTS.md, section "Релиз", and PUBLISHING.md.

## Generated files

Edit `tokens/source.json`, `styles/`, `components/src/`, component `.d.ts` and
`preview.html`/`README.md`. `npm run build` generates `dist/`, `site/`, compatible
`tokens.json`/`tokens.css` and scoped CSS. Do not edit generated copies.
The catalogue discovers previews automatically and derives API props from the
public sources and declarations; no separate registry is maintained.

## Documentation owners

- README: purpose, design rules and development commands.
- getting-started: the single step-by-step consumer setup.
- ANGULAR: scopes, signals, charts and transition details.
- CONTRIBUTING / AGENTS: development and agent rules.
- PUBLISHING: access and release.
- Component README: usage and design decisions; generated API: checked props.
