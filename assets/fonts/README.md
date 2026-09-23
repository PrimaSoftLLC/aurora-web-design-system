# assets/fonts

**Inter Tight** (UI) and **JetBrains Mono** (telemetry digits) are the product's
only type. They are not committed: the design system fetches them from Google
Fonts at design time (`tokens/webfonts-cdn.css`), and production self-hosts them
(`tokens/webfonts-selfhost.css`). The wordmark faces (Nasalization, MTSText) were
removed in September 2026 — v2 sets the product title in the UI face.

Aurora ships as a container into customer infrastructure that frequently has no
egress to the public internet. A CDN font there does not fail loudly — it falls
back to Helvetica, and the whole px type scale (13px UI, −0.015em tracking, the
11px eyebrow) is measured on Inter Tight's metrics. **Self-host for any real
deployment.**

## The ops step

1. Download the two families (both SIL Open Font License 1.1):
   - Inter Tight — <https://fonts.google.com/specimen/Inter+Tight>
   - JetBrains Mono — <https://fonts.google.com/specimen/JetBrains+Mono>
2. Convert/extract the Latin + Cyrillic subsets to `woff2` and place exactly:

```
assets/fonts/inter-tight/InterTight-Regular.woff2      (400)
assets/fonts/inter-tight/InterTight-Medium.woff2       (500)
assets/fonts/inter-tight/InterTight-SemiBold.woff2     (600)
assets/fonts/inter-tight/InterTight-Bold.woff2         (700)
assets/fonts/jetbrains-mono/JetBrainsMono-Regular.woff2 (400)
assets/fonts/jetbrains-mono/JetBrainsMono-Medium.woff2  (500)
```

3. In `styles.css` change one line:

```css
@import "tokens/webfonts-cdn.css";       /* design time */
@import "tokens/webfonts-selfhost.css";  /* production — use this */
```

**Cyrillic is mandatory** — Russian is a hand-maintained source locale. A
Latin-only subset makes every Russian screen fall back mid-sentence.

`tokens/type.css` only names the families in `--ds-font-sans` / `--ds-font-mono`;
it never loads a file, so nothing else changes when you swap delivery.
