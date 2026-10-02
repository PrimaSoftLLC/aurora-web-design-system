/**
 * The strip between the panel's toolbar and its tree: what you can do with the
 * current selection on the left, `selected / total` and select-all on the right.
 *
 * It replaces v1's "Select all" footer button. Selection is the panel's primary
 * verb (share a link, build a group report, clear the map), so the count and the
 * select-all box are pinned above the scroll area, not below it — and actions
 * appear only when something is selected, which keeps the resting panel quiet.
 *
 * The 2px brand rule under the strip is the panel's one piece of chrome: it marks
 * where the scrolling tree begins. Turn it off with `rule={false}` if the bar is
 * used somewhere that already has a divider.
 *
 * `actions` also accepts a child carrying `slot="actions"`.
 */
export interface DsSelectionBarProps {
  children?: React.ReactNode;
  selected?: number;
  total?: number;
  /** Called with `true` to select everything, `false` to clear. */
  onSelectAll?: (all: boolean) => void;
  /** Renders the "clear selection" icon button when something is selected. */
  onClear?: () => void;
  /** Selection actions (DsIconButton / small DsButton) — shown only while `selected > 0`. */
  actions?: React.ReactNode;
  rule?: boolean;
}
export declare function DsSelectionBar(props: DsSelectionBarProps): JSX.Element;
