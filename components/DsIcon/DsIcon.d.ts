/**
 * v2 icon — the one icon primitive.
 *
 * Iconography is **Material Symbols Outlined, self-hosted, as a font**: the glyph
 * is the element's text content, not an SVG. Before this component every v2
 * component carried its own private copy of the same `<span>` — 24 copies in
 * three variants, and two copies of the optical-nudge table — and a consumer
 * writing a new screen had no icon at all and had to hand-roll the span. This is
 * that span, once.
 *
 * Sizes come from density: 20px inside controls (`--ds-icon`), 24px standalone
 * (`--ds-icon-lg`), 16px for chip-remove and dense rows (`--ds-icon-sm`). `size`
 * takes a number or any CSS length, so a token string is fine.
 *
 * **Rotation carries meaning** in this product: `navigation` is rotated by the
 * object's course to show heading, `straighten` by −45° to read as a measuring
 * line, `priority_high` by 180°. Glyphs whose ink is not centred in the em box are
 * nudged so they rotate about the true ink centre; `navigation` is the one
 * measured case so far.
 *
 * Decorative by default (`aria-hidden`). Pass `label` when the glyph is the only
 * carrier of a fact — it becomes `role="img"` plus the accessible name.
 */
export interface DsIconProps {
  /** Material Symbols Outlined ligature name, e.g. `delete`, `local_shipping`. */
  name: string;
  /** Number of px or any CSS length. Default 20. */
  size?: number | string;
  /** Degrees clockwise. Only where rotation means something. */
  rotate?: number;
  /** Set only for a glyph that carries meaning on its own. */
  label?: string;
  style?: React.CSSProperties;
}
export declare function DsIcon(props: DsIconProps): JSX.Element;
