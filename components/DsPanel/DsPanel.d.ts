/**
 * v2 panel — the v2 replacement for `Card`.
 *
 * Legacy cards were `border-radius: 0` blocks separated by a 2px solid
 * `--color-primary` rule, which was the system's real dividing device and the
 * reason every screen read as a 2015 Material dashboard. A v2 panel is a 12px
 * rounded, 1px bordered surface that needs no separator at all: adjacent panels
 * are separated by the page ground showing through the gap.
 * `actions` and `footer` also accept a child carrying `slot="actions"` /
 * `slot="footer"`, for composition from static markup.
 */
export interface DsPanelProps {
  title?: React.ReactNode;
  /** 11px uppercase line above the title — the region's category. */
  eyebrow?: React.ReactNode;
  /** Right-aligned header controls. */
  actions?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Set false when the body is a table or a map that must reach the edges. */
  padding?: boolean;
  /** Make the body the scroll container instead of the page. */
  scroll?: boolean;
  height?: number | string;
  /** No border, no radius — for a panel that fills a region of the app shell. */
  flush?: boolean;
  /** Overrides on the body wrapper. The body is a flex column with overflow-x hidden,
   *  so a `flex:1` child (a map, a table) fills it and a fixed-width panel cannot be
   *  forced wider than itself. Pass `{display:'block'}` for plain document flow. */
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}
export declare function DsPanel(props: DsPanelProps): JSX.Element;
