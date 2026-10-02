/**
 * v2 tab rail, three tones.
 *
 * Legacy `HeaderNav` drew the active tab with a 10% white wash plus a 3px
 * `currentColor` bar with `3px 3px 0 0` corners and 8px side insets — a very
 * specific 2015 Material detail. v2 keeps the idea (wash + bar) and adds two
 * content tones so a tab strip inside a page does not have to borrow header
 * styling.
 *
 * In the header the tab stacks its icon over its label. That buys horizontal room,
 * which is the scarce axis once labels are translated into 23 locales — `Monitoring`
 * becomes `Benachrichtigungen` — and it fits both densities (35px of content in the
 * 56px cozy bar, 33px in the 48px compact bar). The notification count then sits on
 * the glyph rather than after the label.
 *
 * Header tabs take every colour from `--ds-header-*`, so they follow the header
 * band automatically.
 */
export interface DsTabItem {
  id: string;
  label: React.ReactNode;
  /** Material Symbols Outlined ligature. */
  icon?: string;
  /** Count pill. On a stacked header tab it rides the icon's top-right corner. */
  badge?: number | string;
}
export interface DsTabsProps {
  /** Prefix shared with DsTabPanel for tab/panel IDs. */
  idBase?: string;
  'aria-label'?: string;
  items?: DsTabItem[];
  active?: string;
  onChange?: (id: string) => void;
  /** `onHeader` inside DsAppHeader · `underline` in page content · `segmented` for a 2-3 option switch. */
  tone?: 'onHeader' | 'underline' | 'segmented';
  /**
   * Stack the icon above the label. `onHeader` only, on by default. Set false for a
   * header with two or three short labels, where the row reads calmer.
   */
  stack?: boolean;
}
export declare function DsTabs(props: DsTabsProps): JSX.Element;
export interface DsTabPanelProps {
  idBase: string;
  id: string;
  active: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function DsTabPanel(props: DsTabPanelProps): JSX.Element;
